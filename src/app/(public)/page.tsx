import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Meat Freaks - UK-Wide BBQ Event Catering',
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', background: 'var(--char)', color: 'var(--cream)', overflow: 'hidden' }}>
        <div className="hero-media">
          <Image
            src="/assets/cook-smoke.jpg"
            alt="Meat Freaks pitmaster working the smoke at a night event"
            fill
            preload
            sizes="100vw"
            style={{ objectFit: 'cover', filter: 'saturate(1.05) contrast(1.02)' }}
          />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,14,10,.62) 0%, rgba(20,14,10,.35) 38%, rgba(20,14,10,.9) 100%)' }} />
        <div className="container" style={{ position: 'relative', minHeight: 'clamp(560px,88vh,820px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBlock: '48px clamp(40px,6vw,72px)' }}>
          <p className="eyebrow" style={{ color: 'var(--ember)' }}>UK-Wide · Live-Fire BBQ · Any Occasion</p>
          <h1 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(56px,9.5vw,128px)', lineHeight: '.86', letterSpacing: '.5px', maxWidth: '15ch' }}>
            Serious BBQ,<br />wherever the <em style={{ fontStyle: 'normal', color: 'var(--ember)' }}>party</em> lands.
          </h1>
          <p style={{ marginTop: 20, fontSize: 'clamp(17px,2.2vw,21px)', maxWidth: '50ch', color: 'rgba(244,234,215,.86)' }}>
            Real fire, real smoke, low &amp; slow, brought to festivals, weddings and corporate events the length and breadth of the UK.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 }}>
            <Link className="btn btn-primary btn-lg" href="#choose">Choose your event <span className="arr">→</span></Link>
            <Link className="btn btn-ghost-light btn-lg" href="/menu">See the menu</Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginTop: 34, fontSize: 13, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(244,234,215,.6)' }}>
            {['Festivals', 'Weddings', 'Corporate', 'Private parties'].map(tag => (
              <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 100, background: 'var(--ember)' }} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* THREE-WAY LANE SPLIT */}
      <section className="section" id="choose" style={{ paddingBottom: 'clamp(32px,5vw,56px)' }}>
        <div className="container">
          <ScrollReveal style={{ textAlign: 'center', maxWidth: '50ch', margin: '0 auto clamp(28px,5vw,52px)' }}>
            <p className="eyebrow">One pit. Three ways to feast.</p>
            <h2 className="display" style={{ fontSize: 'clamp(42px,5vw,56px)', letterSpacing: '.5px' }}>
              What are we <em style={{ fontStyle: 'normal', color: 'var(--ember)' }}>firing up</em> for?
            </h2>
            <p className="lede" style={{ marginTop: 14 }}>Pick your lane, each one&apos;s tuned to your kind of event. Same obsessive BBQ underneath.</p>
          </ScrollReveal>
        </div>
        <div className="container" style={{ maxWidth: 1240 }}>
          <div className="lanes">
            <Link className="lane-card" href="/festivals">
              <div className="bg">
                <Image src="/assets/feast-arch.jpg" alt="" fill sizes="(max-width:820px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="scrim" />
              <span className="label lane-festivals-accent">Loud &amp; proud</span>
              <span className="lane-no">01</span>
              <h3>Festivals<br />&amp; Events</h3>
              <p>Street-food energy, big crowds, all-day smoke. We bring the noise and the brisket.</p>
              <span className="go">Enter the lane <span className="dot">→</span></span>
            </Link>
            <Link className="lane-card" href="/weddings" style={{ background: '#2a221c' }}>
              <div className="bg">
                <Image src="/assets/service-plated.jpg" alt="" fill sizes="(max-width:820px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="scrim" />
              <span className="label lane-weddings-accent">Refined</span>
              <span className="lane-no">02</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', textTransform: 'none', fontWeight: 500, letterSpacing: 0 }}>Weddings</h3>
              <p>Considered, calm, beautifully plated. The showstopper your guests still talk about.</p>
              <span className="go">Enter the lane <span className="dot">→</span></span>
            </Link>
            <Link className="lane-card" href="/corporate" style={{ background: '#1f3a5f' }}>
              <div className="bg">
                <Image src="/assets/salute-portrait.jpg" alt="" fill sizes="(max-width:820px) 100vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'center 35%' }} />
              </div>
              <div className="scrim" style={{ background: 'linear-gradient(180deg,transparent 18%,rgba(12,22,38,.9) 92%)' }} />
              <span className="label lane-corporate-accent">Dependable</span>
              <span className="lane-no">03</span>
              <h3 style={{ letterSpacing: '-.01em' }}>Corporate</h3>
              <p>Scale, logistics and reliability, hospitality your team and clients can count on.</p>
              <span className="go">Enter the lane <span className="dot">→</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* MENU TEASER */}
      <section className="section" style={{ background: 'var(--char)', color: 'var(--cream)' }}>
        <div className="container">
          <div className="grid-2">
            <ScrollReveal>
              <p className="eyebrow">The food is the star</p>
              <h2 className="display" style={{ fontSize: 'clamp(42px,5vw,60px)', margin: '12px 0 18px' }}>Low &amp; slow,<br />done properly.</h2>
              <p style={{ color: 'rgba(244,234,215,.82)', maxWidth: '46ch' }}>Charcoal and smoke, hours of patience, and a menu built for sharing. Here&apos;s a taste of what comes off the pit.</p>
              <div className="teaser-list" style={{ columns: 2, columnGap: 42, marginTop: 28 }}>
                {[
                  { name: '12-Hour Brisket', sub: 'Salt, pepper, oak smoke' },
                  { name: 'Pulled Pork Shoulder', sub: 'Apple-smoked, hand-pulled' },
                  { name: 'Smoked Mac & Cheese', sub: 'Three-cheese, crisp golden top' },
                  { name: 'Sticky Smoked Wings', sub: 'Hot honey & bourbon glaze' },
                ].map(item => (
                  <div key={item.name} style={{ breakInside: 'avoid', padding: '14px 0', borderBottom: '1px solid rgba(244,234,215,.14)' }}>
                    <b style={{ fontWeight: 800 }}>{item.name}</b>
                    <span style={{ display: 'block', color: 'rgba(244,234,215,.6)', fontSize: 14, marginTop: 2 }}>{item.sub}</span>
                  </div>
                ))}
              </div>
              <Link className="btn btn-primary" href="/menu" style={{ marginTop: 30 }}>Full menu <span className="arr">→</span></Link>
            </ScrollReveal>
            <div style={{ position: 'relative', aspectRatio: '4/5' }}>
              <Image src="/assets/food-ribs.jpg" alt="Racks of ribs smoking low and slow" fill sizes="(max-width:820px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section" style={{ background: 'var(--ember)', color: 'var(--char)' }}>
        <div className="container">
          <div className="proof-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 30, textAlign: 'center' }}>
            {[
              { n: 'UK-Wide', l: 'Coverage, every postcode' },
              { n: '30+', l: 'Events catered' },
              { n: '10–2,000', l: 'Guests, no sweat' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.n} delay={i * 100}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px,7vw,76px)', lineHeight: '.9' }}>{stat.n}</div>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', fontSize: 13, marginTop: 8 }}>{stat.l}</div>
              </ScrollReveal>
            ))}
          </div>
          <hr style={{ background: 'rgba(27,21,17,.2)', margin: '46px 0', border: 0, height: 1 }} />
          <p style={{ textAlign: 'center', fontSize: 'clamp(20px,3vw,30px)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '.5px', maxWidth: '22ch', marginInline: 'auto', lineHeight: '1.05' }}>
            &ldquo;Hands down the best BBQ we&apos;ve ever had at an event.&rdquo;
          </p>
          <p style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 12, marginTop: 14 }}>Recent festival client</p>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section" style={{ background: 'var(--bone)' }}>
        <div className="container">
          <ScrollReveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow">See it, smell it (almost)</p>
              <h2 className="display" style={{ fontSize: 'clamp(38px,4.5vw,52px)', marginTop: 10 }}>Follow the smoke<br />on Instagram</h2>
            </div>
            <a className="btn btn-dark" href="https://www.instagram.com/meatfreaks1/" target="_blank" rel="noopener">@meatfreaks1 <span className="arr">→</span></a>
          </ScrollReveal>
          <div className="insta-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 30 }}>
            {[
              { src: '/assets/stall-soldout.jpg', alt: 'Meat Freaks market stall sold out' },
              { src: '/assets/food-rosemary.jpg', alt: 'Smoked joint with rosemary' },
              { src: '/assets/food-carcass.jpg', alt: 'Whole side smoking on the pit' },
              { src: '/assets/chimney-night.jpg', alt: 'Charcoal chimney glowing at night' },
            ].map(img => (
              <a key={img.src} href="https://www.instagram.com/meatfreaks1/" target="_blank" rel="noopener" style={{ position: 'relative', aspectRatio: '1', display: 'block' }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width:620px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
