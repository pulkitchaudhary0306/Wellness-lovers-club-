import Link from "next/link";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero-section" aria-label="Hero Banner">
      <div className="hero-overlay"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-icon-container">
            <svg
              className="hero-lotus-icon"
              viewBox="0 0 100 100"
              fill="none"
              xmlns=""
            >
              <path
                d="M50 15C50 15 42 35 32 45C22 55 10 50 10 50C10 50 25 62 38 58C50 54 50 75 50 75C50 75 50 54 62 58C75 62 90 50 90 50C90 50 78 55 68 45C58 35 50 15 50 15Z"
                stroke="var(--gold)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M50 35C50 35 45 48 38 53C31 58 22 56 22 56C22 56 31 63 40 60C49 57 50 70 50 70C50 70 51 57 60 60C69 63 78 56 78 56C78 56 69 58 62 53C55 48 50 35 50 35Z"
                stroke="var(--gold)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="hero-title">
            Elevated Wellness,<br />Beautifully Curated
          </h1>

          <p className="hero-subtitle">
            A members club for mindful living with handpicked experiences and privileges that inspire your best life.
          </p>

          <div className="hero-actions">
            <Link href="/membership" className="btn btn-primary">
              Become a Member
            </Link>
            <Link href="/offerings" className="btn btn-outline">
              Explore Our Offerings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
