import Image from "next/image";
import "./Offerings.css";

export default function Offerings() {
  const cards = [
    {
      id: "retreats",
      title: "Wellness Retreats",
      desc: "Immersive escapes designed to restore your mind, body and perspective.",
      img: "/images/wellness-retreat-cabin.webp",
      // Leaf icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 22C2 22 6 18 12 17C18 16 22 10 22 2C22 2 14 2 9 8C4 14 2 22 2 22Z" />
          <path d="M12 12L17 7" />
          <path d="M8 16L11 13" />
        </svg>
      ),
    },
    {
      id: "mindfulness",
      title: "Movement & Mindfulness",
      desc: "Move with intention. Pause with purpose. Build a healthier relationship with your body.",
      img: "/images/movement-mindfulness-yoga.webp",
      // Lotus icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 10h14c1.5 0 2.5-1.5 2.5-3s-1-3-2.5-3-2.5 1.5-2.5 3" />
          <path d="M8 14h12c1.5 0 2.5 1.5 2.5 3s-1 3-2.5 3-2.5-1.5-2.5-3" />
          <path d="M4 18h7c1.5 0 2.5-1.5 2.5-3s-1-3-2.5-3" />
        </svg>
      ),
    },
    {
      id: "community",
      title: "Exclusive Community Experiences",
      desc: "Meaningful connections that inspire growth, collaboration and conscious living.",
      img: "/images/community-experiences-lounge.webp",
      // Star icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      id: "access",
      title: "Priority Access",
      desc: "Exclusive experiences reserved for those who choose wellness first.",
      img: "/images/priority-access.webp",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      ),
    },
    {
      id: "spa",
      title: "Spa & Holistic Healing Experiences",
      desc: "Ancient wisdom and modern therapies curated for complete restoration.",
      img: "/images/spa-healing-room.webp",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21a7 7 0 0 0 7-7H5a7 7 0 0 0 7 7z" />
          <path d="M12 14v-4" />
          <path d="M12 5.5c-.8 1.5-1.5 2.5-1.5 3.5 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-1-.7-2-1.5-3.5z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "stays",
      title: "Premier Stays",
      desc: "Discover exceptional hotels, boutique stays, and wellness resorts through our trusted network of hospitality partners, with exclusive member privileges and preferred pricing.",
      img: "/images/luxury-stays-cabana.webp",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
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
