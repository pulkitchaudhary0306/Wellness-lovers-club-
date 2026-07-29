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
    <article>
      {/* Hero Banner */}
      <section className="inner-hero" aria-label="Stays Hero">
        <div className="container inner-hero-container">
          <span className="eyebrow">REFINED HOSPITALITY & COMFORT</span>
          <h1 className="inner-hero-title">Exceptional Accommodations</h1>
          <p className="inner-hero-desc">
            Enjoy preferred access to exceptional wellness resorts, hotels and luxury accommodations, where refined hospitality, tranquil surroundings, and elevated amenities create an unforgettable restorative stay.
          </p>
        </div>
      </section>

      {/* Staggered Grid Content Section */}
      <section className="inner-section" aria-label="Stays Destinations">
        <div className="container">
          <div className="text-center inner-section-header">
            <span className="eyebrow">EXQUISITE RETREATS</span>
            <h2 className="inner-section-title">Wellness Resorts, Hotels</h2>
            <p>
              Explore our select portfolio of boutique hotels and premium wellness properties, offering custom member privileges and dedicated care for a refreshing stay.
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
