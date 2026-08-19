import Link from "next/link";
import "./privacy-policy.css";

export const metadata = {
  title: "Privacy Policy | Wellness Lovers Club by GlobalSpa",
  description: "Read how Wellness Lovers Club collects, uses, stores, and protects your personal data in compliance with Indian data protection laws including DPDPA 2023.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "who-we-are", num: "1", title: "Who We Are" },
    { id: "information-we-collect", num: "2", title: "Information We Collect" },
    { id: "how-we-use", num: "3", title: "How We Use Your Information" },
    { id: "how-we-share", num: "4", title: "How We Share Your Information" },
    { id: "data-storage", num: "5", title: "Data Storage & Security" },
    { id: "data-retention", num: "6", title: "Data Retention" },
    { id: "cookies-policy", num: "7", title: "Cookies Policy" },
    { id: "your-rights", num: "8", title: "Your Rights" },
    { id: "childrens-privacy", num: "9", title: "Children's Privacy" },
    { id: "third-party-links", num: "10", title: "Third-Party Links" },
    { id: "changes-to-policy", num: "11", title: "Changes to This Policy" },
    { id: "governing-law", num: "12", title: "Governing Law" },
    { id: "contact-us", num: "13", title: "Contact Us" },
  ];

  return (
    <div className="pp-page">
      {/* ─── Hero Header ─────────────────────────────────────────── */}
      <section className="pp-hero" aria-label="Privacy Policy Header">
        <span className="pp-hero-eyebrow">WLC · WELLNESS LOVERS CLUB · BY GLOBALSPA</span>
        <h1 className="pp-hero-title">Privacy Policy</h1>
        <p className="pp-hero-subtitle">
          Your privacy is sacred to us — read how we protect it
        </p>
      </section>

      {/* ─── Dynamic Last Updated Date Bar ──────────────────────── */}
      <div className="pp-date-bar">
        Last updated: July 2025 <span>·</span> Effective from: July 2025 <span>·</span> Applies to: wellnessloversclub.com
      </div>

      {/* ─── Main Content Shell ─────────────────────────────────── */}
      <div className="pp-container">
        {/* Sticky Desktop Table of Contents Sidebar */}
        <aside className="pp-sidebar" aria-label="Table of Contents">
          <div className="pp-sidebar-title">Table of Contents</div>
          <nav>
            <ul className="pp-nav-list">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="pp-nav-link">
                    {s.num}. {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Legal Text Sections */}
        <main className="pp-content">
          <div className="pp-lead-box">
            <p className="pp-text" style={{ margin: 0 }}>
              Wellness Lovers Club (referred to as <strong>&apos;WLC&apos;</strong>, <strong>&apos;we&apos;</strong>, <strong>&apos;us&apos;</strong>, or <strong>&apos;our&apos;</strong>) is operated by Pinnacle Connect under the GlobalSpa brand. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, store, share, and protect your personal data when you visit our website, become a member, or engage with our services.
            </p>
            <p className="pp-text" style={{ margin: "14px 0 0 0" }}>
              By accessing our website or becoming a member of WLC, you agree to the terms outlined in this Privacy Policy. If you do not agree, please discontinue use of our services.
            </p>
          </div>

          {/* Section 1: Who We Are */}
          <section id="who-we-are" className="pp-section">
            <h2 className="pp-section-heading">1. Who We Are</h2>
            <p className="pp-text">
              Wellness Lovers Club is India&apos;s premier wellness and lifestyle membership community, powered by GlobalSpa — India&apos;s leading wellness and luxury lifestyle media brand. We operate at:
            </p>
            <ul className="pp-list">
              <li>
                <strong>Website:</strong>{" "}
                <Link href="https://www.wellnessloversclub.com" target="_blank" className="pp-link">
                  www.wellnessloversclub.com
                </Link>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:wlc@pinnacleconnect.in" className="pp-link">
                  wlc@pinnacleconnect.in
                </a>
              </li>
              <li>
                <strong>Contact:</strong>{" "}
                <a href="mailto:vinit@pinnacleconnect.in" className="pp-link">
                  vinit@pinnacleconnect.in
                </a>
              </li>
            </ul>
          </section>

          {/* Section 2: Information We Collect */}
          <section id="information-we-collect" className="pp-section">
            <h2 className="pp-section-heading">2. Information We Collect</h2>
            <p className="pp-text">
              We collect information you provide directly to us, as well as information collected automatically when you use our website or services.
            </p>

            <h3 className="pp-section-subheading">2.1 Information You Provide</h3>
            <ul className="pp-list">
              <li>Full name, email address, phone number, and city when you fill out our membership application or contact form</li>
              <li>Payment and billing information when you purchase a membership (processed securely via our payment partners)</li>
              <li>Wellness preferences, health interests, and lifestyle information shared during onboarding or surveys</li>
              <li>Communications you send to us via email, WhatsApp, or through our website contact form</li>
              <li>Photos or content shared with us for community features or events</li>
            </ul>

            <h3 className="pp-section-subheading">2.2 Information Collected Automatically</h3>
            <ul className="pp-list">
              <li>IP address, browser type, device type, and operating system</li>
              <li>Pages visited, time spent on pages, and links clicked on our website</li>
              <li>Referral source — how you arrived at our website</li>
              <li>Cookies and similar tracking technologies (see Section 7 for details)</li>
            </ul>

            <h3 className="pp-section-subheading">2.3 Information From Third Parties</h3>
            <ul className="pp-list">
              <li>If you connect via social media (Instagram, Facebook), we may receive basic profile information</li>
              <li>Information from our partners when you redeem a WLC benefit or attend a partner event</li>
              <li>Analytics data from tools such as Google Analytics</li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section id="how-we-use" className="pp-section">
            <h2 className="pp-section-heading">3. How We Use Your Information</h2>
            <p className="pp-text">
              We use the personal information we collect for the following purposes:
            </p>

            <h3 className="pp-section-subheading">3.1 To Provide and Manage Your Membership</h3>
            <ul className="pp-list">
              <li>Process your membership application and set up your account</li>
              <li>Send you your membership welcome kit, credentials, and onboarding information</li>
              <li>Manage renewals, upgrades, and cancellations</li>
              <li>Personalise your member experience based on your wellness preferences</li>
            </ul>

            <h3 className="pp-section-subheading">3.2 To Communicate With You</h3>
            <ul className="pp-list">
              <li>Send you event invitations, masterclass schedules, and exclusive partner offers</li>
              <li>Respond to your queries, requests, and complaints</li>
              <li>Share our newsletter, wellness content, and community updates</li>
              <li>Send important service notifications such as renewal reminders</li>
            </ul>

            <h3 className="pp-section-subheading">3.3 To Improve Our Services</h3>
            <ul className="pp-list">
              <li>Analyse website traffic and usage patterns to improve our platform</li>
              <li>Conduct surveys and gather feedback to enhance member experience</li>
              <li>Develop new offerings and curate better wellness experiences</li>
            </ul>

            <h3 className="pp-section-subheading">3.4 For Legal and Compliance Purposes</h3>
            <ul className="pp-list">
              <li>Comply with applicable Indian laws, regulations, and legal obligations</li>
              <li>Prevent fraud, misuse, or unauthorised access to our platform</li>
              <li>Enforce our Terms &amp; Conditions and membership agreements</li>
            </ul>
          </section>

          {/* Section 4: How We Share Your Information */}
          <section id="how-we-share" className="pp-section">
            <h2 className="pp-section-heading">4. How We Share Your Information</h2>
            <p className="pp-text">
              WLC does not sell, rent, or trade your personal information. We may share your data only in the following limited circumstances:
            </p>

            <h3 className="pp-section-subheading">4.1 With Trusted Partners</h3>
            <p className="pp-text">
              When you redeem a WLC member benefit or book an experience through our partner spas, retreats, or wellness brands, we share only the minimum information required (such as your name and contact details) to facilitate the booking or benefit. All partners are required to maintain appropriate data protection standards.
            </p>

            <h3 className="pp-section-subheading">4.2 With GlobalSpa</h3>
            <p className="pp-text">
              As WLC operates under the GlobalSpa brand, certain operational and administrative functions may be shared with the GlobalSpa team. Your data is treated with the same level of privacy and protection across both entities.
            </p>

            <h3 className="pp-section-subheading">4.3 With Service Providers</h3>
            <p className="pp-text">
              We work with trusted third-party service providers for functions such as email communications, payment processing, website analytics, and event management. These providers are bound by confidentiality obligations and may only use your data to perform services on our behalf.
            </p>

            <h3 className="pp-section-subheading">4.4 When Required by Law</h3>
            <p className="pp-text">
              We may disclose your information if required to do so by law, court order, or government authority, or if we believe disclosure is necessary to protect the rights, safety, or property of WLC, our members, or the public.
            </p>
          </section>

          {/* Section 5: Data Storage & Security */}
          <section id="data-storage" className="pp-section">
            <h2 className="pp-section-heading">5. Data Storage &amp; Security</h2>
            <p className="pp-text">
              We take the security of your personal data seriously and implement appropriate technical and organisational measures to protect it against unauthorised access, loss, destruction, or alteration.
            </p>
            <ul className="pp-list">
              <li>All data is stored on secure servers with access restricted to authorised personnel only</li>
              <li>Payment information is processed through PCI-DSS compliant payment gateways and is never stored on our servers</li>
              <li>We use SSL encryption on our website to protect data in transit</li>
              <li>We conduct regular reviews of our data handling practices and security measures</li>
            </ul>
            <p className="pp-text">
              While we take all reasonable precautions, no method of transmission over the internet or electronic storage is 100% secure. We encourage you to use strong, unique passwords and to contact us immediately if you suspect any unauthorised access to your account.
            </p>
          </section>

          {/* Section 6: Data Retention */}
          <section id="data-retention" className="pp-section">
            <h2 className="pp-section-heading">6. Data Retention</h2>
            <p className="pp-text">
              We retain your personal data for as long as your membership is active and for a reasonable period thereafter, or as required by law. Specifically:
            </p>
            <ul className="pp-list">
              <li>Active member data is retained for the duration of membership plus 2 years</li>
              <li>Enquiry and contact form data is retained for up to 1 year</li>
              <li>Financial and transactional records are retained for 7 years as required by Indian tax and accounting laws</li>
              <li>You may request deletion of your data at any time (see Section 8 — Your Rights)</li>
            </ul>
          </section>

          {/* Section 7: Cookies Policy */}
          <section id="cookies-policy" className="pp-section">
            <h2 className="pp-section-heading">7. Cookies Policy</h2>
            <p className="pp-text">
              Our website uses cookies — small text files placed on your device — to improve your browsing experience and understand how our site is used.
            </p>
            <h3 className="pp-section-subheading">Types of Cookies We Use</h3>
            <ul className="pp-list">
              <li>
                <strong>Essential Cookies</strong> — Required for the website to function. These cannot be disabled.
              </li>
              <li>
                <strong>Analytics Cookies</strong> — Help us understand visitor behaviour (e.g. Google Analytics). These are anonymised.
              </li>
              <li>
                <strong>Preference Cookies</strong> — Remember your settings and personalisation choices.
              </li>
              <li>
                <strong>Marketing Cookies</strong> — Used to serve relevant content. Only activated with your consent.
              </li>
            </ul>
            <p className="pp-text">
              You can manage or disable cookies through your browser settings at any time. Note that disabling certain cookies may affect the functionality of our website.
            </p>
          </section>

          {/* Section 8: Your Rights */}
          <section id="your-rights" className="pp-section">
            <h2 className="pp-section-heading">8. Your Rights</h2>
            <p className="pp-text">
              As a user or member of WLC, you have the following rights with respect to your personal data, in accordance with applicable Indian data protection law (including the Digital Personal Data Protection Act, 2023):
            </p>
            <ul className="pp-list">
              <li>
                <strong>Right to Access</strong> — Request a copy of the personal data we hold about you
              </li>
              <li>
                <strong>Right to Correction</strong> — Request correction of inaccurate or incomplete data
              </li>
              <li>
                <strong>Right to Erasure</strong> — Request deletion of your personal data, subject to legal retention requirements
              </li>
              <li>
                <strong>Right to Withdraw Consent</strong> — Withdraw your consent to marketing communications at any time
              </li>
              <li>
                <strong>Right to Grievance Redressal</strong> — Raise a complaint about how your data is handled
              </li>
              <li>
                <strong>Right to Nominate</strong> — Nominate a person to exercise your data rights on your behalf in the event of death or incapacity
              </li>
            </ul>
            <p className="pp-text">
              To exercise any of these rights, please write to us at{" "}
              <a href="mailto:wlc@pinnacleconnect.in" className="pp-link">
                wlc@pinnacleconnect.in
              </a>
              . We will respond within 30 days of receiving your request.
            </p>
          </section>

          {/* Section 9: Children's Privacy */}
          <section id="childrens-privacy" className="pp-section">
            <h2 className="pp-section-heading">9. Children&apos;s Privacy</h2>
            <p className="pp-text">
              WLC&apos;s services are intended for individuals aged 18 years and above. We do not knowingly collect personal information from anyone under the age of 18. If we become aware that a minor has provided us with personal data, we will take immediate steps to delete that information. If you believe a minor has submitted data to us, please contact us at{" "}
              <a href="mailto:wlc@pinnacleconnect.in" className="pp-link">
                wlc@pinnacleconnect.in
              </a>
              .
            </p>
          </section>

          {/* Section 10: Third-Party Links */}
          <section id="third-party-links" className="pp-section">
            <h2 className="pp-section-heading">10. Third-Party Links</h2>
            <p className="pp-text">
              Our website may contain links to third-party websites, including our partner spas, retreats, and GlobalSpa. This Privacy Policy applies only to wellnessloversclub.com. We are not responsible for the privacy practices of external websites and encourage you to review their respective privacy policies before sharing any personal information.
            </p>
          </section>

          {/* Section 11: Changes to This Policy */}
          <section id="changes-to-policy" className="pp-section">
            <h2 className="pp-section-heading">11. Changes to This Policy</h2>
            <p className="pp-text">
              We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or services. When we make significant changes, we will notify you via email or by posting a prominent notice on our website. The &apos;Last Updated&apos; date at the top of this page will always reflect the most recent version.
            </p>
            <p className="pp-text">
              We encourage you to review this policy periodically to stay informed about how we are protecting your data.
            </p>
          </section>

          {/* Section 12: Governing Law */}
          <section id="governing-law" className="pp-section">
            <h2 className="pp-section-heading">12. Governing Law</h2>
            <p className="pp-text">
              This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          {/* Section 13: Contact Us */}
          <section id="contact-us" className="pp-section">
            <h2 className="pp-section-heading">13. Contact Us</h2>
            <p className="pp-text">
              If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact our Privacy Team:
            </p>

            <div className="pp-contact-box">
              <div className="pp-contact-tag">DATA PRIVACY CONTACT</div>
              <h3 className="pp-contact-title">Wellness Lovers Club by GlobalSpa</h3>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:wlc@pinnacleconnect.in">wlc@pinnacleconnect.in</a>
                {"  "}|{"  "}
                <a href="mailto:vinit@pinnacleconnect.in">vinit@pinnacleconnect.in</a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <Link href="https://www.wellnessloversclub.com" target="_blank">
                  www.wellnessloversclub.com
                </Link>
              </p>
              <p style={{ marginTop: 14, fontSize: 13, color: "rgba(255, 255, 255, 0.75)" }}>
                For all privacy-related queries, requests, or complaints, please write to us at the email above. We will respond within 30 days.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="pp-footer">
        © 2025 Wellness Lovers Club by GlobalSpa · All rights reserved · wellnessloversclub.com
      </footer>
    </div>
  );
}
