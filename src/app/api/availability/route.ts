import { NextResponse } from 'next/server'
import { getBookedDates } from '@/lib/availability'

export async function GET() {
  const unavailable = getBookedDates()
  return NextResponse.json({ unavailable })
}
