"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PARTNERS_DATA } from "@/data/partnerOffers";
import "./explore-offer.css";
import "../contact/contact.css";

const WP_BASE = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.wellnessloversclub.com"
).replace(/\/$/, "");

async function submitInquiryToWordPress(data, destinationName, offerName, offerDiscount = "") {
  // First attempt dedicated offerings endpoint, with seamless fallback to general contact endpoint
  try {
    const res = await fetch(`${WP_BASE}/wp-json/wlc/v1/offering-inquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        destination_name: destinationName,
        destination_slug: destinationName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        offer_title: offerName || "All Member Privileges",
        offer_discount: offerDiscount || "Member Privilege",
        travel_date: data.travelDate || "Flexible",
        num_guests: "1-2",
        message: data.message,
        website: "", // Honeypot
      }),
    });

    const json = await res.json();
    if (res.ok && json.success) {
      return json;
    }
  } catch (e) {
    // Fallback to legacy endpoint
  }

  const fallbackRes = await fetch(`${WP_BASE}/wp-json/custom/v1/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: `Exclusive Offer Booking - ${destinationName}${offerName ? ` (${offerName})` : ""}`,
      message: `Preferred Booking/Travel Date: ${data.travelDate || "Not Specified"}\n\nSelected Privilege: ${offerName || "All Member Privileges"}\n\nGuest Message: ${data.message}`,
      website: "",
    }),
  });

  const fallbackJson = await fallbackRes.json();
  if (!fallbackRes.ok || !fallbackJson.success) {
    throw new Error(fallbackJson.message || "Failed to send inquiry. Please try again.");
  }
  return fallbackJson;
}

