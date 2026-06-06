import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Menu',
}

/* ─── Data ─────────────────────────────────────────────────── */

const categories = [
  {
    id: 'low-slow',
    index: '01',
    title: 'Low & Slow',
    sub: 'The heart of the pit. Hours of oak smoke, sliced and pulled to order.',
    items: [
      {
        name: '12-Hour Brisket',
        flag: { label: 'Signature', cls: 'sig' },
        tags: 'GF',
        desc: 'Oak-smoked overnight, peppery bark, deep smoke ring. Sliced fresh in front of you.',
      },
      {
        name: 'Pulled Pork Shoulder',
        tags: 'GF',
        desc: 'Apple-smoked and hand-pulled, finished with our house rub and a splash of vinegar sauce.',
      },
      {
        name: 'Beef Short Rib',
        tags: 'GF',
        desc: 'Single giant rib, low and slow until it gives way at a touch. A proper showpiece.',
      },
      {
        name: 'Pork Ribs',
        flag: { label: 'Signature', cls: 'sig' },
        desc: 'Sticky, glazed, full rack, that clean bite-through every BBQ fiend chases.',
      },
      {
        name: 'Burnt Ends',
        flag: { label: 'Signature', cls: 'sig' },
        desc: "Candied brisket points, twice-smoked and glazed. The pitmaster's favourite, when there are any left.",
      },
      {
        name: 'Smoked Half Chicken',
        tags: 'GF',
        desc: 'Brined, rubbed and charcoal-finished for crisp skin and juicy everything.',
      },
    ],
  },
  {
    id: 'burgers',
    index: '02',
    title: 'Burgers & Handhelds',
    sub: 'Built for queues and big appetites, the street-food end of the menu.',
    items: [
      {
        name: 'The Freak Burger',
        flag: { label: 'Signature', cls: 'sig' },
        desc: 'Double smashed patty, American cheese, burnt-end mayo, pickles, toasted brioche.',
      },
      {
        name: 'The Brisket Bun',
        desc: 'Sliced 12-hour brisket, slaw, pickles and a hit of house hot sauce.',
      },
      {
        name: 'Pulled Pork Bun',
        desc: 'Hand-pulled pork, apple slaw and a scatter of crackling crumb.',
      },
      {
        name: 'The Loaded Dog',
        desc: 'Foot-long smoked sausage, burnt ends, crispy onions, mustard mayo.',
      },
    ],
  },
  {
    id: 'sides',
    index: '03',
    title: 'Sides',
    sub: 'Never an afterthought. Order a few, everyone always does.',
    items: [
      {
        name: 'Smoked Mac & Cheese',
        tags: 'V',
        desc: 'Three-cheese, smoked on the pit, crisp golden top.',
      },
      {
        name: 'House Slaw',
        tags: 'V · GF',
        desc: 'Apple and fennel, sharp and fresh to cut the richness.',
      },
      {
        name: 'Pit Beans',
        flag: { label: 'Signature', cls: 'sig' },
        desc: "The pitmaster's secret recipe. We don't talk about what goes in — we just know they never come back.",
      },
      {
        name: 'Honey-Butter Cornbread',
        tags: 'V',
        desc: 'Warm, soft, brushed with honey butter.',
      },
      {
        name: 'Streetcorn',
        tags: 'V · GF',
        desc: "Served with Harry J's marinade.",
      },
    ],
  },
  {
    id: 'platters',
    index: '04',
    title: 'Sharing Platters',
    sub: "Family-style feasting for the table, the way BBQ's meant to be eaten.",
    items: [
      {
        name: 'The Freak Show',
        flag: { label: 'Feeds a crowd', cls: 'sig' },
        desc: 'Brisket, ribs, pulled pork, wings and the full line-up of sides. Maximum damage.',
      },
      {
        name: 'Low & Slow Board',
        desc: 'A trio of smoked meats with pickles, slaw and warm bread.',
      },
      {
        name: 'Build-Your-Own Feast',
        desc: "Choose your meats and sides, we'll lay it out family-style across the table.",
      },
    ],
  },
  {
    id: 'drinks',
    index: '05',
    title: 'Drinks',
    sub: 'Add a bar package to any event, soft, craft or fully stocked.',
    items: [
      {
        name: 'Bottled Beers & Cider',
        desc: 'A curated fridge of local beers and ciders to match the smoke.',
      },
      {
        name: 'Soft Drinks',
        desc: 'The full range of soft drinks.',
      },
    ],
  },
]

const navLinks = [
  { label: 'Low & Slow', href: '#low-slow' },
  { label: 'Burgers & Handhelds', href: '#burgers' },
  { label: 'Sides', href: '#sides' },
  { label: 'Sharing Platters', href: '#platters' },
  { label: 'Drinks', href: '#drinks' },
]

/* ─── Page ──────────────────────────────────────────────────── */

