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
    { key: "hexa", partnerSlug: "energetika369" },
    { key: "neuropulse", partnerSlug: "energetika369" },
    { key: "rtms", partnerSlug: "energetika369" },
    { key: "rife", partnerSlug: "energetika369" },
    { key: "dermavision", partnerSlug: "energetika369" },
    { key: "iridoscope", partnerSlug: "energetika369" },
    { key: "dijiwave", partnerSlug: "energetika369" },
    { key: "digiwave", partnerSlug: "energetika369" },
    { key: "lumicare", partnerSlug: "energetika369" },
    { key: "environics", partnerSlug: "environics" },
    { key: "envirochip", partnerSlug: "environics" },
    { key: "enviroglobe", partnerSlug: "environics" },
    { key: "envirocare", partnerSlug: "environics" },
    { key: "enviromat", partnerSlug: "environics" },
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
    message:
      rawDest && rawDest !== matchedPartner.name
        ? `I would like to enquire about "${rawDest}" and claim my Wellness Lovers Club member privileges with ${matchedPartner.name}. Please share pricing, availability, and consultation details.`
        : `I would like to book and claim all member privileges and inclusions at ${matchedPartner.name}. Please share availability and apply club pricing.`,
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
          <h2 className="partner-detail-name">Member Privileges &amp; Inclusions</h2>
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
            className="btn btn-gold partner-claim-btn"
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
      <section className="privileges-main-section">
        <div className="partner-offers-grid">
          {matchedPartner.offers.map((offer) => (
            <div className="partner-offer-card" key={offer.id}>
              <div className="offer-card-top">
                <span className="offer-savings-pill">{offer.discount}</span>
                {offer.badge && <span className="offer-badge">{offer.badge}</span>}
                {offer.duration && (
                  <span className="offer-duration-tag">
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
                      <div className="offer-price-label">Original MRP</div>
                      <div className="offer-mrp">{offer.originalPrice}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="offer-price-label">Special Rate</div>
                      <div className="offer-special-note">
                        {offer.priceNote || "WLC Privilege"}
                      </div>
                    </div>
                  )}
                  <div className="offer-member-price-col">
                    <div className="offer-member-label">WLC Member Price</div>
                    <div className="offer-member-price-val">{offer.memberPrice}</div>
                  </div>
                </div>
              )}

              {offer.terms && (
                <div className="offer-terms-note">
                  <strong>Terms &amp; Validity:</strong> {offer.terms}
                </div>
              )}

              <button
                type="button"
                onClick={() => scrollToForm(offer.title)}
                className="offer-redeem-btn"
              >
                Inquire &amp; Claim Privileges ↓
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── INLINE LUXURY BOOKING & INQUIRY FORM SECTION ────────────────── */}
      <section ref={formSectionRef} className="explore-booking-section">
        <div className="explore-booking-container">
          <div className="explore-booking-header">
            <span className="explore-booking-eyebrow">
              CONCIERGE BOOKING &amp; PRIVILEGE CLAIM
            </span>
            <h2 className="explore-booking-title">
              Book &amp; Claim Privileges at {matchedPartner.name}
            </h2>
            <p className="explore-booking-sub">
              Submit your preferred dates and details below, or call our official concierge desk at{" "}
              <a href="tel:+919289330103" className="explore-concierge-phone">
                +91 92893 30103
              </a>
              . Our member concierge will confirm availability, lock in your exclusive member rates, and ensure all partner inclusions are applied.
            </p>
          </div>

          {/* Partner & Privileges Highlight Card */}
          <div className="explore-sanctuary-bar">
            <div className="explore-sanctuary-info">
              <span className="explore-sanctuary-label">Selected Sanctuary</span>
              <div className="explore-sanctuary-name">{matchedPartner.name}</div>
              <div className="explore-sanctuary-loc">📍 {matchedPartner.location}</div>
            </div>

            <div className="explore-sanctuary-badges">
              <span className="explore-privileges-pill">All Privileges Included</span>
              {matchedPartner.website && (
                <a
                  href={matchedPartner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="explore-official-link"
                >
                  Official Website ↗
                </a>
              )}
            </div>
          </div>

          {isSubmitted ? (
            <div className="explore-submitted-box">
              <div className="explore-submitted-check">✓</div>
              <h3 className="explore-submitted-title">
                Privilege Request Submitted!
              </h3>
              <p className="explore-submitted-desc">
                Thank you! Your booking and privileges request for{" "}
                <strong>{matchedPartner.name}</strong> has been received. Our dedicated member concierge will contact you promptly to finalize your itinerary and confirm club pricing.
              </p>
              <div className="explore-submitted-actions">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-gold"
                >
                  Submit Another Request
                </button>
                <Link href="/destinations" className="btn btn-green">
                  Explore All Destinations
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="explore-booking-form">
              <div className="explore-form-grid">
                <div className="contact-form-group">
                  <label htmlFor="firstName" className="explore-form-label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="e.g. Aria"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="explore-form-input"
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="lastName" className="explore-form-label">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="explore-form-input"
                  />
                </div>
              </div>

              <div className="explore-form-grid">
                <div className="contact-form-group">
                  <label htmlFor="email" className="explore-form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="aria@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="explore-form-input"
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="phone" className="explore-form-label">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="explore-form-input"
                  />
                </div>
              </div>

              <div className="explore-form-grid">
                <div className="contact-form-group">
                  <label htmlFor="travelDate" className="explore-form-label">
                    Preferred Travel / Visit Date
                  </label>
                  <input
                    type="date"
                    id="travelDate"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    className="explore-form-input"
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="duration" className="explore-form-label">
                    Preferred Package / Duration
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    placeholder="e.g. 5 Nights / 7 Nights / 14 Nights"
                    value={formData.duration}
                    onChange={handleChange}
                    className="explore-form-input"
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message" className="explore-form-label">
                  Special Inquiries or Preferences
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="explore-form-input explore-form-textarea"
                ></textarea>
              </div>

              {submitError && (
                <div className="explore-submit-error">{submitError}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-green explore-submit-btn"
              >
                {isSubmitting
                  ? "Submitting Request..."
                  : `Submit Privileges Claim for ${matchedPartner.name} →`}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Bottom Global Actions */}
      <section className="explore-bottom-section">
        <div className="explore-bottom-actions">
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
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading Offer...
        </div>
      }
    >
      <ExploreOfferContent />
    </Suspense>
  );
}
