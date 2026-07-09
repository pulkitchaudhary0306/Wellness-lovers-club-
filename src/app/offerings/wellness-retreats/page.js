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
      name: "Bali, Indonesia",
      code: "id",
      stats: "4 Luxury Resorts • 8 Retreat Packages",
      img: "/images/bali.jpg"
    },
    {
      name: "Maldives",
      code: "mv",
      stats: "3 Overwater Resorts • 6 Retreat Packages",
      img: "/images/maldives.jpg"
    },
    {
      name: "Thailand",
      code: "th",
      stats: "6 Sanctuary Resorts • 12 Retreat Packages",
      img: "/images/thailand.jpg"
    },
    {
      name: "Switzerland",
      code: "ch",
      stats: "2 Alpine Resorts • 4 Retreat Packages",
      img: "/images/switzerland.jpg"
    },
    {
      name: "India",
      code: "in",
      stats: "5 Ayurvedic Resorts • 10 Retreat Packages",
      img: "/images/india.jpg"
    },
    {
      name: "Sri Lanka",
      code: "lk",
      stats: "3 Eco-Luxe Resorts • 5 Retreat Packages",
      img: "/images/sri-lanka.jpg"
    }
  ];

  return (
    <article>
      {/* Hero Banner */}
      <section className="inner-hero" aria-label="Retreats Hero">
        <div className="container inner-hero-container">
          <span className="eyebrow">EXCLUSIVE SANCTUARIES</span>
          <h1 className="inner-hero-title">Wellness Retreats</h1>
          <p className="inner-hero-desc">
            Transformative escapes in the world's most serene, handpicked locations. Reconnect with your inner peace and experience bespoke therapies designed for total rejuvenation.
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
                    <span className="dest-flag">
                      <img 
                        src={`https://flagcdn.com/w40/${dest.code}.png`} 
                        alt="" 
                        width="20"
                        height="15"
                        style={{ display: "block" }}
                      />
                    </span>
                  </h3>
                  <p className="dest-stats">{dest.stats}</p>
                  <Link href="/contact" className="dest-btn">
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
