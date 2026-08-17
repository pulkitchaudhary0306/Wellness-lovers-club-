import Image from "next/image";
import Link from "next/link";
import "./offerings.css";

export const metadata = {
  title: "Our Offerings | Wellness Lovers Club",
  description: "Explore our exclusive wellness offerings, from private retreats and spa rituals to exclusive member events and luxury wellness stays.",
};

export default function OfferingsPage() {
  const offerings = [
    {
      title: "Wellness Retreats",
      desc: "Immersive escapes designed to restore your mind, body and perspective in pristine natural sanctuaries.",
      img: "/images/wellness-retreat-cabin.webp",
      category: "Escapes",
      link: "/offerings/wellness-retreats"
    },
    {
      title: "Movement & Mindfulness",
      desc: "Move with intention. Pause with purpose. Build a healthier, grounded relationship with your body.",
      img: "/images/movement-mindfulness-yoga.webp",
      category: "Mindfulness",
      link: "/offerings/movement-mindfulness"
    },
    {
      title: "Exclusive Community Experiences",
      desc: "Meaningful connections that inspire growth, high-vibrational collaboration, and conscious luxury living.",
      img: "/images/community-experiences-lounge.webp",
      category: "Community"
    },
    {
      title: "Priority Access",
      desc: "Exclusive experiences, bespoke allocations, and priority reservations reserved for members who prioritize wellness.",
      img: "/images/wellness-experience.webp",
      category: "Priority"
    },
    {
      title: "Spa & Holistic Healing Experiences",
      desc: "Ancient healing wisdom and modern restorative therapies curated for complete physiological renewal.",
      img: "/images/spa-healing-room.webp",
      category: "Therapies",
      link: "/offerings/spa-healing"
    },
    {
      title: "Exceptional Accommodations",
      desc: "Enjoy preferred access to exceptional wellness resorts, luxury stays, and tranquil restorative properties worldwide.",
      img: "/images/luxury-stays-cabana.webp",
      category: "Stays",
      link: "/offerings/luxury-stays"
    }
  ];

  return (
    <article className="offerings-page">
      {/* Hero Banner */}
      <section className="offerings-hero" aria-label="Offerings Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">EXCLUSIVE SANCTUARIES & PRIVILEGES</span>
          <h1 className="offerings-hero-title">Our Offerings</h1>
          <p className="offerings-hero-desc">
            Explore a curated selection of longevity experiences, holistic wellness retreats, and premium lifestyle privileges designed to elevate every aspect of your wellbeing.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="offerings-main-section" aria-label="Offerings Directory">
        <div className="offerings-section-header">
          <span className="eyebrow">EXPERIENCES</span>
          <h2 className="offerings-section-title">Curated for Mindful Living</h2>
          <p>
            As a member of Wellness Lovers Club, you gain access to exclusive experiences, preferred pricing and member-only privileges across our trusted wellness partners.
          </p>
        </div>

        <div className="offerings-grid-container">
          {offerings.map((offering, idx) => (
            <div className="offering-item-card" key={idx}>
              <div className="offering-card-img-wrap">
                <Image
                  src={offering.img}
                  alt={offering.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority={idx < 3}
                />
              </div>
              <div className="offering-card-content">
                <span className="offering-tag">{offering.category}</span>
                <h3 className="offering-item-title">{offering.title}</h3>
                <p className="offering-item-desc">{offering.desc}</p>
                <div className="offering-card-footer">
                  <Link href={offering.link || "/contact"} className="offering-action-btn">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="offerings-cta-wrap">
          <Link href="/membership" className="btn btn-gold">
            Apply For Membership
          </Link>
        </div>
      </section>
    </article>
  );
}
