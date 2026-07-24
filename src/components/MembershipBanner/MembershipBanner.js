import Image from "next/image";
import Link from "next/link";
import "./MembershipBanner.css";

export default function MembershipBanner() {
  return (
    <section className="membership-banner-section section-padding" aria-label="Membership Introduction">
      <div className="container membership-banner-container">
        {/* Left Spa Image */}
        <div className="banner-left-image">
          <div className="banner-image-wrapper rect-image">
            <Image
              src="/images/membership-spa.webp"
              alt="Premium spa therapy setup with candles and flowers"
              width={400}
              height={300}
              style={{ objectFit: "cover" }}
              className="banner-img"
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="banner-center-content">
          <span className="eyebrow">MEMBERSHIP</span>
          <h2 className="banner-title">A Life of Wellness Privileges</h2>
          <p className="banner-paragraph">
            Curated experiences. Exclusive access. A community that inspires.
          </p>
          <Link href="/membership" className="btn btn-primary banner-btn">
            Become a Member
          </Link>
        </div>

        {/* Right Resort Image (Arched) */}
        <div className="banner-right-image">
          <div className="banner-image-wrapper arched-image">
            <Image
              src="/images/membership-resort.webp"
              alt="Luxury resort relaxation area with arched view"
              width={400}
              height={300}
              style={{ objectFit: "cover" }}
              className="banner-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
