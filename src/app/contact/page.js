"use client";

import { useState } from "react";
import Link from "next/link";
import { wpPost } from "@/lib/wpFetch";
import "./contact.css";

/**
 * Submits the contact form to WordPress custom REST API endpoint.
 *
 * Endpoint: /wp-json/custom/v1/contact
 * Body:     JSON
 */
async function submitContactToWordPress(data) {
  const json = await wpPost(
    "/wp-json/custom/v1/contact",
    {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: "Website Contact Inquiry",
      message: data.message,
      website: "", // Honeypot field - must stay empty
    },
    { unauthenticated: true }
  );

  return json;
}

export default function ContactPage() {
  const [formData, setFormData] = useState(() => {
    let initialMsg = "";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const dest = params.get("destination");
      if (dest) {
        initialMsg = `I am interested in exploring the offer for: ${dest}.`;
      }
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: initialMsg,
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitContactToWordPress(formData);
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Background Ambience */}
      <div className="contact-glow-1" />
      <div className="contact-glow-2" />

      {/* Header Banner */}
      <section className="contact-header">
        <span className="contact-badge">DIRECT CONCIERGE</span>
        <h1 className="contact-title">Connect with Us</h1>
        <p className="contact-subtitle">
          Whether you seek private retreats, exclusive partner inclusions, or personalized assistance,
          our dedicated concierge team is at your service.
        </p>
      </section>

      {/* Main Content Grid */}
      <div className="contact-container">
        {/* Left Column: Contact Details */}
        <div className="contact-info">
          <div>
            <h2 className="contact-info-title">Get In Touch</h2>
            <p className="contact-info-subtitle">
              Have questions about our exclusive wellness retreats, spa rituals, or membership benefits? 
              Reach out to us and we&apos;ll get back to you shortly.
            </p>
          </div>

          {/* Address Card */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="contact-card-content">
              <h3>Address</h3>
              <p>324 Star Tower, 3rd Floor, Sector 30, Gurgaon, Haryana, 122002</p>
            </div>
          </div>

          {/* Email Card */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="contact-card-content">
              <h3>Email</h3>
              <p>
                <a href="mailto:wellnessloversclub@gmail.com">wellnessloversclub@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Phone Card */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="contact-card-content">
              <h3>Phone</h3>
              <p>
                <a href="tel:+919289330103">+91 92893 30103</a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="contact-form-wrapper">
          {isSubmitted ? (
            <div className="contact-success-box">
              <h3>Thank You!</h3>
              <p>
                Your message has been sent successfully. One of our wellness consultants will reach out to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2>Send a Message</h2>
              <div className="contact-form-grid">
                <div className="contact-form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="contact-form-group" style={{ marginBottom: "20px" }}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form-group" style={{ marginBottom: "20px" }}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form-group full-width" style={{ marginBottom: "24px" }}>
                <label htmlFor="message">Message / Inquiry (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your wellness requirements..."
                  value={formData.message}
                  onChange={handleChange}
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
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
