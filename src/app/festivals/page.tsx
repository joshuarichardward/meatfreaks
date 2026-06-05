import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Festival & Event BBQ Catering',
}

export default function FestivalsPage() {
  return (
    <div data-lane="festivals" className="lane-festivals">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 'clamp(560px,88vh,820px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* Background image */}
        <div className="hero-media">
          <Image
            src="/assets/wide-salute.jpg"
            alt="Meat Freaks pitmaster saluting the crowd at a festival"
            fill
            preload
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 42%' }}
          />
        </div>

        {/* Scrim */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,14,10,.45) 0%, rgba(20,14,10,.25) 35%, rgba(20,14,10,.88) 100%)' }} />

        {/* Festival noise overlay */}
        <div className="fest-noise" />

        {/* Stickers + tape overlay */}
        <div style={{ position: 'absolute', top: 32, right: 32, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, zIndex: 2 }}>
          <span className="sticker ember" style={{ fontSize: 13, transform: 'rotate(3deg)' }}>Live fire</span>
          <span className="tape" style={{ transform: 'rotate(-2deg)' }}>UK-wide</span>
          <span className="sticker yellow" style={{ fontSize: 13, transform: 'rotate(1deg)' }}>Big crowds</span>
        </div>

        {/* Hero content */}
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBlock: '48px clamp(40px,6vw,72px)' }}>
          <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: 16 }}>Festival &amp; Event BBQ · UK-Wide</p>
          <h1
            className="display"
            style={{
              fontSize: 'clamp(60px,11vw,140px)',
              letterSpacing: '.5px',
              maxWidth: '14ch',
              color: 'var(--cream)',
            }}
          >
            <span className="o" style={{ WebkitTextStroke: '2px var(--cream)', color: 'transparent' }}>Feed the</span>{' '}
            <span className="y" style={{ color: '#ffce3a' }}>crowd.</span>{' '}
            <span className="o" style={{ WebkitTextStroke: '2px var(--cream)', color: 'transparent' }}>Loud.</span>
          </h1>
          <p style={{ marginTop: 20, fontSize: 'clamp(17px,2.2vw,21px)', maxWidth: '50ch', color: 'rgba(244,234,215,.86)', lineHeight: 1.55 }}>
            Big smoke, big queues, big flavour. We roll our pit into festivals, fairs, food markets and parties anywhere in the UK, and bring the whole show with us.
          </p>
          <div style={{ marginTop: 30 }}>
            <Link className="btn btn-primary btn-lg" href="/enquiry?lane=festival">
              Book our pit <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────── */}
      <div className="marquee" aria-hidden="true">
        <div className="track">
          <span>Low &amp; Slow <b>★</b> Big Crowds <b>★</b> Real Fire <b>★</b> Street Food <b>★</b> Brisket Mountains <b>★</b>&nbsp;</span>
          <span>Low &amp; Slow <b>★</b> Big Crowds <b>★</b> Real Fire <b>★</b> Street Food <b>★</b> Brisket Mountains <b>★</b>&nbsp;</span>
          <span>Low &amp; Slow <b>★</b> Big Crowds <b>★</b> Real Fire <b>★</b> Street Food <b>★</b> Brisket Mountains <b>★</b>&nbsp;</span>
          <span>Low &amp; Slow <b>★</b> Big Crowds <b>★</b> Real Fire <b>★</b> Street Food <b>★</b> Brisket Mountains <b>★</b>&nbsp;</span>
        </div>
      </div>

      {/* ── WHY GRID ─────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--char-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '52ch', margin: '0 auto clamp(36px,6vw,64px)' }}>
            <p className="eyebrow">Why we slap at a festival</p>
            <h2
              className="display"
              style={{ fontSize: 'clamp(38px,5vw,54px)', color: 'var(--cream)', marginTop: 12 }}
            >
              Crowd-pleasers that actually please the crowd.
            </h2>
          </div>

          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {/* Card 01 */}
            <div style={{ background: 'var(--char-3)', padding: 'clamp(28px,4vw,48px)', borderRadius: 'var(--r)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--ember)', lineHeight: 1, marginBottom: 16, letterSpacing: '.5px' }}>01</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,30px)', textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--cream)', marginBottom: 14 }}>
                Built for volume
              </h3>
              <p style={{ color: 'rgba(244,234,215,.75)', lineHeight: 1.6 }}>
                From a 150-head village fete to thousands through the gate, our pit and crew scale to the queue without dropping quality.
              </p>
            </div>

            {/* Card 02 */}
            <div style={{ background: 'var(--char-3)', padding: 'clamp(28px,4vw,48px)', borderRadius: 'var(--r)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--ember)', lineHeight: 1, marginBottom: 16, letterSpacing: '.5px' }}>02</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,30px)', textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--cream)', marginBottom: 14 }}>
                A proper spectacle
              </h3>
              <p style={{ color: 'rgba(244,234,215,.75)', lineHeight: 1.6 }}>
                Live fire, rolling smoke, the smell that pulls people in from three fields away. We&apos;re as much part of the atmosphere as the lineup.
              </p>
            </div>

            {/* Card 03 */}
            <div style={{ background: 'var(--char-3)', padding: 'clamp(28px,4vw,48px)', borderRadius: 'var(--r)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--ember)', lineHeight: 1, marginBottom: 16, letterSpacing: '.5px' }}>03</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,30px)', textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--cream)', marginBottom: 14 }}>
                Fully self-contained
              </h3>
              <p style={{ color: 'rgba(244,234,215,.75)', lineHeight: 1.6 }}>
                Power, gazebo, servery, the lot. Point us at a patch of grass and we&apos;ll be plating within the hour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT ROLLS UP ────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--red)' }}>
        <div className="container">
          <p className="eyebrow" style={{ color: '#ffce3a', marginBottom: 12 }}>What rolls up</p>
          <h2
            className="display"
            style={{ fontSize: 'clamp(38px,5vw,54px)', color: 'var(--cream)', marginBottom: 'clamp(32px,5vw,56px)' }}
          >
            The whole rig, ready to feed.
          </h2>

          <div className="grid-2" style={{ alignItems: 'center' }}>
            {/* Numbered list */}
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                'Full live-fire smoker & grill setup',
                'Branded servery & gazebo festival-ready',
                'Crew to cook plate and serve at pace',
                'Menu tailored to your crowd & footfall',
                'Veggie & dietary options as standard',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#ffce3a', lineHeight: 1, minWidth: 44, letterSpacing: '.5px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 'clamp(17px,2vw,20px)', color: 'var(--cream)', lineHeight: 1.4, paddingTop: 4 }}>{item}</span>
                </li>
              ))}
            </ol>

            {/* Rotated smoker image */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 420, aspectRatio: '4/5', transform: 'rotate(2deg)', border: '4px solid #ffce3a', borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <Image
                  src="/assets/smoker-goldenhour.jpg"
                  alt="Meat Freaks smoker at golden hour"
                  fill
                  sizes="(max-width: 820px) 90vw, 420px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--char)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 'clamp(24px,4vw,40px)', flexWrap: 'wrap' }}>
            <h2
              className="display"
              style={{ fontSize: 'clamp(36px,4.5vw,52px)', color: 'var(--cream)' }}
            >
              Off the pit
            </h2>
            <a
              href="https://instagram.com/meatfreaks1"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700, fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ember)', whiteSpace: 'nowrap' }}
            >
              More on @meatfreaks1 →
            </a>
          </div>

          {/* 4-col CSS grid */}
          <div className="fest-gallery">
            {/* arch-action.jpg — wide (2 cols) + tall (2 rows) */}
            <div className="wide tall" style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <Image
                src="/assets/arch-action.jpg"
                alt="Live action at the Meat Freaks arch"
                fill
                sizes="(max-width: 820px) 90vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* food-ribs.jpg */}
            <div style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <Image
                src="/assets/food-ribs.jpg"
                alt="Smoked ribs"
                fill
                sizes="(max-width: 820px) 45vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* food-rosemary.jpg */}
            <div style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <Image
                src="/assets/food-rosemary.jpg"
                alt="Food with rosemary"
                fill
                sizes="(max-width: 820px) 45vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* stall-soldout.jpg */}
            <div style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <Image
                src="/assets/stall-soldout.jpg"
                alt="Sold out stall sign"
                fill
                sizes="(max-width: 820px) 45vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* fire-logs.jpg — wide (2 cols) */}
            <div className="wide" style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <Image
                src="/assets/fire-logs.jpg"
                alt="Burning logs in the fire box"
                fill
                sizes="(max-width: 820px) 90vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* food-carcass.jpg */}
            <div style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <Image
                src="/assets/food-carcass.jpg"
                alt="Whole carcass on the pit"
                fill
                sizes="(max-width: 820px) 45vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#ffce3a', color: 'var(--char)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          {/* Sticker */}
          <div style={{ marginBottom: 20 }}>
            <span className="sticker red" style={{ fontSize: 14, transform: 'rotate(-2deg)', display: 'inline-block' }}>
              Dates go fast
            </span>
          </div>

          <h2
            className="display"
            style={{ fontSize: 'clamp(38px,5vw,58px)', color: 'var(--char)', marginBottom: 18 }}
          >
            Got a festival? Let&apos;s get cooking.
          </h2>

          <p style={{ fontSize: 'clamp(17px,2vw,20px)', color: 'rgba(27,21,17,.75)', marginBottom: 32, lineHeight: 1.55 }}>
            Tell us your dates and footfall, we&apos;ll check availability and build you a quote.
          </p>

          <Link
            className="btn btn-dark btn-lg"
            href="/enquiry?lane=festival"
          >
            Start a festival enquiry <span className="arr">→</span>
          </Link>
        </div>
      </section>

    </div>
  )
}
