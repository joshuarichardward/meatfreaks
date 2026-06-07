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

const MAX_ENQUIRIES = 500

export async function storeEnquiry(payload: StoredEnquiry): Promise<void> {
  if (useKV()) {
    const enquiries = await getEnquiries()
    enquiries.unshift(payload)
    if (enquiries.length > MAX_ENQUIRIES) enquiries.length = MAX_ENQUIRIES
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
