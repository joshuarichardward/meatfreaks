import { google } from 'googleapis'
import { StoredEnquiry } from './types'

const TYPE_LABELS: Record<string, string> = {
  party: 'Party',
  wedding: 'Wedding',
  corporate: 'Corporate',
  festival: 'Festival',
  other: 'Other',
}

function getCalendarClient() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyJson) return null

  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) return null

  const key = JSON.parse(keyJson)
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  return { calendar: google.calendar({ version: 'v3', auth }), calendarId }
}

function buildEventTitle(enquiry: StoredEnquiry | null): string {
  if (!enquiry) return 'Meat Freaks - Blocked'
  const type = TYPE_LABELS[enquiry.eventType] || enquiry.eventType
  return `MF - ${type} - ${enquiry.region} - ${enquiry.name}`
}

function buildEventDescription(enquiry: StoredEnquiry | null): string {
  if (!enquiry) return ''
  const lines = [
    `Client: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
  ]
  if (enquiry.phone) lines.push(`Phone: ${enquiry.phone}`)
  lines.push(`Event: ${TYPE_LABELS[enquiry.eventType] || enquiry.eventType}`)
  if (enquiry.guests) lines.push(`Guests: ${enquiry.guests}`)
  lines.push(`Region: ${enquiry.region}`)
  if (enquiry.notes) lines.push(`Notes: ${enquiry.notes}`)
  return lines.join('\n')
}

export async function createCalendarEvent(
  date: string,
  enquiry: StoredEnquiry | null
): Promise<string | null> {
  const client = getCalendarClient()
  if (!client) return null

  try {
    const res = await client.calendar.events.insert({
      calendarId: client.calendarId,
      requestBody: {
        summary: buildEventTitle(enquiry),
        description: buildEventDescription(enquiry),
        start: { date },
        end: { date },
        transparency: 'opaque',
      },
    })
    console.log('Google Calendar event created:', res.data.id)
    return res.data.id ?? null
  } catch (err) {
    console.error('Failed to create Google Calendar event:', err)
    return null
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const client = getCalendarClient()
  if (!client) return

  try {
    await client.calendar.events.delete({
      calendarId: client.calendarId,
      eventId,
    })
    console.log('Google Calendar event deleted:', eventId)
  } catch (err) {
    console.error('Failed to delete Google Calendar event:', err)
  }
}
