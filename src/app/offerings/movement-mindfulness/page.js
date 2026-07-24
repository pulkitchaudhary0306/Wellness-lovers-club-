import Image from "next/image";
import Link from "next/link";
import "../wellness-retreats/retreats.css";

export const metadata = {
  title: "Movement & Mindfulness | Wellness Lovers Club",
  description: "Engage in thoughtfully curated practices including yoga, pilates, meditation, breathwork, and mindful movement, designed to cultivate strength, clarity, balance, and inner calm.",
};

export default function MovementMindfulnessPage() {
  const destinations = [
    {
      name: "Niraamaya Retreats Backwaters & Beyond",
      flag: "🇮🇳",
      stats: "Kumarakom, Kerala",
      img: "/images/niraamaya-backwaters-mindfulness.webp"
    },
    {
      name: "Niraamaya Retreats Surya Samudra",
      flag: "🇮🇳",
      stats: "Kovalam, Trivandrum, Kerala",
      img: "/images/niraamaya-surya-mindfulness.webp"
    },
    {
      name: "Andaaz - Hyatt Hotel",
      flag: "🇮🇳",
      stats: "Delhi, India",
      img: "/images/andaz-mindfulness.webp"
    }
  ];

  return (
    <article>
      {/* Hero Banner */}
      <section className="inner-hero" aria-label="Mindfulness Hero">
        <div className="container inner-hero-container">
          <span className="eyebrow">STRENGTH, BALANCE & INNER CALM</span>
          <h1 className="inner-hero-title">Movement & Mindfulness</h1>
          <p className="inner-hero-desc">
            Engage in thoughtfully curated practices including yoga, pilates, meditation, breathwork, and mindful movement, designed to cultivate strength, clarity, balance, and inner calm.
          </p>
        </div>
      </section>

      {/* Staggered Grid Content Section */}
      <section className="inner-section" aria-label="Mindfulness Destinations">
        <div className="container">
          <div className="text-center inner-section-header">
            <span className="eyebrow">PRACTICES & INSTRUCTORS</span>
            <h2 className="inner-section-title">Mindful Sanctuaries</h2>
            <p>
              Explore our select portfolio of serene locations offering curated wellness retreats, guided meditations, and yoga classes taught by world-class instructors.
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
                    {dest.name} <span className="dest-flag-emoji" style={{ fontSize: "22px", marginLeft: "4px" }}>{dest.flag}</span>
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
