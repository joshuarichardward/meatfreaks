import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  isAdminEmail,
  createMagicLinkToken,
  verifyToken,
  createSessionToken,
  sessionCookieOptions,
} from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (isAdminEmail(email)) {
    const jwt = await createMagicLinkToken(email)
    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/auth?token=${jwt}`

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: `Meat Freaks <noreply@${process.env.NEXT_PUBLIC_SITE_URL?.replace(/https?:\/\//, '')}>`,
      to: email,
      subject: 'Your Meat Freaks admin login link',
      html: `
        <p>Hi Andy,</p>
        <p>Here's your login link — it expires in 15 minutes:</p>
        <p><a href="${loginUrl}">${loginUrl}</a></p>
      `,
    })
  }

  return NextResponse.json({ message: 'If that email is authorised, a login link has been sent.' })
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/admin?error=invalid-token', request.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL('/admin?error=invalid-token', request.url))
  }

  const sessionToken = await createSessionToken(payload.email)
  const cookieStore = await cookies()
  cookieStore.set(sessionCookieOptions(sessionToken))

  return NextResponse.redirect(new URL('/admin/dashboard', request.url))
}
