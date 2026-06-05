import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
}

export default function CookiesPage() {
  return (
    <>
      {/* HERO */}
      <section style={{ background: 'var(--char)', color: 'var(--cream)', paddingBlock: 'clamp(46px,7vw,80px) clamp(34px,5vw,52px)' }}>
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--ember)' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(42px,7vw,72px)', lineHeight: '.9', letterSpacing: '.5px', marginTop: 12 }}>
            Cookie Policy
          </h1>
          <p style={{ color: 'rgba(244,234,215,.7)', marginTop: 14, fontSize: 14 }}>Last updated: June 2026</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section" style={{ paddingBlock: 'clamp(36px,6vw,72px)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ fontSize: 'clamp(16px,1.8vw,17px)', lineHeight: 1.75, color: '#33291f' }}>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>What are cookies?</h2>
            <p style={{ marginBottom: 28 }}>
              Cookies are small text files stored on your device when you visit a website. They help the site function properly and can provide information to the site owner about how visitors use the site.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>Cookies we use</h2>
            <p style={{ marginBottom: 16 }}>This website uses a minimal number of cookies, all related to analytics:</p>

            <div style={{ overflowX: 'auto', marginBottom: 28 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 14px 12px 0', fontWeight: 700 }}>Cookie</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Provider</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Purpose</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 14px 12px 0' }}>_vercel_insights</td>
                    <td style={{ padding: '12px 14px' }}>Vercel Analytics</td>
                    <td style={{ padding: '12px 14px' }}>Counts page views and unique visitors. No personal data is collected. Data is anonymised and aggregated.</td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>Session</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 14px 12px 0' }}>_vercel_speed_insights</td>
                    <td style={{ padding: '12px 14px' }}>Vercel Speed Insights</td>
                    <td style={{ padding: '12px 14px' }}>Measures page load performance (Core Web Vitals). No personal data is collected.</td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>What we don&apos;t use</h2>
            <p style={{ marginBottom: 12 }}>This website does not use:</p>
            <ul style={{ marginBottom: 28, paddingLeft: 22 }}>
              <li>Advertising or tracking cookies</li>
              <li>Third-party marketing pixels (Facebook, Google Ads, etc.)</li>
              <li>Any cookies that identify you personally</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>Managing cookies</h2>
            <p style={{ marginBottom: 28 }}>
              You can block or delete cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when a cookie is being set. Note that blocking cookies will not affect the functionality of this website, as it does not rely on cookies to operate.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>More information</h2>
            <p style={{ marginBottom: 28 }}>
              For more about how we handle your data, see our <Link href="/privacy" style={{ color: 'var(--ember)', fontWeight: 600 }}>Privacy Policy</Link>. If you have questions about cookies on this site, email us at <a href="mailto:meatfreaksltd@gmail.com" style={{ color: 'var(--ember)', fontWeight: 600 }}>meatfreaksltd@gmail.com</a>.
            </p>

          </div>
        </div>
      </section>
    </>
  )
}
