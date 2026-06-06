# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a protected admin area where Andy can view enquiries and manage availability dates via Vercel KV storage.

**Architecture:** Storage layer swaps from filesystem JSON to Vercel KV with a filesystem fallback for local dev. Auth uses JWT magic links via Resend. Admin UI is a client component with two tabs (enquiries + calendar). All admin API routes are protected by cookie-based JWT verification.

**Tech Stack:** Next.js 16 App Router, Vercel KV (`@vercel/kv`), `jose` for JWT, Resend for magic link emails.

**Spec:** `docs/superpowers/specs/2026-06-06-admin-dashboard-design.md`

---

### Task 1: Install dependencies and update types

**Files:**
- Modify: `package.json`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Install packages**

```bash
cd ~/meatfreaks && npm install @vercel/kv jose
```

- [ ] **Step 2: Update types**

Add `StoredEnquiry` type and export it from `src/lib/types.ts`:

```ts
export interface EnquiryPayload {
  lane:        'festival' | 'wedding' | 'corporate' | null
  eventType:   'party' | 'wedding' | 'corporate' | 'festival' | 'other'
  date:        string | null
  name:        string
  email:       string
  phone:       string
  region:      string
  guests:      string | null
  notes:       string
  submittedAt: string
}

export interface StoredEnquiry extends EnquiryPayload {
  id: string
}

export interface AvailabilityResponse {
  unavailable: string[]
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/lib/types.ts
git commit -m "feat: install KV and jose, add StoredEnquiry type"
```

---

### Task 2: Replace storage layer with Vercel KV

**Files:**
- Rewrite: `src/lib/availability.ts`

Replace the entire file. The new version uses Vercel KV when available, falls back to filesystem for local dev.

- [ ] **Step 1: Rewrite availability.ts**

```ts
import { kv } from '@vercel/kv'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { StoredEnquiry } from './types'

const DATES_PATH = join(process.cwd(), 'src/data/booked-dates.json')
const SUBMISSIONS_PATH = join(process.cwd(), 'src/data/submissions.json')

function useKV(): boolean {
  return !!process.env.KV_REST_API_URL
}

// --- Booked dates ---

export async function getBookedDates(): Promise<string[]> {
  if (useKV()) {
    const dates = await kv.get<string[]>('booked-dates')
    if (dates) return dates
    // Seed from JSON file on first KV read
    const fileDates = readDatesFromFile()
    if (fileDates.length > 0) {
      await kv.set('booked-dates', fileDates)
    }
    return fileDates
  }
  return readDatesFromFile()
}

export async function addBookedDate(date: string): Promise<void> {
  const dates = await getBookedDates()
  if (!dates.includes(date)) {
    dates.push(date)
    dates.sort()
    if (useKV()) {
      await kv.set('booked-dates', dates)
    } else {
      writeFileSync(DATES_PATH, JSON.stringify(dates, null, 2))
    }
  }
}

export async function removeBookedDate(date: string): Promise<void> {
  const dates = (await getBookedDates()).filter(d => d !== date)
  if (useKV()) {
    await kv.set('booked-dates', dates)
  } else {
    writeFileSync(DATES_PATH, JSON.stringify(dates, null, 2))
  }
}

function readDatesFromFile(): string[] {
  try {
    return JSON.parse(readFileSync(DATES_PATH, 'utf-8')) as string[]
  } catch {
    return []
  }
}

// --- Enquiries ---

export async function getEnquiries(): Promise<StoredEnquiry[]> {
  if (useKV()) {
    const enquiries = await kv.get<StoredEnquiry[]>('enquiries')
    return enquiries || []
  }
  return readEnquiriesFromFile()
}

export async function storeEnquiry(payload: StoredEnquiry): Promise<void> {
  if (useKV()) {
    const enquiries = await getEnquiries()
    enquiries.unshift(payload)
    await kv.set('enquiries', enquiries)
  } else {
    const enquiries = readEnquiriesFromFile()
    enquiries.unshift(payload)
    writeFileSync(SUBMISSIONS_PATH, JSON.stringify(enquiries, null, 2))
  }
}

function readEnquiriesFromFile(): StoredEnquiry[] {
  try {
    if (!existsSync(SUBMISSIONS_PATH)) return []
    return JSON.parse(readFileSync(SUBMISSIONS_PATH, 'utf-8')) as StoredEnquiry[]
  } catch {
    return []
  }
}
```

