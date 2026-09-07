import Image from "next/image";
import Link from "next/link";
import "../wellness-retreats/retreats.css";

export const metadata = {
  title: "Spa & Holistic Healing | Wellness Lovers Club",
  description: "Experience a curated blend of ancient healing traditions and modern therapeutic treatments designed to restore vitality, release tension, and nurture complete mind-body wellbeing.",
};

export const dynamic = "force-dynamic";

export default function SpaHealingPage() {
  const destinations = [
    {
      name: "JA Palm Tree Court",
      flag: "🇦🇪",
      stats: "Dubai, UAE",
      img: "/images/philosophy-pool.webp",
      website: "https://www.jaresortshotels.com/dubai/ja-palm-tree-court"
    },
    {
      name: "Sawadhee Spa",
      flag: "🇮🇳",
      stats: "Vasant Kunj, New Delhi",
      img: "/images/spa-healing-room.webp",
      website: "https://sawadhee.com/"
    },
    {
      name: "IOSIS Spa & Sorin",
      flag: "🇮🇳",
      stats: "Mumbai · Guwahati · Raipur (PAN India)",
      img: "/images/conscious-living.webp",
      website: "https://www.iosiswellness.com/"
    },
    {
      name: "Dhun Wellness Spa",
      flag: "🇮🇳",
      stats: "Mumbai, India",
      img: "/images/dhun-wellness-spa.webp",
      website: "https://dhunwellness.com/"
    },
    {
      name: "Andaz Delhi — Hyatt Hotel",
      flag: "🇮🇳",
      stats: "Hyatt Hotel, Vasant Vihar / Aerocity, Delhi",
      img: "/images/andaz-hyatt-spa.webp",
      website: "https://www.hyatt.com/andaz/en-US/delaz-andaz-delhi"
    },
    {
      name: "Shangri-La Eros",
      flag: "🇮🇳",
      stats: "Connaught Place, New Delhi",
      img: "/images/shangri-la-stay.webp",
      website: "https://www.shangri-la.com/newdelhi/erosshangrila/"
    },
    {
      name: "Pema Wellness",
      flag: "🇮🇳",
      stats: "Visakhapatnam, India",
      img: "/images/pema-wellness-spa.webp",
      website: "https://www.pemawellness.com/"
    },
    {
      name: "The Wellness Co. — PAN India",
      flag: "🇮🇳",
      stats: "PAN India Clinics Nationwide",
      img: "/images/wellness-co-spa.webp",
      website: "https://www.karmalakelands.com/"
    },
    {
      name: "Silhouette Salon",
      flag: "🇮🇳",
      stats: "Gurgaon & Parfaire Tivoli, Delhi NCR",
      img: "/images/silhouette-salon-spa.webp",
      website: "https://silhouettesalon.co.in/"
    },
    {
      name: "Florian Hurel Hair Couture & Spa",
      flag: "🇮🇳",
      stats: "Mumbai · Ahmedabad · Hyderabad · Pune",
      img: "/images/community-experiences-lounge.webp",
      website: "https://florianhurelhaircouture.com/"
    }
  ];

  return (
    <article className="offerings-page">
      {/* Hero Banner */}
      <section className="offerings-hero" aria-label="Spa Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">ANCIENT WISDOM & MODERN THERAPIES</span>
          <h1 className="offerings-hero-title">Spa & Holistic Healing Experiences</h1>
          <p className="offerings-hero-desc">
            Experience a curated blend of ancient healing traditions and modern therapeutic treatments designed to restore vitality, release tension, and nurture complete mind-body wellbeing.
          </p>
        </div>
      </section>

      {/* Grid Content Section */}
      <section className="offerings-main-section" aria-label="Spa Destinations">
        <div className="offerings-section-header">
          <span className="eyebrow">SPA & HOLISTIC LIVING</span>
          <h2 className="offerings-section-title">Restorative Havens</h2>
          <p>
            Explore our handpicked selection of premium spa sanctuaries, salon rituals, and holistic healing clinics, offering bespoke therapies tailored to your rejuvenation.
          </p>
        </div>

        <div className="staggered-grid">
          {destinations.map((dest, idx) => (
            <div className="destination-card" key={idx}>
              <div className="dest-img-container">
                <Image
                  src={dest.img}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority={idx < 2}
                  loading={idx < 2 ? "eager" : "lazy"}
                />
              </div>
              <div className="dest-gradient" aria-hidden="true" />
              <div className="dest-content">
                <h3 className="dest-title">
                  {dest.name}
                </h3>
                <p className="dest-stats">{dest.stats}</p>
                <Link href={`/explore-offer?destination=${encodeURIComponent(dest.name)}`} className="dest-btn">
                  Explore Now <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: "60px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/offerings" className="btn btn-green">
            ← All Offerings
          </Link>
          <Link href="/destinations" className="btn btn-gold">
            All Destinations
          </Link>
        </div>
      </section>
    </article>
  );
}
