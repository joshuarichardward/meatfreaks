import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { kv } from '@vercel/kv'

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
  const jti = `ml_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  return new SignJWT({ email: email.trim().toLowerCase(), purpose: 'magic-link' })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getSecret())
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email: email.trim().toLowerCase(), purpose: 'session' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyMagicLinkToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (payload.purpose !== 'magic-link') return null

    // One-time use: reject if KV unavailable in production (fail closed)
    if (!process.env.KV_REST_API_URL) {
      if (process.env.NODE_ENV === 'production') return null
    } else if (payload.jti) {
      const used = await kv.get(`used-token:${payload.jti}`)
      if (used) return null
      await kv.set(`used-token:${payload.jti}`, '1', { ex: 900 })
    }

    return { email: payload.email as string }
  } catch {
    return null
  }
}

export async function verifySessionToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (payload.purpose !== 'session') return null
    return { email: payload.email as string }
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
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
