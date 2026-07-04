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
      desc: "Transformative escapes in serene, handpicked locations around the world. Reconnect with nature and your inner peace.",
      img: "/images/wellness-retreat.jpg",
      category: "Escapes"
    },
    {
      title: "Spa Experiences",
      desc: "Curated therapies, mineral baths, and custom bodywork designed by premier therapists to restore vitality and release tension.",
      img: "/images/wellness-experience.jpg",
      category: "Therapies"
    },
    {
      title: "Mindfulness Programs",
      desc: "Guided meditation sessions, sound healing, and breathwork practices tailored to quiet the mind and reduce daily stress.",
      img: "/images/hero-wellness.jpg",
      category: "Mindfulness"
    },
    {
      title: "Nutrition & Well-being",
      desc: "Organic cuisine, cold-pressed juice regimens, and nutritional counseling designed to nourish and detoxify your body.",
      img: "/images/membership-spa.jpg",
      category: "Nutrition"
    },
    {
      title: "Exclusive Events",
      desc: "Private wellness workshops, keynote speaker dinners, and members-only wellness summits in major capital cities.",
      img: "/images/exclusive-privileges.jpg",
      category: "Community"
    },
    {
      title: "Luxury Wellness Stays",
      desc: "Preferred rates and VIP amenities at the world's most exclusive boutique wellness resorts and luxury hotels.",
      img: "/images/membership-resort.jpg",
      category: "Stays"
    }
  ];

  return (
    <article>
      {/* Hero Banner */}
      <section className="inner-hero" aria-label="Offerings Hero">
        <div className="container inner-hero-container">
          <span className="eyebrow">OUR SERVICES</span>
          <h1 className="inner-hero-title">Our Offerings</h1>
          <p className="inner-hero-desc">
            Explore our curated selection of high-end wellness services, exclusive events, and premium destination privileges.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="inner-section" aria-label="Offerings Directory">
        <div className="container">
          <div className="text-center inner-section-header">
            <span className="eyebrow">EXPERIENCES</span>
            <h2 className="inner-section-title">Curated For Mindful Living</h2>
            <p>
              As a member of Wellness Lovers Club, you gain access to exclusive partnerships, preferred pricing, and personalized itineraries tailored to your unique wellness journey.
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
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: "56px" }}>
            <Link href="/membership" className="btn btn-primary">
              Apply For Membership
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