- [ ] **Step 2: Update public API routes to use async storage**

Update `src/app/api/availability/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getBookedDates } from '@/lib/availability'

export async function GET() {
  const unavailable = await getBookedDates()
  return NextResponse.json({ unavailable })
}
```

Update `src/app/api/enquiry/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { EnquiryPayload } from '@/lib/types'
import { storeEnquiry } from '@/lib/availability'
import { sendOwnerEmail, sendClientEmail } from '@/lib/mailer'

export async function POST(req: Request) {
  const payload: EnquiryPayload = await req.json()

  if (!payload.name || !payload.email || !payload.region || !payload.eventType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/meatfreaks && npm run build
```

Expected: clean build, all routes compile.

- [ ] **Step 4: Commit**

```bash
git add src/lib/availability.ts src/app/api/availability/route.ts src/app/api/enquiry/route.ts
git commit -m "feat: replace filesystem storage with Vercel KV (filesystem fallback)"
```

---

### Task 3: Auth utilities - JWT + admin verification

**Files:**
- Create: `src/lib/admin-auth.ts`

- [ ] **Step 1: Create admin-auth.ts**

```ts
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
    path: '/admin',
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
    path: '/admin',
    maxAge: 0,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/admin-auth.ts
git commit -m "feat: add admin auth utilities (JWT magic link + session)"
```

---

### Task 4: Admin API routes

**Files:**
- Create: `src/app/api/admin/auth/route.ts`
- Create: `src/app/api/admin/dates/route.ts`
- Create: `src/app/api/admin/enquiries/route.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p ~/meatfreaks/src/app/api/admin/auth ~/meatfreaks/src/app/api/admin/dates ~/meatfreaks/src/app/api/admin/enquiries
```

- [ ] **Step 2: Create auth route**

Create `src/app/api/admin/auth/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isAdminEmail, createMagicLinkToken, verifyToken, createSessionToken, sessionCookieOptions } from '@/lib/admin-auth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@meatfreaks.co.uk'

// POST - send magic link
export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Always return success to prevent email enumeration
  if (isAdminEmail(email)) {
    const token = await createMagicLinkToken(email)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.meatfreaksltd.com'
    const loginUrl = `${siteUrl}/api/admin/auth?token=${token}`

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email.trim(),
        subject: 'Your Meat Freaks admin login link',
        text: [
          'Hi Andy,',
          '',
          "Here's your login link for the Meat Freaks admin dashboard:",
          '',
          loginUrl,
          '',
          'This link expires in 15 minutes. If you didn\'t request this, you can ignore this email.',
          '',
          'Meat Freaks',
        ].join('\n'),
      })
    } catch (err) {
      console.error('Failed to send magic link:', err)
    }
  }

  return NextResponse.json({ ok: true, message: 'If that email is registered, a login link has been sent.' })
}

// GET - verify magic link token, set session cookie, redirect
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/admin?error=missing-token', req.url))
  }

  const payload = await verifyToken(token)
  if (!payload || !isAdminEmail(payload.email)) {
    return NextResponse.redirect(new URL('/admin?error=invalid-token', req.url))
  }

  const sessionToken = await createSessionToken(payload.email)
  const cookieStore = await cookies()
  const cookieOpts = sessionCookieOptions(sessionToken)
  cookieStore.set(cookieOpts)

  return NextResponse.redirect(new URL('/admin/dashboard', req.url))
}
```

