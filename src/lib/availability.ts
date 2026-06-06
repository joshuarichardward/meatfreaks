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
