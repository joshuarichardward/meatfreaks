import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_PATH = join(process.cwd(), 'src/data/booked-dates.json')

export function getBookedDates(): string[] {
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function addBookedDate(date: string): void {
  const dates = getBookedDates()
  if (!dates.includes(date)) {
    dates.push(date)
    dates.sort()
    writeFileSync(DATA_PATH, JSON.stringify(dates, null, 2))
  }
}

export function removeBookedDate(date: string): void {
  const dates = getBookedDates().filter(d => d !== date)
  writeFileSync(DATA_PATH, JSON.stringify(dates, null, 2))
}

export function storeSubmission(payload: Record<string, unknown>): void {
  const logPath = join(process.cwd(), 'src/data/submissions.json')
  let submissions: Record<string, unknown>[] = []
  try {
    submissions = JSON.parse(readFileSync(logPath, 'utf-8'))
  } catch {
    // file doesn't exist yet
  }
  submissions.push(payload)
  writeFileSync(logPath, JSON.stringify(submissions, null, 2))
}
