import Image from "next/image";
import Link from "next/link";
import "../../wellness-retreats/retreats.css";
import "../../offerings.css";
import "../products.css";
import ProductCategoryTabs from "@/components/Products/ProductCategoryTabs";
import { getProductBrand } from "@/data/productsData";

export const metadata = {
  title: "Energy & Wellness Products | Energetika369 | Wellness Lovers Club",
  description: "Explore curated bio-frequency devices, quantum wellness technologies, and cellular rejuvenation systems from Energetika369.",
};

export const dynamic = "force-dynamic";

export default function Energetika369ProductPage() {
  const brand = getProductBrand("energetika369");

  if (!brand) return null;

  return (
    <article className="offerings-page">
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="offerings-hero" aria-label="Energetika369 Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">BIO-FREQUENCY & QUANTUM WELLNESS</span>
          <h1 className="offerings-hero-title">Energetika369</h1>
          <p className="offerings-hero-desc">
            Explore advanced bio-frequency devices and quantum wellness technologies curated for conscious living, cellular vitality, and harmonic resonance.
          </p>
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
        <div className="products-brand-section" id="energetika369-catalog">
          <div className="brand-header-card">
            <div className="brand-header-info">
              <span className="brand-tagline">{brand.tagline}</span>
              <h3 className="brand-name">{brand.name}</h3>
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
              <div className="brand-badge-pill">
                <span>⚡</span> {brand.badge}
              </div>
            </div>
          </div>

          {/* ─── Product Cards Grid ──────────────────────────────────────── */}
          <div className="offerings-grid-container">
            {brand.products.map((product, idx) => (
              <div className="product-card" key={product.id}>
                <div className="product-card-img-wrap">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
                <div className="product-card-content">
                  <div className="product-meta-row">
                    <span className="product-tag">{product.tag}</span>
                    <span className="product-brand-tag">{product.brand}</span>
                  </div>

                  <h4 className="product-title">{product.name}</h4>
                  <p className="product-desc">{product.shortDesc}</p>

                  {Array.isArray(product.features) && product.features.length > 0 && (
                    <ul className="product-features-list">
                      {product.features.map((feature, fIdx) => (
                        <li key={fIdx}>{feature}</li>
                      ))}
                    </ul>
                  )}

                  <div className="product-card-footer">
                    <Link
                      href={`/explore-offer?destination=${encodeURIComponent(`${product.brand} - ${product.name}`)}`}
                      className="product-enquiry-btn"
                      title={`Enquire about ${product.name}`}
                    >
                      Enquire Now <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
