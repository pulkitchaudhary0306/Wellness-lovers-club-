import Image from "next/image";
import Link from "next/link";
import "../wellness-retreats/retreats.css";

export const metadata = {
  title: "Spa & Holistic Healing | Wellness Lovers Club",
  description: "Experience a curated blend of ancient healing traditions and modern therapeutic treatments designed to restore vitality, release tension, and nurture complete mind-body wellbeing.",
};

export default function SpaHealingPage() {
  const destinations = [
    {
      name: "Niraamaya Retreats Backwaters & Beyond",
      flag: "🇮🇳",
      stats: "Kumarakom, Kerala",
      img: "/images/niraamaya-backwaters-spa.webp"
    },
    {
      name: "Dhun Wellness",
      flag: "🇮🇳",
      stats: "Mumbai, India",
      img: "/images/dhun-wellness-spa.webp"
    },
    {
      name: "Pema Wellness",
      flag: "🇮🇳",
      stats: "Visakhapatnam, India",
      img: "/images/pema-wellness-spa.webp"
    },
    {
      name: "The Wellness Co",
      flag: "🇮🇳",
      stats: "Karma Lakelands, Gurgaon",
      img: "/images/wellness-co-spa.webp"
    },
    {
      name: "Silhouette Salon",
      flag: "🇮🇳",
      stats: "Gurgaon, India",
      img: "/images/silhouette-salon-spa.webp"
    },
    {
      name: "Viveda Wellness Resort",
      flag: "🇮🇳",
      stats: "Nashik, Maharashtra",
      img: "/images/viveda-spa.webp"
    },
    {
      name: "Andaaz - Hyatt Hotel",
      flag: "🇮🇳",
      stats: "Delhi, India",
      img: "/images/andaz-hyatt-spa.webp"
    }
  ];

  return (
    <article>
      {/* Hero Banner */}
      <section className="inner-hero" aria-label="Spa Hero">
        <div className="container inner-hero-container">
          <span className="eyebrow">ANCIENT WISDOM & MODERN THERAPIES</span>
          <h1 className="inner-hero-title">Spa & Holistic Healing Experiences</h1>
          <p className="inner-hero-desc">
            Experience a curated blend of ancient healing traditions and modern therapeutic treatments designed to restore vitality, release tension, and nurture complete mind-body wellbeing.
          </p>
        </div>
      </section>

      {/* Staggered Grid Content Section */}
      <section className="inner-section" aria-label="Spa Destinations">
        <div className="container">
          <div className="text-center inner-section-header">
            <span className="eyebrow">SPA & HOLISTIC LIVING</span>
            <h2 className="inner-section-title">Restorative Haven</h2>
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
                    priority={idx < 3}
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

          <div className="text-center" style={{ marginTop: "80px" }}>
            <Link href="/offerings" className="btn btn-gold" style={{ marginRight: "16px" }}>
              ← All Offerings
            </Link>
            <Link href="/membership" className="btn btn-outline" style={{ color: "#ffffff", borderColor: "#ffffff" }}>
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
