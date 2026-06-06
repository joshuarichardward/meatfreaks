import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'mf-admin-token'
const SEVEN_DAYS = 60 * 60 * 24 * 7

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) throw new Error('ADMIN_JWT_SECRET not set')
  return new TextEncoder().encode(secret)
}

function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS || ''
  return emails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase())
}

export async function createMagicLinkToken(email: string): Promise<string> {
  return new SignJWT({ email: email.trim().toLowerCase() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getSecret())
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email: email.trim().toLowerCase() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return { email: payload.email as string }
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SEVEN_DAYS,
  }
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  }
}
