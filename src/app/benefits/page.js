import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Membership Benefits | Wellness Lovers Club",
  description: "Explore the exclusive benefits of joining the Wellness Lovers Club, including preferred rates, personalized support, and global network access.",
};

export default function BenefitsPage() {
  const benefits = [
    {
      title: "Preferred Partner Rates",
      desc: "Enjoy savings and VIP upgrades at our carefully selected luxury wellness resorts, spa partners, and boutique stays worldwide.",
      img: "/images/membership-resort.jpg",
      label: "Rates"
    },
    {
      title: "Exclusive Invitations",
      desc: "Receive priority invitations to private wellness retreats, guest speaker events, sound healing sessions, and panel discussions.",
      img: "/images/exclusive-privileges.jpg",
      label: "Access"
    },
    {
      title: "Personalised Wellness Support",
      desc: "Gain access to certified wellness advisors who help customize retreat itineraries, nutrition advice, and local therapist matches.",
      img: "/images/wellness-experience.jpg",
      label: "Support"
    },
    {
      title: "Members-Only Experiences",
      desc: "Unlock rare travel opportunities and local rituals created solely for Wellness Lovers Club members.",
      img: "/images/wellness-retreat.jpg",
      label: "Experiences"
    },
    {
      title: "Global Wellness Network",
      desc: "Connect with a community of mindful individuals, luxury wellness practitioners, and brand founders who share your values.",
      img: "/images/hero-wellness.jpg",
      label: "Network"
    },
    {
      title: "Curated Recommendations",
      desc: "Access our monthly digital journal and private concierge reviews detailing the latest wellness discoveries, therapies, and retreats.",
      img: "/images/membership-spa.jpg",
      label: "Recommendations"
    }
  ];

  return (
    <article>
      {/* Hero Banner */}
      <section className="inner-hero" aria-label="Benefits Hero">
        <div className="container inner-hero-container">
          <span className="eyebrow">PRIVILEGES</span>
          <h1 className="inner-hero-title">Membership Benefits</h1>
          <p className="inner-hero-desc">
            Explore the exclusive privileges, rates, and personalized support created for our global community of wellness enthusiasts.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="inner-section" aria-label="Benefits List">
        <div className="container">
          <div className="text-center inner-section-header">
            <span className="eyebrow">CLUB PRIVILEGES</span>
            <h2 className="inner-section-title">Designed for Your Mindful Lifestyle</h2>
            <p>
              Our membership guarantees a seamless blend of luxury, rejuvenation, and genuine hospitality wherever your wellness journey takes you.
            </p>
          </div>

          <div className="three-col-grid">
            {benefits.map((b, idx) => (
              <div className="premium-card" key={idx}>
                <div className="card-img-wrapper">
                  <Image
                    src={b.img}
                    alt={b.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="card-body">
                  <span className="card-label">{b.label}</span>
                  <h3 className="card-heading">{b.title}</h3>
                  <p className="card-text">{b.desc}</p>
                  <div className="card-actions">
                    <Link href="/contact" className="card-btn">
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: "56px" }}>
            <Link href="/membership" className="btn btn-gold">
              Become a Member Today
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
