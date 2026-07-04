import "./WellnessPillars.css";

export default function WellnessPillars() {
  const pillars = [
    {
      id: "mind",
      name: "Mind",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 10C9 10 10.5 8.5 12 8.5C13.5 8.5 15 10 15 10" />
          <path d="M8.5 13C8.5 13 10 15 12 15C14 15 15.5 13 15.5 13" />
          <line x1="12" y1="8.5" x2="12" y2="15.5" strokeDasharray="1 1" />
        </svg>
      ),
    },
    {
      id: "body",
      name: "Body",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="5" r="2" />
          <path d="M6 12C6 12 9 9 12 9C15 9 18 12 18 12" />
          <path d="M12 9V16L9 21M12 16L15 21" />
        </svg>
      ),
    },
    {
      id: "soul",
      name: "Soul",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2C12 2 9 8 5 11C2 13 2 16 2 16C2 16 6 15 9 12C12 9 12 18 12 18C12 18 12 9 15 12C18 15 22 16 22 16C22 16 22 13 19 11C15 8 12 2 12 2Z" />
        </svg>
      ),
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
        </svg>
      ),
    },
    {
      id: "community",
      name: "Community",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21" />
          <circle cx="12" cy="13" r="4" />
          <path d="M23 21V19C23 17.9 22.1 17 21 17H19.5" />
          <circle cx="21" cy="13" r="3" />
          <path d="M1 21V19C1 17.9 1.9 17 3 17H4.5" />
          <circle cx="3" cy="13" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="pillars-section section-padding" aria-label="Wellness Pillars">
      <div className="container">
        <div className="text-center pillars-header">
          <span className="eyebrow">THE WELLNESS PILLARS</span>
        </div>

        <div className="pillars-wrapper">
          <div className="pillars-container">
            {pillars.map((pillar, index) => (
              <div className="pillar-item-wrapper" key={pillar.id}>
                <div className="pillar-item">
                  <div className="pillar-icon">{pillar.icon}</div>
                  <h3 className="pillar-name">{pillar.name}</h3>
                </div>
                {index < pillars.length - 1 && <div className="pillar-divider" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
