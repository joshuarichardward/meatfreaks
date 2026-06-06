'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

/* ── Types ──────────────────────────────────────────────────────────── */

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

/* ── Helpers ─────────────────────────────────────────────────────────── */

function iso(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const day = Math.floor(h / 24)
  if (day < 14) return `${day}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function humanDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ── Calendar helpers ────────────────────────────────────────────────── */

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// Monday = 0 ... Sunday = 6
function startDayOfWeek(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay()
  return (d + 6) % 7
}

/* ── Enquiry card ────────────────────────────────────────────────────── */

function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const [expanded, setExpanded] = useState(false)

  const laneColor: Record<string, string> = {
    festivals: 'var(--ember)',
    weddings: '#b06a3f',
    corporate: '#1f3a5f',
  }
  const badgeBg = enquiry.lane ? laneColor[enquiry.lane] ?? 'var(--muted)' : 'var(--muted)'

  return (
    <div
      onClick={() => setExpanded(v => !v)}
      style={{
        background: 'var(--char-2)',
        border: '1px solid rgba(244,234,215,.1)',
        borderRadius: 8,
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'border-color .15s',
        marginBottom: 10,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,234,215,.25)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(244,234,215,.1)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ color: 'var(--cream)', fontWeight: 700, fontSize: 16 }}>{enquiry.name}</span>
            <span style={{
              background: badgeBg,
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              padding: '3px 8px',
              borderRadius: 4,
            }}>
              {enquiry.eventType}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--muted)', fontSize: 13 }}>
            <span>{enquiry.date ? humanDate(enquiry.date) : 'Flexible'}</span>
            <span>{enquiry.region}</span>
            {enquiry.guests && <span>{enquiry.guests} guests</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>{timeAgo(enquiry.submittedAt)}</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid rgba(244,234,215,.08)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Phone</span>
              <a
                href={`tel:${enquiry.phone}`}
                style={{ display: 'block', color: 'var(--ember)', fontSize: 15, marginTop: 2 }}
              >
                {enquiry.phone}
              </a>
            </div>
            <div>
              <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Email</span>
              <a
                href={`mailto:${enquiry.email}`}
                style={{ display: 'block', color: 'var(--ember)', fontSize: 15, marginTop: 2 }}
              >
                {enquiry.email}
              </a>
            </div>
            {enquiry.notes && (
              <div>
                <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Notes</span>
                <p style={{ color: 'var(--cream)', fontSize: 14, lineHeight: 1.6, marginTop: 4 }}>{enquiry.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Calendar tab ────────────────────────────────────────────────────── */

function CalendarTab({ blockedDates, onToggle }: {
  blockedDates: Set<string>
  onToggle: (dateStr: string, block: boolean) => void
}) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const todayIso = iso(today)
  const totalDays = daysInMonth(year, month)
  const startOffset = startDayOfWeek(year, month)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const cells: Array<{ dateStr: string | null; day: number | null }> = []
  for (let i = 0; i < startOffset; i++) cells.push({ dateStr: null, day: null })
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d)
    cells.push({ dateStr: iso(date), day: d })
  }

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={prevMonth}
          style={{
            background: 'var(--char-2)',
            border: '1px solid rgba(244,234,215,.12)',
            borderRadius: 6,
            color: 'var(--cream)',
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            minHeight: 48, minWidth: 48,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span style={{
          color: 'var(--cream)',
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          textTransform: 'uppercase',
          letterSpacing: '.5px',
        }}>
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          style={{
            background: 'var(--char-2)',
            border: '1px solid rgba(244,234,215,.12)',
            borderRadius: 6,
            color: 'var(--cream)',
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            minHeight: 48, minWidth: 48,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DAY_LABELS.map(label => (
          <div key={label} style={{
            textAlign: 'center',
            color: 'var(--muted)',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            paddingBottom: 6,
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((cell, i) => {
          if (!cell.dateStr || !cell.day) {
            return <div key={`empty-${i}`} />
          }

          const isPast = cell.dateStr < todayIso
          const isToday = cell.dateStr === todayIso
          const isBlocked = blockedDates.has(cell.dateStr)

          let bg = 'rgba(244,234,215,.06)'
          let color = 'var(--cream)'
          let borderColor = 'transparent'
          let cursor = 'pointer'

          if (isPast) {
            bg = 'rgba(244,234,215,.02)'
            color = 'var(--muted)'
            cursor = 'default'
          } else if (isBlocked) {
            bg = 'var(--ember)'
            color = '#fff'
          } else {
            bg = 'rgba(251,247,239,.08)'
          }

          if (isToday) {
            borderColor = 'var(--ember)'
          }

          return (
            <div
              key={cell.dateStr}
              onClick={() => !isPast && onToggle(cell.dateStr!, isBlocked)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                background: bg,
                color,
                fontSize: 13,
                fontWeight: isToday ? 700 : 400,
                border: `2px solid ${borderColor}`,
                cursor,
                transition: 'background .12s, opacity .12s',
                minHeight: 40,
              }}
            >
              {cell.day}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(251,247,239,.08)', border: '1px solid rgba(244,234,215,.15)' }} />
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--ember)' }} />
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>Blocked</span>
        </div>
      </div>
    </div>
  )
}

/* ── Dashboard ───────────────────────────────────────────────────────── */

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'enquiries' | 'calendar'>('enquiries')
  const [toast, setToast] = useState<string | null>(null)

  /* ── Load data ────────────────────────────────────────────────────── */

  useEffect(() => {
    async function load() {
      const [eRes, dRes] = await Promise.all([
        fetch('/api/admin/enquiries'),
        fetch('/api/admin/dates'),
      ])

      if (eRes.status === 401 || dRes.status === 401) {
        router.replace('/admin')
        return
      }

      const [eData, dData] = await Promise.all([eRes.json(), dRes.json()])
      const sorted = (eData.enquiries ?? []).sort(
        (a: Enquiry, b: Enquiry) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
      setEnquiries(sorted)
      setBlockedDates(new Set(dData.dates ?? []))
      setLoading(false)
    }

    load()
  }, [router])

  /* ── Toast helper ─────────────────────────────────────────────────── */

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  /* ── Toggle date ──────────────────────────────────────────────────── */

  const handleToggleDate = useCallback(async (dateStr: string, wasBlocked: boolean) => {
    // Optimistic update
    setBlockedDates(prev => {
      const next = new Set(prev)
      if (wasBlocked) next.delete(dateStr)
      else next.add(dateStr)
      return next
    })

    try {
      const res = await fetch('/api/admin/dates', {
        method: wasBlocked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr }),
      })

      if (!res.ok) throw new Error('Failed')
      showToast(wasBlocked ? 'Date unblocked' : 'Date blocked')
    } catch {
      // Revert
      setBlockedDates(prev => {
        const next = new Set(prev)
        if (wasBlocked) next.add(dateStr)
        else next.delete(dateStr)
        return next
      })
      showToast('Something went wrong')
    }
  }, [])

  /* ── Logout ───────────────────────────────────────────────────────── */

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin')
  }

  /* ── Render ───────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--char)',
      }}>
        <span className="spinner" />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--char)', fontFamily: 'var(--font-sans)' }}>

      {/* ── Sticky header ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 64,
        background: 'var(--char)',
        borderBottom: '1px solid rgba(244,234,215,.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            color: 'var(--cream)',
            textTransform: 'uppercase',
            letterSpacing: '.5px',
          }}>
            Meat Freaks
          </span>
          <span style={{
            background: 'var(--ember)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.1em',
            padding: '3px 8px',
            borderRadius: 4,
          }}>
            Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid rgba(244,234,215,.2)',
            borderRadius: 6,
            color: 'var(--muted)',
            fontSize: 13,
            fontWeight: 600,
            padding: '8px 14px',
            cursor: 'pointer',
            minHeight: 36,
            fontFamily: 'var(--font-sans)',
            transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.borderColor = 'rgba(244,234,215,.4)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'rgba(244,234,215,.2)' }}
        >
          Log out
        </button>
      </header>

      {/* ── Sticky tab bar ── */}
      <div style={{
        position: 'sticky',
        top: 64,
        zIndex: 40,
        background: 'var(--char)',
        borderBottom: '1px solid rgba(244,234,215,.1)',
        display: 'flex',
        padding: '0 20px',
      }}>
        {([
          ['enquiries', `Enquiries (${enquiries.length})`],
          ['calendar', 'Calendar'],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--ember)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--cream)' : 'var(--muted)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: 14,
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'color .15s',
              minHeight: 48,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <main style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '24px 20px 80px',
      }}>
        {activeTab === 'enquiries' ? (
          <div>
            {enquiries.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 0',
                color: 'var(--muted)',
                fontSize: 15,
              }}>
                No enquiries yet. They will appear here when submitted.
              </div>
            ) : (
              enquiries.map(enquiry => (
                <EnquiryCard key={enquiry.id} enquiry={enquiry} />
              ))
            )}
          </div>
        ) : (
          <CalendarTab
            blockedDates={blockedDates}
            onToggle={handleToggleDate}
          />
        )}
      </main>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--char-2)',
          border: '1px solid rgba(244,234,215,.15)',
          borderRadius: 8,
          color: 'var(--cream)',
          fontSize: 14,
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
