import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <>
      {/* HERO */}
      <section style={{ background: 'var(--char)', color: 'var(--cream)', paddingBlock: 'clamp(46px,7vw,80px) clamp(34px,5vw,52px)' }}>
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--ember)' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(42px,7vw,72px)', lineHeight: '.9', letterSpacing: '.5px', marginTop: 12 }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(244,234,215,.7)', marginTop: 14, fontSize: 14 }}>Last updated: June 2026</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section" style={{ paddingBlock: 'clamp(36px,6vw,72px)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ fontSize: 'clamp(16px,1.8vw,17px)', lineHeight: 1.75, color: '#33291f' }}>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>1. Who we are</h2>
            <p style={{ marginBottom: 28 }}>
              Meat Freaks Ltd (company number 16550123) is the data controller responsible for your personal data. Our registered address is 54 Bluebell Hollow, Stafford, England, ST17 0JN. You can contact us at <a href="mailto:meatfreaksltd@gmail.com" style={{ color: 'var(--ember)', fontWeight: 600 }}>meatfreaksltd@gmail.com</a> or by calling <a href="tel:07916635610" style={{ color: 'var(--ember)', fontWeight: 600 }}>07916 635610</a>.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>2. What data we collect</h2>
            <p style={{ marginBottom: 12 }}>When you submit an enquiry through our website, we collect:</p>
            <ul style={{ marginBottom: 28, paddingLeft: 22 }}>
              <li>Your name</li>
              <li>Email address</li>
              <li>Phone number (if provided)</li>
              <li>Location or region</li>
              <li>Event details including type, date, estimated guest numbers and any notes you include</li>
            </ul>
            <p style={{ marginBottom: 28 }}>
              We also collect anonymised usage data through Vercel Analytics and Vercel Speed Insights. See our <Link href="/cookies" style={{ color: 'var(--ember)', fontWeight: 600 }}>Cookie Policy</Link> for details.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>3. Why we collect it</h2>
            <p style={{ marginBottom: 12 }}>We use your personal data to:</p>
            <ul style={{ marginBottom: 28, paddingLeft: 22 }}>
              <li>Respond to your enquiry with availability, a tailored menu and a quote</li>
              <li>Send you a confirmation email and calendar invite (.ics) for your event date</li>
              <li>Communicate with you about your booking</li>
              <li>Keep a record of enquiries for our business administration</li>
            </ul>
            <p style={{ marginBottom: 28 }}>
              Our legal basis for processing your data is legitimate interest (responding to your enquiry and providing our catering services) and, where you proceed to a booking, performance of a contract.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>4. How we store and protect your data</h2>
            <p style={{ marginBottom: 28 }}>
              Your enquiry data is stored securely. Emails are sent via Resend, a transactional email provider with industry-standard encryption. We do not store payment card details on our website. We retain your enquiry data for up to 24 months after your last contact with us, after which it is deleted.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>5. Who we share your data with</h2>
            <p style={{ marginBottom: 12 }}>We do not sell your personal data. We share it only with:</p>
            <ul style={{ marginBottom: 28, paddingLeft: 22 }}>
              <li><strong>Resend</strong> - to send confirmation and notification emails on our behalf</li>
              <li><strong>Vercel</strong> - our website hosting provider, which processes anonymised analytics data</li>
            </ul>
            <p style={{ marginBottom: 28 }}>We do not share your data with any other third parties unless required by law.</p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>6. Your rights</h2>
            <p style={{ marginBottom: 12 }}>Under UK data protection law, you have the right to:</p>
            <ul style={{ marginBottom: 28, paddingLeft: 22 }}>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict our processing of your data</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p style={{ marginBottom: 28 }}>
              To exercise any of these rights, email us at <a href="mailto:meatfreaksltd@gmail.com" style={{ color: 'var(--ember)', fontWeight: 600 }}>meatfreaksltd@gmail.com</a>. We will respond within 30 days.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>7. Complaints</h2>
            <p style={{ marginBottom: 28 }}>
              If you are unhappy with how we have handled your data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener" style={{ color: 'var(--ember)', fontWeight: 600 }}>ico.org.uk</a> or by calling 0303 123 1113.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>8. Changes to this policy</h2>
            <p style={{ marginBottom: 28 }}>
              We may update this policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this page periodically.
            </p>

          </div>
        </div>
      </section>
    </>
  )
}
