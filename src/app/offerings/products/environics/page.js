import Image from "next/image";
import Link from "next/link";
import "../../wellness-retreats/retreats.css";
import "../../offerings.css";
import "../products.css";
import ProductCategoryTabs from "@/components/Products/ProductCategoryTabs";
import { getProductBrand } from "@/data/productsData";

export const metadata = {
  title: "Environics | Create a Healthier Environment | Wellness Lovers Club",
  description: "Create a healthier, safer, and more balanced environment with science-backed environmental and electromagnetic solutions from Environics. Enjoy 50% OFF for WLC members.",
};

export const dynamic = "force-dynamic";

export default function EnvironicsProductPage() {
  const brand = getProductBrand("environics");

  if (!brand) return null;

  return (
    <article className="offerings-page">
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="offerings-hero" aria-label="Environics Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">ENVIRONMENTAL & ELECTROMAGNETIC WELLNESS</span>
          <h1 className="offerings-hero-title">Environics</h1>
          <p className="offerings-hero-desc">
            Science-backed radiation management solutions and environmental health systems engineered to neutralize electro-smog and support restorative spaces.
          </p>
        </div>
      </section>

      {/* ─── Main Content Section ────────────────────────────────────────── */}
      <section className="offerings-main-section" aria-label="Environics Collection">
        <div className="offerings-section-header">
          <span className="eyebrow">RADIATION MANAGEMENT & HEALTHY SPACES</span>
          <h2 className="offerings-section-title">Harmonizing Everyday Environments</h2>
          <p>
            As a verified Wellness Lovers Club member, access preferred environmental audits, priority allocations, and an exclusive 50% OFF privilege across the full Environics collection.
          </p>
        </div>

        {/* ─── Category Selection Tabs ────────────────────────────────────── */}
        <ProductCategoryTabs activeCategory="environics" />

        <div className="products-brand-section" id="environics-catalog">
          {/* ─── Dedicated Brand Narrative Card (Exact Unmodified Copy) ──── */}
          <div className="environics-narrative-card">
            <h3 className="environics-heading">{brand.heading}</h3>
            
            <div className="environics-body">
              <p>{brand.bodyParagraphs[0]}</p>
              <p>{brand.bodyParagraphs[1]}</p>
              <p>{brand.bodyParagraphs[2]}</p>
              
              <div className="environics-highlight-box">
                <p>{brand.bodyParagraphs[3]}</p>
              </div>
              
              <p>{brand.bodyParagraphs[4]}</p>
            </div>
          </div>

          {/* ─── Brand Meta Banner ─────────────────────────────────────────── */}
          <div className="brand-header-card">
            <div className="brand-header-info">
              <span className="brand-tagline">{brand.tagline}</span>
              <h3 className="brand-name">{brand.name} Collection</h3>
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
                <span>🛡️</span> {brand.badge}
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

                  {product.memberPrivilege && (
                    <div className="product-privilege-pill">
                      <span>🏷️</span> {product.memberPrivilege}
                    </div>
                  )}

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
                      Enquire Now (50% OFF) <span>→</span>
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
          <Link href="/offerings/products/energetika369" className="btn btn-green">
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
