import Image from "next/image";
import "./Offerings.css";

export default function Offerings() {
  const cards = [
    {
      id: "retreats",
      title: "Wellness Retreats",
      desc: "Transformative escapes in serene locations.",
      img: "/images/wellness-retreat.jpg",
      // Leaf icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C12 2 19 7 19 13C19 16.8 15.8 20 12 20C8.2 20 5 16.8 5 13C5 7 12 2 12 2Z" />
          <path d="M12 2V20" />
          <path d="M12 8C12 8 15 9 16 11" />
          <path d="M12 12C12 12 9 13 8 15" />
        </svg>
      ),
    },
    {
      id: "experiences",
      title: "Wellness Experiences",
      desc: "Curated therapies and rituals for total well-being.",
      img: "/images/wellness-experience.jpg",
      // Lotus icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3C12 3 9 9 5 12C2 14 2 17 2 17C2 17 6 16 9 13C12 10 12 19 12 19C12 19 12 10 15 13C18 16 22 17 22 17C22 17 22 14 19 12C15 9 12 3 12 3Z" />
        </svg>
      ),
    },
    {
      id: "privileges",
      title: "Exclusive Privileges",
      desc: "Special access and savings designed for you.",
      img: "/images/exclusive-privileges.jpg",
      // Star icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
      ),
    },
  ];

  return (
    <section className="offerings-section section-padding" aria-label="Our Offerings">
      <div className="container">
        <div className="text-center offerings-header">
          <span className="eyebrow">OUR OFFERINGS</span>
          <h2 className="offerings-section-title">Nurturing Mind, Body & Soul</h2>
        </div>

        <div className="offerings-grid">
          {cards.map((card) => (
            <div className="offering-card" key={card.id}>
              <div className="offering-image-wrapper">
                <Image
                  src={card.img}
                  alt={card.title}
                  width={380}
                  height={250}
                  style={{ objectFit: "cover" }}
                  className="offering-img"
                />
                <div className="offering-badge-icon" aria-hidden="true">
                  {card.icon}
                </div>
              </div>
              <div className="offering-content">
                <h3 className="offering-card-title">{card.title}</h3>
                <p className="offering-card-desc">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
