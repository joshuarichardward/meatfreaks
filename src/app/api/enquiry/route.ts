import { NextResponse } from 'next/server'
import { EnquiryPayload } from '@/lib/types'
import { storeEnquiry } from '@/lib/availability'
import { sendOwnerEmail, sendClientEmail } from '@/lib/mailer'
import { enquiryLimiter, getIP } from '@/lib/rate-limit'

const VALID_EVENT_TYPES = ['party', 'wedding', 'corporate', 'festival', 'other']

export async function POST(req: Request) {
  // Rate limit by IP (only when KV is available)
  if (process.env.KV_REST_API_URL) {
    const ip = getIP(req)
    const { success } = await enquiryLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
  }

  const payload: EnquiryPayload = await req.json()

  if (!payload.name || !payload.email || !payload.region || !payload.eventType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Validate event type against allowed values
  if (!VALID_EVENT_TYPES.includes(payload.eventType)) {
    return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
  }

  // Validate input lengths to prevent storage abuse
  if (
    payload.name.length > 200 ||
    payload.email.length > 200 ||
    payload.region.length > 200 ||
    (payload.phone?.length ?? 0) > 50 ||
    (payload.notes?.length ?? 0) > 5000 ||
    (payload.guests?.length ?? 0) > 50
  ) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 })
  }

  const stored = {
    ...payload,
    id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  }

  await storeEnquiry(stored)

  try {
    await sendOwnerEmail(payload)
    await sendClientEmail(payload)
  } catch (err) {
    console.error('Email send failed:', err)
  }

  return NextResponse.json({ ok: true })
}
