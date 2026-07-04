import "./about.css";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* 1. Hero Section */}
      <section className="about-section">
        <div className="about-content">
          <h1 className="about-title">
            Conscious Living, Elevated.
          </h1>
          <p className="about-description">
            Wellness Lovers Club is a premier members club for mindful living. We curate handpicked experiences, privileges, and connections that inspire your best life, helping you invest in your mind, body, and soul with intention.
          </p>
          <div className="about-buttons">
            <Link href="/membership" className="btn-sage">
              Become a Member
            </Link>
            <Link href="/services" className="btn-sage-outline">
              Explore Offerings
            </Link>
          </div>
        </div>
        <div className="about-image-wrapper">
          <img
            src="/homepage/d30a5470622d212e7ae19d485f9e1911.jpg"
            alt="Conscious Living"
            className="img-top-left-rounded"
          />
        </div>
      </section>

      {/* 2. Calibration / Philosophy Detail Section */}
      <section className="about-section reverse">
        <div className="about-content">
          <h2 className="about-title">
            A Wellness Movement Nurtured by GlobalSpa
          </h2>
          <p className="about-description">
            Backed by GlobalSpa — India&apos;s leading wellness and luxury lifestyle media brand — WLC is more than a club. It is a movement that brings together like-minded individuals, luxury brands, and world-class retreats to foster a culture of conscious living.
          </p>
          <p className="about-description">
            We believe that true luxury is the freedom to focus on personal well-being. WLC serves as your trusted companion, offering preferred rates, bespoke wellness itineraries, and members-only events that nurture your spiritual and physical growth.
          </p>
          
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years of Legacy</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Members Globally</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Luxury Partners</span>
            </div>
          </div>
        </div>
        <div className="about-image-wrapper">
          <img
            src="/homepage/1d8a0a0d24ef6d5d4eef7e4564b4dab8.jpg"
            alt="GlobalSpa Legacy"
            className="img-bottom-left-rounded"
          />
        </div>
      </section>

      {/* 3. Core Value Propositions Section */}
      <section className="about-section core-values-section">
        <div className="about-content" style={{ maxWidth: '600px' }}>
          <h2 className="about-title">Our Core Pillars of Wellness</h2>
          <p className="about-description">
            Every privilege, retreat partnership, and community gathering we organize is built upon our four core pillars, designed to provide a holistic and premium experience.
          </p>
        </div>
        
        <div className="core-values-wrapper">
          <div className="values-grid">
            {/* Card 1: Mindful Living */}
            <div className="value-card">
              <svg className="value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10M12 10c1-2.5 3-4 6-4M12 13c-1.5-2-3.5-3-6-3" />
                <path d="M12 10c-1-2.5-3-4-6-4" />
              </svg>
              <h3 className="value-title">Mindful Living</h3>
              <p className="value-text">
                An active alignment of your choices with personal health, conscious consumption, and inner balance.
              </p>
            </div>
            
            {/* Card 2: Privileged Access */}
            <div className="value-card">
              <svg className="value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3 className="value-title">Privileged Access</h3>
              <p className="value-text">
                Unlocking special rates, private entries, and unique benefits across global luxury wellness properties.
              </p>
            </div>
            
            {/* Card 3: Global Community */}
            <div className="value-card">
              <svg className="value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 className="value-title">Global Community</h3>
              <p className="value-text">
                Connecting you with like-minded wellness lovers, visionaries, and wellness experts worldwide.
              </p>
            </div>
            
            {/* Card 4: Curated Experiences */}
            <div className="value-card">
              <svg className="value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="12" />
                <line x1="12" y1="12" x2="22" y2="8.5" />
                <line x1="12" y1="12" x2="2" y2="8.5" />
              </svg>
              <h3 className="value-title">Curated Experiences</h3>
              <p className="value-text">
                Bespoke journeys, healing retreats, and holistic workshops curated to enrich mind, body, and soul.
              </p>
            </div>
          </div>
          
          <div className="about-image-wrapper values-image">
            <img
              src="/homepage/eb9fb38adaf4e895f43ef0798cf67c3a.jpg"
              alt="Our Pillars"
              className="img-bottom-right-rounded"
            />
          </div>
        </div>
      </section>

      {/* 4. Message Section */}
      <section className="about-section">
        <div className="about-image-wrapper">
          <img
            src="/homepage/41dfe3d2198e675d587959f122ba984a.jpg"
            alt="A Message from our Founders"
            className="img-top-right-rounded"
          />
        </div>
        <div className="about-content">
          <h2 className="about-title">A Message From Our Founders</h2>
          
          <p className="about-description">
            &ldquo;Wellness Lovers Club was born out of a desire to create a global sanctuary for those seeking conscious lifestyle choices. We recognized that true wellness is not just a temporary escape, but a lifelong commitment to self-care, shared with a community that supports your highest aspirations.&rdquo;
          </p>
          
          <p className="about-description">
            &ldquo;Through our deep association with GlobalSpa, we bring the world&apos;s most trusted wellness authorities, holistic destinations, and exclusive privileges directly to you, making intentional living effortless and beautiful.&rdquo;
          </p>
          
          <div className="message-quote">
            &ldquo;We curation meaningful experiences that inspire, restore, and connect. Welcome to a higher level of mindful living.&rdquo;
            <span className="message-author">— The Founders of Wellness Lovers Club & GlobalSpa</span>
          </div>
        </div>
      </section>
    </div>
  );
}
