import Image from "next/image";
import Link from "next/link";
import "./retreats.css";

export const metadata = {
  title: "Wellness Retreats | Wellness Lovers Club",
  description: "Discover our handpicked collection of the world's most exclusive wellness retreats, spa sanctuaries, and mindful escapes.",
};

export default function WellnessRetreatsPage() {
  const destinations = [
    {
      name: "Niraamaya Retreats Surya Samudra",
      flag: "🇮🇳",
      stats: "Kovalam, Trivandrum, Kerala",
      img: "/images/niraamaya-retreat-real.webp"
    },
    {
      name: "Swastik Luxury Wellbeing Sanctuary",
      flag: "🇮🇳",
      stats: "Pune, Maharashtra",
      img: "/images/swastik-sanctuary-real.webp"
    },
    {
      name: "The Wellness Co",
      flag: "🇮🇳",
      stats: "Karma Lakelands, Gurgaon",
      img: "/images/wellness-co-real.webp"
    },
    {
      name: "Viveda Wellness Resort",
      flag: "🇮🇳",
      stats: "Nashik, Maharashtra",
      img: "/images/viveda-resort-real.webp"
    },
    {
      name: "Viva Mayr",
      flag: "🇦🇹",
      stats: "Maria Wörth, Austria",
      img: "/images/vivamayr-austria-real.webp"
    }
  ];

  return (
    <article>
      {/* Hero Banner */}
      <section className="inner-hero" aria-label="Retreats Hero">
        <div className="container inner-hero-container">
          <span className="eyebrow">EXCLUSIVE EXPERIENCES</span>
          <h1 className="inner-hero-title">Wellness Retreats</h1>
          <p className="inner-hero-desc">
            Discover immersive escapes in the world’s most serene destinations, where nature, bespoke wellness programs, and restorative experiences come together to renew mind, body, and perspective.
          </p>
        </div>
      </section>

      {/* Staggered Grid Content Section */}
      <section className="inner-section" aria-label="Retreat Destinations">
        <div className="container">
          <div className="text-center inner-section-header">
            <span className="eyebrow">DESTINATIONS</span>
            <h2 className="inner-section-title">Mindful Journeys Await</h2>
            <p>
              Explore our global portfolio of curated wellness programs, luxury sanctuary partnerships, and tailored retreats designed to release stress and restore vitality.
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
