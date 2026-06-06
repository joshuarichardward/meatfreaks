import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getBookedDates, addBookedDate, removeBookedDate } from '@/lib/availability'

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
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { date } = await request.json()
  await removeBookedDate(date)
  return NextResponse.json({ ok: true })
}
