import "./about.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Our Philosophy | Wellness Lovers Club",
  description: "Learn more about the movement nurtured by GlobalSpa and the people behind Wellness Lovers Club.",
};

export default function AboutPage() {
  const leadershipTeam = [
    {
      role: "Founder",
      name: "Parineeta Sethi",
      tagline: "Founder, Wellness Lovers Club",
      bio1: "Parineeta's journey into wellness began long before WLC - rooted in a personal quest for balance, meaning, and beauty in everyday living. She envisioned a space where like-minded individuals could come together not just to escape, but to truly transform.",
      bio2: "Her philosophy is simple: wellness is not a luxury reserved for a few - it is a right that every conscious individual deserves access to. Through WLC, she has brought that vision to life, curating experiences that are as soulful as they are exquisite.",
      quote: "Wellness Lovers Club was born from a deep desire to create a sanctuary - not just a membership. A place where you come not to escape your life, but to fall in love with it.",
      img: "/founders/Parineeta Sethi.png",
      imgPosition: "top center"
    },
    {
      role: "Founder",
      name: "Abhinav Kaushal",
      tagline: "Founder, Wellness Lovers Club",
      bio1: "Abhinav brings a rare combination of entrepreneurial vision and a genuine passion for holistic living. With a background in building luxury lifestyle communities, he understood early that the modern individual was seeking more than products - they were seeking purpose.",
      bio2: "His belief that luxury and wellness are not opposing forces, but natural companions, is the very foundation on which WLC is built. He continues to shape the club's direction - ensuring every experience carries both elegance and intention.",
      quote: "True wellness is not about retreating from the world - it is about returning to yourself. WLC exists to make that journey effortless, beautiful, and deeply personal.",
      img: "/founders/Abhinav Kaushal.png",
      imgPosition: "center center"
    },
    {
      role: "Director",
      name: "Vinit Pandhi",
      tagline: "Director, Wellness Lovers Club",
      bio1: "Vinit is the force behind WLC's world-class partnerships and brand ecosystem. With deep roots in the luxury and hospitality industry, he has spent years forging relationships with the finest wellness brands, spas, and retreat destinations across the globe.",
      bio2: "He believes that a community is only as strong as the experiences it offers, and his relentless pursuit of excellence ensures that every WLC partnership reflects the highest standards of quality, trust, and care.",
      quote: "We don't just partner with brands - we choose allies who share our commitment to conscious luxury. Every experience we offer is one we would choose for ourselves.",
      img: "/founders/Vinit Pandhi.jpeg",
      imgPosition: "center center"
    },
    {
      role: "Director",
      name: "Soumya Maheshwari",
      tagline: "Director, Wellness Lovers Club",
      bio1: "Soumya has been part of India's wellness and luxury lifestyle media space for several years, working closely with brands, experts, destinations, and thought leaders who are shaping the future of wellbeing. Through these experiences, he has developed a deep understanding of the many ways wellness influences how we live, work, and connect.",
      bio2: "Soumya believes wellness is not defined by trends but by the choices we make every day. His approach is centred on creating genuine connections, encouraging thoughtful conversations, and making every member feel seen, supported, and inspired. Under his guidance, WLC continues to evolve as more than a community—it's a space where people come together to learn, grow, and embrace wellbeing in all its forms.",
      quote: "The conversations we have, the places we discover, and the people we meet often shape our wellbeing more than we realise.",
      img: "/founders/Soumya Maheshwari.jpeg",
      imgPosition: "center top"
    }
  ];

  return (
    <div className="about-page-container">
      {/* Hero Header */}
      <section className="about-hero" aria-label="About Us Hero">
        <div className="about-hero-container">
          <span className="about-hero-eyebrow">CONSCIOUS LIVING & WELLBEING</span>
          <h1 className="about-hero-title">About Us</h1>
          <p className="about-hero-desc">
            A wellness movement dedicated to mindful luxury, world-class retreat sanctuaries, and holistic personal transformation.
          </p>
        </div>
      </section>

      {/* SECTION 1 — A WELLNESS MOVEMENT NURTURED BY GLOBALSPA */}
      <section className="about-sec" aria-label="A Wellness Movement">
        <div className="about-sec-content">
          <span className="about-eyebrow"> WELLNESS LOVERS CLUB · BY GLOBALSPA</span>
          <h2 className="about-sec-title">A Wellness Movement Nurtured by GlobalSpa</h2>
          <p className="about-sec-desc">
            Backed by <strong>GlobalSpa</strong> - India&apos;s leading wellness and luxury lifestyle media brand - WLC is more than a club. It is a movement that brings together like-minded individuals, luxury brands, and world-class retreats to foster a culture of conscious living.
          </p>
          <p className="about-sec-desc">
            We believe that true luxury is the freedom to focus on personal well-being. WLC serves as your trusted companion, offering preferred rates, bespoke wellness experiences, and members-only events that nurture your spiritual and physical growth.
          </p>
        </div>
        <div className="about-sec-image-wrapper">
          <div className="about-image-container">
            <Image
              src="/images/nurtured-by-globalspa.webp"
              alt="Woman meditating in a forest deck overlooking a geothermal hot spring"
              fill
              sizes="(max-width: 991px) 100vw, 420px"
              priority
              className="arch-image"
            />
          </div>
        </div>
      </section>

      {/* GLOBALSPA LINK BAR */}
      <a
        href="https://globalspaonline.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="globalspa-bar"
      >
        <div className="globalspa-bar-text">
          <span>GlobalSpa</span>
          INDIA&apos;S #1 WELLNESS & LUXURY LIFESTYLE MEDIA BRAND
        </div>
        <div className="globalspa-bar-link">
          VISIT GLOBALSPA.IN →
        </div>
      </a>

      {/* STATS STRIP */}
      <section className="stats-strip" aria-label="Wellness Statistics">
        <div className="stat-box">
          <div className="stat-box-num">12+</div>
          <div className="stat-box-label">Years of Wellness Excellence</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-num">1,50,000+</div>
          <div className="stat-box-label">Subscribers & Community Members</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-num">100+</div>
          <div className="stat-box-label">Luxury Wellness Partners</div>
        </div>
      </section>

      {/* SECTION 2 — CONSCIOUS LIVING, ELEVATED */}
      <section className="about-sec cream-bg reverse" aria-label="Conscious Living Elevated">
        <div className="about-sec-content">
          <span className="about-eyebrow">OUR PHILOSOPHY</span>
          <h2 className="about-sec-title">Conscious Living, Elevated.</h2>
          <p className="about-sec-desc">
            Wellness Lovers Club is a premier members club for mindful living. We curate handpicked experiences, privileges, and connections that inspire your best life, helping you invest in your mind, body, and soul with intention.
          </p>
          <Link href="/membership" className="about-cta-btn">
            Become a Member
          </Link>
        </div>
        <div className="about-sec-image-wrapper">
          <div className="about-image-container">
            <Image
              src="/images/philosophy-pool.webp"
              alt="Luxury tropical wellness resort pool with palm trees"
              fill
              sizes="(max-width: 991px) 100vw, 420px"
              className="arch-image"
            />
          </div>
        </div>
      </section>

      {/* LEADERSHIP BANNER */}
      <section aria-label="Leadership team">
        <div className="leadership-header">
          <h2 className="leadership-header-title">The People Behind WLC</h2>
          <p className="leadership-header-subtitle">
            United by a shared belief that wellness is not a destination, but a way of life.
          </p>
        </div>

        {/* TEAM MEMBERS ALTERNATING GRID */}
        {leadershipTeam.map((leader, idx) => (
          <div className={`leader-row ${idx % 2 === 1 ? "reverse" : ""}`} key={idx}>
            <div className="leader-content">
              <span className="leader-role">{leader.role}</span>
              <h3 className="leader-name">{leader.name}</h3>
              <span className="leader-tagline">{leader.tagline}</span>
              <p className="leader-bio">{leader.bio1}</p>
              <p className="leader-bio">{leader.bio2}</p>
              <div className="leader-quote-box">
                <p className="leader-quote-text">&ldquo;{leader.quote}&rdquo;</p>
                <div className="leader-quote-author">
                  {leader.name}, {leader.tagline}
                </div>
              </div>
            </div>
            <div className="leader-image-wrapper">
              <div className="about-image-container">
                <Image
                  src={leader.img}
                  alt={`${leader.name} headshot`}
                  fill
                  sizes="(max-width: 991px) 100vw, 420px"
                  className="arch-image"
                  style={{ objectPosition: leader.imgPosition || "center center" }}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* BECOME A MEMBER BAR — BOTTOM OF PAGE */}
      <section className="become-member-banner" aria-label="Membership Invitation">
        <div className="become-member-banner-inner">
          <div className="become-member-banner-quote">
            &ldquo;Your wellness journey begins here.&rdquo;
          </div>
          <Link href="/membership" className="about-cta-btn">
            Become a Member
          </Link>
        </div>
      </section>
    </div>
  );
}
