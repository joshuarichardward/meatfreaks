import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getEnquiries } from '@/lib/availability'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const enquiries = await getEnquiries()
  return NextResponse.json({ enquiries })
}
