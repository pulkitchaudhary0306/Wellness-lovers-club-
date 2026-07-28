"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../contact/contact.css";

const WP_BASE = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://your-wordpress-site.com"
).replace(/\/$/, "");

async function submitInquiryToWordPress(data, destinationName) {
  const res = await fetch(`${WP_BASE}/wp-json/custom/v1/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: `Exclusive Offer Inquiry - ${destinationName || "General"}`,
      message: `Preferred Booking/Travel Date: ${data.travelDate || "Not Specified"}\n\nMessage: ${data.message}`,
      website: "", // Honeypot field
    }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to send message.");
  }

  return json;
}

export default function ExploreOfferPage() {
  const [destination, setDestination] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelDate: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const dest = params.get("destination");
      if (dest) {
        setDestination(dest);
        setFormData((prev) => ({
          ...prev,
          message: `I am interested in booking / exploring the exclusive members offer for ${dest}. Please share the availability, special packages, and member benefits.`
        }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitInquiryToWordPress(formData, destination);
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
    <div className="contact-page" style={{ minHeight: "100vh" }}>
      {/* Page Header */}
      <div className="contact-header" style={{ backgroundColor: "#0d563f" }}>
        <div className="contact-header-content">
          <span style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#bca374", textTransform: "uppercase", display: "block", marginBottom: "8px", fontWeight: 600 }}>Exclusive WLC Offer</span>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 38px)", textTransform: "none", letterSpacing: "normal" }}>
            {destination ? `Explore ${destination}` : "Explore Exclusive Offers"}
          </h1>
          <div className="contact-breadcrumbs">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <Link href="/offerings">Offerings</Link>
            <span className="separator">/</span>
            <span>Explore Offer</span>
          </div>
        </div>
      </div>

      {/* Main Content Split Layout */}
      <div className="contact-container" style={{ marginTop: "60px" }}>
        {/* Left Column: Offer Details */}
        <div className="contact-info">
          <div>
            <h2 className="contact-info-title" style={{ color: "#0d563f", fontFamily: "Georgia, serif" }}>WLC Member Privileges</h2>
            <p className="contact-info-subtitle" style={{ fontSize: "14.5px" }}>
              As a valued member of the Wellness Lovers Club, you gain access to curated privileges, preferred pricing, and tailored services at our handpicked partner destinations.
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="contact-card" style={{ background: "#ffffff", border: "1px solid rgba(13,86,63,0.08)" }}>
            <div className="contact-card-icon" style={{ backgroundColor: "rgba(13,86,63,0.05)", color: "#0d563f" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", height: "20px" }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="contact-card-content">
              <h3 style={{ color: "#0d563f" }}>Priority Bookings</h3>
              <p>Skip standard reservation lines with direct, fast-track access to our partner retreats and spas.</p>
            </div>
          </div>

          <div className="contact-card" style={{ background: "#ffffff", border: "1px solid rgba(13,86,63,0.08)" }}>
            <div className="contact-card-icon" style={{ backgroundColor: "rgba(13,86,63,0.05)", color: "#0d563f" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", height: "20px" }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="contact-card-content">
              <h3 style={{ color: "#0d563f" }}>Exclusive Benefits</h3>
              <p>Enjoy complimentary room upgrades, extended checkout times, and specialized spa/salon credits.</p>
            </div>
          </div>

          <div className="contact-card" style={{ background: "#ffffff", border: "1px solid rgba(13,86,63,0.08)" }}>
            <div className="contact-card-icon" style={{ backgroundColor: "rgba(13,86,63,0.05)", color: "#0d563f" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", height: "20px" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="contact-card-content">
              <h3 style={{ color: "#0d563f" }}>Dedicated Support</h3>
              <p>A dedicated wellness consultant will manage your booking and ensure a seamless, restorative stay.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="contact-form-wrapper" style={{ background: "#ffffff", border: "1px solid rgba(13,86,63,0.08)", boxShadow: "0 8px 30px rgba(13,86,63,0.04)" }}>
          {isSubmitted ? (
            <div className="contact-success-box" style={{ borderColor: "#0d563f", backgroundColor: "rgba(13, 86, 63, 0.03)", color: "#0d563f" }}>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px" }}>Request Submitted!</h3>
              <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
                Thank you for your interest in {destination || "our exclusive offer"}. Your inquiry has been sent to our membership team. One of our wellness consultants will reach out to you shortly.
              </p>
              <div style={{ marginTop: "24px" }}>
                <Link href="/offerings" className="btn btn-gold" style={{ display: "inline-block", padding: "10px 20px", fontSize: "12px", textDecoration: "none" }}>
                  Back to Offerings
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontFamily: "Georgia, serif", color: "#0d563f", marginBottom: "20px" }}>Request More Information</h2>
              
              <div className="contact-form-grid">
                <div className="contact-form-group">
                  <label htmlFor="firstName" style={{ color: "#0d563f" }}>First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ background: "#faf8f5" }}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="lastName" style={{ color: "#0d563f" }}>Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ background: "#faf8f5" }}
                  />
                </div>
              </div>

              <div className="contact-form-grid" style={{ marginTop: "20px" }}>
                <div className="contact-form-group">
                  <label htmlFor="email" style={{ color: "#0d563f" }}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ background: "#faf8f5" }}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="phone" style={{ color: "#0d563f" }}>Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ background: "#faf8f5" }}
                  />
                </div>
              </div>

              <div className="contact-form-group" style={{ margin: "20px 0" }}>
                <label htmlFor="travelDate" style={{ color: "#0d563f" }}>Preferred Travel / Booking Date (Optional)</label>
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  style={{ background: "#faf8f5" }}
                />
              </div>

              <div className="contact-form-group full-width" style={{ marginBottom: "24px" }}>
                <label htmlFor="message" style={{ color: "#0d563f" }}>Inquiry Details *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Share any details like length of stay, guest count, or custom wellness requirements..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{ background: "#faf8f5", height: "130px" }}
                ></textarea>
              </div>

              {submitError && (
                <div
                  role="alert"
                  style={{
                    marginBottom: "16px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background: "rgba(220, 38, 38, 0.08)",
                    border: "1px solid rgba(220, 38, 38, 0.3)",
                    color: "#dc2626",
                    fontSize: "0.875rem",
                  }}
                >
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={isSubmitting}
                style={{ backgroundColor: "#0d563f", color: "#ffffff" }}
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <span>Submit Inquiry Request</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
