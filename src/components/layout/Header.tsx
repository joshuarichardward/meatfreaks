'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MobileNav } from './MobileNav'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/festivals', label: 'Festivals' },
  { href: '/weddings', label: 'Weddings' },
  { href: '/corporate', label: 'Corporate' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const laneEnquiryMap: Record<string, string> = {
  '/festivals': '?lane=festival',
  '/weddings': '?lane=wedding',
  '/corporate': '?lane=corporate',
}

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const enquiryParams = laneEnquiryMap[pathname] || ''

  return (
    <>
      <header className="site-header">
        <div className="container bar">
          <Link className="brand" href="/" aria-label="Meat Freaks home">
            <Image src="/assets/logo-ember.png" alt="Meat Freaks BBQ Event Catering" height={70} width={210} style={{ height: 70, width: 'auto' }} />
          </Link>
          <nav className="nav" aria-label="Primary">
            {links.map(link => (
              <Link
                key={link.href}
                className={`nav-link${pathname === link.href ? ' active' : ''}`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            <Link className="btn btn-primary nav-cta" href={`/enquiry${enquiryParams}`}>
              Enquire
            </Link>
            <button
              className="menu-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 7h20M3 13h20M3 19h20" />
              </svg>
            </button>
          </nav>
        </div>
      </header>
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        enquiryParams={enquiryParams}
      />
    </>
  )
}
