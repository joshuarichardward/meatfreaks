'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  enquiryParams: string
}

const links = [
  { href: '/festivals', label: 'Festivals' },
  { href: '/weddings', label: 'Weddings' },
  { href: '/corporate', label: 'Corporate' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function MobileNav({ open, onClose, enquiryParams }: MobileNavProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div
      className={`mobile-nav${open ? ' open' : ''}`}
      aria-label="Mobile menu"
    >
      <div className="mtop">
        <span className="brand">
          <Image src="/assets/logo-ember.png" alt="Meat Freaks" height={54} width={162} style={{ height: 54, width: 'auto' }} />
        </span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{ background: 'none', border: 0, color: 'var(--cream)', cursor: 'pointer' }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M7 7l16 16M23 7L7 23" />
          </svg>
        </button>
      </div>
      <nav>
        {links.map(link => (
          <Link key={link.href} href={link.href} onClick={onClose}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Link className="btn btn-primary btn-lg mn-cta" href={`/enquiry${enquiryParams}`} onClick={onClose}>
        Start an enquiry →
      </Link>
    </div>
  )
}
