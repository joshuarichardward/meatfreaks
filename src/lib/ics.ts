import { EnquiryPayload } from './types'

function escapeICS(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n').replace(/\r/g, '')
}

export function generateICS(payload: EnquiryPayload): string {
  if (!payload.date) return ''
  const [y, m, d] = payload.date.split('-').map(Number)
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  const dtStart = `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Meat Freaks//Enquiry//EN',
    'BEGIN:VEVENT',
    `UID:mf-${payload.submittedAt}@meatfreaks.co.uk`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtStart}`,
    `SUMMARY:Meat Freaks BBQ - ${escapeICS(payload.eventType)} (provisional)`,
    `DESCRIPTION:Enquiry from ${escapeICS(payload.name)}. Provisional - subject to confirmation.`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}
