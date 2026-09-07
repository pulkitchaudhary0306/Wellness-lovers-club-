import Image from "next/image";
import Link from "next/link";
import "../wellness-retreats/retreats.css";
import "../offerings.css";
import "./products.css";
import { PRODUCTS_BRANDS } from "@/data/productsData";

export const metadata = {
  title: "Products & Bio-Frequency Technology | Wellness Lovers Club",
  description: "Explore curated bio-frequency devices and quantum wellness technologies from Energetika369.",
};

export const dynamic = "force-dynamic";

export default function ProductsOfferingsPage() {
  const energetikaBrand = PRODUCTS_BRANDS.find((b) => b.id === "energetika369");

  return (
    <article className="offerings-page">
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="offerings-hero" aria-label="Products Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">BIO-FREQUENCY & WELLNESS INNOVATION</span>
          <h1 className="offerings-hero-title">Products</h1>
          <p className="offerings-hero-desc">
            Explore advanced bio-frequency devices and quantum wellness technologies curated for conscious living and cellular vitality.
          </p>
        </div>
      </section>

      {/* ─── Main Content Section ────────────────────────────────────────── */}
      <section className="offerings-main-section" aria-label="Products Catalog">
        <div className="offerings-section-header">
          <span className="eyebrow">PRODUCTS & TECHNOLOGIES</span>
          <h2 className="offerings-section-title">Harmonizing Mind, Body & Environment</h2>
          <p>
            As a verified Wellness Lovers Club member, access preferred consultations, concierge allocations, and exclusive privileges across our trusted wellness technology partners.
          </p>
        </div>

        {/* ─── BRAND 1: Energetika369 ──────────────────────────────────────── */}
        {energetikaBrand && (
          <div className="products-brand-section" id="energetika369">
            <div className="brand-header-card">
              <div className="brand-header-info">
                <span className="brand-tagline">{energetikaBrand.tagline}</span>
                <h3 className="brand-name">{energetikaBrand.name}</h3>
                <p className="brand-desc">{energetikaBrand.description}</p>
              </div>
              <div className="brand-badge-pill">
                <span>⚡</span> {energetikaBrand.badge}
              </div>
            </div>

            {/* ─── Product Cards Grid ──────────────────────────────────────── */}
            <div className="offerings-grid-container">
              {energetikaBrand.products.map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-card-img-wrap">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={product.id === "pemf-crystal-mat"}
                      loading={product.id === "pemf-crystal-mat" ? "eager" : "lazy"}
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
                        {product.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    )}

                    <div className="product-card-footer">
                      {product.pdfPath && (
                        <a
                          href={product.pdfPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="product-pdf-link"
                          title={`View ${product.pdfName}`}
                        >
                          📄 View Official Catalogue PDF ↗
                        </a>
                      )}
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
        )}

        {/* ─── Bottom Actions ──────────────────────────────────────────────── */}
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
