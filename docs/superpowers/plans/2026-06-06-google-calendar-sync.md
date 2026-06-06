# Google Calendar Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When Andy blocks/unblocks dates in the admin dashboard, automatically create/delete all-day events in his Google Calendar with enquiry details if available.

**Architecture:** A new `google-calendar.ts` lib handles Google Calendar API calls via a service account. The booked dates storage format changes from a flat string array to objects that include Google Calendar event IDs. The admin dates API route calls the calendar lib after KV operations. Calendar sync is best-effort - failures don't block the admin UI.

**Tech Stack:** `googleapis` npm package, Google Calendar API v3, Google Cloud service account.

**Spec:** `docs/superpowers/specs/2026-06-06-google-calendar-sync-design.md`

---

### Task 1: Install googleapis and update types

**Files:**
- Modify: `package.json`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Install googleapis**

```bash
cd ~/meatfreaks && npm install googleapis
```

- [ ] **Step 2: Add BookedDate type to types.ts**

Update `src/lib/types.ts` to add the new `BookedDate` type:

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

export interface BookedDate {
  date: string
  calEventId: string | null
}

export interface AvailabilityResponse {
  unavailable: string[]
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/lib/types.ts
git commit -m "feat: install googleapis, add BookedDate type"
```

---

### Task 2: Update availability.ts to use BookedDate objects

**Files:**
- Modify: `src/lib/availability.ts`

The booked dates storage changes from `string[]` to `BookedDate[]` internally, but `getBookedDates()` still returns `string[]` for the public API. New functions are added for the richer format.

- [ ] **Step 1: Rewrite availability.ts**

Replace the entire booked dates section of `src/lib/availability.ts`. Keep the enquiries section unchanged.

```ts
import { kv } from '@vercel/kv'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { StoredEnquiry, BookedDate } from './types'

const DATES_PATH = join(process.cwd(), 'src/data/booked-dates.json')
const SUBMISSIONS_PATH = join(process.cwd(), 'src/data/submissions.json')

function useKV(): boolean {
  return !!process.env.KV_REST_API_URL
}

// --- Booked dates ---

export async function getBookedDateObjects(): Promise<BookedDate[]> {
  if (useKV()) {
    const raw = await kv.get<BookedDate[] | string[]>('booked-dates')
    if (!raw) {
      const fileDates = readDatesFromFile()
      if (fileDates.length > 0) {
        const objects = fileDates.map(d => ({ date: d, calEventId: null }))
        await kv.set('booked-dates', objects)
        return objects
      }
      return []
    }
    // Migrate from old string[] format if needed
    if (raw.length > 0 && typeof raw[0] === 'string') {
      const objects = (raw as string[]).map(d => ({ date: d, calEventId: null }))
      await kv.set('booked-dates', objects)
      return objects
    }
    return raw as BookedDate[]
  }
  return readDatesFromFile().map(d => ({ date: d, calEventId: null }))
}

export async function getBookedDates(): Promise<string[]> {
  const objects = await getBookedDateObjects()
  return objects.map(o => o.date)
}

export async function addBookedDate(date: string, calEventId: string | null = null): Promise<void> {
  const objects = await getBookedDateObjects()
  if (objects.some(o => o.date === date)) return

  objects.push({ date, calEventId })
  objects.sort((a, b) => a.date.localeCompare(b.date))

  if (useKV()) {
    await kv.set('booked-dates', objects)
  } else {
    writeFileSync(DATES_PATH, JSON.stringify(objects.map(o => o.date), null, 2))
  }
}

export async function removeBookedDate(date: string): Promise<string | null> {
  const objects = await getBookedDateObjects()
  const existing = objects.find(o => o.date === date)
  const calEventId = existing?.calEventId ?? null
  const filtered = objects.filter(o => o.date !== date)

  if (useKV()) {
    await kv.set('booked-dates', filtered)
  } else {
    writeFileSync(DATES_PATH, JSON.stringify(filtered.map(o => o.date), null, 2))
  }

  return calEventId
}

export async function updateBookedDateCalEventId(date: string, calEventId: string): Promise<void> {
  const objects = await getBookedDateObjects()
  const entry = objects.find(o => o.date === date)
  if (entry) {
    entry.calEventId = calEventId
    if (useKV()) {
      await kv.set('booked-dates', objects)
    }
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

Key changes:
- `getBookedDateObjects()` returns `BookedDate[]` and auto-migrates from old `string[]` format
- `getBookedDates()` still returns `string[]` for the public API (no breaking change)
- `addBookedDate()` accepts optional `calEventId`
- `removeBookedDate()` returns the `calEventId` of the removed date (needed for Google Calendar deletion)
- `updateBookedDateCalEventId()` updates the calEventId after creating a Google Calendar event

- [ ] **Step 2: Build and verify**

```bash
cd ~/meatfreaks && npm run build
```

Expected: clean build. The public API and admin dates API still work since `getBookedDates()` returns the same `string[]` shape.

- [ ] **Step 3: Commit**

```bash
git add src/lib/availability.ts
git commit -m "feat: update booked dates to store Google Calendar event IDs"
```

---

### Task 3: Create Google Calendar lib

**Files:**
- Create: `src/lib/google-calendar.ts`

- [ ] **Step 1: Create google-calendar.ts**

```ts
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
  const auth = new google.auth.JWT(
    key.client_email,
    undefined,
    key.private_key,
    ['https://www.googleapis.com/auth/calendar']
  )

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
```

- [ ] **Step 2: Build and verify**

```bash
cd ~/meatfreaks && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/google-calendar.ts
git commit -m "feat: add Google Calendar API client for event create/delete"
```

---

### Task 4: Wire calendar sync into admin dates API

**Files:**
- Modify: `src/app/api/admin/dates/route.ts`

- [ ] **Step 1: Update the dates route**

Replace `src/app/api/admin/dates/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getBookedDates, addBookedDate, removeBookedDate, updateBookedDateCalEventId, getEnquiries } from '@/lib/availability'
import { createCalendarEvent, deleteCalendarEvent } from '@/lib/google-calendar'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dates = await getBookedDates()
  return NextResponse.json({ dates })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { date } = await request.json()
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

  const { date } = await request.json()
  const calEventId = await removeBookedDate(date)

  // Delete Google Calendar event (best-effort)
  if (calEventId) {
    await deleteCalendarEvent(calEventId)
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Build and verify**

```bash
cd ~/meatfreaks && npm run build
```

Expected: clean build. Without Google env vars set, calendar sync is silently skipped.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/dates/route.ts
git commit -m "feat: wire Google Calendar sync into admin dates API"
```

---

### Task 5: Build, test, and push

- [ ] **Step 1: Full build**

```bash
cd ~/meatfreaks && npm run build
```

- [ ] **Step 2: Local smoke test**

```bash
lsof -ti:3456 | xargs kill -9 2>/dev/null
sleep 1
cd ~/meatfreaks && npx next start -p 3456 &
sleep 3
# Public availability still works
curl -s http://localhost:3456/api/availability
# Admin dates still works (will be 401 without cookie, that's correct)
curl -s http://localhost:3456/api/admin/dates
kill %1 2>/dev/null
```

Expected: `/api/availability` returns `{"unavailable":[...]}`, admin returns `{"error":"Unauthorized"}`.

- [ ] **Step 3: Push**

```bash
cd ~/meatfreaks && git push
```

- [ ] **Step 4: Post-deploy Google Cloud setup instructions**

Joshua needs to do this once:

**1. Create Google Cloud project:**
- Go to https://console.cloud.google.com
- Create a new project (e.g. "Meat Freaks Calendar")
- It's free, no billing needed for Calendar API

**2. Enable Calendar API:**
- In the project, go to APIs & Services > Library
- Search "Google Calendar API" and click Enable

**3. Create service account:**
- Go to APIs & Services > Credentials
- Click "Create Credentials" > "Service Account"
- Name it (e.g. "meatfreaks-calendar")
- Skip optional steps, click Done
- Click the service account email to open it
- Go to Keys tab > Add Key > Create New Key > JSON
- Download the JSON file

**4. Share Andy's calendar with the service account:**
- Open Google Calendar in a browser logged into Andy's Gmail
- Click the three dots next to Andy's calendar > Settings and sharing
- Under "Share with specific people or groups", add the service account email (from the JSON file, `client_email` field)
- Set permission to "Make changes to events"

**5. Get Andy's calendar ID:**
- In the same calendar settings page, scroll down to "Integrate calendar"
- Copy the Calendar ID (usually his Gmail address, e.g. `meatfreaksltd@gmail.com`)

**6. Add env vars to Vercel:**
- `GOOGLE_SERVICE_ACCOUNT_KEY` = paste the entire contents of the downloaded JSON file
- `GOOGLE_CALENDAR_ID` = Andy's calendar ID

**7. Redeploy** and test by blocking a date in the admin dashboard - it should appear in Andy's Google Calendar.
