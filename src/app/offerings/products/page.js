import React from "react";
import Image from "next/image";
import Link from "next/link";
import "../wellness-retreats/retreats.css";
import "../offerings.css";
import "./products.css";
import ProductCategoryTabs from "@/components/Products/ProductCategoryTabs";
import ProductCatalogueExplorer from "@/components/Products/ProductCatalogueExplorer";
import { PRODUCTS_DATA } from "@/data/productsData";

export const metadata = {
  title:
    "Products & Wellness Technology | Curated E-Commerce Catalogue | Wellness Lovers Club",
  description:
    "Explore the complete Wellness Lovers Club product catalogue: Energetika369 PEMF Crystal Mats, HEXA SENSE AI Diagnostics, Hexa Flow NLS Frequency Devices, NeuroPulse rTMS, Diji-Wave 369, Rife Frequency Pro, DermaVision369, Aligné 369, and Environics EMR Protection (50% OFF for WLC Members).",
  keywords: [
    "Wellness Products",
    "Energetika369",
    "Environics",
    "Beyond PEMF Wellness Mat",
    "HEXA SENSE AI",
    "Hexa Pulse",
    "Hexa Sync",
    "Hexa Lux",
    "NeuroPulse rTMS",
    "Diji-Wave 369",
    "Rife Frequency Pro",
    "DermaVision369",
    "Envirochips",
    "Enviroglobe",
    "Envirocare",
    "Enviromat"
  ],
  alternates: {
    canonical: "https://www.wellnessloversclub.com/offerings/products"
  },
  openGraph: {
    title: "Curated Wellness Technology Catalogue | Wellness Lovers Club",
    description:
      "Discover authentic bio-resonance, PEMF, neuromodulation, and radiation-harmonizing products curated for Wellness Lovers Club members.",
    url: "https://www.wellnessloversclub.com/offerings/products",
    siteName: "Wellness Lovers Club",
    images: [
      {
        url: "/images/products/pemf-mat-session.webp",
        width: 1200,
        height: 630,
        alt: "Wellness Lovers Club Product Catalogue"
      }
    ],
    type: "website"
  }
};

export default function ProductsOverviewPage() {
  return (
    <article className="offerings-page">
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="offerings-hero" aria-label="Products Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">
            BIO-FREQUENCY &amp; ENVIRONMENTAL WELLNESS
          </span>
          <h1 className="offerings-hero-title">
            Transformative Products for Mindful &amp; Restorative Living
          </h1>
          <p className="offerings-hero-desc">
            Explore our world-class portfolio of authentic bio-resonance
            systems, PEMF crystal mats, AI spectral diagnostics, and
            scientifically validated radiation-protection solutions.
          </p>
        </div>
      </section>

      {/* ─── Main Content Section ────────────────────────────────────────── */}
      <section className="offerings-main-section" aria-label="Products Hub">
        <div className="offerings-section-header">
          <span className="eyebrow">CURATED WELLNESS INNOVATIONS</span>
          <h2 className="offerings-section-title">
            Harmonizing Mind, Body &amp; Environment
          </h2>
          <p>
            Choose a specialized partner brand or browse our complete interactive
            catalogue of 15 curated wellness technologies and environmental
            protection systems below.
          </p>
        </div>

        {/* ─── Category Selection Tabs ────────────────────────────────────── */}
        <ProductCategoryTabs activeCategory="all" />

        {/* ─── Partner Brand Entry Point Cards ────────────────────────────── */}
        <div className="wlc-brands-showcase-section">
          <div className="products-entry-grid">
            {PRODUCTS_DATA.map((brand) => {
              const isEnvironics = brand.id === "environics";
              const brandTitle = brand.brand || brand.name;
              const coverImg =
                brand.heroImage ||
                brand.logo ||
                "/images/products/pemf-mat-session.webp";

              return (
                <div key={brand.id} className="brand-entry-card">
                  <div className="brand-entry-visual">
                    <Image
                      src={coverImg}
                      alt={brandTitle}
                      fill
                      className="brand-entry-img"
                      sizes="(max-width: 900px) 100vw, 50vw"
                      priority={brand.id === "energetika369"}
                    />
                    <div className="brand-entry-overlay" />
                    <div className="brand-entry-badge">
                      {isEnvironics
                        ? "50% OFF WLC Member Privilege"
                        : `${brand.products.length} Curated Systems`}
                    </div>
                  </div>
                  <div className="brand-entry-info">
                    <span className="brand-entry-tagline">{brand.tagline}</span>
                    <h3 className="brand-entry-title">{brandTitle}</h3>
                    <p className="brand-entry-desc">{brand.description}</p>

                    <div className="brand-entry-meta">
                      <span className="meta-pill">
                        {brand.products.length} Authentic Products
                      </span>
                      <span className="meta-pill">
                        {isEnvironics
                          ? "50% OFF Exclusive Member Offer"
                          : "PEMF • NLS • rTMS • MMW"}
                      </span>
                    </div>

                    <div className="brand-entry-actions">
                      <Link
                        href={`/offerings/products/${brand.id}`}
                        className="brand-entry-btn"
                      >
                        Explore {brandTitle} Collection →
                      </Link>
                      <Link
                        href={`/explore-offer?destination=${encodeURIComponent(
                          brandTitle
                        )}`}
                        className="brand-entry-btn-outline"
                      >
                        {isEnvironics ? "Claim 50% OFF" : "Enquire"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Complete Interactive Product Catalogue Explorer (All 15 Products) ─── */}
        <ProductCatalogueExplorer />

        {/* ─── Bottom Navigation Actions ─────────────────────────────────── */}
        <div className="offerings-nav-buttons">
          <Link href="/offerings" className="btn btn-green">
            ← All Offerings
          </Link>
          <Link href="/membership" className="btn btn-gold">
            Apply For Membership
          </Link>
        </div>
      </section>
    </article>
  );
}
