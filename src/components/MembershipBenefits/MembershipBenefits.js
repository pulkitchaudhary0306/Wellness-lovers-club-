import "./MembershipBenefits.css";

export default function MembershipBenefits() {
  const benefits = [
    {
      id: "rates",
      title: "Preferred Rates",
      desc: "Save on stays, retreats & more.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="16" y1="2" x2="16" y2="4" />
          <line x1="8" y1="2" x2="8" y2="4" />
          <path d="M7 10H17" />
          <path d="M7 14H13" />
        </svg>
      ),
    },
    {
      id: "access",
      title: "Exclusive Access",
      desc: "Invitations to private events & offers.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C10.9 2 10 2.9 10 4V6H14V4C14 2.9 13.1 2 12 2Z" />
          <rect x="5" y="6" width="14" height="12" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 14V16" />
        </svg>
      ),
    },
    {
      id: "support",
      title: "Wellness Support",
      desc: "Guidance for your wellness journey.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.3 3 12 4 12 4C12 4 12.7 3 14.5 3C17.5 3 20 5.5 20 8.5C20 13.5 12 21 12 21Z" />
        </svg>
      ),
    },
    {
      id: "network",
      title: "Global Network",
      desc: "Connect with a community that shares your values.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <section className="m-benefits-section section-padding" aria-label="Membership Benefits">
      <div className="container">
        <div className="text-center m-benefits-header">
          <span className="eyebrow">MEMBERSHIP BENEFITS</span>
        </div>

        <div className="m-benefits-grid">
          {benefits.map((b) => (
            <div className="m-benefit-item" key={b.id}>
              <div className="m-benefit-icon-wrapper">
                {b.icon}
              </div>
              <h3 className="m-benefit-title">{b.title}</h3>
              <p className="m-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
