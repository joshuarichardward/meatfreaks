import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Corporate & Event BBQ Catering',
}

export default function CorporatePage() {
  return (
    <div className="lane-corporate">
      <style>{`
        .corp-hero-grid {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: clamp(28px,5vw,64px);
          align-items: center;
          padding-block: clamp(54px,7vw,96px);
        }
        @media (max-width: 860px) {
          .corp-hero-grid { grid-template-columns: 1fr; }
        }

        .corp-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 760px) {
          .corp-steps-grid { grid-template-columns: 1fr; }
        }

        .corp-cap-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 40px;
        }
        @media (max-width: 680px) {
          .corp-cap-grid { grid-template-columns: 1fr; }
        }

        .corp-cta-grid {
          display: grid;
          grid-template-columns: 1.3fr .7fr;
          gap: 30px;
          align-items: center;
        }
        @media (max-width: 760px) {
          .corp-cta-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: 'var(--bone)', borderBottom: '1px solid #e6e9ee' }}>
        <div className="container">
          <div className="corp-hero-grid">
            {/* Left */}
            <div>
              <p className="eyebrow">Lane 03 · Corporate &amp; Business</p>
              <h1 style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                letterSpacing: '-.025em',
                fontSize: 'clamp(48px,5.6vw,72px)',
                lineHeight: 1.02,
                color: '#1a1f26',
                margin: '16px 0 22px',
              }}>
                Catering your team can{' '}
                <span style={{ color: '#1f3a5f' }}>count on.</span>
              </h1>
              <p style={{
                fontSize: 'clamp(17px,2.2vw,20px)',
                lineHeight: 1.55,
                color: '#56606e',
                maxWidth: '48ch',
                marginBottom: 32,
              }}>
                Company days, client hospitality, conferences and staff celebrations, proper BBQ delivered with the reliability and scale that business events demand.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Link className="btn btn-primary" href="/enquiry?lane=corporate">
                  Request a proposal <span className="arr">→</span>
                </Link>
                <Link className="btn btn-ghost" href="/menu">
                  View the menu
                </Link>
              </div>
            </div>

            {/* Right — image */}
            <div style={{ position: 'relative', aspectRatio: '5/4', borderRadius: 8, overflow: 'hidden' }}>
              <Image
                src="/assets/smoker-goldenhour.jpg"
                alt="Meat Freaks smoker glowing at golden hour"
                fill
                preload
                sizes="(max-width: 860px) 100vw, 45vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ paddingBlock: 'clamp(40px,5vw,64px)' }}>
        <div className="container">
          <div className="stat-grid">
            <div className="stat">
              <div className="n">UK-Wide</div>
              <div className="l">On-site anywhere, every region</div>
            </div>
            <div className="stat">
              <div className="n">10–2,000</div>
              <div className="l">Guests catered per event</div>
            </div>
            <div className="stat">
              <div className="n">30+</div>
              <div className="l">Events delivered</div>
            </div>
            <div className="stat">
              <div className="n" dangerouslySetInnerHTML={{ __html: 'Fully<br>insured' }} />
              <div className="l">PL cover &amp; Level 2 food hygiene</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">How it works</p>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            textTransform: 'none',
            letterSpacing: '-.02em',
            fontSize: 'clamp(36px,4vw,48px)',
            lineHeight: 1.06,
            color: '#1a1f26',
            margin: '14px 0 40px',
            maxWidth: '28ch',
          }}>
            Booked, briefed and delivered, without the back-and-forth.
          </h2>

          <div className="corp-steps-grid">
            {[
              {
                step: 'STEP 01',
                title: 'Brief & proposal',
                body: "Tell us headcount, venue and timings. You'll get a clear written proposal and fixed quote, no guesswork, no surprises.",
              },
              {
                step: 'STEP 02',
                title: 'Confirm & plan',
                body: 'One point of contact handles menus, dietaries, access and logistics. We coordinate directly with your venue or office.',
              },
              {
                step: 'STEP 03',
                title: 'Cooked on the day',
                body: "We arrive self-contained, cook on-site and serve to schedule, then clear down cleanly. You run your event, we run the food.",
              },
            ].map(card => (
              <div key={card.step} style={{
                background: '#fff',
                border: '1px solid #e6e9ee',
                borderRadius: 8,
                padding: 'clamp(22px,3vw,36px)',
              }}>
                {/* Accent bar — replaces ::before pseudo-element */}
                <div style={{ width: 44, height: 3, background: '#1f3a5f', marginBottom: 20 }} />
                <p style={{
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: '#1f3a5f',
                  marginBottom: 10,
                }}>
                  {card.step}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 800,
                  fontSize: 20,
                  color: '#1a1f26',
                  marginBottom: 12,
                }}>
                  {card.title}
                </h3>
                <p style={{ color: '#56606e', fontSize: 15, lineHeight: 1.6 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="section" style={{ background: '#13243a', color: '#eef2f7' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Left */}
            <div>
              <p className="eyebrow" style={{ color: '#7fb0e8' }}>Built for business events</p>
              <h2 style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                textTransform: 'none',
                letterSpacing: '-.02em',
                fontSize: 'clamp(36px,4vw,48px)',
                lineHeight: 1.06,
                color: '#eef2f7',
                margin: '14px 0 22px',
              }}>
                Reliability is the whole point.
              </h2>
              <p style={{
                color: 'rgba(238,242,247,.72)',
                fontSize: 'clamp(16px,2vw,18px)',
                lineHeight: 1.6,
                maxWidth: '42ch',
              }}>
                We&apos;ve built our operation around the demands of professional events — consistent quality, clear communication and zero drama on the day.
              </p>
            </div>

            {/* Right — capability grid */}
            <div className="corp-cap-grid">
              {[
                { title: 'Conferences & away-days', sub: 'Buffet, served or grab-and-go formats' },
                { title: 'Client & corporate hospitality', sub: 'Premium menus that impress' },
                { title: 'Staff parties & celebrations', sub: 'Summer socials to year-end dos' },
                { title: 'Recurring & repeat events', sub: 'Preferred-supplier arrangements' },
                { title: 'Dietary & allergen managed', sub: 'Full labelling, veggie & vegan options' },
                { title: 'Invoicing & paperwork', sub: 'RAMS, insurance & PO-friendly billing' },
              ].map(item => (
                <div key={item.title} style={{
                  display: 'flex',
                  gap: 14,
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(238,242,247,.14)',
                }}>
                  <span style={{
                    color: '#7fb0e8',
                    fontWeight: 800,
                    fontSize: 18,
                    flexShrink: 0,
                    lineHeight: 1.4,
                  }}>
                    ✓
                  </span>
                  <div>
                    <b style={{ fontWeight: 700, fontSize: 15, color: '#eef2f7' }}>{item.title}</b>
                    <span style={{
                      display: 'block',
                      color: 'rgba(238,242,247,.62)',
                      fontSize: 14,
                      marginTop: 3,
                    }}>
                      {item.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 840, marginInline: 'auto' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #e6e9ee',
              borderRadius: 10,
              padding: 'clamp(28px,4vw,52px)',
            }}>
              <p style={{
                fontSize: 'clamp(18px,2.4vw,22px)',
                lineHeight: 1.55,
                color: '#1a1f26',
                fontStyle: 'italic',
                marginBottom: 28,
              }}>
                &ldquo;It was our first time using Meat Freaks, and they made the whole thing effortless. Faultless organisation, genuinely outstanding food, and the team handled every bit of the logistics without us lifting a finger. We&apos;re already planning to have them back.&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: '100%',
                  background: '#1f3a5f',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 15,
                  flexShrink: 0,
                }}>
                  RG
                </div>
                <div>
                  <b style={{ display: 'block', fontWeight: 700, fontSize: 15, color: '#1a1f26' }}>Events Manager</b>
                  <span style={{ display: 'block', color: '#56606e', fontSize: 14 }}>
                    National retail group · first event with us
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="section" style={{ background: '#1f3a5f', color: '#fff' }}>
        <div className="container">
          <div className="corp-cta-grid">
            <div>
              <h2 style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                letterSpacing: '-.02em',
                fontSize: 'clamp(34px,3.8vw,44px)',
                lineHeight: 1.1,
                color: '#fff',
                marginBottom: 16,
              }}>
                Planning a company event?
              </h2>
              <p style={{
                color: 'rgba(255,255,255,.8)',
                fontSize: 'clamp(16px,2vw,18px)',
                lineHeight: 1.6,
                maxWidth: '46ch',
              }}>
                Send us the brief and we&apos;ll come back with a proposal and availability, usually within one working day.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                className="btn btn-lg"
                href="/enquiry?lane=corporate"
                style={{ background: '#fff', color: '#1f3a5f', border: '2px solid #fff' }}
              >
                Request a proposal →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
