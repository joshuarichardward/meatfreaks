'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        setFormError('Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setFormError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--char)',
      padding: '24px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--char-2)',
        borderRadius: 8,
        border: '1px solid rgba(244,234,215,.12)',
        padding: '40px 36px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ marginBottom: 28 }}>
          <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: 8 }}>
            Admin Dashboard
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '.5px',
            color: 'var(--cream)',
            lineHeight: 1,
          }}>
            Meat Freaks
          </h1>
        </div>

        {error === 'invalid-token' && (
          <div style={{
            background: 'rgba(158,43,37,.18)',
            border: '1px solid rgba(158,43,37,.4)',
            borderRadius: 'var(--r)',
            padding: '12px 16px',
            marginBottom: 20,
            color: '#f08080',
            fontSize: 14,
            lineHeight: 1.5,
          }}>
            That login link has expired or is invalid. Please request a new one.
          </div>
        )}

        {submitted ? (
          <div style={{
            textAlign: 'center',
            padding: '20px 0',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(232,115,28,.15)',
              border: '2px solid var(--ember)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ color: 'var(--cream)', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
              Check your inbox
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              A login link has been sent to <strong style={{ color: 'var(--cream)' }}>{email}</strong>. It expires in 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                color: 'var(--muted)',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.1em',
                marginBottom: 8,
              }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '13px 14px',
                  background: 'rgba(244,234,215,.06)',
                  border: '1px solid rgba(244,234,215,.15)',
                  borderRadius: 'var(--r)',
                  color: 'var(--cream)',
                  fontSize: 16, /* prevents iOS zoom */
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'border-color .15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--ember)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(244,234,215,.15)' }}
              />
            </div>

            {formError && (
              <p style={{
                color: '#f08080',
                fontSize: 14,
                marginBottom: 16,
              }}>
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', opacity: loading || !email ? .6 : 1 }}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Sending…
                </>
              ) : (
                'Send login link'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--char)',
      }}>
        <span className="spinner" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
