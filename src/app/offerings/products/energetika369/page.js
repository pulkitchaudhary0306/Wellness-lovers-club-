import React from "react";
import Image from "next/image";
import Link from "next/link";
import "../../wellness-retreats/retreats.css";
import "../../offerings.css";
import "../products.css";
import "./energetika369.css";
import ProductCategoryTabs from "@/components/Products/ProductCategoryTabs";
import Energetika369View from "@/components/Products/Energetika369View";
import { PRODUCTS_DATA } from "@/data/productsData";

export const metadata = {
  title:
    "Energetika369 — PEMF Mat, HEXA SENSE AI, Hexa Flow NLS, NeuroPulse rTMS & Bio-Frequency Systems | Wellness Lovers Club",
  description:
    "Explore the complete Energetika369 wellness technology suite: Beyond PEMF Wellness Mat, HEXA SENSE AI (59 Reports), Hexa Flow Frequency Devices (Hexa Pulse, Hexa Sync, Hexa Lux), NeuroPulse rTMS, Diji-Wave 369, Rife Frequency Pro, DermaVision369, Aligné 369, and Lumicare.",
  keywords: [
    "Energetika369",
    "Beyond PEMF Wellness Mat",
    "HEXA SENSE AI",
    "Hexa Pulse",
    "Hexa Sync",
    "Hexa Lux",
    "Hexa Flow Frequency Devices",
    "NeuroPulse rTMS",
    "Diji-Wave 369",
    "Rife Frequency Pro",
    "DermaVision369",
    "Aligne 369",
    "Lumicare",
    "Wellness Lovers Club"
  ],
  alternates: {
    canonical: "https://www.wellnessloversclub.com/offerings/products/energetika369"
  },
  openGraph: {
    title:
      "Energetika369 Quantum Wellness & Bio-Frequency Systems | Wellness Lovers Club",
    description:
      "Discover Energetika369's complete range of PEMF, AI spectral diagnostics, NLS bioresonance, rTMS neuromodulation, and millimeter-wave systems.",
    url: "https://www.wellnessloversclub.com/offerings/products/energetika369",
    siteName: "Wellness Lovers Club",
    images: [
      {
        url: "/images/products/pemf-mat-session.webp",
        width: 1200,
        height: 630,
        alt: "Energetika369 Wellness Technology Collection"
      }
    ],
    type: "website"
  }
};

export default function EnergetikaPage() {
  const brandData = PRODUCTS_DATA.find((b) => b.id === "energetika369");
  if (!brandData) return null;

  const brandName = brandData.brand || brandData.name || "Energetika369";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brandName,
    url: brandData.website,
    description: brandData.description,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Energetika369 Bio-Frequency Products",
      itemListElement: brandData.products.map((prod, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: prod.name,
          description: prod.shortDesc,
          image: `https://www.wellnessloversclub.com${prod.image}`,
          category: prod.category,
          url: `https://www.wellnessloversclub.com/offerings/products/energetika369/${prod.id}`,
          brand: {
            "@type": "Brand",
            name: brandName
          }
        },
        position: index + 1
      }))
    }
  };

  return (
    <article className="offerings-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── Hero Banner: Two-Column Responsive Layout ─────────────────────── */}
      <section
        className="offerings-hero energetika-hero"
        aria-label="Energetika369 Hero"
      >
        <div className="offerings-hero-container energetika-hero-container">
          <div className="energetika-hero-content">
            <span className="offerings-hero-eyebrow">
              ADVANCED WELLNESS TECHNOLOGY
            </span>
            <h1 className="offerings-hero-title">{brandName}</h1>
            <p className="offerings-hero-desc">{brandData.description}</p>

            <div className="energetika-hero-actions">
              <a
                href="#energetika369-catalog"
                className="hero-cta-btn-gold"
                title="Explore the Energetika369 product collection"
              >
                Explore Products <span>↓</span>
              </a>
              <Link
                href="/explore-offer?destination=Energetika369%20Concierge"
                className="hero-cta-btn-outline"
                title="Request a quote for Energetika369 systems"
              >
                Request a Quote <span>→</span>
              </Link>
            </div>
          </div>

          <div className="energetika-hero-visual">
            <div className="energetika-hero-img-wrap">
              <Image
                src="/images/products/pemf-mat-session.webp"
                alt="Energetika369 Bio-Frequency Innovation Suite"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 520px"
              />
              <span className="hero-floating-badge">
                ✦ 11 Bio-Frequency Systems
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Section ────────────────────────────────────────── */}
      <section
        className="offerings-main-section"
        aria-label="Energetika369 Products"
      >
        <div className="offerings-section-header">
          <span className="eyebrow">PRODUCTS &amp; TECHNOLOGIES</span>
          <h2 className="offerings-section-title">
            Harmonizing Mind, Body &amp; Cellular Vitality
          </h2>
          <p>
            As a verified Wellness Lovers Club member, access preferred
            consultations, concierge allocations, and exclusive privileges
            across our trusted wellness technology partners.
          </p>
        </div>

        {/* ─── Category Selection Tabs ────────────────────────────────────── */}
        <ProductCategoryTabs activeCategory="energetika369" />

        {/* ─── Brand Header Card ─────────────────────────────────────────── */}
        <div className="products-brand-section">
          <div className="brand-header-card">
            <div className="brand-header-info">
              <span className="brand-tagline">{brandData.tagline}</span>
              <h3 className="brand-name">{brandName} Innovation Suite</h3>
              <p className="brand-desc">{brandData.description}</p>
            </div>
            <div className="brand-header-actions">
              {brandData.website && (
                <a
                  href={brandData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-website-btn"
                  title={`Visit official ${brandName} website`}
                >
                  Official Website <span>↗</span>
                </a>
              )}
              <div className="brand-badge-pill gold">
                <span>⚡</span> Exclusive WLC Member Privileges
              </div>
            </div>
          </div>

          {/* ─── Complete Energetika369 Interactive Showcase ─────────────── */}
          <Energetika369View brand={brandData} />
        </div>

        {/* ─── Bottom Navigation Actions ─────────────────────────────────── */}
        <div className="offerings-nav-buttons">
          <Link href="/offerings/products" className="btn btn-green">
            ← All Product Categories
          </Link>
          <Link href="/offerings/products/environics" className="btn btn-green">
            Environics Products →
          </Link>
          <Link href="/membership" className="btn btn-gold">
            Apply For Membership
          </Link>
        </div>
      </section>
    </article>
  );
}
