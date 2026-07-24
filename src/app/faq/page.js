"use client";

import { useState } from "react";
import Link from "next/link";
import "./faq.css";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    { id: "ALL", label: "All" },
    { id: "GENERAL", label: "General" },
    { id: "MEMBERSHIP", label: "Membership" },
    { id: "BENEFITS", label: "Benefits & Perks" },
    { id: "RETREATS", label: "Retreats" },
    { id: "GLOBALSPA", label: "GlobalSpa" }
  ];

  const faqData = [
    {
      category: "GENERAL",
      q: "What is Wellness Lovers Club?",
      a: "Wellness Lovers Club (WLC) is India's premier wellness and lifestyle membership community, powered by GlobalSpa. It is a curated, members-only ecosystem designed for individuals who embrace wellness as a way of life, offering exclusive access to the world’s most luxurious spas, retreats, expert masterclasses, wellness events, and a like-minded community of conscious living enthusiasts."
    },
    {
      category: "GENERAL",
      q: "Who is WLC for?",
      a: "WLC is for discerning individuals who value conscious living, holistic wellbeing, and elevated experiences. Whether you are a wellness enthusiast, a frequent spa-goer, a mindful traveller, or someone seeking a like-minded community: WLC is built exactly for you."
    },
    {
      category: "MEMBERSHIP",
      q: "How do I become a member of WLC?",
      a: "You can apply for a membership by visiting wellnessloversclub.com, clicking 'Become a Member', and filling out the application form. You can also write to us at wlc@pinnacleconnect.in or scan the QR code on our brochure. Our team will get in touch with you within 48 hours."
    },
    {
      category: "MEMBERSHIP",
      q: "What are the membership fees?",
      a: "WLC offers a single annual membership right now, that provides access to a curated world of exclusive wellness privileges and experiences. To view the current membership fee, visit our ‘Become a Member’ page or contact us at wlc@pinnacleconnect.in."
    },
    {
      category: "MEMBERSHIP",
      q: "Is membership open to everyone or by invitation only?",
      a: "WLC is open to applications from all individuals who are genuinely passionate about wellness and conscious living. While we do not operate on a strict invitation-only basis, we curate our community thoughtfully to ensure every member adds to and benefits from the shared ecosystem."
    },
    {
      category: "MEMBERSHIP",
      q: "Can I gift a WLC membership to someone?",
      a: "Yes, WLC memberships are easy to gift. Simply enter the recipient’s details, complete the payment and we’ll take care of the rest. Your recipient will receive their membership along with a personalized welcome email from the WLC team. And you will get an exclusive benefit tailored specifically for you as well."
    },
    {
      category: "MEMBERSHIP",
      q: "How long does a membership last?",
      a: "WLC memberships are annual. You will be notified in advance of your renewal date, and our team will assist you through the renewal process. Members who renew early may also receive exclusive loyalty benefits."
    },
    {
      category: "BENEFITS",
      q: "What benefits do WLC members receive?",
      a: "WLC members enjoy a comprehensive suite of benefits including: priority access to luxury wellness events and masterclasses; exclusive rates at partner spas and retreats across the Globe. Immersive and curated wellness experiences; and holistic healing sessions; access to a like-minded community network; invitations to member-only events; and collaborations with the world’s finest wellness, beauty, and lifestyle brands."
    },
    {
      category: "BENEFITS",
      q: "How do I access my member benefits?",
      a: "Once your membership is confirmed, you will receive a welcome Email confirming your membership along with your member credentials. All benefits, partner offers, and event invitations will then be communicated directly to you via email/phone and through your member dashboard."
    },
    {
      category: "BENEFITS",
      q: "Are the partner offers exclusive to WLC members?",
      a: "Yes. All partner offers are Exclusive to WLC Community Members."
    },
    {
      category: "RETREATS",
      q: "How do I book a Wellness experience through WLC?",
      a: "You can simply call our wellness concierge team. We can handle the booking, coordination, and personalisation of your experience, so all you need to do is arrive and restore. Or you can choose to head to the Offerings or Destination page to browse through our available offers, choose the one that best suits your needs and complete the payment online. Once your booking is confirmed, you’re all set to enjoy your wellness experience."
    },
    {
      category: "RETREATS",
      q: "What types of experiences does WLC offer?",
      a: "WLC offers a wide spectrum of curated wellness experiences from Himalayan and coastal escapes to international retreats and immersive wellness journeys. Members enjoy access to Ayurvedic and holistic healing programmes, luxury spa rituals and recovery Therapies, Pilates, Yoga, HIIT and mindfulness sessions, exclusive worldwide wellness networking events, and expert-led masterclasses with globally renowned pioneers in longevity and wellbeing."
    },
    {
      category: "RETREATS",
      q: "Can I attend WLC events without being a member?",
      a: "Most WLC events and experiences are exclusive to members. Some select community events may be open to guests accompanied by a WLC Member (as approved by the WLC team)."
    },
    {
      category: "GLOBALSPA",
      q: "What is GlobalSpa and how is it connected to WLC?",
      a: "GlobalSpa is India's leading wellness and luxury lifestyle media brand ; with 12+ years of excellence, 1,50,000+ subscribers, and 100+ luxury wellness partners. WLC is the exclusive membership community born from GlobalSpa's deep roots in the wellness world, giving members direct access to the trust, relationships, and expertise that GlobalSpa has built over more than a decade."
    },
    {
      category: "GLOBALSPA",
      q: "Do I get access to GlobalSpa's content and network as a WLC member?",
      a: "Yes. Your WLC membership gives you privileged access to GlobalSpa's curated wellness insights, expert editorial content, and network of trusted wellness authorities, in addition to all your exclusive member benefits. You become part of a community that is truly at the forefront of India's wellness movement."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = activeCategory === "ALL"
    ? faqData
    : faqData.filter(faq => faq.category === activeCategory);

  return (
    <div className="faq-page-container">
      {/* ─── Hero Section ─── */}
      <section className="faq-hero" aria-label="FAQ Introduction">
        <span className="faq-hero-eyebrow">WLC · WELLNESS LOVERS CLUB · BY GLOBALSPA</span>
        <h1 className="faq-hero-title">Frequently Asked Questions</h1>
        <p className="faq-hero-subtitle">
          Everything you need to know about Wellness Lovers Club
        </p>
      </section>

      {/* ─── Category Filter Row ─── */}
      <section className="faq-filters" aria-label="FAQ Categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`faq-filter-btn ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(cat.id);
              setOpenIndex(null); // Reset open states on filter change
            }}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* ─── Accordion Content ─── */}
      <main className="faq-content-wrapper">
        <div className="faq-accordion">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`faq-item ${isOpen ? "open" : ""}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => handleToggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{idx + 1}. {faq.q}</span>
                  <span className="faq-toggle-icon">+</span>
                </button>
                <div className="faq-answer-pane">
                  <div className="faq-answer-content">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ─── Support / Still Have Questions ─── */}
      <section className="faq-contact-banner" aria-label="Still have questions">
        <h2 className="faq-contact-title">Still have a question?</h2>
        <p className="faq-contact-desc">
          Our team is happy to help. Reach out and we will get back to you within 48 hours.
        </p>
        <div className="faq-emails-wrapper">
          <a href="mailto:wlc@pinnacleconnect.in" className="faq-email-link">
            wlc@pinnacleconnect.in
          </a>
          <a href="mailto:vinit@pinnacleconnect.in" className="faq-email-link">
            vinit@pinnacleconnect.in
          </a>
        </div>
      </section>

      {/* ─── Bottom Call-To-Action Banner ─── */}
      <section className="faq-invite-banner" aria-label="Membership Invitation">
        <div className="faq-invite-inner">
          <div className="faq-invite-quote">
            &ldquo;Your wellness journey begins here.&rdquo;
          </div>
          <Link
            href="/membership"
            className="faq-invite-btn"
          >
            Become a Member
          </Link>
        </div>
      </section>
    </div>
  );
}
