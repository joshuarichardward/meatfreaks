import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
}

export default function About() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section style={{ position: 'relative', background: 'var(--char)', color: 'var(--cream)', overflow: 'hidden' }}>
        <Image
          src="/assets/cook-smoke.jpg"
          alt="Meat Freaks pitmaster wreathed in cook smoke"
          fill
          preload
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        {/* scrim */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(20,14,10,.5),rgba(20,14,10,.82))' }} />
        <div
          className="container"
          style={{
            position: 'relative',
            minHeight: 'clamp(420px,62vh,580px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBlock: '54px clamp(40px,6vw,72px)',
          }}
        >
          <p className="eyebrow" style={{ color: 'var(--ember)' }}>Who we are</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              fontSize: 'clamp(48px,11vw,128px)',
              lineHeight: '.86',
              letterSpacing: '.5px',
            }}
          >
            Born from <em style={{ fontStyle: 'normal', color: 'var(--ember)' }}>smoke</em> &amp; obsession.
          </h1>
          <p style={{ marginTop: 20, fontSize: 'clamp(17px,2.2vw,21px)', maxWidth: '52ch', color: 'rgba(244,234,215,.86)' }}>
            One crew, one pit, a serious thing about doing BBQ properly, wherever in the UK you need us.
          </p>
        </div>
      </section>

      {/* ── 2. STORY ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          {/* kicker row */}
          <div className="kicker-row" style={{ marginBottom: 36 }}>
            <p className="eyebrow">The story</p>
            <span className="rule" />
          </div>

          {/* paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 'clamp(17px,2vw,19.5px)', lineHeight: 1.7, color: '#33291f' }}>
              Meat Freaks is the work of founder Andy, a chef who earned his stripes cooking in the kitchens of the Royal Air Force before turning a lifelong obsession with live fire into something of his own.
            </p>

            {/* pull quote */}
            <p
              className="display"
              style={{
                color: 'var(--ember)',
                fontSize: 'clamp(28px,5vw,52px)',
                lineHeight: '.95',
                margin: '32px 0',
              }}
            >
              Chef-grade food, cooked over real fire.
            </p>

            <p style={{ fontSize: 'clamp(17px,2vw,19.5px)', lineHeight: 1.7, color: '#33291f' }}>
              Those RAF years drilled in the discipline, the precision and the standards of a serious kitchen, and Andy brings every bit of it to the pit. This isn&apos;t just smoke and swagger; it&apos;s fine-dining technique meeting proper low-and-slow BBQ. Brisket smoked overnight, pork pulled by hand, everything cooked on-site over real flame, then plated like it matters. Because it does.
            </p>

            <p style={{ fontSize: 'clamp(17px,2vw,19.5px)', lineHeight: 1.7, color: '#33291f' }}>
              What started as pure passion now feeds events the length of the country: muddy festivals, elegant weddings, corporate days and back-garden parties. Andy still leads from the front, and the whole team shares the same obsession, high-end food, straight off the fire, wherever you are.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. BRAND STAMP ── */}
      <section style={{ background: '#120d0a', textAlign: 'center', padding: 'clamp(48px,7vw,84px) 22px' }}>
        <div style={{ display: 'inline-block' }}>
          <div
            style={{
              position: 'relative',
              width: 'min(64vw,300px)',
              aspectRatio: '1',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              margin: '0 auto',
            }}
          >
            <Image
              src="/assets/logo-3d-bronze.jpg"
              alt="Meat Freaks 3D bronze logo"
              fill
              sizes="min(64vw, 300px)"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <p
          className="display"
          style={{
            color: 'var(--cream)',
            fontSize: 'clamp(22px,3.2vw,34px)',
            letterSpacing: '.18em',
            marginTop: 28,
          }}
        >
          Fire · Flavour · Feast
        </p>
      </section>

      {/* ── 4. VALUES ── */}
      <section className="section" style={{ background: 'var(--char)', color: 'var(--cream)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 14 }}>What makes us freaks</p>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(30px,4.5vw,54px)',
              maxWidth: '18ch',
              marginBottom: 'clamp(36px,5vw,56px)',
            }}
          >
            Three things we&apos;ll never compromise on.
          </h2>

          {/* 3-col grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 2,
              background: 'rgba(244,234,215,.12)',
              border: '1px solid rgba(244,234,215,.12)',
            }}
          >
            {[
              {
                num: '01',
                title: 'Real fire only',
                body: "Charcoal and wood smoke, cooked on-site. If it didn't see flame, it's not on our menu.",
              },
              {
                num: '02',
                title: 'Time, not tricks',
                body: "Great BBQ can't be rushed. We give every cut the hours it deserves, that's the whole point.",
              },
              {
                num: '03',
                title: 'Feed people properly',
                body: 'Generous portions, big flavour, zero pretension. Everyone leaves full and talking about it.',
              },
            ].map(card => (
              <div
                key={card.num}
                style={{
                  background: 'var(--char)',
                  padding: '30px 26px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--ember)',
                    fontSize: 34,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {card.num}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    textTransform: 'uppercase',
                    fontSize: 22,
                    marginBottom: 12,
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ color: 'rgba(244,234,215,.74)', fontSize: 15, lineHeight: 1.6 }}>{card.body}</p>
              </div>
            ))}
          </div>

          <style>{`
            @media (max-width: 760px) {
              .values-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* ── 5. TEAM / CREW ── */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            {/* left: founder photo */}
            <div className="ph" style={{ aspectRatio: '4/3' }}>
              <Image
                src="/assets/founder.jpg"
                alt="Andy, founder of Meat Freaks, tending the pit"
                fill
                sizes="(max-width:820px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center 65%' }}
              />
            </div>

            {/* right: copy */}
            <div>
              <p className="eyebrow" style={{ marginBottom: 14 }}>The crew</p>
              <h2 className="display" style={{ fontSize: 'clamp(28px,4vw,46px)', marginBottom: 20 }}>
                Led by Andy, fired by the team.
              </h2>
              <p className="muted" style={{ maxWidth: '42ch', lineHeight: 1.7 }}>
                Founder Andy heads up a tight crew who&apos;d rather be tending a smoker at 4am than anywhere else. When you book Meat Freaks, you get the people who actually cook the food, hands on the pit at your event, start to finish.
              </p>
              <Link className="btn btn-dark" href="/contact" style={{ marginTop: 28 }}>
                Meet us / get in touch <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA ── */}
      <section
        style={{
          background: 'var(--ember)',
          color: 'var(--char)',
          textAlign: 'center',
          padding: 'clamp(56px,9vw,120px) 22px',
        }}
      >
        <h2 className="display" style={{ fontSize: 'clamp(30px,5vw,60px)', marginBottom: 20 }}>
          Hungry yet?
        </h2>
        <p style={{ fontWeight: 600, fontSize: 18, maxWidth: '40ch', marginInline: 'auto', marginBottom: 32 }}>
          Tell us about your event, we&apos;d love to bring the pit to you.
        </p>
        <Link className="btn btn-dark btn-lg" href="/enquiry">
          Start an enquiry <span className="arr">→</span>
        </Link>
      </section>
    </>
  )
}