function ExploreOfferContent() {
  const searchParams = useSearchParams();
  const rawDest = searchParams.get("destination") || "Niraamaya Retreats Surya Samudra";
  const rawOffer = searchParams.get("offer") || "";

  // Match the partner record from the partner dataset with robust normalization
  const cleanTarget = (rawDest || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const matchedPartner = PARTNERS_DATA.find((p) => {
    const pName = p.name.toLowerCase();
    const cleanPName = pName.replace(/[^a-z0-9]/g, "");
    const cleanSlug = p.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const target = (rawDest || "").toLowerCase();

    return (
      pName.includes(target) ||
      target.includes(pName) ||
      cleanPName.includes(cleanTarget) ||
      cleanTarget.includes(cleanPName) ||
      cleanSlug.includes(cleanTarget) ||
      cleanTarget.includes(cleanSlug) ||
      (cleanTarget.includes("andaz") && (cleanSlug.includes("andaz") || cleanPName.includes("andaaz"))) ||
      (cleanTarget.includes("andaaz") && (cleanSlug.includes("andaz") || cleanPName.includes("andaaz")))
    );
  }) || PARTNERS_DATA[0]; // Defaults to Niraamaya Retreats Surya Samudra

  const formSectionRef = useRef(null);

  const [selectedOffer, setSelectedOffer] = useState(
    matchedPartner.offers.find((o) => o.title.toLowerCase().includes(rawOffer.toLowerCase())) || matchedPartner.offers[0]
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelDate: "",
    message: `I would like to explore and claim the member privilege "${selectedOffer?.title || "All Member Privileges"}" (${selectedOffer?.discount || "20% SAVINGS"}) at ${matchedPartner.name}. Please share availability and apply club pricing.`,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (rawOffer) {
      const found = matchedPartner.offers.find((o) => o.title.toLowerCase().includes(rawOffer.toLowerCase()));
      if (found) {
        setSelectedOffer(found);
      }
    }
  }, [rawOffer, matchedPartner]);

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setFormData((prev) => ({
      ...prev,
      message: `I would like to explore and claim the member privilege "${offer.title}" (${offer.discount}) at ${matchedPartner.name}. Please share availability and apply club pricing.`,
    }));
    setIsSubmitted(false);
    setSubmitError("");

    // Smooth scroll down to the form
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
        selectedOffer ? selectedOffer.title : "All Member Privileges",
        selectedOffer ? selectedOffer.discount : ""
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
          <h2 className="partner-detail-name">Exclusive Member Privileges</h2>
          <p className="partner-detail-summary">{matchedPartner.shortDesc}</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleSelectOffer(matchedPartner.offers[0])}
            className="btn btn-gold"
            style={{ padding: "12px 24px", fontSize: "12.5px" }}
          >
            Book / Claim Privilege ↓
          </button>
          <Link href="/destinations" className="partner-back-btn">
            ← Explore Destinations
          </Link>
        </div>
      </div>

      {/* ─── Partner-Specific Offers Section ─────────────────────────────── */}
      <section className="privileges-main-section" style={{ paddingTop: "0px", paddingBottom: "40px" }}>
        <div className="partner-offers-grid">
          {matchedPartner.offers.map((offer) => {
            const isSelected = selectedOffer?.id === offer.id;
            return (
              <div
                className="partner-offer-card"
                key={offer.id}
                style={{
                  border: isSelected ? "2px solid #0d563f" : "1px solid rgba(13, 86, 63, 0.08)",
                  boxShadow: isSelected ? "0 15px 35px rgba(13, 86, 63, 0.15)" : undefined,
                  transform: isSelected ? "translateY(-4px)" : undefined,
                }}
              >
                <div className="offer-card-top">
                  <span className="offer-savings-pill">{offer.discount}</span>
                  {offer.badge && <span className="offer-badge">{offer.badge}</span>}
                </div>

                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{offer.description}</p>

                {offer.memberPrice && (
                  <div className="offer-pricing-block">
                    <div>
                      <div style={{ fontSize: "10.5px", textTransform: "uppercase", color: "#888", letterSpacing: "0.5px" }}>
                        Original MRP
                      </div>
                      <div className="offer-mrp">{offer.originalPrice}</div>
                    </div>
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
                    <strong>Terms:</strong> {offer.terms}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleSelectOffer(offer)}
                  className="offer-redeem-btn"
                  style={{
                    border: "none",
                    backgroundColor: isSelected ? "#bca374" : "#0d563f",
                    color: isSelected ? "#06281e" : "#ffffff",
                    fontWeight: 700,
                  }}
                >
                  {isSelected ? "✓ Selected (Proceed Below) ↓" : "Select Privilege →"}
                </button>
              </div>
            );
          })}
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
              Submit your dates and details below to lock in exclusive member rates and tailored hospitality inclusions.
            </p>
          </div>

          {/* Selected Privilege Highlight Banner */}
          {selectedOffer && (
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
                  Selected Offer for {matchedPartner.name}
                </span>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 600, color: "#0d563f" }}>
                  {selectedOffer.title}
                </div>
              </div>
              <span
                style={{
                  background: "#bca374",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 800,
                  padding: "6px 14px",
                  borderRadius: "20px",
                }}
              >
                {selectedOffer.discount}
              </span>
            </div>
          )}

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
                Privilege Claim Submitted!
              </h3>
              <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.7", maxWidth: "560px", margin: "0 auto 24px auto" }}>
                Thank you! Your booking request for <strong>{selectedOffer?.title || "Member Privileges"}</strong> at <strong>{matchedPartner.name}</strong> has been received. Our dedicated member concierge will contact you promptly to finalize details and apply member discounts.
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

              <div className="contact-form-group">
                <label htmlFor="travelDate" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>Preferred Travel / Treatment Date</label>
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
                <label htmlFor="message" style={{ color: "#0d563f", fontWeight: 600, fontSize: "12.5px", display: "block", marginBottom: "6px" }}>Special Inquiries or Requests</label>
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
                {isSubmitting ? "Submitting Inquiry..." : `Submit Booking Inquiry for ${matchedPartner.name} →`}
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
            Membership Tiers
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
