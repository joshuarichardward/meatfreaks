import { NextResponse } from 'next/server'
import { StoredEnquiry } from '@/lib/types'
import { storeEnquiry } from '@/lib/availability'
import { sendOwnerEmail, sendClientEmail } from '@/lib/mailer'
import { enquiryLimiter, getIP } from '@/lib/rate-limit'

const VALID_EVENT_TYPES = ['party', 'wedding', 'corporate', 'festival', 'other']

export async function POST(req: Request) {
  // Rate limit by IP — fail closed if KV is unavailable in production
  if (process.env.KV_REST_API_URL) {
    const ip = getIP(req)
    const { success } = await enquiryLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.error('Rate limiting unavailable: KV_REST_API_URL not set')
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = body.name
  const email = body.email
  const region = body.region
  const eventType = body.eventType

  // Validate required fields are strings
  if (typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof region !== 'string' || !region.trim() ||
      typeof eventType !== 'string' || !eventType.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate email format and reject header injection attempts
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Validate event type against allowed values
  if (!VALID_EVENT_TYPES.includes(eventType)) {
    return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
  }

  // Validate input lengths to prevent storage abuse
  if (
    name.length > 200 ||
    email.length > 200 ||
    region.length > 200 ||
    (typeof body.phone === 'string' && body.phone.length > 50) ||
    (typeof body.notes === 'string' && body.notes.length > 5000) ||
    (typeof body.guests === 'string' && body.guests.length > 50)
  ) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 })
  }

  // Destructure only known fields — never spread untrusted input
  const stored: StoredEnquiry = {
    id: crypto.randomUUID(),
    lane: typeof body.lane === 'string' ? body.lane as StoredEnquiry['lane'] : null,
    eventType: eventType as StoredEnquiry['eventType'],
    date: typeof body.date === 'string' ? body.date : null,
    name: name.trim(),
    email: email.trim(),
    phone: typeof body.phone === 'string' ? body.phone.trim() : '',
    region: region.trim(),
    guests: typeof body.guests === 'string' ? body.guests : null,
    notes: typeof body.notes === 'string' ? body.notes.trim() : '',
    submittedAt: new Date().toISOString(),
  }

  await storeEnquiry(stored)

  try {
    await sendOwnerEmail(stored)
    await sendClientEmail(stored)
  } catch (err) {
    console.error('Email send failed:', err)
  }

  return NextResponse.json({ ok: true })
}
