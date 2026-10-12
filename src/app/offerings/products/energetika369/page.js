import Image from "next/image";
import Link from "next/link";
import "../../wellness-retreats/retreats.css";
import "../../offerings.css";
import "../products.css";
import "./energetika369.css";
import ProductCategoryTabs from "@/components/Products/ProductCategoryTabs";
import Energetika369View from "@/components/Products/Energetika369View";
import { getProductBrand } from "@/data/productsData";

export const metadata = {
  title: "Energetika369 | Bio-Frequency & Quantum Wellness | Wellness Lovers Club",
  description: "Explore curated bio-frequency devices, PEMF wellness mats, AI wellness analysis, and NLS frequency systems from Energetika369. Enjoy bespoke consultations and WLC member privileges.",
  keywords: [
    "Energetika369",
    "Beyond PEMF Wellness Mat",
    "HEXA SENSE AI",
    "Hexa Flow Frequency Devices",
    "Hexa Pulse",
    "Hexa Sync",
    "Hexa Lux",
    "Bio-frequency",
    "Quantum Wellness",
    "Wellness Lovers Club"
  ],
  openGraph: {
    title: "Energetika369 Bio-Frequency & Wellness Technologies | Wellness Lovers Club",
    description: "Curated bio-frequency devices, PEMF mats, and non-invasive bio-resonance analysis from Energetika369.",
    url: "https://wellnessloversclub.com/offerings/products/energetika369",
    siteName: "Wellness Lovers Club",
    images: [
      {
        url: "https://wellnessloversclub.com/images/products/pemf-crystal-mat.webp",
        width: 1200,
        height: 630,
        alt: "Energetika369 Bio-Frequency Technologies",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default function Energetika369ProductPage() {
  const brand = getProductBrand("energetika369");

  if (!brand) return null;

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "Energetika369",
    "url": "https://energetika369.com/",
    "description": "Pioneering cellular restoration, scalar resonance, and bio-frequency systems engineered to restore energetic coherence, vitality, and cellular harmony.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Energetika369 Bio-Frequency Products",
      "itemListElement": brand.products.map((prod, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": prod.name,
          "description": prod.shortDesc,
          "image": `https://wellnessloversclub.com${prod.image}`,
          "category": prod.category,
          "brand": {
            "@type": "Brand",
            "name": "Energetika369"
          }
        },
        "position": index + 1
      }))
    }
  };

  return (
    <article className="offerings-page">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── Hero Banner: Two-Column Responsive Layout ─────────────────────── */}
      <section className="offerings-hero energetika-hero" aria-label="Energetika369 Hero">
        <div className="offerings-hero-container energetika-hero-container">
          <div className="energetika-hero-content">
            <span className="offerings-hero-eyebrow">ADVANCED WELLNESS TECHNOLOGY</span>
            <h1 className="offerings-hero-title">Energetika369</h1>
            <p className="offerings-hero-desc">
              Explore advanced bio-frequency devices and quantum wellness technologies curated for conscious living, cellular vitality, and harmonic resonance.
            </p>

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
                src="/images/products/pemf-crystal-mat.webp"
                alt="Energetika369 Bio-Frequency Innovation Suite"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 520px"
              />
              <span className="hero-floating-badge">✦ Bio-Frequency Suite</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Section ────────────────────────────────────────── */}
      <section className="offerings-main-section" aria-label="Energetika369 Products">
        <div className="offerings-section-header">
          <span className="eyebrow">PRODUCTS & TECHNOLOGIES</span>
          <h2 className="offerings-section-title">Harmonizing Mind, Body & Cellular Vitality</h2>
          <p>
            As a verified Wellness Lovers Club member, access preferred consultations, concierge allocations, and exclusive privileges across our trusted wellness technology partners.
          </p>
        </div>

        {/* ─── Category Selection Tabs ────────────────────────────────────── */}
        <ProductCategoryTabs activeCategory="energetika369" />

        {/* ─── Brand Header Card ─────────────────────────────────────────── */}
        <div className="products-brand-section">
          <div className="brand-header-card">
            <div className="brand-header-info">
              <span className="brand-tagline">{brand.tagline}</span>
              <h3 className="brand-name">{brand.name} Innovation Suite</h3>
              <p className="brand-desc">{brand.description}</p>
            </div>
            <div className="brand-header-actions">
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-website-btn"
                  title={`Visit official ${brand.name} website`}
                >
                  Official Website <span>↗</span>
                </a>
              )}
              <div className="brand-badge-pill gold">
                <span>⚡</span> Exclusive WLC Member Privileges
              </div>
            </div>
          </div>

          {/* ─── Dedicated 5-Product View with Interactive Sections ──────── */}
          <Energetika369View brand={brand} />
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
