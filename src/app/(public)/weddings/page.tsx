import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wedding BBQ Catering',
}

export default function WeddingsPage() {
  return (
    <div className="lane-weddings">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="w-hero">
        {/* Copy side */}
        <div style={{
          padding: 'clamp(48px,7vw,96px) clamp(28px,5vw,72px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <p className="eyebrow">Lane 02 · Weddings</p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            fontSize: 'clamp(50px,6vw,82px)',
            lineHeight: 1.02,
            letterSpacing: 0,
            textTransform: 'none',
            marginTop: 18,
            maxWidth: '14ch',
          }}>
            The feast they&apos;ll{' '}
            <em style={{ fontStyle: 'italic', color: '#b06a3f' }}>remember.</em>
          </h1>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.9vw,21px)',
            lineHeight: 1.55,
            marginTop: 24,
            maxWidth: '42ch',
            color: '#5a4f45',
          }}>
            Live-fire BBQ, beautifully done, relaxed enough to feel like you,
            refined enough for the day that matters most.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
            <Link className="btn btn-primary btn-lg" href="/enquiry?lane=wedding">
              Enquire about your day <span className="arr">→</span>
            </Link>
            <Link className="btn btn-ghost btn-lg" href="/menu">
              View the menu
            </Link>
          </div>
        </div>

        {/* Media side */}
        <div className="w-hero-media">
          <Image
            src="/assets/service-plated.jpg"
            alt="Beautifully plated wedding BBQ from Meat Freaks"
            fill
            preload
            sizes="(max-width:860px) 100vw, 48vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* ── 2. INTRO ────────────────────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <div style={{
            position: 'relative',
            width: 96,
            height: 96,
            borderRadius: 100,
            overflow: 'hidden',
            margin: '0 auto 28px',
            boxShadow: '0 4px 22px rgba(42,34,28,.18)',
          }}>
            <Image
              src="/assets/mf-monogram.jpg"
              alt="Meat Freaks monogram"
              fill
              sizes="96px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(20px,2.4vw,26px)',
            lineHeight: 1.55,
            color: '#2a221c',
          }}>
            Smoke and fire, plated with{' '}
            <em style={{ fontStyle: 'italic', color: '#b06a3f' }}>intention.</em>{' '}
            We bring the warmth of a backyard cook-out to a celebration that feels
            considered, calm and entirely yours.
          </p>
        </div>
      </section>

      {/* ── 3. HAIRLINE DIVIDER ─────────────────────────────────────────────── */}
      <div className="container">
        <hr style={{ border: 0, height: 1, background: '#d8cbb6', margin: 0 }} />
      </div>

      {/* ── 4. HOW WE CATER ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '50ch', margin: '0 auto clamp(40px,6vw,68px)' }}>
            <p className="eyebrow">How we cater your day</p>
            <h2 className="display-serif" style={{ fontSize: 'clamp(38px,4.5vw,52px)', marginTop: 14 }}>
              Quietly looked after, start to finish.
            </h2>
          </div>

          <div className="w-offer-grid">
            {[
              {
                num: 'i.',
                title: "A menu that's yours",
                body: "We'll shape the food around your day, feasting tables, plated courses or relaxed sharing boards, with tastings before you commit.",
              },
              {
                num: 'ii.',
                title: 'Beautifully presented',
                body: 'The flavour of a proper BBQ, finished with the care of fine dining. Considered plating, generous boards, nothing rushed.',
              },
              {
                num: 'iii.',
                title: 'Calm on the day',
                body: "Our team handle the cook, the service and the clear-down so you and your guests simply enjoy it. We've got the timings.",
              },
            ].map(offer => (
              <div key={offer.num}>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 20,
                  color: '#b06a3f',
                  marginBottom: 10,
                }}>
                  {offer.num}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  fontSize: 26,
                  color: '#2a221c',
                  marginBottom: 12,
                  lineHeight: 1.1,
                }}>
                  {offer.title}
                </h3>
                <p style={{ color: '#5a4f45', fontSize: 16, lineHeight: 1.6 }}>
                  {offer.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. GALLERY ──────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 0, paddingBottom: 'clamp(56px,9vw,120px)' }}>
        <div className="container">
          <div className="w-gallery">
            <div className="w-gallery-7">
              <Image
                src="/assets/feast-arch.jpg"
                alt="Feast table under a garden arch"
                fill
                sizes="(max-width:760px) 100vw, 58vw"
                style={{ objectFit: 'cover', borderRadius: 0 }}
              />
            </div>
            <div className="w-gallery-5">
              <Image
                src="/assets/food-rosemary.jpg"
                alt="Smoked joint garnished with rosemary"
                fill
                sizes="(max-width:760px) 100vw, 42vw"
                style={{ objectFit: 'cover', borderRadius: 0 }}
              />
            </div>
            <div className="w-gallery-5">
              <Image
                src="/assets/platter.jpg"
                alt="Wedding BBQ sharing platter"
                fill
                sizes="(max-width:760px) 100vw, 42vw"
                style={{ objectFit: 'cover', borderRadius: 0 }}
              />
            </div>
            <div className="w-gallery-7">
              <Image
                src="/assets/service-plated.jpg"
                alt="Plated wedding BBQ service"
                fill
                sizes="(max-width:760px) 100vw, 58vw"
                style={{ objectFit: 'cover', borderRadius: 0 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. DUAL TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#2a221c', color: '#f4ead7' }}>
        <div className="container">
          <div className="w-testi-grid">
            {[
              {
                quote: '\u2018We\u2019d seen Meat Freaks bring the noise at a festival, so we couldn\u2019t quite believe it was the same crew at our wedding, sharp in uniform, with high-end, considered plating and the calmest, most elegant atmosphere. Same incredible food, run completely differently. Our guests are still talking about it.',
                attr: 'Hannah & Tom \u00b7 Cotswolds wedding',
              },
              {
                quote: 'Every one of our guests was amazed by the food. Andy and the team put together a completely personalised menu for us and nothing was too much trouble, they made our engagement party feel really special.',
                attr: 'Chris & Katie \u00b7 Lancashire engagement party',
              },
            ].map(card => (
              <div key={card.attr} style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(244,234,215,.2)',
                borderRadius: 10,
                padding: 'clamp(28px,3.2vw,46px)',
                background: 'rgba(244,234,215,.035)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(20px,2.2vw,28px)',
                  lineHeight: 1.45,
                  maxWidth: '30ch',
                }}>
                  &ldquo;{card.quote}&rdquo;
                </p>
                <p style={{
                  marginTop: 'auto',
                  paddingTop: 24,
                  letterSpacing: '.24em',
                  textTransform: 'uppercase',
                  fontSize: 12,
                  color: '#d8b89a',
                }}>
                  {card.attr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA ──────────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bone)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 660 }}>
          <p className="eyebrow">Let&apos;s talk about your day</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            fontSize: 'clamp(38px,4.5vw,52px)',
            lineHeight: 1.08,
            marginTop: 16,
            color: '#2a221c',
          }}>
            Tell us your{' '}
            <em style={{ fontStyle: 'italic', color: '#b06a3f' }}>date,</em>{' '}
            we&apos;ll do the rest.
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            color: '#5a4f45',
            maxWidth: '44ch',
            marginInline: 'auto',
            marginTop: 18,
            lineHeight: 1.6,
          }}>
            Whether you know exactly what you want or you&apos;re just starting to think
            it through, we&apos;re happy to talk through options and put together something
            built around your day.
          </p>
          <div style={{ marginTop: 36 }}>
            <Link className="btn btn-primary btn-lg" href="/enquiry?lane=wedding">
              Enquire about your wedding <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
