import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Our Offerings | Wellness Lovers Club",
  description: "Explore our exclusive wellness offerings, from private retreats and spa rituals to exclusive member events and luxury wellness stays.",
};

export default function OfferingsPage() {
  const offerings = [
    {
      title: "Wellness Retreats",
      desc: "Immersive escapes designed to restore your mind, body and perspective.",
      img: "/images/wellness-retreat-cabin.webp",
      category: "Escapes",
      link: "/offerings/wellness-retreats"
    },
    {
      title: "Movement & Mindfulness",
      desc: "Move with intention. Pause with purpose. Build a healthier relationship with your body.",
      img: "/images/movement-mindfulness-yoga.webp",
      category: "Mindfulness",
      link: "/offerings/movement-mindfulness"
    },
    {
      title: "Exclusive Community Experiences",
      desc: "Meaningful connections that inspire growth, collaboration and conscious living.",
      img: "/images/community-experiences-lounge.webp",
      category: "Community"
    },
    {
      title: "Priority Access",
      desc: "Exclusive experiences reserved for those who choose wellness first.",
      img: "/images/wellness-experience.webp",
      category: "Priority"
    },
    {
      title: "Spa & Holistic Healing Experiences",
      desc: "Ancient wisdom and modern therapies curated for complete restoration.",
      img: "/images/spa-healing-room.webp",
      category: "Therapies",
      link: "/offerings/spa-healing"
    },
    {
      title: "Premier Stays",
      desc: "Discover exceptional hotels, boutique stays, and wellness resorts through our trusted network of hospitality partners, with exclusive member privileges and preferred pricing.",
      img: "/images/luxury-stays-cabana.webp",
      category: "Stays",
      link: "/offerings/luxury-stays"
    }
  ];

  return (
    <article>
      {/* Hero Banner */}
      <section className="inner-hero" aria-label="Offerings Hero">
        <div className="container inner-hero-container">
          <h1 className="inner-hero-title">Our Offerings</h1>
          <p className="inner-hero-desc">
            Explore a curated selection of wellness experiences, exclusive events, and premium lifestyle privileges designed to elevate every aspect of your wellbeing.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="inner-section" aria-label="Offerings Directory">
        <div className="container">
          <div className="text-center inner-section-header">
            <span className="eyebrow">EXPERIENCES</span>
            <h2 className="inner-section-title">Exclusive Experiences</h2>
            <p>
              As a member of Wellness Lovers Club, you gain access to exclusive partnerships, preferred pricing, and itineraries tailored to your unique wellness journey.
            </p>
          </div>

          <div className="three-col-grid">
            {offerings.map((offering, idx) => (
              <div className="premium-card" key={idx}>
                <div className="card-img-wrapper">
                  <Image
                    src={offering.img}
                    alt={offering.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="card-body">
                  <span className="card-label">{offering.category}</span>
                  <h3 className="card-heading">{offering.title}</h3>
                  <p className="card-text">{offering.desc}</p>
                  <div className="card-actions">
                    <Link href={offering.link || "/contact"} className="card-btn">
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: "56px" }}>
            <Link href="/membership" className="btn btn-gold">
              Apply For Membership
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
