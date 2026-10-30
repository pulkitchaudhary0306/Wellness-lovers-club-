"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { wpPost } from "@/lib/wpFetch";
import ProductCardWithModal from "./ProductCardWithModal";

export default function ProductDetailClient({
  product,
  brand,
  relatedProducts = []
}) {
  const galleryItems =
    Array.isArray(product.gallery) && product.gallery.length > 0
      ? product.gallery.map((g) =>
          typeof g === "string"
            ? { src: g, alt: product.name, caption: product.name }
            : g
        )
      : [{ src: product.image, alt: product.name, caption: product.name }];

  const [activeHeroImg, setActiveHeroImg] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [openReportGroup, setOpenReportGroup] = useState(0);

  const brandDisplayName = brand.brand || brand.name || "Energetika369";
  const isEnvironics = brand.id === "environics";

  // Inline Enquiry Form state (connected to existing WordPress /wp-json/custom/v1/contact endpoint via wpFetch)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    enquiryType: "Personal / Home Use",
    message: isEnvironics
      ? `I would like to claim my 50% OFF Wellness Lovers Club member privilege for ${product.name} (${brandDisplayName}).`
      : `I am interested in learning more about ${product.name} (${brandDisplayName}), including pricing, availability, and consultation options.`
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const enquiryHref = `/explore-offer?destination=${encodeURIComponent(
    product.enquiryDestination || `${brandDisplayName} - ${product.name}`
  )}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim()) return;
    setSubmitting(true);
    setSubmitStatus(null);
    setSubmitError("");

    const nameParts = formState.name.trim().split(/\s+/);
    const firstName = nameParts[0] || formState.name.trim();
    const lastName = nameParts.slice(1).join(" ") || "-";

    try {
      await wpPost(
        "/wp-json/custom/v1/contact",
        {
          first_name: firstName,
          last_name: lastName,
          email: formState.email.trim(),
          phone: formState.phone.trim(),
          subject: `Exclusive Privileges Claim - ${brandDisplayName} - ${product.name}`,
          message: `Product: ${product.name} (${brandDisplayName})\nCategory: ${
            product.category
          }\nIntended Application: ${formState.enquiryType}\nCity/Location: ${
            formState.city || "Not Specified"
          }\n\nGuest Message: ${formState.message || "N/A"}${
            brand.website ? `\nPartner Website: ${brand.website}` : ""
          }`,
          website: "" // Honeypot field - must stay empty
        },
        { unauthenticated: true }
      );

      setSubmitStatus({
        type: "success",
        text: `Thank you! Your enquiry for ${product.name} has been received by the Wellness Lovers Club concierge team. We will contact you shortly.`
      });
    } catch (err) {
      setSubmitError(
        err?.message ||
          "Unable to submit right now. Please try again or use the Concierge Portal button."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pdp-wrapper">
      {/* Breadcrumb Navigation */}
      <div className="pdp-breadcrumb-bar">
        <div className="pdp-container">
          <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="pdp-bc-sep">/</span>
            <Link href="/offerings">Offerings</Link>
            <span className="pdp-bc-sep">/</span>
            <Link href="/offerings/products">Products</Link>
            <span className="pdp-bc-sep">/</span>
            <Link href={`/offerings/products/${brand.id}`}>
              {brandDisplayName}
            </Link>
            <span className="pdp-bc-sep">/</span>
            <span className="pdp-bc-current" aria-current="page">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ==================================================================
          SECTION 1 – PRODUCT HERO
          ================================================================== */}
      <section className="pdp-hero-section">
        <div className="pdp-container">
          <div className="pdp-hero-grid">
            {/* Left: Authentic Product Image & Thumbnail Switcher */}
            <div className="pdp-hero-visual">
              <div
                className="pdp-main-img-stage"
                onClick={() => setLightboxIndex(activeHeroImg)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setLightboxIndex(activeHeroImg);
                }}
                aria-label="Click to enlarge product image"
              >
                <Image
                  src={galleryItems[activeHeroImg]?.src || product.image}
                  alt={galleryItems[activeHeroImg]?.alt || product.name}
                  fill
                  priority
                  className="pdp-main-img"
                  sizes="(max-width: 992px) 100vw, 55vw"
                />
                <div className="pdp-stage-top-badges">
                  <span className="pdp-badge-brand">{brandDisplayName}</span>
                  {(product.memberPrivilege || product.tag) && (
                    <span
                      className={`pdp-badge-tag ${
                        isEnvironics ? "is-gold" : ""
                      }`}
                    >
                      {isEnvironics
                        ? product.memberPrivilege || product.tag
                        : product.tag}
                    </span>
                  )}
                </div>
                <span className="pdp-zoom-hint">
                  Click to enlarge ({activeHeroImg + 1}/{galleryItems.length})
                </span>
              </div>

              {galleryItems[activeHeroImg]?.caption && (
                <p className="pdp-active-caption">
                  {galleryItems[activeHeroImg].caption}
                </p>
              )}

              {galleryItems.length > 1 && (
                <div
                  className="pdp-hero-thumbs"
                  role="tablist"
                  aria-label="Product gallery thumbnails"
                >
                  {galleryItems.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={activeHeroImg === idx}
                      className={`pdp-thumb-btn ${
                        activeHeroImg === idx ? "active" : ""
                      }`}
                      onClick={() => setActiveHeroImg(idx)}
                      aria-label={img.caption || `View ${idx + 1}`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt || `${product.name} thumbnail ${idx + 1}`}
                        fill
                        sizes="96px"
                        style={{ objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Identity, Tagline, Short Desc, Highlights & Enquiry CTA */}
            <div className="pdp-hero-info">
              <div className="pdp-meta-row">
                <span className="pdp-category-pill">{product.category}</span>
                {product.group && (
                  <span className="pdp-group-pill">{product.group}</span>
                )}
              </div>

              <h1 className="pdp-title">{product.name}</h1>

              {product.tagline && (
                <p className="pdp-tagline">{product.tagline}</p>
              )}

              {isEnvironics && (
                <div className="pdp-member-privilege-banner">
                  <span className="pdp-privilege-badge">WLC MEMBER OFFER</span>
                  <p>
                    Exclusive <strong>50% OFF</strong> privilege for verified
                    Wellness Lovers Club members.
                  </p>
                </div>
              )}

              <p className="pdp-short-desc">{product.shortDesc}</p>

              {/* 3 Key Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="pdp-hero-highlights">
                  <h2 className="pdp-sub-eyebrow">KEY HIGHLIGHTS</h2>
                  <ul>
                    {product.highlights.map((hl, idx) => (
                      <li key={idx}>
                        <span className="pdp-hl-icon" aria-hidden="true">
                          ✦
                        </span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Primary & Secondary CTAs */}
              <div className="pdp-hero-actions">
                <Link href={enquiryHref} className="pdp-cta-primary">
                  <span>
                    {product.ctaText || `Enquire About ${product.name}`}
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
                <a href="#product-enquiry-section" className="pdp-cta-secondary">
                  Request Specialist Callback
                </a>
              </div>

              {/* Trust & Assurance Strip */}
              <div className="pdp-trust-strip">
                <div className="pdp-trust-item">
                  <strong>100% Authentic</strong>
                  <span>Official {brandDisplayName} Partner</span>
                </div>
                <div className="pdp-trust-item">
                  <strong>Specialist Guidance</strong>
                  <span>1-on-1 Consultation &amp; Setup</span>
                </div>
                <div className="pdp-trust-item">
                  <strong>WLC Privilege</strong>
                  <span>
                    {isEnvironics
                      ? "50% OFF Member Discount"
                      : "Priority Member Access"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 2 – PRODUCT OVERVIEW & INTENDED APPLICATIONS
          ================================================================== */}
      <section className="pdp-section pdp-overview-section">
        <div className="pdp-container">
          <div className="pdp-overview-grid">
            <div className="pdp-overview-main">
              <span className="pdp-section-eyebrow">01 • PRODUCT OVERVIEW</span>
              <h2 className="pdp-section-title">
                Architecture, Purpose &amp; Wellness Philosophy
              </h2>
              <p className="pdp-overview-lead">{product.overview}</p>

              {product.purpose && (
                <div className="pdp-purpose-callout">
                  <h3>Core Purpose</h3>
                  <p>{product.purpose}</p>
                </div>
              )}

              {product.usageSummary && (
                <div className="pdp-usage-box">
                  <h3>How It Is Used</h3>
                  <p>{product.usageSummary}</p>
                </div>
              )}
            </div>

            {/* Intended Applications Sidebar */}
            <aside className="pdp-applications-card">
              <span className="pdp-sub-eyebrow">INTENDED APPLICATIONS</span>
              <h3>Ideal For</h3>
              {product.idealFor && product.idealFor.length > 0 && (
                <ul className="pdp-ideal-list">
                  {product.idealFor.map((app, idx) => (
                    <li key={idx}>
                      <span className="pdp-ideal-bullet">✓</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              )}

              {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                <div className="pdp-included-mini">
                  <h4>Standard Configuration Includes</h4>
                  <ul>
                    {product.whatsIncluded.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 3 – KEY FEATURES & TECHNICAL CAPABILITIES
          ================================================================== */}
      <section className="pdp-section pdp-features-section">
        <div className="pdp-container">
          <div className="pdp-section-header">
            <span className="pdp-section-eyebrow">02 • KEY FEATURES</span>
            <h2 className="pdp-section-title">
              Core Engineering &amp; Functional Highlights
            </h2>
            <p className="pdp-section-subtitle">
              Built with authentic components and non-invasive wellness
              protocols for reliable daily performance.
            </p>
          </div>

          <div className="pdp-features-grid">
            {(product.features || []).map((feat, idx) => {
              const title =
                typeof feat === "object"
                  ? feat.title
                  : `Key Highlight 0${idx + 1}`;
              const desc = typeof feat === "object" ? feat.desc : feat;
              return (
                <div key={idx} className="pdp-feature-card">
                  <div className="pdp-feature-num">0{idx + 1}</div>
                  <h3 className="pdp-feature-title">{title}</h3>
                  <p className="pdp-feature-desc">{desc}</p>
                </div>
              );
            })}
          </div>

          {/* Optional 4-Step Pipeline & 59 Reports Explorer for HEXA SENSE AI */}
          {product.howItWorksSteps && (
            <div className="pdp-pipeline-block">
              <h3 className="pdp-sub-heading">
                4-Stage Spectral Assessment Pipeline
              </h3>
              <div className="pdp-steps-grid">
                {product.howItWorksSteps.map((st, idx) => (
                  <div key={idx} className="pdp-step-card">
                    <span className="pdp-step-num">STEP {st.step}</span>
                    <h4>{st.title}</h4>
                    <p>{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.reportCategories && (
            <div className="pdp-reports-explorer">
              <div className="pdp-reports-header">
                <h3>Complete 59 Wellness Report Portfolio</h3>
                <p>
                  Explore all 59 functional, nutritional, meridian, and
                  pediatric report parameters generated during a 60-second scan.
                </p>
              </div>
              <div className="pdp-reports-tabs">
                {product.reportCategories.map((groupObj, idx) => (
                  <div
                    key={idx}
                    className={`pdp-report-group ${
                      openReportGroup === idx ? "open" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="pdp-report-group-btn"
                      onClick={() =>
                        setOpenReportGroup(openReportGroup === idx ? -1 : idx)
                      }
                    >
                      <span>{groupObj.group}</span>
                      <span>{openReportGroup === idx ? "−" : "+"}</span>
                    </button>
                    {openReportGroup === idx && (
                      <div className="pdp-report-items-grid">
                        {groupObj.items.map((item, i) => (
                          <div key={i} className="pdp-report-pill">
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================================
          SECTION 4 – PRODUCT BENEFITS
          ================================================================== */}
      <section className="pdp-section pdp-benefits-section">
        <div className="pdp-container">
          <div className="pdp-benefits-layout">
            <div className="pdp-benefits-intro">
              <span className="pdp-section-eyebrow">03 • CUSTOMER BENEFITS</span>
              <h2 className="pdp-section-title">
                How {product.name} Elevates Your Daily Wellness
              </h2>
              <p>
                Designed around practical, real-world outcomes—supporting
                balance, comfort, and resilience for individuals, families, and
                professional wellness spaces.
              </p>
              <Link href={enquiryHref} className="pdp-cta-primary">
                <span>Speak With a Product Specialist</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="pdp-benefits-list">
              {(product.benefits || []).map((benefit, idx) => (
                <div key={idx} className="pdp-benefit-item">
                  <div className="pdp-benefit-check" aria-hidden="true">
                    ✓
                  </div>
                  <div className="pdp-benefit-text">
                    <p>{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 5 – AUTHENTIC IMAGE GALLERY
          ================================================================== */}
      <section className="pdp-section pdp-gallery-section">
        <div className="pdp-container">
          <div className="pdp-section-header">
            <span className="pdp-section-eyebrow">04 • VISUAL SHOWCASE</span>
            <h2 className="pdp-section-title">
              Authentic Product Photography &amp; Studio Views
            </h2>
            <p className="pdp-section-subtitle">
              Inspect hardware craftsmanship, included applicators, and clinical
              or home studio configurations. Click any photograph to view full
              screen.
            </p>
          </div>

          <div className="pdp-gallery-grid">
            {galleryItems.map((img, idx) => (
              <figure
                key={idx}
                className="pdp-gallery-card"
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setLightboxIndex(idx);
                }}
              >
                <div className="pdp-gallery-img-wrap">
                  <Image
                    src={img.src}
                    alt={img.alt || `${product.name} view ${idx + 1}`}
                    fill
                    className="pdp-gallery-img"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {img.caption && (
                  <figcaption className="pdp-gallery-caption">
                    <span>0{idx + 1}</span>
                    <p>{img.caption}</p>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 6 – TECHNICAL SPECIFICATIONS & SAFETY
          ================================================================== */}
      <section className="pdp-section pdp-specs-section">
        <div className="pdp-container">
          <div className="pdp-section-header">
            <span className="pdp-section-eyebrow">
              05 • TECHNICAL SPECIFICATIONS
            </span>
            <h2 className="pdp-section-title">
              Verified Specifications &amp; Package Configuration
            </h2>
          </div>

          <div className="pdp-specs-layout">
            <div className="pdp-specs-table-wrap">
              <table className="pdp-specs-table">
                <tbody>
                  {Object.entries(product.specs || {}).map(
                    ([label, value], idx) => (
                      <tr key={idx}>
                        <th scope="row">{label}</th>
                        <td>{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="pdp-specs-side">
              {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                <div className="pdp-box-card">
                  <h3>What&apos;s Included in the Box</h3>
                  <ul className="pdp-box-list">
                    {product.whatsIncluded.map((item, idx) => (
                      <li key={idx}>
                        <span aria-hidden="true">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.safetyInfo && (
                <div className="pdp-safety-card">
                  <h4>Wellness &amp; Safety Advisory</h4>
                  <p>{product.safetyInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 7 – PRODUCT ENQUIRY & CONCIERGE INTEGRATION
          ================================================================== */}
      <section
        className="pdp-section pdp-enquiry-section"
        id="product-enquiry-section"
      >
        <div className="pdp-container">
          <div className="pdp-enquiry-grid">
            <div className="pdp-enquiry-copy">
              <span className="pdp-section-eyebrow">
                06 • DIRECT PRODUCT ENQUIRY
              </span>
              <h2 className="pdp-section-title">
                Enquire About {product.name}
              </h2>
              <p className="pdp-enquiry-desc">
                {isEnvironics
                  ? "Submit your details below or proceed to our Member Concierge Desk to claim your exclusive 50% OFF Wellness Lovers Club privilege on authentic Environics solutions."
                  : "Connect with our Wellness Technology Specialists for personalized guidance, private demonstrations, clinic packages, and member pricing."}
              </p>

              <div className="pdp-concierge-highlights">
                <div className="pdp-ch-item">
                  <strong>Direct Partner Fulfilment</strong>
                  <span>
                    Guaranteed authentic {brandDisplayName} equipment &amp;
                    warranty support.
                  </span>
                </div>
                <div className="pdp-ch-item">
                  <strong>Practitioner &amp; Home Onboarding</strong>
                  <span>
                    Includes product walkthrough and session protocol guidance.
                  </span>
                </div>
                <div className="pdp-ch-item">
                  <strong>Official WLC Concierge</strong>
                  <span>
                    <a
                      href="tel:+919289330103"
                      style={{ color: "#bca374", textDecoration: "none", fontWeight: 700 }}
                    >
                      +91 92893 30103
                    </a>
                  </span>
                </div>
              </div>

              <div className="pdp-direct-desk-box">
                <p>Prefer our full Member Offer &amp; Concierge Portal?</p>
                <Link href={enquiryHref} className="pdp-cta-outline-light">
                  Open {brandDisplayName} Offer Desk →
                </Link>
              </div>
            </div>

            {/* Embedded Enquiry Form (Preserves WordPress /wp-json/custom/v1/contact integration via wpFetch) */}
            <div className="pdp-enquiry-form-card">
              <h3>Send a Direct Enquiry</h3>
              <p className="pdp-form-sub">
                Selected Product: <strong>{product.name}</strong> (
                {brandDisplayName})
              </p>

              {submitStatus ? (
                <div className="pdp-form-success">
                  <div className="pdp-success-icon">✓</div>
                  <h4>Enquiry Received</h4>
                  <p>{submitStatus.text}</p>
                  <div className="pdp-success-actions">
                    <button
                      type="button"
                      className="pdp-cta-secondary"
                      onClick={() => setSubmitStatus(null)}
                    >
                      Send Another Enquiry
                    </button>
                    <Link href={enquiryHref} className="pdp-cta-primary">
                      Visit Concierge Portal →
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="pdp-form">
                  {submitError && (
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "#fef2f2",
                        color: "#991b1b",
                        fontSize: "12.5px"
                      }}
                    >
                      {submitError}
                    </div>
                  )}

                  <div className="pdp-form-row">
                    <div className="pdp-field">
                      <label htmlFor="pdp-name">Full Name *</label>
                      <input
                        id="pdp-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formState.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="pdp-field">
                      <label htmlFor="pdp-email">Email Address *</label>
                      <input
                        id="pdp-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formState.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="pdp-form-row">
                    <div className="pdp-field">
                      <label htmlFor="pdp-phone">Phone / WhatsApp *</label>
                      <input
                        id="pdp-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formState.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="pdp-field">
                      <label htmlFor="pdp-city">City / Country</label>
                      <input
                        id="pdp-city"
                        name="city"
                        type="text"
                        placeholder="e.g., New Delhi, Mumbai, Dubai"
                        value={formState.city}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="pdp-field">
                    <label htmlFor="pdp-type">Intended Application</label>
                    <select
                      id="pdp-type"
                      name="enquiryType"
                      value={formState.enquiryType}
                      onChange={handleInputChange}
                    >
                      <option value="Personal / Home Use">
                        Personal / Family Home Sanctuary
                      </option>
                      <option value="Wellness Clinic / Studio">
                        Wellness Clinic / Holistic Practice / Spa
                      </option>
                      <option value="Corporate / Workspace">
                        Corporate Office / Workspace Protection
                      </option>
                      <option value="Product Demonstration">
                        Request Live Product Demonstration
                      </option>
                    </select>
                  </div>

                  <div className="pdp-field">
                    <label htmlFor="pdp-message">Your Message / Questions</label>
                    <textarea
                      id="pdp-message"
                      name="message"
                      rows={3}
                      value={formState.message}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="pdp-submit-btn"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting Enquiry..."
                      : product.ctaText || `Submit Enquiry for ${product.name}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          RELATED PRODUCTS SECTION
          ================================================================== */}
      {relatedProducts.length > 0 && (
        <section className="pdp-section pdp-related-section">
          <div className="pdp-container">
            <div className="pdp-related-header">
              <div>
                <span className="pdp-section-eyebrow">
                  COMPLEMENTARY SOLUTIONS
                </span>
                <h2 className="pdp-section-title">
                  Explore Related Wellness Products
                </h2>
              </div>
              <Link
                href={`/offerings/products/${brand.id}`}
                className="pdp-view-all-link"
              >
                View All {brandDisplayName} Products →
              </Link>
            </div>

            <div className="wlc-lux-grid">
              {relatedProducts.map((relProd) => (
                <ProductCardWithModal
                  key={relProd.id}
                  product={relProd}
                  brandName={relProd.brandName}
                  brandId={relProd.brandId}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="pdp-lightbox"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
        >
          <button
            type="button"
            className="pdp-lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image viewer"
          >
            ✕
          </button>
          <div
            className="pdp-lightbox-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pdp-lightbox-img-box">
              <Image
                src={galleryItems[lightboxIndex]?.src || product.image}
                alt={galleryItems[lightboxIndex]?.alt || product.name}
                fill
                sizes="95vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="pdp-lightbox-bar">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + galleryItems.length) %
                      galleryItems.length
                  )
                }
                aria-label="Previous image"
              >
                ← Prev
              </button>
              <span>
                {galleryItems[lightboxIndex]?.caption || product.name} (
                {lightboxIndex + 1} / {galleryItems.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % galleryItems.length)
                }
                aria-label="Next image"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
