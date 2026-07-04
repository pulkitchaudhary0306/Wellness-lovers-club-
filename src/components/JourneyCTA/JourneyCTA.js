import Image from "next/image";
import Link from "next/link";
import "./JourneyCTA.css";

export default function JourneyCTA() {
  return (
    <section className="journey-section section-padding" aria-label="Start Your Journey">
      <div className="container journey-container">
        {/* Left Side: Zen Stones Beach Image */}
        <div className="journey-image-column">
          <div className="journey-image-wrapper">
            <Image
              src="/images/journey-wellness.jpg"
              alt="Stacked zen stones on a peaceful beach at sunset"
              width={500}
              height={350}
              style={{ objectFit: "cover" }}
              className="journey-img"
            />
          </div>
        </div>

        {/* Right Side: Text & Contact & Lotus Artwork */}
        <div className="journey-content-column">
          {/* Decorative background lotus (SVG) */}
          <div className="journey-lotus-deco" aria-hidden="true">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M60 10C60 10 50 40 35 55C20 70 5 60 5 60C5 60 25 80 45 75C65 70 60 110 60 110C60 110 65 70 85 75C105 80 115 60 115 60C115 60 100 70 85 55C70 40 60 10 60 10Z"
                stroke="var(--gold)"
                strokeWidth="1"
                strokeOpacity="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="journey-text-content">
            <h2 className="journey-title">Begin Your Wellness Journey</h2>
            <p className="journey-subtitle">Join Wellness Lovers Club today.</p>

            <div className="journey-contacts">
              <a href="mailto:hello@wellnessloversclub.com" className="journey-contact-item">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                hello@wellnessloversclub.com
              </a>
              <a href="https://wellnessloversclub.com" target="_blank" rel="noopener noreferrer" className="journey-contact-item">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                wellnessloversclub.com
              </a>
            </div>

            <div className="journey-actions">
              <Link href="/membership" className="btn btn-primary journey-btn">
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
