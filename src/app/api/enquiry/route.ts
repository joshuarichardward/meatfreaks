import { NextResponse } from 'next/server'
import { EnquiryPayload } from '@/lib/types'
import { storeSubmission } from '@/lib/availability'
import { sendOwnerEmail, sendClientEmail } from '@/lib/mailer'

export async function POST(req: Request) {
  const payload: EnquiryPayload = await req.json()

  if (!payload.name || !payload.email || !payload.region || !payload.eventType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  storeSubmission(payload as unknown as Record<string, unknown>)

  try {
    await sendOwnerEmail(payload)
    await sendClientEmail(payload)
  } catch (err) {
    console.error('Email send failed:', err)
  }

  return NextResponse.json({ ok: true })
}
