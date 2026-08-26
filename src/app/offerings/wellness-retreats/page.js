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
      img: "/images/niraamaya-retreat-real.webp",
      website: "https://niraamaya.com/"
    },
    {
      name: "Niraamaya Retreats Backwaters & Beyond",
      flag: "🇮🇳",
      stats: "Kumarakom, Kerala",
      img: "/images/niraamaya-backwaters-spa.webp",
      website: "https://niraamaya.com/"
    },
    {
      name: "Swastik Luxury Wellbeing Sanctuary",
      flag: "🇮🇳",
      stats: "Pune, Maharashtra",
      img: "/images/swastik-sanctuary-real.webp",
      website: "https://swastikwellbeing.com/"
    },
    {
      name: "Trē Wellness",
      flag: "🇮🇳",
      stats: "Hyderabad, Telangana",
      img: "/images/wellness-retreat-cabin.webp",
      website: "https://trewellness.in/"
    },
    {
      name: "Viveda Wellness Resort",
      flag: "🇮🇳",
      stats: "Nashik, Maharashtra",
      img: "/images/viveda-resort-real.webp",
      website: "https://vivedawellness.com/"
    },
    {
      name: "The Wellness Co. — Karma Lakelands",
      flag: "🇮🇳",
      stats: "Karma Lakelands, Gurgaon",
      img: "/images/wellness-co-real.webp",
      website: "https://www.karmalakelands.com/"
    },
    {
      name: "COMO Point Yamu",
      flag: "🇹🇭",
      stats: "Phuket, Thailand",
      img: "/images/journey-wellness.webp",
      website: "https://www.comohotels.com/thailand/como-point-yamu"
    },
    {
      name: "COMO Uma Paro & Punakha",
      flag: "🇧🇹",
      stats: "Paro & Punakha, Bhutan",
      img: "/images/buddha-bg.webp",
      website: "https://www.comohotels.com/bhutan/como-uma-paro"
    },
    {
      name: "Lošinj Hotels & Villas (Alhambra)",
      flag: "🇭🇷",
      stats: "Lošinj Island, Croatia",
      img: "/images/luxury-stays-cabana.webp",
      website: "https://www.losinj-hotels.com/"
    },
    {
      name: "Viva Mayr",
      flag: "🇦🇹",
      stats: "Maria Wörth / Altaussee, Austria",
      img: "/images/vivamayr-austria-real.webp",
      website: "https://www.vivamayr.com/"
    }
  ];

  return (
    <article className="offerings-page">
      {/* Hero Banner */}
      <section className="offerings-hero" aria-label="Retreats Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">EXCLUSIVE EXPERIENCES</span>
          <h1 className="offerings-hero-title">Wellness Retreats</h1>
          <p className="offerings-hero-desc">
            Discover immersive escapes in the world’s most serene destinations, where nature, bespoke wellness programs, and restorative experiences come together to renew mind, body, and perspective.
          </p>
        </div>
      </section>

      {/* Grid Content Section */}
      <section className="offerings-main-section" aria-label="Retreat Destinations">
        <div className="offerings-section-header">
          <span className="eyebrow">DESTINATIONS</span>
          <h2 className="offerings-section-title">Mindful Journeys Await</h2>
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
