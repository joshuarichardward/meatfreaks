import { Resend } from 'resend'
import { EnquiryPayload } from './types'
import { generateICS } from './ics'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@meatfreaks.co.uk'
const EMAIL_OWNER = process.env.EMAIL_OWNER || 'meatfreaksltd@gmail.com'

const TYPE_LABELS: Record<string, string> = {
  party: 'Party',
  wedding: 'Wedding',
  corporate: 'Corporate',
  festival: 'Festival / Event',
  other: 'Other',
}

export async function sendOwnerEmail(payload: EnquiryPayload) {
  const dateStr = payload.date || 'flexible'
  await getResend().emails.send({
    from: EMAIL_FROM,
    to: EMAIL_OWNER,
    replyTo: payload.email,
    subject: `New enquiry — ${TYPE_LABELS[payload.eventType] || payload.eventType} in ${payload.region} on ${dateStr}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone || 'Not provided'}`,
      `Event type: ${TYPE_LABELS[payload.eventType] || payload.eventType}`,
      `Date: ${dateStr}`,
      `Region: ${payload.region}`,
      `Guest estimate: ${payload.guests || 'Not specified'}`,
      `Notes: ${payload.notes || 'None'}`,
      ``,
      `Submitted at: ${payload.submittedAt}`,
    ].join('\n'),
  })
}

export async function sendClientEmail(payload: EnquiryPayload) {
  const firstName = payload.name.split(' ')[0]
  const icsString = generateICS(payload)

  const attachments = icsString
    ? [{ filename: 'meat-freaks-event.ics', content: Buffer.from(icsString).toString('base64'), contentType: 'text/calendar' as const }]
    : undefined

  await getResend().emails.send({
    from: EMAIL_FROM,
    to: payload.email,
    subject: `We've got your enquiry, ${firstName} — Meat Freaks`,
    text: [
      `Hi ${firstName},`,
      ``,
      `Thanks for getting in touch — your enquiry has landed with the Meat Freaks crew.`,
      ``,
      `Here's what you sent us:`,
      `  Event type: ${TYPE_LABELS[payload.eventType] || payload.eventType}`,
      `  Date: ${payload.date || 'Flexible / to confirm'}`,
      `  Region: ${payload.region}`,
      `  Guests: ${payload.guests || 'Not specified'}`,
      ``,
      `We'll come back to you usually within one working day with availability,`,
      `a tailored menu and a written quote.`,
      ``,
      payload.date ? `If you included a date, there's a provisional calendar invite attached —` : '',
      payload.date ? `this is just a placeholder until we confirm.` : '',
      ``,
      `Any questions: meatfreaksltd@gmail.com / 07916 635610`,
      ``,
      `Andy & the Meat Freaks team`,
      `Fire · Flavour · Feast`,
    ].filter(Boolean).join('\n'),
    attachments,
  })
}
