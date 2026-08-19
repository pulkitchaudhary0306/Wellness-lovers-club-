"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  FileText,
  Share2,
  Database,
  Clock,
  Cookie,
  Scale,
  UserX,
  ExternalLink,
  RefreshCw,
  Landmark,
  Mail,
  Search,
  CheckCircle,
  Copy,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import "./privacy-policy.css";

const SECTIONS = [
  {
    id: "who-we-are",
    num: "01",
    title: "Who We Are",
    icon: <Landmark size={20} />,
    summary: "WLC is operated by Pinnacle Connect under the GlobalSpa brand.",
    content: (
      <>
        <p className="pp-text">
          Wellness Lovers Club is India&apos;s premier wellness and lifestyle membership community, powered by GlobalSpa — India&apos;s leading wellness and luxury lifestyle media brand. We operate at:
        </p>
        <div className="pp-info-grid">
          <div className="pp-info-card">
            <span className="pp-info-label">Official Website</span>
            <Link href="https://www.wellnessloversclub.com" target="_blank" className="pp-info-val pp-link-hover">
              www.wellnessloversclub.com <ExternalLink size={13} />
            </Link>
          </div>
          <div className="pp-info-card">
            <span className="pp-info-label">General &amp; Privacy Email</span>
            <a href="mailto:wlc@pinnacleconnect.in" className="pp-info-val pp-link-hover">
              wlc@pinnacleconnect.in <Mail size={13} />
            </a>
          </div>
          <div className="pp-info-card">
            <span className="pp-info-label">Direct Leadership Contact</span>
            <a href="mailto:vinit@pinnacleconnect.in" className="pp-info-val pp-link-hover">
              vinit@pinnacleconnect.in <Mail size={13} />
            </a>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "information-we-collect",
    num: "02",
    title: "Information We Collect",
    icon: <Database size={20} />,
    summary: "Personal details, wellness preferences, usage data, and partner redemptions.",
    content: (
      <>
        <p className="pp-text">
          We collect information you provide directly to us, as well as information collected automatically when you use our website or services.
        </p>

        <div className="pp-subblock">
          <h4 className="pp-subheading">2.1 Information You Provide</h4>
          <ul className="pp-list">
            <li>Full name, email address, phone number, and city when you fill out our membership application or contact form</li>
            <li>Payment and billing information when you purchase a membership (processed securely via our payment partners)</li>
            <li>Wellness preferences, health interests, and lifestyle information shared during onboarding or surveys</li>
            <li>Communications you send to us via email, WhatsApp, or through our website contact form</li>
            <li>Photos or content shared with us for community features or events</li>
          </ul>
        </div>

        <div className="pp-subblock">
          <h4 className="pp-subheading">2.2 Information Collected Automatically</h4>
          <ul className="pp-list">
            <li>IP address, browser type, device type, and operating system</li>
            <li>Pages visited, time spent on pages, and links clicked on our website</li>
            <li>Referral source — how you arrived at our website</li>
            <li>Cookies and similar tracking technologies (see Section 7 for details)</li>
          </ul>
        </div>

        <div className="pp-subblock">
          <h4 className="pp-subheading">2.3 Information From Third Parties</h4>
          <ul className="pp-list">
            <li>If you connect via social media (Instagram, Facebook), we may receive basic profile information</li>
            <li>Information from our partners when you redeem a WLC benefit or attend a partner event</li>
            <li>Analytics data from tools such as Google Analytics</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "how-we-use",
    num: "03",
    title: "How We Use Your Information",
    icon: <FileText size={20} />,
    summary: "To deliver memberships, curate events, communicate, and ensure compliance.",
    content: (
      <>
        <p className="pp-text">We use the personal information we collect for the following purposes:</p>
        
        <div className="pp-subblock">
          <h4 className="pp-subheading">3.1 To Provide and Manage Your Membership</h4>
          <ul className="pp-list">
            <li>Process your membership application and set up your account</li>
            <li>Send you your membership welcome kit, credentials, and onboarding information</li>
            <li>Manage renewals, upgrades, and cancellations</li>
            <li>Personalise your member experience based on your wellness preferences</li>
          </ul>
        </div>

        <div className="pp-subblock">
          <h4 className="pp-subheading">3.2 To Communicate With You</h4>
          <ul className="pp-list">
            <li>Send you event invitations, masterclass schedules, and exclusive partner offers</li>
            <li>Respond to your queries, requests, and complaints</li>
            <li>Share our newsletter, wellness content, and community updates</li>
            <li>Send important service notifications such as renewal reminders</li>
          </ul>
        </div>

        <div className="pp-subblock">
          <h4 className="pp-subheading">3.3 To Improve Our Services</h4>
          <ul className="pp-list">
            <li>Analyse website traffic and usage patterns to improve our platform</li>
            <li>Conduct surveys and gather feedback to enhance member experience</li>
            <li>Develop new offerings and curate better wellness experiences</li>
          </ul>
        </div>

        <div className="pp-subblock">
          <h4 className="pp-subheading">3.4 For Legal and Compliance Purposes</h4>
          <ul className="pp-list">
            <li>Comply with applicable Indian laws, regulations, and legal obligations</li>
            <li>Prevent fraud, misuse, or unauthorised access to our platform</li>
            <li>Enforce our Terms &amp; Conditions and membership agreements</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "how-we-share",
    num: "04",
    title: "How We Share Your Information",
    icon: <Share2 size={20} />,
    summary: "We never sell your data. We share only minimum details with trusted partners.",
    content: (
      <>
        <p className="pp-text">
          <strong>WLC does not sell, rent, or trade your personal information.</strong> We may share your data only in the following limited circumstances:
        </p>

        <div className="pp-subblock">
          <h4 className="pp-subheading">4.1 With Trusted Partners</h4>
          <p className="pp-text">
            When you redeem a WLC member benefit or book an experience through our partner spas, retreats, or wellness brands, we share only the minimum information required (such as your name and contact details) to facilitate the booking or benefit. All partners are required to maintain appropriate data protection standards.
          </p>
        </div>

        <div className="pp-subblock">
          <h4 className="pp-subheading">4.2 With GlobalSpa</h4>
          <p className="pp-text">
            As WLC operates under the GlobalSpa brand, certain operational and administrative functions may be shared with the GlobalSpa team. Your data is treated with the same level of privacy and protection across both entities.
          </p>
        </div>

        <div className="pp-subblock">
          <h4 className="pp-subheading">4.3 With Service Providers</h4>
          <p className="pp-text">
            We work with trusted third-party service providers for functions such as email communications, payment processing, website analytics, and event management. These providers are bound by confidentiality obligations and may only use your data to perform services on our behalf.
          </p>
        </div>

        <div className="pp-subblock">
          <h4 className="pp-subheading">4.4 When Required by Law</h4>
          <p className="pp-text">
            We may disclose your information if required to do so by law, court order, or government authority, or if we believe disclosure is necessary to protect the rights, safety, or property of WLC, our members, or the public.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "data-storage",
    num: "05",
    title: "Data Storage & Security",
    icon: <Lock size={20} />,
    summary: "256-Bit SSL encryption, PCI-DSS payment gateways, and strict access controls.",
    content: (
      <>
        <p className="pp-text">
          We take the security of your personal data seriously and implement appropriate technical and organisational measures to protect it against unauthorised access, loss, destruction, or alteration.
        </p>
        <ul className="pp-list">
          <li>All data is stored on secure servers with access restricted to authorised personnel only</li>
          <li>Payment information is processed through PCI-DSS compliant payment gateways and is never stored on our servers</li>
          <li>We use SSL encryption on our website to protect data in transit</li>
          <li>We conduct regular reviews of our data handling practices and security measures</li>
        </ul>
        <p className="pp-text" style={{ fontStyle: "italic", opacity: 0.85 }}>
          While we take all reasonable precautions, no method of transmission over the internet or electronic storage is 100% secure. We encourage you to use strong, unique passwords and to contact us immediately if you suspect any unauthorised access to your account.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    num: "06",
    title: "Data Retention",
    icon: <Clock size={20} />,
    summary: "2 years for active members, 1 year for inquiries, 7 years for statutory records.",
    content: (
      <>
        <p className="pp-text">
          We retain your personal data for as long as your membership is active and for a reasonable period thereafter, or as required by law. Specifically:
        </p>
        <ul className="pp-list">
          <li><strong>Active member data</strong> is retained for the duration of membership plus 2 years</li>
          <li><strong>Enquiry and contact form data</strong> is retained for up to 1 year</li>
          <li><strong>Financial and transactional records</strong> are retained for 7 years as required by Indian tax and accounting laws</li>
          <li>You may request deletion of your data at any time (see Section 8 — Your Rights)</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies-policy",
    num: "07",
    title: "Cookies Policy",
    icon: <Cookie size={20} />,
    summary: "Essential, analytics, preference, and marketing cookie management.",
    content: (
      <>
        <p className="pp-text">
          Our website uses cookies — small text files placed on your device — to improve your browsing experience and understand how our site is used.
        </p>
        <h4 className="pp-subheading">Types of Cookies We Use</h4>
        <ul className="pp-list">
          <li><strong>Essential Cookies</strong> — Required for the website to function. These cannot be disabled.</li>
          <li><strong>Analytics Cookies</strong> — Help us understand visitor behaviour (e.g. Google Analytics). These are anonymised.</li>
          <li><strong>Preference Cookies</strong> — Remember your settings and personalisation choices.</li>
          <li><strong>Marketing Cookies</strong> — Used to serve relevant content. Only activated with your consent.</li>
        </ul>
        <p className="pp-text">
          You can manage or disable cookies through your browser settings at any time. Note that disabling certain cookies may affect the functionality of our website.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    num: "08",
    title: "Your Rights",
    icon: <Scale size={20} />,
    summary: "DPDPA 2023 rights: Access, Correction, Erasure, Grievance, and Nomination.",
    content: (
      <>
        <p className="pp-text">
          As a user or member of WLC, you have the following rights with respect to your personal data, in accordance with applicable Indian data protection law (including the Digital Personal Data Protection Act, 2023):
        </p>
        <ul className="pp-list">
          <li><strong>Right to Access</strong> — Request a copy of the personal data we hold about you</li>
          <li><strong>Right to Correction</strong> — Request correction of inaccurate or incomplete data</li>
          <li><strong>Right to Erasure</strong> — Request deletion of your personal data, subject to legal retention requirements</li>
          <li><strong>Right to Withdraw Consent</strong> — Withdraw your consent to marketing communications at any time</li>
          <li><strong>Right to Grievance Redressal</strong> — Raise a complaint about how your data is handled</li>
          <li><strong>Right to Nominate</strong> — Nominate a person to exercise your data rights on your behalf in the event of death or incapacity</li>
        </ul>
        <p className="pp-text">
          To exercise any of these rights, please write to us at{" "}
          <a href="mailto:wlc@pinnacleconnect.in" className="pp-link">
            wlc@pinnacleconnect.in
          </a>
          . We will respond within 30 days of receiving your request.
        </p>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    num: "09",
    title: "Children's Privacy",
    icon: <UserX size={20} />,
    summary: "WLC services are exclusively for individuals aged 18 and above.",
    content: (
      <p className="pp-text">
        WLC&apos;s services are intended for individuals aged 18 years and above. We do not knowingly collect personal information from anyone under the age of 18. If we become aware that a minor has provided us with personal data, we will take immediate steps to delete that information. If you believe a minor has submitted data to us, please contact us at{" "}
        <a href="mailto:wlc@pinnacleconnect.in" className="pp-link">
          wlc@pinnacleconnect.in
        </a>.
      </p>
    ),
  },
  {
    id: "third-party-links",
    num: "10",
    title: "Third-Party Links",
    icon: <ExternalLink size={20} />,
    summary: "We are not responsible for privacy practices on external partner destinations.",
    content: (
      <p className="pp-text">
        Our website may contain links to third-party websites, including our partner spas, retreats, and GlobalSpa. This Privacy Policy applies only to wellnessloversclub.com. We are not responsible for the privacy practices of external websites and encourage you to review their respective privacy policies before sharing any personal information.
      </p>
    ),
  },
  {
    id: "changes-to-policy",
    num: "11",
    title: "Changes to This Policy",
    icon: <RefreshCw size={20} />,
    summary: "Periodic reviews to reflect regulatory updates and member enhancements.",
    content: (
      <p className="pp-text">
        We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or services. When we make significant changes, we will notify you via email or by posting a prominent notice on our website.
      </p>
    ),
  },
  {
    id: "governing-law",
    num: "12",
    title: "Governing Law",
    icon: <Landmark size={20} />,
    summary: "Governed by IT Act 2000, SPDI Rules 2011, and DPDPA 2023 under Indian courts.",
    content: (
      <p className="pp-text">
        This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the courts in India.
      </p>
    ),
  },
  {
    id: "contact-us",
    num: "13",
    title: "Contact Us",
    icon: <Mail size={20} />,
    summary: "Direct privacy inquiries and grievance redressal within 30 days.",
    content: (
      <>
        <p className="pp-text">
          If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact our Privacy Team:
        </p>

        <div className="pp-contact-card">
          <div className="pp-contact-header">
            <span className="pp-contact-pill">Data Privacy Contact</span>
            <h3 className="pp-contact-title">Wellness Lovers Club by GlobalSpa</h3>
          </div>

          <div className="pp-contact-rows">
            <div className="pp-contact-row">
              <span className="pp-contact-label">Official Inquiries:</span>
              <a href="mailto:wlc@pinnacleconnect.in" className="pp-contact-value">
                wlc@pinnacleconnect.in
              </a>
            </div>
            <div className="pp-contact-row">
              <span className="pp-contact-label">Executive Leadership:</span>
              <a href="mailto:vinit@pinnacleconnect.in" className="pp-contact-value">
                vinit@pinnacleconnect.in
              </a>
            </div>
            <div className="pp-contact-row">
              <span className="pp-contact-label">Official Portal:</span>
              <Link href="https://www.wellnessloversclub.com" target="_blank" className="pp-contact-value">
                www.wellnessloversclub.com
              </Link>
            </div>
          </div>

          <div className="pp-contact-footnote">
            For all privacy-related queries, requests, or complaints, please write to us at the email above. We will respond within 30 days.
          </div>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const query = searchQuery.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.num.includes(query)
    );
  }, [searchQuery]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("wlc@pinnacleconnect.in");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="pp-root">
      {/* ─── Premium Hero Section ─────────────────────────────── */}
      <section className="pp-hero-banner">
        <div className="pp-hero-overlay" />
        <div className="pp-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pp-hero-content"
          >
            <div className="pp-badge">
              <Sparkles size={14} className="pp-badge-icon" />
              <span>WLC · WELLNESS LOVERS CLUB · BY GLOBALSPA</span>
            </div>

            <h1 className="pp-main-title">Privacy Policy</h1>
            <p className="pp-main-tagline">
              Your privacy is sacred to us — read how we protect it
            </p>

            {/* Quick Trust Pillars */}
            <div className="pp-pillars-grid">
              <div className="pp-pillar-item">
                <Shield size={18} className="pp-pillar-icon" />
                <div>
                  <strong>100% Zero Sale</strong>
                  <span>We never sell your personal data</span>
                </div>
              </div>
              <div className="pp-pillar-item">
                <Lock size={18} className="pp-pillar-icon" />
                <div>
                  <strong>PCI-DSS &amp; SSL</strong>
                  <span>256-Bit encrypted transactions</span>
                </div>
              </div>
              <div className="pp-pillar-item">
                <Scale size={18} className="pp-pillar-icon" />
                <div>
                  <strong>DPDPA 2023</strong>
                  <span>Compliant with Indian Data Laws</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content Area with Sidebar ───────────────────── */}
      <div className="pp-layout-wrap">
        <div className="pp-main-container">
          
          {/* Sticky Desktop Navigation Sidebar */}
          <aside className="pp-nav-sidebar">
            <div className="pp-sidebar-inner">
              <div className="pp-search-box">
                <Search size={16} className="pp-search-icon" />
                <input
                  type="text"
                  placeholder="Search 13 sections…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pp-search-input"
                />
              </div>

              <div className="pp-sidebar-heading">Table of Contents</div>

              <nav className="pp-sidebar-nav">
                {SECTIONS.map((sec) => (
                  <a key={sec.id} href={`#${sec.id}`} className="pp-sidebar-link">
                    <span className="pp-link-num">{sec.num}</span>
                    <span className="pp-link-text">{sec.title}</span>
                    <ChevronRight size={14} className="pp-link-arrow" />
                  </a>
                ))}
              </nav>

              <div className="pp-sidebar-help">
                <div className="pp-help-title">Need Assistance?</div>
                <p className="pp-help-desc">Our Data Protection team responds within 30 days.</p>
                <button type="button" onClick={handleCopyEmail} className="pp-help-btn">
                  {copiedEmail ? (
                    <>
                      <CheckCircle size={14} color="#4ade80" />
                      <span>Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Privacy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>

          {/* Core Content Body */}
          <main className="pp-body-content">
            {/* Introductory Statement */}
            <div className="pp-intro-card">
              <h2 className="pp-intro-title">Commitment to Member Confidentiality</h2>
              <p className="pp-intro-text">
                Wellness Lovers Club (referred to as <strong>&apos;WLC&apos;</strong>, <strong>&apos;we&apos;</strong>, <strong>&apos;us&apos;</strong>, or <strong>&apos;our&apos;</strong>) is operated by Pinnacle Connect under the GlobalSpa brand. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, store, share, and protect your personal data when you visit our website, become a member, or engage with our services.
              </p>
              <p className="pp-intro-text" style={{ marginTop: "12px", marginBottom: 0 }}>
                By accessing our website or becoming a member of WLC, you agree to the terms outlined in this Privacy Policy. If you do not agree, please discontinue use of our services.
              </p>
            </div>

            {/* Render Sections */}
            <div className="pp-sections-list">
              {filteredSections.length === 0 ? (
                <div className="pp-no-results">
                  <p>No section matching &ldquo;{searchQuery}&rdquo;</p>
                  <button type="button" onClick={() => setSearchQuery("")} className="pp-reset-search">
                    Clear Search Filter
                  </button>
                </div>
              ) : (
                filteredSections.map((sec) => (
                  <section key={sec.id} id={sec.id} className="pp-section-card">
                    <div className="pp-card-header">
                      <div className="pp-card-badge">
                        <span className="pp-card-num">{sec.num}</span>
                        <div className="pp-card-icon">{sec.icon}</div>
                      </div>
                      <div className="pp-card-titles">
                        <h2 className="pp-section-title">{sec.title}</h2>
                        <span className="pp-section-summary">{sec.summary}</span>
                      </div>
                    </div>

                    <div className="pp-card-body">{sec.content}</div>
                  </section>
                ))
              )}
            </div>
          </main>

        </div>
      </div>

      {/* ─── Elegant Footer ───────────────────────────────────── */}
      <footer className="pp-footer-bar">
        <div className="pp-footer-content">
          <p>© 2025 Wellness Lovers Club by GlobalSpa · All rights reserved · wellnessloversclub.com</p>
        </div>
      </footer>
    </div>
  );
}
