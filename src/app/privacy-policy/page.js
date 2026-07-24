import "./privacy-policy.css";

export const metadata = {
  title: "Privacy Policy | Wellness Lovers Club",
  description: "Understand how Wellness Lovers Club collects, uses, and protects your personal data in compliance with India's IT Act 2000, SPDI Rules 2011, and DPDPA 2023.",
};

export default function PrivacyPolicyPage() {
  const cookies = [
    {
      type: "essential",
      name: "Essential Cookies",
      desc: "Required for the website to function properly. These cannot be disabled — they handle session management, authentication, and security.",
    },
    {
      type: "analytics",
      name: "Analytics Cookies",
      desc: "Help us understand how visitors interact with our website by collecting anonymous usage statistics, improving the overall experience.",
    },
    {
      type: "preference",
      name: "Preference Cookies",
      desc: "Remember your settings and choices (such as language or display preferences) so you don't have to re-enter them on each visit.",
    },
    {
      type: "marketing",
      name: "Marketing Cookies",
      desc: "Used to deliver relevant content and offers based on your interests. You may opt out of these at any time via your browser settings.",
    },
  ];

  const rights = [
    {
      icon: "🔍",
      title: "Right to Access",
      desc: "Request a copy of the personal data we hold about you at any time.",
    },
    {
      icon: "✏️",
      title: "Right to Correction",
      desc: "Ask us to correct inaccurate or incomplete personal data we hold.",
    },
    {
      icon: "🗑️",
      title: "Right to Erasure",
      desc: "Request deletion of your personal data, subject to legal retention requirements.",
    },
    {
      icon: "🚫",
      title: "Right to Withdraw Consent",
      desc: "Withdraw your consent for data processing at any time without affecting past processing.",
    },
    {
      icon: "⚖️",
      title: "Right to Grievance Redressal",
      desc: "Lodge a complaint with our Data Protection Officer or the Data Protection Board of India.",
    },
    {
      icon: "👤",
      title: "Right to Nominate",
      desc: "Nominate another person to exercise your data rights in the event of your death or incapacity.",
    },
  ];

  const retention = [
    {
      category: "Active Member Data",
      period: "Duration of membership + 2 years",
      reason: "Service continuity, dispute resolution, and legal compliance",
    },
    {
      category: "Membership Enquiries",
      period: "1 year from date of enquiry",
      reason: "Follow-up communications and service improvement",
    },
    {
      category: "Financial & Transaction Records",
      period: "7 years",
      reason: "Mandatory under Indian financial and tax regulations",
    },
    {
      category: "Communication Records",
      period: "2 years",
      reason: "Customer support, dispute resolution",
    },
  ];

  return (
    <div className="pp-page">

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="pp-hero" aria-label="Privacy Policy Header">
        <span className="pp-hero-eyebrow">Legal · Data Privacy</span>
        <h1 className="pp-hero-title">Privacy Policy</h1>
        <p className="pp-hero-subtitle">
          Wellness Lovers Club · wellnessloversclub.com
        </p>
      </section>



      {/* ─── Layout Container ────────────────────────────── */}
      <div className="pp-container">

        {/* Sidebar Sticky Navigation */}
        <aside className="pp-sidebar">
          <nav className="pp-toc-wrapper" aria-label="Table of Contents">
            <h2 className="pp-toc-title">Policy Sections</h2>
            <ul className="pp-toc-list">
              <li className="pp-toc-item"><a href="#who-we-are"><span>01</span> Who We Are</a></li>
              <li className="pp-toc-item"><a href="#information-we-collect"><span>02</span> Information We Collect</a></li>
              <li className="pp-toc-item"><a href="#how-we-use"><span>03</span> How We Use Your Info</a></li>
              <li className="pp-toc-item"><a href="#how-we-share"><span>04</span> How We Share Your Info</a></li>
              <li className="pp-toc-item"><a href="#data-security"><span>05</span> Data Storage &amp; Security</a></li>
              <li className="pp-toc-item"><a href="#data-retention"><span>06</span> Data Retention</a></li>
              <li className="pp-toc-item"><a href="#cookies"><span>07</span> Cookies Policy</a></li>
              <li className="pp-toc-item"><a href="#your-rights"><span>08</span> Your Rights</a></li>
              <li className="pp-toc-item"><a href="#children"><span>09</span> Children's Privacy</a></li>
              <li className="pp-toc-item"><a href="#third-party"><span>10</span> Third-Party Links</a></li>
              <li className="pp-toc-item"><a href="#changes"><span>11</span> Policy Changes</a></li>
              <li className="pp-toc-item"><a href="#governing-law"><span>12</span> Governing Law</a></li>
              <li className="pp-toc-item"><a href="#contact"><span>13</span> Contact Us</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="pp-content">

          {/* ── 1. Who We Are ───────────────────────────────── */}
          <section id="who-we-are" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">01</span>
              <h2 className="pp-section-title">Who We Are</h2>
            </div>
            <p className="pp-text">
              <strong>Wellness Lovers Club (WLC)</strong> is a premium members club curating elevated wellness experiences across India and internationally. WLC is nurtured by <strong>GlobalSpa</strong> — India's leading wellness and luxury lifestyle media brand — and operated under the umbrella of <strong>Pinnacle Connect</strong>.
            </p>
            <p className="pp-text">
              This Privacy Policy explains how WLC collects, uses, stores, and protects the personal data you share with us when you visit our website, enquire about membership, or become a WLC member.
            </p>
            <div className="pp-highlight">
              <p>
                <strong>Data Controller:</strong> Wellness Lovers Club (Pinnacle Connect)<br />
                <strong>Website:</strong> wellnessloversclub.com<br />
                <strong>Registered Country:</strong> India<br />
                <strong>Contact:</strong> <a href="mailto:privacy@wellnessloversclub.com" style={{ color: 'var(--wlc-emerald)', fontWeight: 500 }}>privacy@wellnessloversclub.com</a>
              </p>
            </div>
          </section>

          <div className="pp-divider" />

          {/* ── 2. Information We Collect ────────────────────── */}
          <section id="information-we-collect" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">02</span>
              <h2 className="pp-section-title">Information We Collect</h2>
            </div>

            <div className="pp-subsection">
              <h3 className="pp-subsection-title">Information You Provide Directly</h3>
              <ul className="pp-list">
                <li>Full name, email address, phone number, and residential city</li>
                <li>Membership application details and wellness preferences</li>
                <li>Payment and billing information (processed securely via PCI-DSS compliant gateways)</li>
                <li>Feedback, survey responses, and support communications</li>
                <li>Information shared when attending WLC events or retreats</li>
              </ul>
            </div>

            <div className="pp-subsection">
              <h3 className="pp-subsection-title">Automatically Collected Data</h3>
              <ul className="pp-list">
                <li>IP address, browser type, operating system, and device identifiers</li>
                <li>Pages visited, time spent, referral URLs, and click behaviour</li>
                <li>Cookie data and session information (see Section 7)</li>
                <li>Geographic location data (country / city level only)</li>
              </ul>
            </div>

            <div className="pp-subsection">
              <h3 className="pp-subsection-title">Data from Third Parties</h3>
              <ul className="pp-list">
                <li>Information from GlobalSpa's platforms where you have consented to data sharing</li>
                <li>Analytics data from Google Analytics and similar tools</li>
                <li>Payment verification data from our payment gateway providers</li>
              </ul>
            </div>
          </section>

          <div className="pp-divider" />

          {/* ── 3. How We Use Your Information ──────────────── */}
          <section id="how-we-use" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">03</span>
              <h2 className="pp-section-title">How We Use Your Information</h2>
            </div>
            <p className="pp-text">We use your information only for legitimate and clearly defined purposes:</p>
            <ul className="pp-list">
              <li><strong>Membership Management</strong> — processing applications, onboarding, and managing your active membership</li>
              <li><strong>Service Delivery</strong> — booking wellness experiences, retreats, and partner benefits on your behalf</li>
              <li><strong>Communications</strong> — sending membership updates, curated wellness content, event invitations, and service notifications</li>
              <li><strong>Payments</strong> — processing membership fees and transactional communications</li>
              <li><strong>Service Improvement</strong> — analysing usage patterns to enhance our website, content, and offerings</li>
              <li><strong>Personalisation</strong> — tailoring recommendations based on your stated wellness preferences</li>
              <li><strong>Legal Compliance</strong> — fulfilling obligations under applicable Indian laws, resolving disputes, and enforcing our Terms of Service</li>
            </ul>
            <div className="pp-highlight">
              <p>
                We will always request your <strong>explicit consent</strong> before using your data for marketing communications. You may withdraw this consent at any time by contacting us or clicking 'unsubscribe' in any email we send you.
              </p>
            </div>
          </section>

          <div className="pp-divider" />

          {/* ── 4. How We Share Your Information ────────────── */}
          <section id="how-we-share" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">04</span>
              <h2 className="pp-section-title">How We Share Your Information</h2>
            </div>
            <p className="pp-text">WLC only shares your personal data in the following circumstances:</p>
            <ul className="pp-list">
              <li><strong>Wellness Partners &amp; Destinations</strong> — shared only to the extent required to fulfil your booked experience or membership benefit</li>
              <li><strong>GlobalSpa</strong> — as our parent media brand, GlobalSpa may receive aggregated, anonymised insights. Individual member data is shared only where explicitly consented to</li>
              <li><strong>Service Providers</strong> — trusted third parties such as payment processors, email platforms, and website hosting providers, all contractually bound to data protection obligations</li>
              <li><strong>Legal Requirements</strong> — when required by law, court order, or a request from government authorities under applicable Indian legislation</li>
            </ul>

            <div className="pp-notice">
              <span className="pp-notice-icon">🔒</span>
              <p>
                <strong>WLC does not sell, rent, or trade your personal data</strong> to any third party for commercial or marketing purposes. Your information is never monetised.
              </p>
            </div>
          </section>

          <div className="pp-divider" />

          {/* ── 5. Data Storage & Security ───────────────────── */}
          <section id="data-security" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">05</span>
              <h2 className="pp-section-title">Data Storage &amp; Security</h2>
            </div>
            <p className="pp-text">
              We take the security of your personal data seriously and implement multiple layers of protection:
            </p>
            <ul className="pp-list">
              <li><strong>SSL / TLS Encryption</strong> — all data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS protocols</li>
              <li><strong>Restricted Access</strong> — personal data is accessible only to authorised WLC personnel on a strict need-to-know basis</li>
              <li><strong>Payment Security</strong> — all payment transactions are processed through PCI-DSS compliant payment gateways. WLC does not store card numbers, CVVs, or full payment credentials on our servers</li>
              <li><strong>Secure Infrastructure</strong> — our systems are hosted on secure, reputable cloud infrastructure with regular security audits</li>
              <li><strong>Data Minimisation</strong> — we collect only the data necessary for the stated purposes</li>
            </ul>
            <p className="pp-text">
              While we implement robust safeguards, no method of internet transmission is entirely infallible. We encourage you to use a strong password and keep your account credentials confidential.
            </p>
          </section>

          <div className="pp-divider" />

          {/* ── 6. Data Retention ────────────────────────────── */}
          <section id="data-retention" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">06</span>
              <h2 className="pp-section-title">Data Retention</h2>
            </div>
            <p className="pp-text">
              We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law:
            </p>
            <div className="pp-retention-table-wrapper">
              <table className="pp-retention-table">
                <thead>
                  <tr>
                    <th>Data Category</th>
                    <th>Retention Period</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {retention.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.category}</strong></td>
                      <td>{row.period}</td>
                      <td>{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pp-text">
              After the applicable retention period, your data is securely deleted or anonymised so it can no longer be linked to you.
            </p>
          </section>

          <div className="pp-divider" />

          {/* ── 7. Cookies Policy ────────────────────────────── */}
          <section id="cookies" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">07</span>
              <h2 className="pp-section-title">Cookies Policy</h2>
            </div>
            <p className="pp-text">
              Our website uses cookies — small text files stored on your device — to improve your browsing experience, analyse site traffic, and deliver relevant content. We use the following four types of cookies:
            </p>
            <div className="pp-cookie-grid">
              {cookies.map((cookie, idx) => (
                <div className="pp-cookie-card" key={idx}>
                  <span className={`pp-cookie-badge ${cookie.type}`}>{cookie.type}</span>
                  <div className="pp-cookie-name">{cookie.name}</div>
                  <p className="pp-cookie-desc">{cookie.desc}</p>
                </div>
              ))}
            </div>
            <p className="pp-text">
              You can manage or disable non-essential cookies at any time through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.
            </p>
          </section>

          <div className="pp-divider" />

          {/* ── 8. Your Rights ───────────────────────────────── */}
          <section id="your-rights" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">08</span>
              <h2 className="pp-section-title">Your Rights</h2>
            </div>
            <p className="pp-text">
              Under India's <strong>Digital Personal Data Protection Act 2023 (DPDPA)</strong>, you have the following rights as a data principal:
            </p>
            <div className="pp-rights-grid">
              {rights.map((right, idx) => (
                <div className="pp-right-card" key={idx}>
                  <span className="pp-right-icon">{right.icon}</span>
                  <div className="pp-right-title">{right.title}</div>
                  <p className="pp-right-desc">{right.desc}</p>
                </div>
              ))}
            </div>
            <p className="pp-text">
              To exercise any of these rights, please contact us at <a href="mailto:privacy@wellnessloversclub.com" style={{ color: 'var(--wlc-emerald)', fontWeight: 500 }}>privacy@wellnessloversclub.com</a>. We will respond to all verified requests within <strong>30 days</strong>.
            </p>
          </section>

          <div className="pp-divider" />

          {/* ── 9. Children's Privacy ────────────────────────── */}
          <section id="children" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">09</span>
              <h2 className="pp-section-title">Children&apos;s Privacy</h2>
            </div>
            <p className="pp-text">
              WLC is an <strong>18+ members club</strong>. Our services, website, and communications are directed exclusively at adults. We do not knowingly collect personal data from individuals under the age of 18.
            </p>
            <p className="pp-text">
              If we become aware that personal data has been submitted by or on behalf of a minor, we will delete it promptly. If you believe a minor has submitted personal data to us, please contact us immediately at <a href="mailto:privacy@wellnessloversclub.com" style={{ color: 'var(--wlc-emerald)', fontWeight: 500 }}>privacy@wellnessloversclub.com</a>.
            </p>
          </section>

          <div className="pp-divider" />

          {/* ── 10. Third-Party Links ─────────────────────────── */}
          <section id="third-party" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">10</span>
              <h2 className="pp-section-title">Third-Party Links</h2>
            </div>
            <p className="pp-text">
              Our website may contain links to external sites, including <strong>GlobalSpa</strong> (globalspaonline.com) and our wellness partner destinations. These websites operate independently and have their own privacy policies.
            </p>
            <p className="pp-text">
              WLC is not responsible for the privacy practices or content of any third-party website. We encourage you to read the privacy policy of any external site you visit. The inclusion of a link on our site does not imply our endorsement of that site's data practices.
            </p>
          </section>

          <div className="pp-divider" />

          {/* ── 11. Changes to This Policy ───────────────────── */}
          <section id="changes" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">11</span>
              <h2 className="pp-section-title">Changes to This Policy</h2>
            </div>
            <p className="pp-text">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons. When we do:
            </p>
            <ul className="pp-list">
              <li>The updated policy will be published on this page with a revised "Last Updated" date</li>
              <li>For material changes, we will notify active members by email at least 14 days before the changes take effect</li>
              <li>Continued use of WLC's services after the effective date constitutes acceptance of the updated policy</li>
            </ul>
            <p className="pp-text">
              We encourage you to review this page periodically to stay informed about how we protect your information.
            </p>
          </section>

          <div className="pp-divider" />

          {/* ── 12. Governing Law ────────────────────────────── */}
          <section id="governing-law" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">12</span>
              <h2 className="pp-section-title">Governing Law</h2>
            </div>
            <p className="pp-text">
              This Privacy Policy is governed by and construed in accordance with the laws of India. Your use of our services is subject to the following legislation:
            </p>
            <div className="pp-law-badges">
              <span className="pp-law-badge">Information Technology Act, 2000</span>
              <span className="pp-law-badge">IT (SPDI) Rules, 2011</span>
              <span className="pp-law-badge">DPDPA, 2023</span>
            </div>
            <p className="pp-text">
              Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
            </p>
          </section>

          <div className="pp-divider" />

          {/* ── 13. Contact Us ───────────────────────────────── */}
          <section id="contact" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">13</span>
              <h2 className="pp-section-title">Contact Us</h2>
            </div>
            <p className="pp-text">
              For any questions, requests, or concerns about this Privacy Policy or how your personal data is handled, please reach out to our Privacy team:
            </p>

            <div className="pp-contact-box">
              <h3 className="pp-contact-title">Privacy &amp; Data Protection</h3>
              <p className="pp-contact-subtitle">Wellness Lovers Club · Pinnacle Connect</p>
              <div className="pp-contact-items">
                <div className="pp-contact-item">
                  <span className="pp-contact-icon">📧</span>
                  <div>
                    <span className="pp-contact-label">Privacy Enquiries</span>
                    <div className="pp-contact-value">
                      <a href="mailto:privacy@wellnessloversclub.com">privacy@wellnessloversclub.com</a>
                    </div>
                  </div>
                </div>
                <div className="pp-contact-item">
                  <span className="pp-contact-icon">📨</span>
                  <div>
                    <span className="pp-contact-label">General Contact</span>
                    <div className="pp-contact-value">
                      <a href="mailto:wlc@pinnacleconnect.in">wlc@pinnacleconnect.in</a>
                    </div>
                  </div>
                </div>
                <div className="pp-contact-item">
                  <span className="pp-contact-icon">⏱️</span>
                  <div>
                    <span className="pp-contact-label">Response Time</span>
                    <div className="pp-contact-value">Within 30 business days</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