- [ ] **Step 3: Create dates route**

Create `src/app/api/admin/dates/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getBookedDates, addBookedDate, removeBookedDate } from '@/lib/availability'

async function requireAuth() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function GET() {
  const denied = await requireAuth()
  if (denied) return denied

  const dates = await getBookedDates()
  return NextResponse.json({ dates })
}

export async function POST(req: Request) {
  const denied = await requireAuth()
  if (denied) return denied

  const { date } = await req.json()
  if (!date || typeof date !== 'string') {
    return NextResponse.json({ error: 'Date required' }, { status: 400 })
  }

  await addBookedDate(date)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const denied = await requireAuth()
  if (denied) return denied

  const { date } = await req.json()
  if (!date || typeof date !== 'string') {
    return NextResponse.json({ error: 'Date required' }, { status: 400 })
  }

  await removeBookedDate(date)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Create enquiries route**

Create `src/app/api/admin/enquiries/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getEnquiries } from '@/lib/availability'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const enquiries = await getEnquiries()
  return NextResponse.json({ enquiries })
}
```

- [ ] **Step 5: Build and verify**

```bash
cd ~/meatfreaks && npm run build
```

Expected: clean build with new API routes showing as dynamic.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat: add admin API routes (auth, dates, enquiries)"
```

---

