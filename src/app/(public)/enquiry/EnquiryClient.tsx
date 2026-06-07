'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { EnquiryPayload } from '@/lib/types'

// ─── Lane config ────────────────────────────────────────────────────────────

type LaneKey = 'festival' | 'wedding' | 'corporate'

const LANE_MAP: Record<string, { key: LaneKey; label: string; eventType: EnquiryPayload['eventType'] }> = {
  festival:  { key: 'festival',  label: 'Festival / Event', eventType: 'festival' },
  festivals: { key: 'festival',  label: 'Festival / Event', eventType: 'festival' },
  wedding:   { key: 'wedding',   label: 'Wedding',          eventType: 'wedding'  },
  weddings:  { key: 'wedding',   label: 'Wedding',          eventType: 'wedding'  },
  corporate: { key: 'corporate', label: 'Corporate event',  eventType: 'corporate' },
}

const LANE_VARS: Record<LaneKey, { accent: string; ink: string }> = {
  festival:  { accent: '#e8731c', ink: '#1b1511' },
  wedding:   { accent: '#b06a3f', ink: '#fff' },
  corporate: { accent: '#1f3a5f', ink: '#fff' },
}

// ─── Event type options ──────────────────────────────────────────────────────

const EVENT_TYPES: { label: string; value: EnquiryPayload['eventType'] }[] = [
  { label: 'Party',           value: 'party'     },
  { label: 'Wedding',         value: 'wedding'   },
  { label: 'Corporate',       value: 'corporate' },
  { label: 'Festival / Event',value: 'festival'  },
  { label: 'Other',           value: 'other'     },
]

const GUEST_OPTIONS = [
  'Under 50', '50–100', '100–250', '250–500', '500–1,000', '1,000+',
]

const REGIONS = [
  'London & South East', 'South West', 'Midlands', 'North West',
  'North East', 'Yorkshire', 'East of England', 'Wales', 'Scotland',
  'Northern Ireland', 'Other / UK-wide',
]

// ─── Calendar ───────────────────────────────────────────────────────────────

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function pad(n: number) { return String(n).padStart(2, '0') }
function toISO(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}` }

function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${DAYS_LONG[dt.getDay()]} ${d} ${MONTHS[m - 1]} ${y}`
}

interface CalendarProps {
  selected: string | null
  onSelect: (iso: string) => void
}

function Calendar({ selected, onSelect }: CalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate())

  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [unavailable, setUnavailable] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/availability')
      .then(r => r.json())
      .then(d => setUnavailable(d.unavailable ?? []))
      .catch(() => {})
  }, [])

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  function prevMonth() {
    if (isCurrentMonth) return
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Build calendar grid (Mon-first)
  const firstDay = new Date(year, month, 1)
  // getDay() returns 0=Sun. Convert to Mon=0 offset
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<number | null> = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="cal">
      {/* Header */}
      <div className="cal-head">
        <span className="cal-mlabel" style={{ fontWeight: 800, fontSize: 17 }}>
          {MONTHS[month]} {year}
        </span>
        <div className="cal-nav">
          <button
            type="button"
            onClick={prevMonth}
            disabled={isCurrentMonth}
            aria-label="Previous month"
            style={{ opacity: isCurrentMonth ? 0.35 : 1 }}
          >
            ←
          </button>
          <button type="button" onClick={nextMonth} aria-label="Next month">→</button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="cal-dow">
        {DOW.map(d => <span key={d}>{d}</span>)}
      </div>

      {/* Day cells */}
      <div className="cal-grid">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`e-${i}`} className="cal-cell empty" />
          }
          const iso = toISO(year, month, day)
          const isPast = iso < todayISO
          const isToday = iso === todayISO
          const isUnavail = unavailable.includes(iso)
          const isSel = iso === selected

          let cls = 'cal-cell'
          if (isPast) cls += ' past'
          else if (isUnavail) cls += ' unavailable'
          else if (isToday) cls += ' today'

          const disabled = isPast || isUnavail

          return (
            <button
              key={iso}
              className={cls}
              disabled={disabled}
              aria-pressed={isSel ? 'true' : 'false'}
              onClick={() => !disabled && onSelect(iso)}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Selected readout */}
      {selected && (
        <p style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>
          {formatDateLong(selected)}
        </p>
      )}

      {/* Legend */}
      <div className="cal-legend">
        <div className="li"><div className="sw sw-avail" /><span>Available</span></div>
        <div className="li"><div className="sw sw-sel" style={{ background: 'var(--accent)' }} /><span>Selected</span></div>
        <div className="li"><div className="sw sw-un" /><span>Already booked</span></div>
      </div>
    </div>
  )
}

