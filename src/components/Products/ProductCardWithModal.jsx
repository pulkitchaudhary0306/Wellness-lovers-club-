"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCardWithModal({ product, idx }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedModelIdx, setSelectedModelIdx] = useState(0);

  const hasModels = Array.isArray(product.models) && product.models.length > 0;
  const currentItem = hasModels ? product.models[selectedModelIdx] : product;

  const images = currentItem.gallery && currentItem.gallery.length > 0
    ? currentItem.gallery
    : [currentItem.image || product.image];

  const hasRichDetails = Boolean(
    currentItem.overview ||
    currentItem.description ||
    currentItem.whatsIncluded ||
    currentItem.specs ||
    currentItem.idealFor ||
    currentItem.trainingSupport ||
    hasModels ||
    (images && images.length > 1)
  );

  const handleModelChange = (modelIdx) => {
    setSelectedModelIdx(modelIdx);
    setActiveImageIndex(0);
  };

  const enquiryTitle = hasModels
    ? `${product.brand} - ${product.name} (${currentItem.shortName || currentItem.name})`
    : `${product.brand} - ${product.name}`;

  return (
    <>
      <div className={`product-card ${hasModels ? "product-card-has-models" : ""}`}>
        {/* ─── Product Image & Gallery Badge ─────────────────────────────── */}
        <div
          className="product-card-img-wrap"
          onClick={() => hasRichDetails && setIsOpen(true)}
          style={{ cursor: hasRichDetails ? "pointer" : "default" }}
        >
          <Image
            src={currentItem.image || product.image}
            alt={currentItem.name || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={idx === 0}
            loading={idx === 0 ? "eager" : "lazy"}
          />
          {images && images.length > 1 && (
            <span className="product-gallery-badge">
              📷 {images.length} Views
            </span>
          )}
          {hasModels && (
            <span className="product-series-badge">
              ⚡ 3 Models Series
            </span>
          )}
        </div>

        {/* ─── Product Card Body ────────────────────────────────────────── */}
        <div className="product-card-content">
          <div className="product-meta-row">
            <span className="product-tag">{currentItem.tag || product.tag}</span>
            <span className="product-brand-tag">{product.brand}</span>
          </div>

          <h4 className="product-title">{product.name}</h4>

          {/* Model Switcher Buttons if Product contains Models */}
          {hasModels && (
            <div className="product-card-model-pills" role="tablist" aria-label="Device models">
              {product.models.map((mod, mIdx) => (
                <button
                  key={mod.id || mIdx}
                  type="button"
                  className={`model-pill-btn ${selectedModelIdx === mIdx ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModelChange(mIdx);
                  }}
                  role="tab"
                  aria-selected={selectedModelIdx === mIdx}
                >
                  {mod.shortName || mod.name}
                </button>
              ))}
            </div>
          )}

          <p className="product-desc">
            {currentItem.shortDesc || currentItem.tagline || product.shortDesc}
          </p>

          {Array.isArray(currentItem.features) && currentItem.features.length > 0 && (
            <ul className="product-features-list">
              {currentItem.features.slice(0, 4).map((feature, fIdx) => (
                <li key={fIdx}>{feature}</li>
              ))}
            </ul>
          )}

          <div className="product-card-footer">
            {hasRichDetails && (
              <button
                type="button"
                className="product-details-btn"
                onClick={() => setIsOpen(true)}
                title={`View full specifications for ${currentItem.name || product.name}`}
              >
                View Full Details & Specs <span>🔍</span>
              </button>
            )}
            <Link
              href={`/explore-offer?destination=${encodeURIComponent(enquiryTitle)}`}
              className="product-enquiry-btn"
              title={`Enquire about ${currentItem.name || product.name}`}
            >
              Enquire Now <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Rich Product Details Modal ────────────────────────────────────── */}
      {isOpen && (
        <div className="product-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="product-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${product.id}`}
          >
            <button
              type="button"
              className="product-modal-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close details modal"
            >
              ✕
            </button>

            {/* Model Switcher Tabs inside Modal if Applicable */}
            {hasModels && (
              <div className="product-modal-model-tabs">
                <div className="model-tabs-header">
                  <span className="model-tabs-label">Available Models in Series:</span>
                </div>
                <div className="model-tabs-nav">
                  {product.models.map((mod, mIdx) => (
                    <button
                      key={mod.id || mIdx}
                      type="button"
                      className={`modal-model-tab ${selectedModelIdx === mIdx ? "active" : ""}`}
                      onClick={() => handleModelChange(mIdx)}
                    >
                      <span className="tab-tier-num">0{mIdx + 1}</span>
                      <span className="tab-tier-info">
                        <strong>{mod.name.split("–")[0].trim()}</strong>
                        <small>{mod.tier || "System"}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-modal-grid">
              {/* Left Column: Interactive Image Gallery */}
              <div className="product-modal-media-col">
                <div className="product-modal-main-image-wrap">
                  <Image
                    src={images[activeImageIndex] || currentItem.image || product.image}
                    alt={`${currentItem.name || product.name} - View ${activeImageIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>

                {images.length > 1 && (
                  <div className="product-modal-thumbs-row">
                    {images.map((img, thumbIdx) => (
                      <button
                        key={thumbIdx}
                        type="button"
                        className={`product-modal-thumb-btn ${thumbIdx === activeImageIndex ? "active" : ""}`}
                        onClick={() => setActiveImageIndex(thumbIdx)}
                        aria-label={`View photo ${thumbIdx + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${currentItem.name || product.name} thumbnail ${thumbIdx + 1}`}
                          fill
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Detailed Specifications & Content */}
              <div className="product-modal-info-col">
                <div className="product-modal-header">
                  <div className="product-meta-row">
                    <span className="product-tag">{currentItem.tag || product.tag}</span>
                    <span className="product-brand-tag">{product.brand}</span>
                  </div>
                  <h3 id={`modal-title-${product.id}`} className="product-modal-title">
                    {currentItem.name || product.name}
                  </h3>
                  {currentItem.tagline && (
                    <p className="product-modal-tagline">{currentItem.tagline}</p>
                  )}
                </div>

                {/* Long Overview / Description */}
                {(currentItem.overview || currentItem.description) && (
                  <div className="product-modal-section">
                    <h5 className="product-modal-section-title">📖 Overview</h5>
                    <p className="product-modal-overview" style={{ whiteSpace: "pre-line" }}>
                      {currentItem.overview || currentItem.description}
                    </p>
                  </div>
                )}

                {/* Core Features */}
                {Array.isArray(currentItem.features) && currentItem.features.length > 0 && (
                  <div className="product-modal-section">
                    <h5 className="product-modal-section-title">⚙️ Core Features</h5>
                    <ul className="product-features-list modal-features">
                      {currentItem.features.map((feat, fIdx) => (
                        <li key={fIdx}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What's Included */}
                {Array.isArray(currentItem.whatsIncluded) && currentItem.whatsIncluded.length > 0 && (
                  <div className="product-modal-section">
                    <h5 className="product-modal-section-title">📦 What’s Included</h5>
                    <ul className="product-modal-bullets">
                      {currentItem.whatsIncluded.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ideal For */}
                {Array.isArray(currentItem.idealFor) && currentItem.idealFor.length > 0 && (
                  <div className="product-modal-section">
                    <h5 className="product-modal-section-title">💡 Ideal For</h5>
                    <ul className="product-modal-bullets">
                      {currentItem.idealFor.map((target, tIdx) => (
                        <li key={tIdx}>{target}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Specifications Table */}
                {currentItem.specs && typeof currentItem.specs === "object" && (
                  <div className="product-modal-section">
                    <h5 className="product-modal-section-title">🔧 Technical Specifications</h5>
                    <div className="product-modal-specs-table">
                      {Object.entries(currentItem.specs).map(([key, value]) => {
                        const formattedKey = key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase());
                        return (
                          <div className="spec-row" key={key}>
                            <span className="spec-label">{formattedKey}</span>
                            <span className="spec-val">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Training & Support */}
                {Array.isArray(currentItem.trainingSupport) && currentItem.trainingSupport.length > 0 && (
                  <div className="product-modal-section">
                    <h5 className="product-modal-section-title">🎓 Training & Support</h5>
                    <ul className="product-modal-bullets">
                      {currentItem.trainingSupport.map((supp, sIdx) => (
                        <li key={sIdx}>{supp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="product-modal-action-bar">
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent(enquiryTitle)}`}
                    className="product-enquiry-btn modal-enquiry-btn"
                    title={`Enquire about ${currentItem.name || product.name}`}
                  >
                    Enquire for Exclusive Member Privileges <span>→</span>
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