### Task 5: Admin login page

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/layout.tsx`

- [ ] **Step 1: Create admin layout**

Create `src/app/admin/layout.tsx`. This is a minimal layout without the public site header/footer:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Meat Freaks',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Create login page**

Create `src/app/admin/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)

    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })

    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--char)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 22,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--char-2)',
        borderRadius: 10,
        padding: 'clamp(28px,5vw,40px)',
        border: '1px solid rgba(244,234,215,.1)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          fontSize: 28,
          color: 'var(--cream)',
          letterSpacing: '.5px',
          marginBottom: 6,
        }}>
          Meat Freaks
        </h1>
        <p style={{ color: 'var(--ember)', fontWeight: 700, fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 28 }}>
          Admin Dashboard
        </p>

        {error && (
          <p style={{
            color: 'var(--red)',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 18,
            padding: '10px 14px',
            background: 'rgba(158,43,37,.12)',
            borderRadius: 'var(--r)',
          }}>
            {error === 'invalid-token' ? 'That login link has expired or is invalid. Please request a new one.' : 'Something went wrong. Please try again.'}
          </p>
        )}

        {sent ? (
          <div>
            <div style={{
              width: 52, height: 52, borderRadius: 100,
              background: 'var(--ember)', display: 'grid', placeItems: 'center',
              marginBottom: 18,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1b1511" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <p style={{ color: 'var(--cream)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Check your inbox</p>
            <p style={{ color: 'rgba(244,234,215,.7)', fontSize: 15, lineHeight: 1.5 }}>
              If that email is registered, a login link has been sent. Click the link to access the dashboard. It expires in 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', color: 'rgba(244,234,215,.7)', fontWeight: 700, fontSize: 13, marginBottom: 7 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 16,
                borderRadius: 'var(--r)',
                border: '1.5px solid rgba(244,234,215,.2)',
                background: 'var(--char)',
                color: 'var(--cream)',
                marginBottom: 16,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Sending...' : 'Send login link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/meatfreaks && npm run build
```

Expected: `/admin` shows in route table.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin login page with magic link flow"
```

---

### Task 6: Admin dashboard page

**Files:**
- Create: `src/app/admin/dashboard/page.tsx`

This is the main admin UI with enquiries list and calendar tabs.

- [ ] **Step 1: Create the dashboard page**

Create `src/app/admin/dashboard/page.tsx`:

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Enquiry {
  id: string
  lane: string | null
  eventType: string
  date: string | null
  name: string
  email: string
  phone: string
  region: string
  guests: string | null
  notes: string
  submittedAt: string
}

const TYPE_LABELS: Record<string, string> = {
  party: 'Party',
  wedding: 'Wedding',
  corporate: 'Corporate',
  festival: 'Festival',
  other: 'Other',
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function iso(d: Date) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function humanDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'enquiries' | 'calendar'>('enquiries')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const [loading, setLoading] = useState(true)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const [enqRes, datesRes] = await Promise.all([
          fetch('/api/admin/enquiries'),
          fetch('/api/admin/dates'),
        ])
        if (enqRes.status === 401 || datesRes.status === 401) {
          router.push('/admin')
          return
        }
        const enqData = await enqRes.json()
        const datesData = await datesRes.json()
        setEnquiries(enqData.enquiries || [])
        setBookedDates(new Set(datesData.dates || []))
      } catch {
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  async function toggleDate(dateStr: string) {
    const isBooked = bookedDates.has(dateStr)
    const method = isBooked ? 'DELETE' : 'POST'

    // Optimistic update
    setBookedDates(prev => {
      const next = new Set(prev)
      if (isBooked) next.delete(dateStr)
      else next.add(dateStr)
      return next
    })
    showToast(isBooked ? 'Date unblocked' : 'Date blocked')

    const res = await fetch('/api/admin/dates', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr }),
    })
    if (!res.ok) {
      // Revert on failure
      setBookedDates(prev => {
        const next = new Set(prev)
        if (isBooked) next.add(dateStr)
        else next.delete(dateStr)
        return next
      })
      showToast('Failed to update')
    }
  }

  function handleLogout() {
    document.cookie = 'mf-admin-token=; path=/admin; max-age=0'
    router.push('/admin')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = iso(today)
  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const startDow = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--char)', display: 'grid', placeItems: 'center' }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--char)',
        borderBottom: '1px solid rgba(244,234,215,.1)',
        padding: '0 22px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)', fontSize: 20, textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Meat Freaks
          </span>
          <span style={{ color: 'var(--ember)', fontWeight: 700, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', marginLeft: 10 }}>
            Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 0, color: 'rgba(244,234,215,.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '8px 0' }}
        >
          Log out
        </button>
      </header>

      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#fff',
        borderBottom: '1px solid var(--line)',
        position: 'sticky',
        top: 64,
        zIndex: 40,
      }}>
        {(['enquiries', 'calendar'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '16px 0',
              fontWeight: 700,
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              background: 'none',
              border: 0,
              borderBottom: tab === t ? '3px solid var(--ember)' : '3px solid transparent',
              color: tab === t ? 'var(--ink)' : 'var(--muted)',
              cursor: 'pointer',
              minHeight: 48,
            }}
          >
            {t === 'enquiries' ? `Enquiries (${enquiries.length})` : 'Calendar'}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--char)',
          color: 'var(--cream)',
          padding: '12px 24px',
          borderRadius: 100,
          fontWeight: 700,
          fontSize: 14,
          zIndex: 100,
          boxShadow: 'var(--shadow-lg)',
        }}>
          {toast}
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 700, marginInline: 'auto', padding: '20px 16px' }}>

        {/* ENQUIRIES TAB */}
        {tab === 'enquiries' && (
          <div>
            {enquiries.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '60px 0', fontSize: 15 }}>
                No enquiries yet. They will appear here when submitted.
              </p>
            ) : (
              enquiries.map(enq => {
                const isOpen = expandedId === enq.id
                return (
                  <div
                    key={enq.id}
                    onClick={() => setExpandedId(isOpen ? null : enq.id)}
                    style={{
                      background: '#fff',
                      border: '1px solid var(--line)',
                      borderRadius: 8,
                      padding: '18px 20px',
                      marginBottom: 10,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: 16 }}>{enq.name}</span>
                        <span style={{
                          display: 'inline-block',
                          marginLeft: 10,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '.06em',
                          textTransform: 'uppercase',
                          padding: '3px 9px',
                          borderRadius: 100,
                          background: 'var(--cream-2)',
                          color: 'var(--char)',
                        }}>
                          {TYPE_LABELS[enq.eventType] || enq.eventType}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {timeAgo(enq.submittedAt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px 18px', flexWrap: 'wrap', marginTop: 8, fontSize: 14, color: 'var(--muted)' }}>
                      <span>{enq.date ? humanDate(enq.date) : 'Flexible'}</span>
                      <span>{enq.region}</span>
                      {enq.guests && <span>{enq.guests} guests</span>}
                    </div>

                    {isOpen && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)', fontSize: 14, lineHeight: 1.7 }}>
                        {enq.phone && <p><strong>Phone:</strong> <a href={`tel:${enq.phone}`} style={{ color: 'var(--ember)' }}>{enq.phone}</a></p>}
                        <p><strong>Email:</strong> <a href={`mailto:${enq.email}`} style={{ color: 'var(--ember)' }}>{enq.email}</a></p>
                        {enq.notes && <p style={{ marginTop: 8 }}><strong>Notes:</strong> {enq.notes}</p>}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* CALENDAR TAB */}
        {tab === 'calendar' && (
          <div>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <button
                onClick={() => {
                  if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
                  else setViewMonth(viewMonth - 1)
                }}
                style={{
                  width: 44, height: 44, borderRadius: 'var(--r)', border: '1.5px solid var(--line)',
                  background: '#fff', cursor: 'pointer', fontSize: 18, display: 'grid', placeItems: 'center',
                }}
              >
                ‹
              </button>
              <span style={{ fontWeight: 800, fontSize: 18 }}>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={() => {
                  if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
                  else setViewMonth(viewMonth + 1)
                }}
                style={{
                  width: 44, height: 44, borderRadius: 'var(--r)', border: '1.5px solid var(--line)',
                  background: '#fff', cursor: 'pointer', fontSize: 18, display: 'grid', placeItems: 'center',
                }}
              >
                ›
              </button>
            </div>

            {/* Day labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 6 }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <span key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  {d}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
              {Array.from({ length: startDow }).map((_, i) => (
                <div key={`e${i}`} style={{ aspectRatio: '1' }} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateObj = new Date(viewYear, viewMonth, day)
                const dateStr = iso(dateObj)
                const isPast = dateObj < today && dateStr !== todayStr
                const isBooked = bookedDates.has(dateStr)
                const isToday = dateStr === todayStr

                return (
                  <button
                    key={day}
                    disabled={isPast}
                    onClick={() => !isPast && toggleDate(dateStr)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 'var(--r)',
                      border: isToday && !isBooked ? '2px solid var(--ember)' : '1.5px solid transparent',
                      background: isPast ? 'transparent' : isBooked ? 'var(--ember)' : 'var(--bone)',
                      color: isPast ? '#cdc2b0' : isBooked ? '#fff' : 'var(--ink)',
                      cursor: isPast ? 'default' : 'pointer',
                      fontWeight: 600,
                      fontSize: 15,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 18, marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--bone)', border: '1.5px solid var(--line)' }} /> Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--ember)' }} /> Blocked
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
cd ~/meatfreaks && npm run build
```

Expected: `/admin/dashboard` appears in routes.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/dashboard/
git commit -m "feat: add admin dashboard with enquiries list and calendar"
```

---

### Task 7: Exclude admin pages from public layout

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/admin/layout.tsx`

The admin pages should NOT render the public Header and Footer. The root layout currently wraps everything with Header/Footer. We need to move Header/Footer into a layout for the public routes only.

- [ ] **Step 1: Create a route group for public pages**

Move the Header/Footer rendering out of root layout. Update `src/app/layout.tsx` to only render the HTML shell:

```tsx
import type { Metadata } from 'next'
import { Anton, Archivo, Cormorant } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' })
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['400', '500', '600', '700', '800'],
})
const cormorant = Cormorant({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.meatfreaks.co.uk'),
  title: {
    default: 'Meat Freaks - UK-Wide BBQ Event Catering',
    template: '%s · Meat Freaks',
  },
  description:
    'Real fire, real smoke, low & slow BBQ catering for festivals, weddings, corporate events and parties across the UK.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.meatfreaks.co.uk',
    siteName: 'Meat Freaks',
    images: [{ url: '/assets/cook-smoke.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/favicon.png' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Meat Freaks',
  description: 'UK-wide BBQ event catering',
  url: 'https://www.meatfreaks.co.uk',
  telephone: '07916635610',
  email: 'meatfreaksltd@gmail.com',
  areaServed: 'GB',
  sameAs: ['https://www.instagram.com/meatfreaks1/'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${anton.variable} ${archivo.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create a template for public pages that includes Header/Footer**

Create `src/app/(public)/layout.tsx`:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Move all public pages into the (public) route group**

```bash
cd ~/meatfreaks/src/app
mkdir -p "(public)"
# Move all public page directories into (public)
mv page.tsx "(public)/"
mv about "(public)/"
mv contact "(public)/"
mv cookies "(public)/"
mv corporate "(public)/"
mv enquiry "(public)/"
mv festivals "(public)/"
mv menu "(public)/"
mv privacy "(public)/"
mv terms "(public)/"
mv weddings "(public)/"
```

Note: the `(public)` route group does NOT affect URLs. `/festivals` still works as `/festivals`, not `/(public)/festivals`.

- [ ] **Step 4: Update admin layout**

Update `src/app/admin/layout.tsx` to be self-contained (no Header/Footer):

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Meat Freaks',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

(This file is unchanged from Task 5 - it already excludes Header/Footer.)

- [ ] **Step 5: Build and verify all routes still work**

```bash
cd ~/meatfreaks && npm run build
```

Expected: all existing public routes still appear at the same URLs. `/admin` and `/admin/dashboard` appear without Header/Footer.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: separate public/admin layouts using route groups"
```

---

### Task 8: Final build, test, and push

- [ ] **Step 1: Full build**

```bash
cd ~/meatfreaks && npm run build
```

Expected output should show all routes including:
- All existing public pages at unchanged URLs
- `/admin` (login)
- `/admin/dashboard` (protected dashboard)
- `/api/admin/auth`, `/api/admin/dates`, `/api/admin/enquiries` (dynamic)

- [ ] **Step 2: Local smoke test**

```bash
cd ~/meatfreaks && npx next start -p 3456 &
sleep 3
# Public routes still work
curl -s -o /dev/null -w "%{http_code}" http://localhost:3456/
curl -s -o /dev/null -w "%{http_code}" http://localhost:3456/festivals
curl -s -o /dev/null -w "%{http_code}" http://localhost:3456/menu
# Admin routes exist
curl -s -o /dev/null -w "%{http_code}" http://localhost:3456/admin
curl -s -o /dev/null -w "%{http_code}" http://localhost:3456/api/admin/enquiries
# Admin API is protected
curl -s http://localhost:3456/api/admin/enquiries | head -1
# Should show {"error":"Unauthorized"}
kill %1
```

- [ ] **Step 3: Push to deploy**

```bash
cd ~/meatfreaks && git push
```

- [ ] **Step 4: Post-deploy setup instructions**

After deploy, Joshua needs to:

1. **Enable Vercel KV**: Project Settings > Storage > Create Database > KV
2. **Add env vars** in Vercel:
   - `ADMIN_EMAILS` = `meatfreaksltd@gmail.com`
   - `ADMIN_JWT_SECRET` = (generate with `openssl rand -hex 32`)
3. **Redeploy** after adding env vars (Settings > Deployments > Redeploy)
4. Visit `https://www.meatfreaksltd.com/admin` and test the login flow
