import Image from "next/image";
import Link from "next/link";
import "../offerings/offerings.css";

export const metadata = {
  title: "Our Services | Wellness Lovers Club",
  description: "Explore our comprehensive suite of luxury wellness services, restorative therapies, longevity retreats, and curated member privileges.",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Wellness Retreats & Immersion",
      desc: "Immersive escapes designed to restore your mind, body and perspective in pristine natural sanctuaries across India and globally.",
      img: "/images/wellness-retreat-cabin.webp",
      category: "Escapes & Longevity",
      link: "/offerings/wellness-retreats"
    },
    {
      title: "Spa & Holistic Healing Therapies",
      desc: "Ancient Ayurvedic healing wisdom, traditional Thai therapies, and modern restorative treatments curated for complete physiological renewal.",
      img: "/images/spa-healing-room.webp",
      category: "Therapies & Spas",
      link: "/offerings/spa-healing"
    },
    {
      title: "Movement & Mindfulness Programs",
      desc: "Thoughtfully guided practices including mindful yoga, meditation, breathwork, and sound journeys designed for inner calm.",
      img: "/images/movement-mindfulness-yoga.webp",
      category: "Mindfulness",
      link: "/offerings/movement-mindfulness"
    },
    {
      title: "Exceptional Accommodations & Stays",
      desc: "Preferred access to world-class wellness resorts, luxury boutique hotels, and tranquil island sanctuaries worldwide.",
      img: "/images/luxury-stays-cabana.webp",
      category: "Luxury Stays",
      link: "/offerings/luxury-stays"
    },
    {
      title: "Biohacking & Thermal Contrast Recovery",
      desc: "State-of-the-art longevity clinics offering whole-body cryotherapy, red light collagen therapy, pressotherapy, and IV nutrient infusions.",
      img: "/images/dhun-wellness-spa.webp",
      category: "Biohacking",
      link: "/explore-offer?destination=Dhun%20Wellness%20Spa"
    },
    {
      title: "Exclusive Community & Priority Concierge",
      desc: "Direct access to private masterclasses, bespoke wellness itineraries, and high-vibrational networking with industry pioneers.",
      img: "/images/community-experiences-lounge.webp",
      category: "Community",
      link: "/membership"
    }
  ];

  return (
    <article className="offerings-page">
      {/* Hero Banner */}
      <section className="offerings-hero" aria-label="Services Hero">
        <div className="offerings-hero-container">
          <span className="offerings-hero-eyebrow">BESPOKE CARE & PRIVILEGES</span>
          <h1 className="offerings-hero-title">Our Services</h1>
          <p className="offerings-hero-desc">
            Discover a comprehensive ecosystem of holistic wellness services, clinical longevity therapies, and preferred sanctuary access designed to elevate your wellbeing.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="offerings-main-section" aria-label="Services Directory">
        <div className="offerings-section-header">
          <span className="eyebrow">SERVICES & EXPERIENCES</span>
          <h2 className="offerings-section-title">Curated for Conscious Living</h2>
          <p>
            As a verified Wellness Lovers Club member, you receive all listed privileges, preferred rates, and personal concierge support across our trusted network.
          </p>
        </div>

        <div className="offerings-grid-container">
          {services.map((service, idx) => (
            <div className="offering-item-card" key={idx}>
              <div className="offering-card-img-wrap">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority={idx < 2}
                  loading={idx < 2 ? "eager" : "lazy"}
                />
              </div>
              <div className="offering-card-content">
                <span className="offering-tag">{service.category}</span>
                <h3 className="offering-item-title">{service.title}</h3>
                <p className="offering-item-desc">{service.desc}</p>
                <div className="offering-card-footer">
                  <Link href={service.link} className="offering-action-btn">
                    Explore Services →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="offerings-cta-wrap">
          <Link href="/destinations" className="btn btn-green">
            Explore All Destinations
          </Link>
          <Link href="/membership" className="btn btn-gold">
            Apply For Membership
          </Link>
        </div>
      </section>
    </article>
  );
}
