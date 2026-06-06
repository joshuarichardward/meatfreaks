import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getBookedDates, addBookedDate, removeBookedDate, updateBookedDateCalEventId, getEnquiries } from '@/lib/availability'
import { createCalendarEvent, deleteCalendarEvent } from '@/lib/google-calendar'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dates = await getBookedDates()
  return NextResponse.json({ dates })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const date = body.date
  if (typeof date !== 'string' || !DATE_REGEX.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  await addBookedDate(date)

  // Find matching enquiry for this date (most recent first)
  const enquiries = await getEnquiries()
  const matchingEnquiry = enquiries.find(e => e.date === date) ?? null

  // Create Google Calendar event (best-effort)
  const calEventId = await createCalendarEvent(date, matchingEnquiry)
  if (calEventId) {
    await updateBookedDateCalEventId(date, calEventId)
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const date = body.date
  if (typeof date !== 'string' || !DATE_REGEX.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  const calEventId = await removeBookedDate(date)

  // Delete Google Calendar event (best-effort)
  if (calEventId) {
    await deleteCalendarEvent(calEventId)
  }

  return NextResponse.json({ ok: true })
}
