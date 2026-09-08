import Image from "next/image";
import Link from "next/link";
import "../wellness-retreats/retreats.css";
import "../offerings.css";
import "./products.css";
import ProductCategoryTabs from "@/components/Products/ProductCategoryTabs";
import { getAllProductBrands } from "@/data/productsData";

export const metadata = {
  title: "Products & Wellness Technology | Wellness Lovers Club",
  description: "Explore curated bio-frequency devices from Energetika369 and science-backed radiation management solutions from Environics.",
};

export const dynamic = "force-dynamic";

export default function ProductsOfferingsPage() {
  const brands = getAllProductBrands();

  return (
    <article className="offerings-page">
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="offerings-hero" aria-label="Products Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">BIO-FREQUENCY & ENVIRONMENTAL WELLNESS</span>
          <h1 className="offerings-hero-title">Products</h1>
          <p className="offerings-hero-desc">
            Explore advanced bio-frequency devices, quantum wellness technologies, and science-backed environmental solutions curated for conscious living and cellular vitality.
          </p>
        </div>
      </section>

      {/* ─── Main Content Section ────────────────────────────────────────── */}
      <section className="offerings-main-section" aria-label="Products Hub">
        <div className="offerings-section-header">
          <span className="eyebrow">CURATED WELLNESS INNOVATIONS</span>
          <h2 className="offerings-section-title">Harmonizing Mind, Body & Environment</h2>
          <p>
            Choose a specialized product category to explore bio-energetic technologies and environmental wellness solutions curated exclusively for Wellness Lovers Club members.
          </p>
        </div>

        {/* ─── Category Selection Tabs ────────────────────────────────────── */}
        <ProductCategoryTabs activeCategory="all" />

        {/* ─── Category Entry Point Cards ─────────────────────────────────── */}
        <div className="category-hub-grid">
          {brands.map((brand) => (
            <Link
              href={brand.route}
              className="category-hub-card"
              key={brand.id}
              aria-label={`Explore ${brand.name} collection`}
            >
              <div className="category-hub-img-wrap">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={brand.id === "energetika369"}
                  loading={brand.id === "energetika369" ? "eager" : "lazy"}
                />
                <span className={`category-hub-badge ${brand.id === "environics" ? "gold" : ""}`}>
                  {brand.id === "environics" ? "50% OFF Privilege" : "Bio-Frequency Tech"}
                </span>
              </div>
              <div className="category-hub-content">
                <span className="category-hub-tagline">{brand.tagline}</span>
                <h3 className="category-hub-title">{brand.name}</h3>
                <p className="category-hub-desc">{brand.description}</p>
                
                <div className="category-hub-footer">
                  <span className="category-hub-cta">
                    View Collection <span>→</span>
                  </span>
                  <span className="category-hub-count">
                    {brand.products.length} Products
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

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
