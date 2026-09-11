"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { PARTNERS_DATA } from "@/data/partnerOffers";
import { wpPost } from "@/lib/wpFetch";
import "./explore-offer.css";
import "../contact/contact.css";

export const dynamic = "force-dynamic";

async function submitInquiryToWordPress(data, destinationName, websiteUrl) {
  const json = await wpPost(
    "/wp-json/custom/v1/contact",
    {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: `Exclusive Privileges Claim - ${destinationName}`,
      message: `Preferred Booking/Travel Date: ${data.travelDate || "Not Specified"}\nPackage Duration: ${data.duration || "Standard Package"}\nGuests: ${data.guests || "1-2"}\n\nPrivileges: All Member Privileges & Inclusions Bundle\n\nGuest Message: ${data.message || "N/A"}${websiteUrl ? `\nPartner Website: ${websiteUrl}` : ""}`,
      website: "", // Honeypot field - must stay empty
    },
    { unauthenticated: true }
  );

  return json;
}

function normalizeStr(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function findPartnerByDestination(rawDest) {
  const cleanTarget = normalizeStr(rawDest).replace(/[^a-z0-9]/g, "");
  if (!cleanTarget) return PARTNERS_DATA[0];

  // 1. Exact match on normalized name or slug
  const exact = PARTNERS_DATA.find((p) => {
    const cName = normalizeStr(p.name).replace(/[^a-z0-9]/g, "");
    const cSlug = normalizeStr(p.slug).replace(/[^a-z0-9]/g, "");
    return cName === cleanTarget || cSlug === cleanTarget;
  });
  if (exact) return exact;

  // 2. Specific distinctive keyword mapping
  const keywords = [
    { key: "tre", partnerSlug: "tre-wellness-retreat" },
    { key: "losinj", partnerSlug: "losinj-hotels-villas-alhambra" },
    { key: "alhambra", partnerSlug: "losinj-hotels-villas-alhambra" },
    { key: "surya", partnerSlug: "niraamaya-retreats-surya-samudra" },
    { key: "samudra", partnerSlug: "niraamaya-retreats-surya-samudra" },
    { key: "kumarakom", partnerSlug: "niraamaya-retreats-backwaters-beyond" },
    { key: "backwater", partnerSlug: "niraamaya-retreats-backwaters-beyond" },
    { key: "swastik", partnerSlug: "swastik-luxury-wellbeing-sanctuary" },
    { key: "viveda", partnerSlug: "viveda-wellness-resort" },
    { key: "karmalakeland", partnerSlug: "the-wellness-co-karma-lakelands" },
    { key: "panindia", partnerSlug: "the-wellness-co-pan-india" },
    { key: "silhouette", partnerSlug: "silhouette-salon" },
    { key: "mayr", partnerSlug: "viva-mayr" },
    { key: "andaz", partnerSlug: "andaz-delhi-hyatt-hotel" },
    { key: "shangri", partnerSlug: "shangri-la-eros-new-delhi" },
    { key: "pema", partnerSlug: "pema-wellness-resort" },
    { key: "dhun", partnerSlug: "dhun-wellness-spa" },
    { key: "florian", partnerSlug: "florian-hurel-hair-couture-spa" },
    { key: "sawadhee", partnerSlug: "sawadhee-traditional-thai-spa" },
    { key: "iosis", partnerSlug: "iosis-spa-sorin" },
    { key: "barai", partnerSlug: "hyatt-regency-hua-hin-the-barai" },
    { key: "huahin", partnerSlug: "hyatt-regency-hua-hin-the-barai" },
    { key: "yamu", partnerSlug: "como-point-yamu-phuket" },
    { key: "bhutan", partnerSlug: "como-uma-paro-bhutan" },
    { key: "paro", partnerSlug: "como-uma-paro-bhutan" },
    { key: "palm", partnerSlug: "ja-palm-tree-court-calm-spa" },
    { key: "energetika", partnerSlug: "energetika369" },
    { key: "pemf", partnerSlug: "energetika369" },
    { key: "environics", partnerSlug: "environics" },
  ];

  for (const item of keywords) {
    if (cleanTarget.includes(item.key)) {
      const match = PARTNERS_DATA.find((p) => p.slug === item.partnerSlug);
      if (match) return match;
    }
  }

  // 3. Fallback to contains
  return (
    PARTNERS_DATA.find((p) => {
      const cName = normalizeStr(p.name).replace(/[^a-z0-9]/g, "");
      const cSlug = normalizeStr(p.slug).replace(/[^a-z0-9]/g, "");
      return (
        cName.includes(cleanTarget) ||
        cleanTarget.includes(cName) ||
        cSlug.includes(cleanTarget) ||
        cleanTarget.includes(cSlug)
      );
    }) || PARTNERS_DATA[0]
  );
}

function ExploreOfferContent() {
  const searchParams = useSearchParams();
  const rawDest = searchParams.get("destination") || "Niraamaya Retreats Surya Samudra";
  const matchedPartner = findPartnerByDestination(rawDest);

  const formSectionRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelDate: "",
    duration: "Flexible / Recommended Duration",
    guests: "1-2 Guests",
    message: `I would like to book and claim all member privileges and inclusions at ${matchedPartner.name}. Please share availability and apply club pricing.`,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const scrollToForm = (specificOfferTitle = null) => {
    if (specificOfferTitle) {
      setFormData((prev) => ({
        ...prev,
        message: `I would like to inquire about "${specificOfferTitle}" and claim all member privileges at ${matchedPartner.name}. Please share availability and apply club pricing.`,
      }));
    }
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitInquiryToWordPress(
        formData,
        matchedPartner.name,
        matchedPartner.website
      );
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(
        err.message || "Something went wrong. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="privileges-page">
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="privileges-hero" aria-label="Partner Hero">
        <div className="privileges-hero-container">
          <span className="privileges-hero-eyebrow">
            {matchedPartner.flag} {matchedPartner.category}
          </span>
          <h1 className="privileges-hero-title">{matchedPartner.name}</h1>
          <p className="privileges-hero-desc">
            Exclusive club privileges, preferred savings, and bespoke wellness experiences curated specifically for Wellness Lovers Club members.
          </p>
        </div>
      </section>

      {/* ─── Partner Detail Header Card ──────────────────────────────────── */}
      <div className="partner-detail-header-card">
        <div className="partner-detail-info">
          <div className="partner-detail-location">
            <span>📍</span>
            <span>{matchedPartner.location}</span>
          </div>
          <h2 className="partner-detail-name">Member Privileges & Inclusions</h2>
          <p className="partner-detail-summary">{matchedPartner.shortDesc}</p>
        </div>

        <div className="partner-action-group">
          {matchedPartner.website && (
            <a
              href={matchedPartner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="partner-website-btn"
              title={`Visit official website of ${matchedPartner.name}`}
            >
              Visit Official Website ↗
            </a>
          )}
          <button
            onClick={() => scrollToForm()}
            className="btn btn-gold"
            style={{ padding: "12px 22px", fontSize: "12px", borderRadius: "30px", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            Claim All Privileges ↓
          </button>
          <Link href="/destinations" className="partner-back-btn">
            ← Explore Destinations
          </Link>
        </div>
      </div>

      {/* ─── All-Inclusive Privileges Callout Banner ─────────────────────── */}
      <div className="inclusive-banner">
        <div className="inclusive-banner-text">
          <h4>All-Inclusive Member Privileges</h4>
          <p>
            As a Wellness Lovers Club member, you receive <strong>all listed offers and package inclusions</strong> for this property together — no need to choose just one.
          </p>
        </div>
        {matchedPartner.bookingPeriod && (
          <div className="booking-period-pill">
            <Calendar size={13} style={{ flexShrink: 0 }} />
            <span>{matchedPartner.bookingPeriod}</span>
          </div>
        )}
      </div>

      {/* ─── Partner-Specific Offers Section ─────────────────────────────── */}
      <section className="privileges-main-section" style={{ paddingTop: "0px", paddingBottom: "40px" }}>
        <div className="partner-offers-grid">
          {matchedPartner.offers.map((offer) => (
            <div className="partner-offer-card" key={offer.id}>
              <div className="offer-card-top">
                <span className="offer-savings-pill">{offer.discount}</span>
                {offer.badge && <span className="offer-badge">{offer.badge}</span>}
                {offer.duration && (
                  <span style={{ fontSize: "11px", color: "#bca374", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} /> {offer.duration}
                  </span>
                )}
              </div>

              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-desc">{offer.description}</p>

              {/* Package Inclusions Checklist */}
              {Array.isArray(offer.inclusions) && offer.inclusions.length > 0 && (
                <div className="package-inclusions-box">
                  <div className="package-inclusions-header">
                    <span>★</span> Package Inclusions
                  </div>
                  <ul className="inclusions-bullet-list">
                    {offer.inclusions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing breakdown if available */}
              {offer.memberPrice && (
                <div className="offer-pricing-block">
                  {offer.originalPrice ? (
                    <div>
                      <div style={{ fontSize: "10.5px", textTransform: "uppercase", color: "#888", letterSpacing: "0.5px" }}>
                        Original MRP
                      </div>
                      <div className="offer-mrp">{offer.originalPrice}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: "10.5px", textTransform: "uppercase", color: "#888", letterSpacing: "0.5px" }}>
                        Special Rate
                      </div>
                      <div style={{ fontSize: "12px", color: "#0d563f", fontWeight: 600 }}>
                        {offer.priceNote || "WLC Privilege"}
                      </div>
                    </div>
                  )}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10.5px", textTransform: "uppercase", color: "#0d563f", fontWeight: 700, letterSpacing: "0.5px" }}>
                      WLC Member Price
                    </div>
                    <div className="offer-member-price-val">{offer.memberPrice}</div>
                  </div>
                </div>
              )}

              {offer.terms && (
                <div className="offer-terms-note">
                  <strong>Terms & Validity:</strong> {offer.terms}
                </div>
              )}

              <button
                type="button"
                onClick={() => scrollToForm(offer.title)}
                className="offer-redeem-btn"
              >
                Inquire & Claim Privileges ↓
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── INLINE LUXURY BOOKING & INQUIRY FORM SECTION ────────────────── */}
      <section
        ref={formSectionRef}
        style={{
          background: "#ffffff",
          borderTop: "1px solid #ebdcb9",
          borderBottom: "1px solid #ebdcb9",
          padding: "70px 24px 85px 24px",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="eyebrow" style={{ display: "block", color: "#bca374", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
              CONCIERGE BOOKING & PRIVILEGE CLAIM
            </span>
            <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(28px, 4vw, 38px)", color: "#0d563f", margin: "0 0 10px 0" }}>
              Book & Claim Privileges at {matchedPartner.name}
            </h2>
            <p style={{ color: "#666", fontSize: "14.5px", maxWidth: "620px", margin: "0 auto" }}>
              Submit your preferred dates and details below. Our member concierge will confirm availability, lock in your exclusive member rates, and ensure all partner inclusions are applied.
            </p>
          </div>

          {/* Partner & Privileges Highlight Card */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(13,86,63,0.06) 0%, rgba(188,163,116,0.14) 100%)",
              border: "1px solid #bca374",
              borderRadius: "14px",
              padding: "18px 24px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#9c8458", textTransform: "uppercase", letterSpacing: "1px" }}>
                Selected Sanctuary
              </span>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 600, color: "#0d563f" }}>
                {matchedPartner.name}
              </div>
              <div style={{ fontSize: "12.5px", color: "#666", marginTop: "2px" }}>
                📍 {matchedPartner.location}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "#0d563f",
                  color: "#ffffff",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: "20px",
                }}
              >
                All Privileges Included
              </span>
              {matchedPartner.website && (
                <a
                  href={matchedPartner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0d563f",
                    textDecoration: "underline",
                  }}
                >
                  Official Website ↗
                </a>
              )}
            </div>
          </div>

          {isSubmitted ? (
            <div
              style={{
                background: "rgba(13, 86, 63, 0.04)",
                border: "1.5px solid #0d563f",
                borderRadius: "16px",
                padding: "40px 30px",
                textAlign: "center",
              }}
            >
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#0d563f", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", fontSize: "30px" }}>
                ✓
              </div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: "#0d563f", marginBottom: "8px" }}>
                Privilege Request Submitted!
              </h3>
              <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.7", maxWidth: "560px", margin: "0 auto 24px auto" }}>
                Thank you! Your booking and privileges request for <strong>{matchedPartner.name}</strong> has been received. Our dedicated member concierge will contact you promptly to finalize your itinerary and confirm club pricing.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-gold"
                  style={{ padding: "12px 24px", fontSize: "12.5px" }}
                >
                  Submit Another Request
                </button>
                <Link href="/destinations" className="btn btn-green" style={{ padding: "12px 24px", fontSize: "12.5px" }}>
                  Explore All Destinations
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="contact-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="contact-form-group">
                  <label htmlFor="firstName" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="e.g. Aria"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ width: "100%", background: "#faf8f5", border: "1px solid #ebdcb9", borderRadius: "8px", padding: "12px 14px", fontSize: "13.5px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="lastName" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ width: "100%", background: "#faf8f5", border: "1px solid #ebdcb9", borderRadius: "8px", padding: "12px 14px", fontSize: "13.5px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div className="contact-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="contact-form-group">
                  <label htmlFor="email" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="aria@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: "100%", background: "#faf8f5", border: "1px solid #ebdcb9", borderRadius: "8px", padding: "12px 14px", fontSize: "13.5px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="phone" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>Mobile Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ width: "100%", background: "#faf8f5", border: "1px solid #ebdcb9", borderRadius: "8px", padding: "12px 14px", fontSize: "13.5px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div className="contact-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="contact-form-group">
                  <label htmlFor="travelDate" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>Preferred Travel / Visit Date</label>
                  <input
                    type="date"
                    id="travelDate"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    style={{ width: "100%", background: "#faf8f5", border: "1px solid #ebdcb9", borderRadius: "8px", padding: "12px 14px", fontSize: "13.5px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="duration" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>Preferred Package / Duration</label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    placeholder="e.g. 5 Nights / 7 Nights / 14 Nights / Day Session"
                    value={formData.duration}
                    onChange={handleChange}
                    style={{ width: "100%", background: "#faf8f5", border: "1px solid #ebdcb9", borderRadius: "8px", padding: "12px 14px", fontSize: "13.5px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>Special Inquiries or Preferences</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ width: "100%", background: "#faf8f5", border: "1px solid #ebdcb9", borderRadius: "8px", padding: "12px 14px", fontSize: "13.5px", boxSizing: "border-box" }}
                ></textarea>
              </div>

              {submitError && (
                <div style={{ color: "#e53e3e", fontSize: "13px", textAlign: "center" }}>
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-green"
                style={{ width: "100%", padding: "16px 24px", fontSize: "14px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginTop: "10px" }}
              >
                {isSubmitting ? "Submitting Request..." : `Submit Privileges Claim for ${matchedPartner.name} →`}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Bottom Global Actions */}
      <section style={{ padding: "50px 24px 70px 24px", textAlign: "center", background: "#fdfbf7" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/destinations" className="btn btn-green">
            ← Explore Destinations
          </Link>
          <Link href="/membership" className="btn btn-gold">
            Become a Member
          </Link>
        </div>
      </section>
    </article>
  );
}

export default function ExploreOfferPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Offer...</div>}>
      <ExploreOfferContent />
    </Suspense>
  );
}
