import React from "react";
import Link from "next/link";
import "../../wellness-retreats/retreats.css";
import "../../offerings.css";
import "../products.css";
import ProductCategoryTabs from "@/components/Products/ProductCategoryTabs";
import ProductCardWithModal from "@/components/Products/ProductCardWithModal";
import { PRODUCTS_DATA } from "@/data/productsData";

export const metadata = {
  title:
    "Environics | Create a Healthier Environment — 50% OFF for WLC Members | Wellness Lovers Club",
  description:
    "Create a healthier, safer, and more balanced environment with science-backed environmental and electromagnetic solutions from Environics. Enjoy 50% OFF for WLC members across Envirochips, Enviroglobe, Envirocare, and Enviromat.",
  keywords: [
    "Environics",
    "Envirochips",
    "Enviroglobe",
    "Envirocare",
    "Enviromat",
    "EMR Protection",
    "Radiation Protection",
    "Wellness Lovers Club 50% OFF"
  ],
  alternates: {
    canonical: "https://www.wellnessloversclub.com/offerings/products/environics"
  },
  openGraph: {
    title:
      "Environics Radiation Protection — Exclusive 50% OFF for WLC Members | Wellness Lovers Club",
    description:
      "Create a healthier, safer, and more balanced environment with science-backed environmental and electromagnetic solutions from Environics at 50% OFF for WLC Members.",
    url: "https://www.wellnessloversclub.com/offerings/products/environics",
    siteName: "Wellness Lovers Club",
    images: [
      {
        url: "/images/products/environics-main-cover.webp",
        width: 1200,
        height: 630,
        alt: "Environics Radiation Protection Suite"
      }
    ],
    type: "website"
  }
};

export default function EnvironicsPage() {
  const brand = PRODUCTS_DATA.find((b) => b.id === "environics");
  if (!brand) return null;

  const brandName = brand.brand || brand.name || "Environics";

  return (
    <article className="offerings-page">
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="offerings-hero" aria-label="Environics Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">
            ENVIRONMENTAL &amp; ELECTROMAGNETIC WELLNESS
          </span>
          <h1 className="offerings-hero-title">{brandName}</h1>
          <p className="offerings-hero-desc">
            Science-backed radiation management solutions and environmental
            health systems engineered to neutralize electro-smog and support
            restorative spaces.
          </p>
        </div>
      </section>

      {/* ─── Main Content Section ────────────────────────────────────────── */}
      <section
        className="offerings-main-section"
        aria-label="Environics Collection"
      >
        <div className="offerings-section-header">
          <span className="eyebrow">
            RADIATION MANAGEMENT &amp; HEALTHY SPACES
          </span>
          <h2 className="offerings-section-title">
            Harmonizing Everyday Environments
          </h2>
          <p>
            As a verified Wellness Lovers Club member, access preferred
            environmental audits, priority allocations, and an exclusive 50% OFF
            privilege across the full Environics collection.
          </p>
        </div>

        {/* ─── Category Selection Tabs ────────────────────────────────────── */}
        <ProductCategoryTabs activeCategory="environics" />

        <div className="products-brand-section" id="environics-catalog">
          {/* ─── Dedicated Brand Narrative Card (Preserved Approved Copy) ── */}
          <div className="environics-narrative-card">
            <h3 className="environics-heading">{brand.heading}</h3>

            <div className="environics-body">
              {brand.bodyParagraphs?.[0] && <p>{brand.bodyParagraphs[0]}</p>}
              {brand.bodyParagraphs?.[1] && <p>{brand.bodyParagraphs[1]}</p>}
              {brand.bodyParagraphs?.[2] && <p>{brand.bodyParagraphs[2]}</p>}

              {brand.bodyParagraphs?.[3] && (
                <div className="environics-highlight-box">
                  <p>{brand.bodyParagraphs[3]}</p>
                </div>
              )}

              {brand.bodyParagraphs?.[4] && <p>{brand.bodyParagraphs[4]}</p>}
            </div>
          </div>

          {/* ─── Brand Meta Banner ─────────────────────────────────────────── */}
          <div className="brand-header-card">
            <div className="brand-header-info">
              <span className="brand-tagline">{brand.tagline}</span>
              <h3 className="brand-name">{brandName} Collection</h3>
              <p className="brand-desc">{brand.description}</p>
            </div>
            <div className="brand-header-actions">
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-website-btn"
                  title={`Visit official ${brandName} website`}
                >
                  Official Website <span>↗</span>
                </a>
              )}
              <div className="brand-badge-pill gold">
                <span>🛡️</span>{" "}
                {brand.badge ||
                  brand.memberOfferBadge ||
                  "50% OFF EXCLUSIVE PRIVILEGE"}
              </div>
            </div>
          </div>

          {/* ─── 4 Environics Products Grid ──────────────────────────────── */}
          <div className="wlc-lux-grid">
            {brand.products.map((product) => (
              <ProductCardWithModal
                key={product.id}
                product={product}
                brandName={brandName}
                brandId={brand.id}
              />
            ))}
          </div>
        </div>

        {/* ─── Bottom Navigation Actions ─────────────────────────────────── */}
        <div className="offerings-nav-buttons">
          <Link href="/offerings/products" className="btn btn-green">
            ← All Product Categories
          </Link>
          <Link
            href="/offerings/products/energetika369"
            className="btn btn-green"
          >
            Energetika369 Products →
          </Link>
          <Link href="/membership" className="btn btn-gold">
            Apply For Membership
          </Link>
        </div>
      </section>
    </article>
  );
}
