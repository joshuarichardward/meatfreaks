import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="wm">Meat&nbsp;Freaks</div>
            <p style={{ marginTop: 14, maxWidth: '34ch' }}>
              UK-wide BBQ event catering for festivals, weddings, corporate days and private parties. Real fire. Real smoke.
            </p>
            <Link className="btn btn-primary" href="/enquiry" style={{ marginTop: 20 }}>
              Start an enquiry <span className="arr">→</span>
            </Link>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/festivals">Festivals</Link></li>
              <li><Link href="/weddings">Weddings</Link></li>
              <li><Link href="/corporate">Corporate</Link></li>
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/about">About us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><a href="mailto:meatfreaksltd@gmail.com">meatfreaksltd@gmail.com</a></li>
              <li><a href="tel:07916635610">07916 635610</a></li>
              <li>Coverage: UK-wide</li>
              <li><a href="https://www.instagram.com/meatfreaks1/" target="_blank" rel="noopener">Instagram · @meatfreaks1</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Meat Freaks Ltd. All rights reserved.</span>
          <span style={{ display: 'flex', gap: '8px 18px', flexWrap: 'wrap' }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
