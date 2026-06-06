import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
}

export default function TermsPage() {
  return (
    <>
      {/* HERO */}
      <section style={{ background: 'var(--char)', color: 'var(--cream)', paddingBlock: 'clamp(46px,7vw,80px) clamp(34px,5vw,52px)' }}>
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--ember)' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(42px,7vw,72px)', lineHeight: '.9', letterSpacing: '.5px', marginTop: 12 }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ color: 'rgba(244,234,215,.7)', marginTop: 14, fontSize: 14 }}>Last updated: June 2026</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section" style={{ paddingBlock: 'clamp(36px,6vw,72px)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ fontSize: 'clamp(16px,1.8vw,17px)', lineHeight: 1.75, color: '#33291f' }}>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>1. About us</h2>
            <p style={{ marginBottom: 28 }}>
              Meat Freaks Ltd (company number 16550123) provides BBQ event catering services across the United Kingdom. Our registered address is 54 Bluebell Hollow, Stafford, England, ST17 0JN. These terms and conditions govern the provision of our catering services.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>2. Enquiries and quotes</h2>
            <p style={{ marginBottom: 28 }}>
              Submitting an enquiry through our website does not constitute a booking. Once we have reviewed your enquiry, we will respond with availability, a tailored menu and a written quote, usually within one working day. A booking is only confirmed once we have received your signed acceptance and deposit payment.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>3. Booking and deposit</h2>
            <p style={{ marginBottom: 28 }}>
              To secure your event date, a non-refundable deposit of 50% of the quoted total is required. Your date is not held until the deposit has been received. The deposit may be paid by bank transfer or any other method agreed in writing.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>4. Final payment</h2>
            <p style={{ marginBottom: 28 }}>
              The remaining 50% balance is due on the day of your event, prior to or upon completion of service. Payment must be made by bank transfer or any other method agreed in writing. We reserve the right to withhold service if the balance remains unpaid.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>5. Cancellation</h2>
            <p style={{ marginBottom: 12 }}>Cancellations must be made in writing (email is acceptable).</p>
            <ul style={{ marginBottom: 28, paddingLeft: 22 }}>
              <li><strong>More than 7 days before the event:</strong> you may cancel and your deposit will be forfeited, but no further payment is due.</li>
              <li><strong>7 days or fewer before the event:</strong> the full quoted amount becomes payable, as we will have committed to staffing, supplies and preparation for your event.</li>
            </ul>
            <p style={{ marginBottom: 28 }}>
              If we need to cancel for reasons beyond our control (severe weather, vehicle breakdown, illness), we will offer an alternative date or a full refund including deposit.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>6. Menu and dietary requirements</h2>
            <p style={{ marginBottom: 28 }}>
              Final menu selections and confirmed guest numbers must be agreed at least 7 days before your event. We will do our best to accommodate dietary requirements and common allergens where possible. It is your responsibility to inform us of any dietary needs or allergies among your guests. While we take every reasonable precaution, our food is prepared in an environment where allergens are present and we cannot guarantee a completely allergen-free service.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>7. Event requirements</h2>
            <p style={{ marginBottom: 28 }}>
              We arrive self-contained with our own cooking equipment, servery and gazebo. You are responsible for providing adequate space for our setup, vehicular access to the serving area, and any permissions or licences required by your venue. If you are unsure about access or space, we are happy to discuss this in advance or visit the venue.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>8. Liability and insurance</h2>
            <p style={{ marginBottom: 28 }}>
              Meat Freaks Ltd is fully insured for public liability and holds a Level 2 food hygiene certification. Our liability to you for any claim arising from our services is limited to the total value of the booking. We are not liable for any loss or damage arising from circumstances beyond our reasonable control, including but not limited to adverse weather, venue issues or third-party actions.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>9. Photography and social media</h2>
            <p style={{ marginBottom: 28 }}>
              We may photograph our food and setup at your event for use on our website, social media and marketing materials. No identifiable guests will be included without consent. If you would prefer we do not take photographs, please let us know in advance.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>10. Changes to guest numbers</h2>
            <p style={{ marginBottom: 28 }}>
              We understand numbers can change. Increases of more than 10% to the confirmed guest count may result in an adjusted quote. Decreases of more than 10% within 7 days of the event may not reduce the final cost, as supplies will already have been purchased.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>11. Governing law</h2>
            <p style={{ marginBottom: 28 }}>
              These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px,3vw,28px)', letterSpacing: '.5px', marginBottom: 14 }}>12. Contact</h2>
            <p style={{ marginBottom: 28 }}>
              If you have any questions about these terms, contact us at <a href="mailto:meatfreaksltd@gmail.com" style={{ color: 'var(--ember)', fontWeight: 600 }}>meatfreaksltd@gmail.com</a> or call <a href="tel:07916635610" style={{ color: 'var(--ember)', fontWeight: 600 }}>07916 635610</a>.
            </p>

          </div>
        </div>
      </section>
    </>
  )
}
