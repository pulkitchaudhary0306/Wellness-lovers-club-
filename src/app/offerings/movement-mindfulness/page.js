import Image from "next/image";
import Link from "next/link";
import "../wellness-retreats/retreats.css";

export const metadata = {
  title: "Movement & Mindfulness | Wellness Lovers Club",
  description: "Engage in thoughtfully curated practices including yoga, pilates, meditation, breathwork, and mindful movement, designed to cultivate strength, clarity, balance, and inner calm.",
};

export const dynamic = "force-dynamic";

export default function MovementMindfulnessPage() {
  const destinations = [
    {
      name: "Niraamaya Retreats Backwaters & Beyond",
      flag: "🇮🇳",
      stats: "Kumarakom, Kerala",
      img: "/images/niraamaya-backwaters-mindfulness.webp",
      website: "https://niraamaya.com/"
    },
    {
      name: "Niraamaya Retreats Surya Samudra",
      flag: "🇮🇳",
      stats: "Kovalam, Trivandrum, Kerala",
      img: "/images/niraamaya-surya-mindfulness.webp",
      website: "https://niraamaya.com/"
    },
    {
      name: "COMO Point Yamu",
      flag: "🇹🇭",
      stats: "Phuket, Thailand",
      img: "/images/movement-mindfulness-yoga.webp",
      website: "https://www.comohotels.com/thailand/como-point-yamu"
    },
    {
      name: "Trē Wellness",
      flag: "🇮🇳",
      stats: "Hyderabad, Telangana",
      img: "/images/wellness-retreat-cabin.webp",
      website: "https://trewellness.in/"
    },
    {
      name: "Andaz Delhi — Hyatt Hotel",
      flag: "🇮🇳",
      stats: "Hyatt Hotel, Vasant Vihar / Aerocity, Delhi",
      img: "/images/andaz-mindfulness.webp",
      website: "https://www.hyatt.com/andaz/en-US/delaz-andaz-delhi"
    }
  ];

  return (
    <article className="offerings-page">
      {/* Hero Banner */}
      <section className="offerings-hero" aria-label="Mindfulness Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">STRENGTH, BALANCE & INNER CALM</span>
          <h1 className="offerings-hero-title">Movement & Mindfulness</h1>
          <p className="offerings-hero-desc">
            Engage in thoughtfully curated practices including yoga, pilates, meditation, breathwork, and mindful movement, designed to cultivate strength, clarity, balance, and inner calm.
          </p>
        </div>
      </section>

      {/* Grid Content Section */}
      <section className="offerings-main-section" aria-label="Mindfulness Destinations">
        <div className="offerings-section-header">
          <span className="eyebrow">PRACTICES & INSTRUCTORS</span>
          <h2 className="offerings-section-title">Mindful Sanctuaries</h2>
          <p>
            Explore our serene locations offering wellness retreats, guided meditations, and yoga classes taught by world-class instructors.
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