export default function MenuPage() {
  return (
    <>
      {/* 1. HERO */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--char)',
          color: 'var(--cream)',
          paddingTop: 'clamp(54px,8vw,96px)',
          paddingBottom: 'clamp(40px,6vw,72px)',
        }}
      >
        {/* Ember watermark */}
        <div
          style={{
            position: 'absolute',
            right: -60,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'min(40vw,360px)',
            aspectRatio: '1',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <Image
            src="/assets/mark-ember.png"
            alt=""
            fill
            sizes="min(40vw, 360px)"
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="container" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: 18 }}>
            The food is the star
          </p>
          <h1
            className="display"
            style={{ fontSize: 'clamp(60px,10vw,112px)', color: 'var(--cream)', maxWidth: '14ch' }}
          >
            The{' '}
            <em style={{ fontStyle: 'normal', color: 'var(--ember)' }}>Menu</em>
          </h1>
          <p
            style={{
              marginTop: 22,
              fontSize: 'clamp(16px,2vw,19px)',
              lineHeight: 1.6,
              color: 'rgba(244,234,215,.82)',
              maxWidth: '52ch',
            }}
          >
            Everything&apos;s cooked over real fire and smoke. This is our spread, we&apos;ll tailor portions,
            formats and platters to your event. Catering is quoted, never priced off a board.
          </p>
        </div>
      </section>

      {/* 2. FOOD STRIP */}
      <div
        style={{
          background: 'var(--char)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 3,
        }}
      >
        {(['food-ribs.jpg', 'platter.jpg', 'food-rosemary.jpg'] as const).map((img) => (
          <div
            key={img}
            style={{ position: 'relative', aspectRatio: '1', borderRadius: 0, overflow: 'hidden' }}
          >
            <Image
              src={`/assets/${img}`}
              alt=""
              fill
              sizes="(max-width: 768px) 33vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* 3. STICKY CATEGORY NAV */}
      <nav
        style={{
          position: 'sticky',
          top: 84,
          zIndex: 40,
          background: 'color-mix(in srgb,var(--bone) 94%,transparent)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            overflowX: 'auto',
            paddingBlock: 12,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                whiteSpace: 'nowrap',
                fontWeight: 700,
                fontSize: 14,
                padding: '9px 15px',
                borderRadius: 100,
                border: '1.5px solid var(--line)',
                color: 'var(--ink)',
                flexShrink: 0,
                transition: 'background .15s, color .15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* 4. MENU CATEGORIES */}
      <div className="section">
        <div style={{ maxWidth: 920, marginInline: 'auto', paddingInline: 22 }}>
          {categories.map((cat) => (
            <section
              key={cat.id}
              id={cat.id}
              style={{
                scrollMarginTop: 130,
                marginBottom: 'clamp(48px,7vw,84px)',
              }}
            >
              {/* Category header */}
              <div style={{ marginBottom: 28 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 13,
                    letterSpacing: '.3em',
                    textTransform: 'uppercase',
                    color: 'var(--ember)',
                    marginBottom: 8,
                  }}
                >
                  {cat.index}
                </p>
                <h2
                  className="display"
                  style={{ fontSize: 'clamp(40px,5vw,52px)', color: 'var(--char)' }}
                >
                  {cat.title}
                </h2>
                <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 16, maxWidth: '56ch' }}>
                  {cat.sub}
                </p>
              </div>

              {/* Items */}
              <div className="menu-list">
                {cat.items.map((item) => (
                  <div key={item.name} className="menu-item">
                    <h4>
                      {item.name}
                      {item.flag && (
                        <span className={`menu-flag${item.flag.cls ? ` ${item.flag.cls}` : ''}`}>
                          {item.flag.label}
                        </span>
                      )}
                    </h4>
                    {'tags' in item && item.tags && <span className="mtag">{item.tags}</span>}
                    <p className="desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* 5. FOOTER CTA */}
      <section
        style={{
          background: 'var(--char)',
          color: 'var(--cream)',
          textAlign: 'center',
          padding: 'clamp(64px,10vw,120px) 22px',
        }}
      >
        <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: 16 }}>
          Like the sound of it?
        </p>
        <h2
          className="display"
          style={{ fontSize: 'clamp(44px,7vw,84px)', color: 'var(--cream)', maxWidth: '16ch', marginInline: 'auto' }}
        >
          Let&apos;s build your menu.
        </h2>
        <p
          style={{
            marginTop: 20,
            fontSize: 'clamp(16px,2vw,19px)',
            color: 'rgba(244,234,215,.78)',
            maxWidth: '46ch',
            marginInline: 'auto',
          }}
        >
          Tell us about your event and we&apos;ll put together a menu and quote tailored exactly to you.
          No off-the-shelf packages, no surprises.
        </p>
        <div style={{ marginTop: 32 }}>
          <Link className="btn btn-primary btn-lg" href="/enquiry">
            Start an enquiry →
          </Link>
        </div>
      </section>
    </>
  )
}
