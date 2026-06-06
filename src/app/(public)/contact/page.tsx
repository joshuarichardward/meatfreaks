import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Contact & Social',
}

const INSTAGRAM_URL = 'https://www.instagram.com/meatfreaks1'

const instaImages = [
  { src: '/assets/smoker-goldenhour.jpg', alt: 'Smoker glowing gold at dusk' },
  { src: '/assets/food-ribs.jpg',         alt: 'Rack of smoked ribs' },
  { src: '/assets/stall-soldout.jpg',     alt: 'Meat Freaks stall sold out sign' },
  { src: '/assets/feast-arch.jpg',        alt: 'Feast spread under an archway' },
  { src: '/assets/food-rosemary.jpg',     alt: 'Herb-crusted meat fresh off the pit' },
  { src: '/assets/chimney-night.jpg',     alt: 'Chimney smoke at night' },
]

export default function ContactPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--char)',
          color: 'var(--cream)',
          paddingBlockStart: 'clamp(54px,8vw,90px)',
          paddingBlockEnd:   'clamp(36px,5vw,60px)',
        }}
      >
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--ember)' }}>Say hello</p>

          <h1
            style={{
              fontFamily:    'var(--font-display)',
              textTransform: 'uppercase',
              fontSize:      'clamp(60px,12vw,140px)',
              lineHeight:    '.86',
              letterSpacing: '.5px',
              marginTop:     12,
            }}
          >
            Get in{' '}
            <em style={{ fontStyle: 'normal', color: 'var(--ember)' }}>touch</em>
          </h1>

          <p
            style={{
              marginTop: 22,
              color:     'rgba(244,234,215,.82)',
              maxWidth:  '46ch',
              fontSize:  'clamp(16px,1.9vw,18px)',
              lineHeight: 1.55,
            }}
          >
            Got an event in mind, or just want to talk smoke? Drop us a line, or
            start an enquiry and we&apos;ll come straight back with availability.
          </p>

          {/* Info pills */}
          <div
            style={{
              display:    'flex',
              flexWrap:   'wrap',
              gap:        '10px 28px',
              marginTop:  8,
              fontSize:   13,
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color:      'rgba(244,234,215,.68)',
            }}
          >
            {[
              'UK-wide coverage',
              'All event types',
              'Festivals · Weddings · Corporate · Parties',
            ].map((pill) => (
              <span
                key={pill}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}
              >
                <span
                  style={{
                    width:        6,
                    height:       6,
                    borderRadius: 100,
                    background:   'var(--ember)',
                    flexShrink:   0,
                  }}
                />
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CARDS ────────────────────────────────────────── */}
      <section style={{ paddingBlockStart: 'clamp(36px,5vw,56px)', paddingBlockEnd: 'clamp(36px,5vw,72px)' }}>
        <div className="container">
          <div
            className="contact-cards"
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap:                 16,
            }}
          >
            {/* Card wrapper style */}
            {/* ── Email ── */}
            <ScrollReveal delay={0}>
            <div
              style={{
                border:       '1.5px solid var(--line)',
                borderRadius: 8,
                padding:      26,
                background:   '#fff',
              }}
            >
              <p
                style={{
                  fontWeight:    800,
                  fontSize:      12,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color:         'var(--ember)',
                  margin:        0,
                }}
              >
                Email
              </p>
              <a
                href="mailto:meatfreaksltd@gmail.com"
                style={{
                  display:    'block',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 800,
                  fontSize:   21,
                  marginTop:  10,
                  color:      'var(--ink)',
                  wordBreak:  'break-all',
                  lineHeight: 1.2,
                }}
              >
                meatfreaksltd@gmail.com
              </a>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 14.5 }}>
                Best for detailed enquiries &amp; quotes.
              </p>
            </div>
            </ScrollReveal>

            {/* ── Phone ── */}
            <ScrollReveal delay={100}>
            <div
              style={{
                border:       '1.5px solid var(--line)',
                borderRadius: 8,
                padding:      26,
                background:   '#fff',
              }}
            >
              <p
                style={{
                  fontWeight:    800,
                  fontSize:      12,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color:         'var(--ember)',
                  margin:        0,
                }}
              >
                Phone
              </p>
              <a
                href="tel:07916635610"
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-display)',
                  textTransform: 'uppercase',
                  fontSize:      'clamp(20px,2.4vw,26px)',
                  fontWeight:    400,
                  letterSpacing: '.5px',
                  marginTop:     10,
                  color:         'var(--ink)',
                  lineHeight:    1.15,
                }}
              >
                07916 635610
              </a>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 14.5 }}>
                Call or text, we&apos;re often by the pit.
              </p>
            </div>
            </ScrollReveal>

            {/* ── Instagram ── */}
            <ScrollReveal delay={200}>
            <div
              style={{
                border:       '1.5px solid var(--line)',
                borderRadius: 8,
                padding:      26,
                background:   '#fff',
              }}
            >
              <p
                style={{
                  fontWeight:    800,
                  fontSize:      12,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color:         'var(--ember)',
                  margin:        0,
                }}
              >
                Instagram
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:    'block',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 800,
                  fontSize:   21,
                  marginTop:  10,
                  color:      'var(--ink)',
                  lineHeight: 1.2,
                }}
              >
                @meatfreaks1
              </a>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 14.5 }}>
                See the latest cooks &amp; events.
              </p>
            </div>
            </ScrollReveal>
          </div>

          {/* Enquiry CTA */}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
              Ready to talk dates?
            </p>
            <Link className="btn btn-primary btn-lg" href="/enquiry">
              Start an enquiry <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM GRID ───────────────────────────────────────── */}
      <section style={{ background: 'var(--char)', color: 'var(--cream)', paddingBlock: 'clamp(48px,7vw,96px)' }}>
        <div className="container">
          {/* Header row */}
          <ScrollReveal>
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              flexWrap:       'wrap',
              gap:            '16px 24px',
            }}
          >
            <div>
              <p className="eyebrow" style={{ color: 'var(--ember)' }}>
                Follow the smoke
              </p>
              <h2
                className="display"
                style={{
                  fontSize:  'clamp(38px,4.5vw,54px)',
                  marginTop: 8,
                  color:     'var(--cream)',
                }}
              >
                @meatfreaks1 on Instagram
              </h2>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light"
              style={{ whiteSpace: 'nowrap' }}
            >
              Open Instagram →
            </a>
          </div>
          </ScrollReveal>

          {/* 6-col image grid */}
          <div
            className="insta-grid"
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(6,1fr)',
              gap:                 8,
              marginTop:           28,
            }}
          >
            {instaImages.map(({ src, alt }) => (
              <a
                key={src}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:       'block',
                  position:      'relative',
                  aspectRatio:   '1 / 1',
                  overflow:      'hidden',
                  borderRadius:  4,
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 760px) 33vw, 17vw"
                  style={{ objectFit: 'cover', transition: 'transform .35s ease' }}
                />
              </a>
            ))}
          </div>

          {/* Responsive grid override */}
          <style>{`
            @media (max-width: 760px) {
              .insta-grid { grid-template-columns: repeat(3,1fr) !important; }
              .contact-cards { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>
    </>
  )
}
