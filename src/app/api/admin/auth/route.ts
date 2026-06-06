import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  isAdminEmail,
  createMagicLinkToken,
  verifyMagicLinkToken,
  createSessionToken,
  sessionCookieOptions,
} from '@/lib/admin-auth'
import { authLimiter, getIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limit by IP (only when KV is available)
  if (process.env.KV_REST_API_URL) {
    const ip = getIP(request)
    const { success } = await authLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ message: 'If that email is authorised, a login link has been sent.' })
    }
  }

  const { email } = await request.json()

  if (isAdminEmail(email)) {
    const jwt = await createMagicLinkToken(email)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meatfreaksltd.com'
    const loginUrl = `${siteUrl}/api/admin/auth?token=${jwt}`

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@meatfreaksltd.com',
        to: email,
        subject: 'Your Meat Freaks admin login link',
        text: [
          'Hi Andy,',
          '',
          "Here's your login link for the Meat Freaks admin dashboard:",
          '',
          loginUrl,
          '',
          "This link expires in 15 minutes. If you didn't request this, you can ignore this email.",
          '',
          'Meat Freaks',
        ].join('\n'),
      })
      console.log('Magic link email result:', JSON.stringify(result))
    } catch (err) {
      console.error('Failed to send magic link email:', err)
    }
  }

  return NextResponse.json({ message: 'If that email is authorised, a login link has been sent.' })
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/admin?error=invalid-token', request.url))
  }

  const payload = await verifyMagicLinkToken(token)
  if (!payload || !isAdminEmail(payload.email)) {
    return NextResponse.redirect(new URL('/admin?error=invalid-token', request.url))
  }

  const sessionToken = await createSessionToken(payload.email)
  const cookieStore = await cookies()
  cookieStore.set(sessionCookieOptions(sessionToken))

  return NextResponse.redirect(new URL('/admin/dashboard', request.url))
}
