import "./FeatureStrip.css";

export default function FeatureStrip() {
  const features = [
    {
      id: "curated",
      title: "Curated for Wellness",
      desc: "Handpicked experiences for mind, body & soul.",
      // Lotus-like flower icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C12 2 9 8 5 11C2 13 2 16 2 16C2 16 6 15 9 12C12 9 12 18 12 18C12 18 12 9 15 12C18 15 22 16 22 16C22 16 22 13 19 11C15 8 12 2 12 2Z" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      id: "access",
      title: "Privileged Access",
      desc: "Members-only benefits and preferred rates.",
      // Key / Heart Shield icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
          <path d="M12 7C10.5 5.5 8.5 7.5 12 11C15.5 7.5 13.5 5.5 12 7Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      ),
    },
    {
      id: "partners",
      title: "Exclusive Partners",
      desc: "Trusted luxury wellness brands and resorts.",
      // Gift Box / Award icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M12 8V21" />
          <path d="M3 12H21" />
          <path d="M12 8C12 8 10 4 7 4C4.5 4 4.5 7 7 8C9.5 9 12 8 12 8ZM12 8C12 8 14 4 17 4C19.5 4 19.5 7 17 8C14.5 9 12 8 12 8Z" />
        </svg>
      ),
    },
    {
      id: "community",
      title: "Global Community",
      desc: "Connect with like-minded wellness lovers.",
      // Globe with nodes icon
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12H22" />
          <path d="M12 2C14.5 4.8 16 8.2 16 12C16 15.8 14.5 19.2 12 22C9.5 19.2 8 15.8 8 12C8 8.2 9.5 4.8 12 2Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="feature-strip-section" aria-label="Key Features">
      <div className="container">
        <div className="feature-grid">
          {features.map((feat) => (
            <div className="feature-item" key={feat.id}>
              <div className="feature-icon-wrapper">
                <div className="feature-icon-circle">{feat.icon}</div>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