// ─── Step label ─────────────────────────────────────────────────────────────

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div
        style={{
          width: 30, height: 30, borderRadius: 100,
          background: 'var(--accent)', color: 'var(--accent-ink)',
          display: 'grid', placeItems: 'center',
          fontWeight: 800, fontSize: 14, flexShrink: 0,
        }}
      >
        {n}
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '.02em', textTransform: 'uppercase' }}>
        {children}
      </span>
    </div>
  )
}

// ─── Error message ───────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p role="alert" style={{ color: 'var(--red)', fontSize: 13, fontWeight: 700, marginTop: 4 }}>
      {msg}
    </p>
  )
}

// ─── Summary row ─────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingBlock: 10, borderBottom: '1px solid rgba(244,234,215,.12)' }}>
      <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(244,234,215,.55)' }}>
        {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, textAlign: 'right', color: value ? 'var(--cream)' : 'rgba(244,234,215,.35)', fontStyle: value ? 'normal' : 'italic' }}>
        {value ?? 'Not set'}
      </span>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

type UIState = 'form' | 'submitting' | 'success'

interface FormErrors {
  eventType?: string
  name?: string
  email?: string
  region?: string
}

export default function EnquiryClient() {
  const params = useSearchParams()
  const laneParam = params.get('lane') ?? ''
  const laneConfig = LANE_MAP[laneParam.toLowerCase()] ?? null

  // CSS variable overrides via inline style on wrapper
  const laneVars = laneConfig ? LANE_VARS[laneConfig.key] : null

  // Lane chip state
  const [chipDismissed, setChipDismissed] = useState(false)

  // Form state
  const [eventType, setEventType] = useState<EnquiryPayload['eventType'] | null>(
    laneConfig?.eventType ?? null
  )
  const [date,      setDate]      = useState<string | null>(null)
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [region,    setRegion]    = useState('')
  const [guests,    setGuests]    = useState<string | null>(null)
  const [notes,     setNotes]     = useState('')

  const [errors,    setErrors]    = useState<FormErrors>({})
  const [uiState,   setUIState]   = useState<UIState>('form')

  const formRef = useRef<HTMLDivElement>(null)

  // Keep eventType in sync if lane param changes on client (edge case)
  useEffect(() => {
    if (laneConfig && !eventType) {
      setEventType(laneConfig.eventType)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Validation ────────────────────────────────────────────────
  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {}
    if (!eventType)           errs.eventType = 'Please choose an event type.'
    if (!name.trim())         errs.name      = 'Your name is required.'
    if (!email.trim())        errs.email     = 'Your email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
                              errs.email     = 'Please enter a valid email address.'
    if (!region)              errs.region    = 'Please choose your region.'
    return errs
  }, [eventType, name, email, region])

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      setTimeout(() => {
        const firstErr = formRef.current?.querySelector('[data-err]') as HTMLElement | null
        firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    setErrors({})
    setUIState('submitting')

    const payload: EnquiryPayload = {
      lane:        laneConfig?.key ?? null,
      eventType:   eventType!,
      date,
      name:        name.trim(),
      email:       email.trim(),
      phone:       phone.trim(),
      region,
      guests,
      notes:       notes.trim(),
      submittedAt: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/enquiry', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Server error')
      setUIState('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setUIState('form')
      alert('Something went wrong - please try again or email us directly.')
    }
  }

  const eventTypeLabel = EVENT_TYPES.find(e => e.value === eventType)?.label ?? null

  // ── Wrapper style (lane CSS vars) ─────────────────────────────
  const wrapperStyle: React.CSSProperties = laneVars
    ? ({ '--accent': laneVars.accent, '--accent-ink': laneVars.ink } as React.CSSProperties)
    : {}

  // ─────────────────────────────────────────────────────────────
  // SUCCESS STATE
  // ─────────────────────────────────────────────────────────────
  if (uiState === 'success') {
    const firstName = name.trim().split(' ')[0]
    return (
      <div style={wrapperStyle} data-lane={laneConfig?.key}>
        {/* Charcoal top strip */}
        <div style={{ background: 'var(--char)', paddingBlock: 'clamp(46px,7vw,80px) clamp(34px,5vw,52px)' }}>
          <div className="container" style={{ maxWidth: 680, textAlign: 'center' }}>
            <div className="success-mark">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                <path d="M6 17.5L13 24.5L28 9.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: 10 }}>
              Enquiry received
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)', textTransform: 'uppercase',
                fontSize: 'clamp(42px,7vw,80px)', lineHeight: .88, color: 'var(--cream)',
              }}
            >
              We&apos;re on it.
            </h2>
            <p style={{ marginTop: 20, color: 'rgba(244,234,215,.8)', fontSize: 'clamp(16px,1.9vw,19px)', lineHeight: 1.55, maxWidth: '48ch', marginInline: 'auto' }}>
              Thanks {firstName}, your enquiry&apos;s landed with the Meat Freaks crew.
              We&apos;ll check availability and come back to you with a tailored menu and
              quote, usually within one working day.
            </p>
          </div>
        </div>

        {/* Summary card */}
        <div style={{ background: 'var(--bone)', paddingBlock: 'clamp(40px,6vw,72px)' }}>
          <div className="container" style={{ maxWidth: 620 }}>

            {/* Recap table */}
            <div
              style={{
                background: 'var(--char)', borderRadius: 10, padding: 'clamp(20px,3vw,32px)',
                marginBottom: 28,
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)', textTransform: 'uppercase',
                  fontSize: 22, color: 'var(--ember)', marginBottom: 18,
                }}
              >
                Your enquiry
              </h3>
              {[
                { label: 'Occasion', value: eventTypeLabel },
                { label: 'Date',     value: date ? formatDateLong(date) : null },
                { label: 'Region',   value: region || null },
                { label: 'Guests',   value: guests },
                { label: 'Name',     value: name.trim() || null },
                { label: 'Email',    value: email.trim() || null },
              ].map(row => (
                <SummaryRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>

            {/* Next step callout */}
            <div
              style={{
                border: '1.5px solid var(--line)', borderRadius: 8, padding: '18px 22px',
                display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 32,
              }}
            >
              <div
                style={{
                  width: 38, height: 38, borderRadius: 100, background: 'var(--accent)',
                  display: 'grid', placeItems: 'center', flexShrink: 0, color: 'var(--accent-ink)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15 }}>What happens next?</p>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>
                  We&apos;ll review your details, check the date and come back to you by email
                  within one working day with a tailored menu proposal and quote.
                  If you don&apos;t see a confirmation email, please check your spam or junk folder.
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link className="btn btn-primary" href="/menu">
                Browse the menu <span className="arr">→</span>
              </Link>
              <Link className="btn btn-ghost" href="/" style={{ borderColor: 'var(--char)', color: 'var(--char)' }}>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // FORM STATE (+ submitting)
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={wrapperStyle} data-lane={laneConfig?.key}>
      {/* ── HERO ── */}
      <section
        style={{
          background: 'var(--char)',
          color: 'var(--cream)',
          paddingBlockStart: 'clamp(46px,7vw,80px)',
          paddingBlockEnd:   'clamp(34px,5vw,52px)',
        }}
      >
        <div className="container">
          {/* Lane chip */}
          {laneConfig && !chipDismissed && (
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--accent)', color: 'var(--accent-ink)',
                fontWeight: 800, fontSize: 13, padding: '8px 14px', borderRadius: 100,
                marginBottom: 18,
              }}
            >
              <span>Enquiring about: {laneConfig.label}</span>
              <button
                onClick={() => setChipDismissed(true)}
                aria-label="Dismiss"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'inherit', lineHeight: 1, fontSize: 16, padding: '0 0 0 4px',
                  opacity: .7,
                }}
              >
                ×
              </button>
            </div>
          )}

          <p className="eyebrow" style={{ color: 'var(--ember)' }}>
            Enquiry &amp; availability
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)', textTransform: 'uppercase',
              fontSize: 'clamp(50px,8vw,96px)', lineHeight: .86,
              letterSpacing: '.5px', marginTop: 12, maxWidth: '16ch',
            }}
          >
            Let&apos;s get your event booked in.
          </h1>
          <p
            style={{
              marginTop: 22, color: 'rgba(244,234,215,.8)',
              maxWidth: '52ch', fontSize: 'clamp(16px,1.9vw,19px)', lineHeight: 1.55,
            }}
          >
            Tell us what you&apos;re planning and pick a date, we&apos;ll check availability
            and come back with a tailored menu and quote, usually within one working day.
          </p>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section style={{ background: 'var(--bone)', paddingBlock: 'clamp(32px,5vw,64px)' }}>
        <div className="container">
          <form onSubmit={handleSubmit} noValidate>
            <div
              ref={formRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(280px,1fr,1fr) min(340px,100%)',
                gap: 'clamp(24px,3.5vw,44px)',
                alignItems: 'start',
              }}
              className="enq-layout"
            >
              {/* ── LEFT COLUMN ── */}
              <div style={{ minWidth: 0 }}>

                {/* ─ Block 1: Event type ─ */}
                <div
                  style={{
                    background: '#fff', borderRadius: 10, padding: 'clamp(22px,3vw,36px)',
                    marginBottom: 'clamp(16px,2vw,24px)',
                    boxShadow: '0 1px 2px rgba(27,21,17,.06), 0 6px 20px -8px rgba(27,21,17,.14)',
                  }}
                >
                  <StepLabel n={1}>What&apos;s the occasion?</StepLabel>
                  <div className="seg">
                    {EVENT_TYPES.map(et => (
                      <button
                        key={et.value}
                        type="button"
                        aria-pressed={eventType === et.value ? 'true' : 'false'}
                        onClick={() => {
                          setEventType(et.value)
                          setErrors(e => ({ ...e, eventType: undefined }))
                        }}
                      >
                        {et.label}
                      </button>
                    ))}
                  </div>
                  {errors.eventType && (
                    <div data-err="eventType">
                      <FieldError msg={errors.eventType} />
                    </div>
                  )}
                </div>

                {/* ─ Block 2: Date ─ */}
                <div
                  style={{
                    background: '#fff', borderRadius: 10, padding: 'clamp(22px,3vw,36px)',
                    marginBottom: 'clamp(16px,2vw,24px)',
                    boxShadow: '0 1px 2px rgba(27,21,17,.06), 0 6px 20px -8px rgba(27,21,17,.14)',
                  }}
                >
                  <StepLabel n={2}>Pick your date</StepLabel>
                  <Calendar selected={date} onSelect={(iso) => {
                  setDate(iso)
                  setTimeout(() => {
                    document.getElementById('enq-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }} />
                </div>

                {/* ─ Block 3: Details ─ */}
                <div
                  id="enq-details"
                  style={{
                    background: '#fff', borderRadius: 10, padding: 'clamp(22px,3vw,36px)',
                    boxShadow: '0 1px 2px rgba(27,21,17,.06), 0 6px 20px -8px rgba(27,21,17,.14)',
                  }}
                >
                  <StepLabel n={3}>Your details</StepLabel>

                  {/* Name */}
                  <div className="field" data-err={errors.name ? 'name' : undefined}>
                    <label htmlFor="enq-name">
                      Name <span className="req">*</span>
                    </label>
                    <input
                      id="enq-name"
                      type="text"
                      className={`input${errors.name ? ' err' : ''}`}
                      autoComplete="name"
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })) }}
                      style={errors.name ? { borderColor: 'var(--red)' } : {}}
                    />
                    <FieldError msg={errors.name} />
                  </div>

                  {/* Email + Phone */}
                  <div className="field-row">
                    <div className="field" data-err={errors.email ? 'email' : undefined}>
                      <label htmlFor="enq-email">
                        Email <span className="req">*</span>
                      </label>
                      <input
                        id="enq-email"
                        type="email"
                        className={`input${errors.email ? ' err' : ''}`}
                        autoComplete="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setErrors(er => ({ ...er, email: undefined })) }}
                        style={errors.email ? { borderColor: 'var(--red)' } : {}}
                      />
                      <FieldError msg={errors.email} />
                    </div>
                    <div className="field">
                      <label htmlFor="enq-phone">Phone</label>
                      <input
                        id="enq-phone"
                        type="tel"
                        className="input"
                        autoComplete="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Region + Guests */}
                  <div className="field-row">
                    <div className="field" data-err={errors.region ? 'region' : undefined}>
                      <label htmlFor="enq-region">
                        Region <span className="req">*</span>
                      </label>
                      <select
                        id="enq-region"
                        className={`select${errors.region ? ' err' : ''}`}
                        value={region}
                        onChange={e => { setRegion(e.target.value); setErrors(er => ({ ...er, region: undefined })) }}
                        style={errors.region ? { borderColor: 'var(--red)' } : {}}
                      >
                        <option value="">Select region…</option>
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <FieldError msg={errors.region} />
                    </div>
                    <div className="field">
                      <label htmlFor="enq-guests">Expected guests</label>
                      <select
                        id="enq-guests"
                        className="select"
                        value={guests ?? ''}
                        onChange={e => setGuests(e.target.value || null)}
                      >
                        <option value="">Not sure yet</option>
                        {GUEST_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="field">
                    <label htmlFor="enq-notes">Anything else?</label>
                    <span className="hint">
                      The more you tell us, the better we can tailor your quote.
                    </span>
                    <textarea
                      id="enq-notes"
                      className="textarea"
                      rows={5}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN — sticky summary ── */}
              <aside
                style={{
                  position: 'sticky', top: 100,
                }}
              >
                <div
                  style={{
                    background: 'var(--char)', color: 'var(--cream)',
                    borderRadius: 10, padding: 'clamp(20px,3vw,28px)',
                    boxShadow: '0 24px 64px -20px rgba(27,21,17,.4)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)', textTransform: 'uppercase',
                      fontSize: 22, color: 'var(--ember)', marginBottom: 18,
                    }}
                  >
                    Your enquiry
                  </h3>

                  <SummaryRow label="Occasion" value={eventTypeLabel} />
                  <SummaryRow label="Date"     value={date ? formatDateLong(date) : null} />
                  <SummaryRow label="Region"   value={region || null} />
                  <SummaryRow label="Guests"   value={guests} />

                  <div style={{ height: 22 }} />

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={uiState === 'submitting'}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {uiState === 'submitting' ? (
                      <>
                        <span className="spinner" />
                        Sending…
                      </>
                    ) : (
                      <>Send enquiry <span className="arr">→</span></>
                    )}
                  </button>

                  {/* Reassurance */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16,
                      fontSize: 13, color: 'rgba(244,234,215,.58)', lineHeight: 1.45,
                    }}
                  >
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}
                    >
                      <path
                        d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
                        stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
                      />
                    </svg>
                    <span>
                      No obligation. We&apos;ll come back within one working day with
                      tailored options and pricing - completely free.
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        </div>
      </section>

      {/* Responsive grid breakpoint style */}
      <style>{`
        @media (max-width: 900px) {
          .enq-layout {
            grid-template-columns: 1fr !important;
          }
          .enq-layout aside {
            position: static !important;
            order: 1;
          }
        }
      `}</style>
    </div>
  )
}
