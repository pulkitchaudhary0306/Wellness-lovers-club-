import Image from "next/image";
import Link from "next/link";
import "../wellness-retreats/retreats.css";

export const metadata = {
  title: "Exceptional Accommodations | Wellness Lovers Club",
  description: "Enjoy preferred access to exceptional wellness resorts, hotels and luxury accommodations, where refined hospitality, tranquil surroundings, and elevated amenities create an unforgettable restorative stay.",
};

export default function LuxuryStaysPage() {
  const destinations = [
    {
      name: "Shangri-La Eros",
      flag: "🇮🇳",
      stats: "Connaught Place, New Delhi",
      img: "/images/shangri-la-stay.webp"
    },
    {
      name: "Andaaz - Hyatt Hotel",
      flag: "🇮🇳",
      stats: "Aerocity, New Delhi",
      img: "/images/andaz-stay.webp"
    }
  ];

  return (
    <article className="offerings-page">
      {/* Hero Banner */}
      <section className="offerings-hero" aria-label="Stays Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">REFINED HOSPITALITY & COMFORT</span>
          <h1 className="offerings-hero-title">Exceptional Accommodations</h1>
          <p className="offerings-hero-desc">
            Enjoy preferred access to exceptional wellness resorts, hotels and luxury accommodations, where refined hospitality, tranquil surroundings, and elevated amenities create an unforgettable restorative stay.
          </p>
        </div>
      </section>

      {/* Grid Content Section */}
      <section className="offerings-main-section" aria-label="Stays Destinations">
        <div className="offerings-section-header">
          <span className="eyebrow">EXQUISITE RETREATS</span>
          <h2 className="offerings-section-title">Premier Stays</h2>
          <p>
            Discover exceptional hotels, boutique stays, and wellness resorts through our trusted network of hospitality partners, with exclusive member privileges and preferred pricing.
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

        <div className="text-center" style={{ marginTop: "60px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/offerings" className="btn btn-green">
            ← All Offerings
          </Link>
          <Link href="/membership" className="btn btn-gold">
            Become a Member
          </Link>
        </div>
      </section>
    </article>
  );
}
