"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCardWithModal({ product, brandName, brandId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const resolvedBrandId =
    brandId ||
    product.brandId ||
    (String(brandName || product.brandName || "")
      .toLowerCase()
      .includes("environics")
      ? "environics"
      : "energetika369");

  const resolvedBrandName =
    brandName ||
    product.brandName ||
    (resolvedBrandId === "environics" ? "Environics" : "Energetika369");

  const detailHref =
    product.detailUrl || `/offerings/products/${resolvedBrandId}/${product.id}`;

  const enquiryDest =
    product.enquiryDestination || `${resolvedBrandName} - ${product.name}`;

  const enquiryHref = `/explore-offer?destination=${encodeURIComponent(enquiryDest)}`;

  const highlights =
    Array.isArray(product.highlights) && product.highlights.length > 0
      ? product.highlights.slice(0, 3)
      : Array.isArray(product.features)
        ? product.features
          .slice(0, 3)
          .map((f) => (typeof f === "object" ? f.title : f))
        : [];

  const galleryItems =
    Array.isArray(product.gallery) && product.gallery.length > 0
      ? product.gallery.map((g) =>
        typeof g === "string" ? { src: g, alt: product.name } : g
      )
      : [{ src: product.image, alt: product.name }];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const isEnvironics = resolvedBrandId === "environics";

  return (
    <>
      <article className="wlc-lux-card" id={product.anchorId || product.id}>
        {/* Image Header */}
        <div className="wlc-lux-card-media">
          <Link
            href={detailHref}
            className="wlc-lux-card-img-link"
            aria-label={`View full details for ${product.name}`}
          >
            <Image
              src={product.image}
              alt={`${product.name} — ${product.tagline || resolvedBrandName}`}
              fill
              className="wlc-lux-card-img"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          {/* Top Left Category Pill */}
          <div className="wlc-lux-card-badges">
            <span className="wlc-lux-badge-category">
              {product.category || resolvedBrandName}
            </span>
            {product.tag && (
              <span
                className={`wlc-lux-badge-tag ${isEnvironics ? "is-gold" : ""
                  }`}
              >
                {product.tag}
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <button
            type="button"
            className="wlc-lux-quickview-btn"
            onClick={() => {
              setActiveImgIndex(0);
              setIsModalOpen(true);
            }}
            aria-label={`Quick view ${product.name}`}
            title="Quick View Specifications"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Quick View</span>
          </button>
        </div>

        {/* Card Content Body */}
        <div className="wlc-lux-card-body">
          <div className="wlc-lux-card-brand-row">
            <span className="wlc-lux-card-brand">{resolvedBrandName}</span>
            {galleryItems.length > 1 && (
              <span className="wlc-lux-card-gallery-count">
                {galleryItems.length} Photos
              </span>
            )}
          </div>

          <h3 className="wlc-lux-card-title">
            <Link href={detailHref}>{product.name}</Link>
          </h3>

          {product.tagline && (
            <p className="wlc-lux-card-tagline">{product.tagline}</p>
          )}

          <p className="wlc-lux-card-desc">{product.shortDesc}</p>

          {/* 3 Important Product Highlights */}
          {highlights.length > 0 && (
            <ul className="wlc-lux-card-highlights" aria-label="Product highlights">
              {highlights.map((item, idx) => (
                <li key={idx}>
                  <span className="wlc-lux-check" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Card Footer Actions */}
          <div className="wlc-lux-card-footer">
            <Link href={detailHref} className="wlc-lux-btn-primary">
              <span>Explore Product</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link href={enquiryHref} className="wlc-lux-btn-secondary">
              {isEnvironics ? "Claim 50% OFF" : "Enquire"}
            </Link>
          </div>
        </div>
      </article>

      {/* Quick-View Modal */}
      {isModalOpen && (
        <div
          className="prod-modal-overlay"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${product.id}`}
        >
          <div
            className="prod-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="prod-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close Quick View"
            >
              ✕
            </button>

            <div className="prod-modal-grid">
              {/* Left Column: Interactive Gallery */}
              <div className="prod-modal-visual">
                <div className="prod-modal-img-wrapper">
                  <Image
                    src={galleryItems[activeImgIndex]?.src || product.image}
                    alt={galleryItems[activeImgIndex]?.alt || product.name}
                    fill
                    className="prod-modal-img"
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                  {product.tag && (
                    <span className="prod-modal-badge">{product.tag}</span>
                  )}
                </div>

                {galleryItems.length > 1 && (
                  <div className="prod-modal-thumbs">
                    {galleryItems.map((imgObj, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`prod-modal-thumb ${activeImgIndex === idx ? "active" : ""
                          }`}
                        onClick={() => setActiveImgIndex(idx)}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image
                          src={imgObj.src}
                          alt={imgObj.alt || `${product.name} view ${idx + 1}`}
                          fill
                          sizes="80px"
                          style={{ objectFit: "cover" }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {product.idealFor && product.idealFor.length > 0 && (
                  <div className="prod-modal-ideal-box">
                    <h4>Ideal Applications</h4>
                    <div className="prod-ideal-tags">
                      {product.idealFor.map((item, idx) => (
                        <span key={idx} className="prod-ideal-tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Detailed Info */}
              <div className="prod-modal-details">
                <span className="prod-modal-brand">
                  {resolvedBrandName} • {product.category}
                </span>
                <h2 id={`modal-title-${product.id}`} className="prod-modal-title">
                  {product.name}
                </h2>
                {product.tagline && (
                  <p className="prod-modal-tagline">{product.tagline}</p>
                )}

                <div className="prod-modal-section">
                  <h4>Product Overview</h4>
                  <p className="prod-modal-desc">
                    {product.overview || product.shortDesc}
                  </p>
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="prod-modal-section">
                    <h4>Key Features</h4>
                    <ul className="prod-modal-features">
                      {product.features.map((feat, idx) => (
                        <li key={idx}>
                          <span className="feat-icon">✦</span>
                          <div>
                            {typeof feat === "object" ? (
                              <>
                                <strong>{feat.title}:</strong> {feat.desc}
                              </>
                            ) : (
                              feat
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div className="prod-modal-section">
                    <h4>Technical Specifications</h4>
                    <div className="prod-specs-grid">
                      {Object.entries(product.specs).map(([key, val], idx) => (
                        <div key={idx} className="prod-spec-item">
                          <span className="spec-label">{key}</span>
                          <span className="spec-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="prod-modal-footer-actions">
                  <Link
                    href={detailHref}
                    className="prod-modal-cta-outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Open Full Product Page
                  </Link>
                  <Link
                    href={enquiryHref}
                    className="prod-modal-cta"
                    onClick={() => setIsModalOpen(false)}
                  >
                    {product.ctaText || `Enquire About ${product.name}`} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
