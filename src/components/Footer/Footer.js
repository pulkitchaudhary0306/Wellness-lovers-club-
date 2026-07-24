"use client";

import Link from "next/link";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand/Logo Column */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-logo-link">
              <img loading="lazy" src="/logo/logo.png"
                alt="Wellness Lovers Club Logo"
                className="footer-logo-img" />
            </Link>

          </div>

          {/* Links Column Group */}
          <div className="footer-links-group">
            <div className="footer-links-col">
              <h4 className="footer-links-title">EXPLORE</h4>
              <Link href="/">Home</Link>
              <Link href="/our-philosophy">Our Philosophy</Link>
              <Link href="/offerings">Offerings</Link>
              <Link href="/destinations">Destinations</Link>
            </div>
            <div className="footer-links-col">
              <h4 className="footer-links-title">MEMBERSHIP</h4>
              <Link href="/membership">Become a Member</Link>
            </div>
            <div className="footer-links-col">
              <h4 className="footer-links-title">SUPPORT</h4>
              <Link href="/contact">Contact Us</Link>
              <Link href="/faq">FAQs</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </div>
          </div>

          {/* Social / Follow Column */}
          <div className="footer-social-col">
            <h4 className="footer-links-title">FOLLOW US</h4>
            <div className="social-icons">
              <a href="https://www.instagram.com/globalspaindia?igsh=MWVoZzRsd2xla3duMg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.linkedin.com/showcase/globalspa/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://youtube.com/@globalspamagazine?si=rKBEgeoL35UhvUh1" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; 2025 Wellness Lovers Club by GlobalSpa &middot; All rights reserved &middot; wellnessloversclub.com
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
