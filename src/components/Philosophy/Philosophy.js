import Image from "next/image";
import "./Philosophy.css";

export default function Philosophy() {
  return (
    <section className="philosophy-section section-padding" aria-label="Our Philosophy">
      <div className="container philosophy-container">
        <div className="philosophy-text-column">
          <span className="eyebrow">OUR PHILOSOPHY</span>
          <h2 className="philosophy-title">
            Conscious Living,<br />Elevated
          </h2>
          <p className="philosophy-description">
            We curate meaningful experiences that nurture, restore and inspire.
          </p>
        </div>
        <div className="philosophy-image-column">
          <div className="philosophy-image-wrapper">
            <Image
              src="/images/philosophy-resort.jpg"
              alt="Luxury tropical wellness resort infinity pool"
              width={600}
              height={400}
              style={{ objectFit: "cover" }}
              className="philosophy-img"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
