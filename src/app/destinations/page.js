"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./destinations.css";

export default function DestinationsPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const filters = [
    { label: "ALL", value: "ALL" },
    { label: "NORTH INDIA", value: "NORTH INDIA" },
    { label: "SOUTH INDIA", value: "SOUTH INDIA" },
    { label: "WEST INDIA", value: "WEST INDIA" },
    { label: "EAST INDIA", value: "EAST INDIA" },
    { label: "INTERNATIONAL", value: "INTERNATIONAL" }
  ];

  const markers = [
    {
      id: "himalayas",
      name: "Himalayas",
      region: "NORTH INDIA",
      x: 130,
      y: 100,
      details: "Serene mountain retreats for renewal and mindful living."
    },
    {
      id: "delhi",
      name: "Delhi NCR",
      region: "NORTH INDIA",
      x: 129,
      y: 150,
      details: "Urban luxury, holistic wellness, and premium experiences."
    },
    {
      id: "rajasthan",
      name: "Rajasthan",
      region: "WEST INDIA",
      x: 90,
      y: 185,
      details: "Royal heritage stays and immersive wellness escapes."
    },
    {
      id: "mumbai",
      name: "Maharashtra",
      region: "WEST INDIA",
      x: 104,
      y: 285,
      details: "Luxury coastal retreats, wellness resorts, and vibrant city escapes."
    },
    {
      id: "goa",
      name: "Goa",
      region: "WEST INDIA",
      x: 80,
      y: 345,
      details: "Beachfront sanctuaries blending relaxation and rejuvenation."
    },
    {
      id: "bengaluru",
      name: "Karnataka",
      region: "SOUTH INDIA",
      x: 125,
      y: 380,
      details: "Nature-inspired retreats and contemporary wellness destinations."
    },
    {
      id: "kerala",
      name: "Kerala",
      region: "SOUTH INDIA",
      x: 115,
      y: 425,
      details: "Ayurvedic traditions, backwater retreats, and holistic healing."
    }
  ];

  const regionCards = [
    {
      region: "NORTH INDIA",
      title: "Himalayan Retreats",
      cities: "Rishikesh · Mussoorie",
      stats: "2 properties"
    },
    {
      region: "SOUTH INDIA",
      title: "Coastal & Ayurvedic",
      cities: "Kerala · Bengaluru · Chennai · Pondicherry",
      stats: "4 properties"
    },
    {
      region: "WEST INDIA",
      title: "Luxury & Leisure",
      cities: "Goa · Mumbai · Rajasthan · Gujarat",
      stats: "4 properties"
    },
    {
      region: "EAST INDIA",
      title: "Nature & Spiritual",
      cities: "Darjeeling · Gangtok · Assam",
      stats: "3 properties"
    }
  ];

  const partnerProperties = [
    {
      name: "Niraamaya Retreats Surya Samudra",
      region: "SOUTH INDIA",
      location: "Kovalam, Trivandrum, Kerala",
      category: "Wellness Retreat",
      img: "/images/niraamaya-retreat-real.webp",
      link: "/offerings/wellness-retreats"
    },
    {
      name: "Swastik Luxury Wellbeing Sanctuary",
      region: "WEST INDIA",
      location: "Pune, Maharashtra",
      category: "Wellness Retreat",
      img: "/images/swastik-sanctuary-real.webp",
      link: "/offerings/wellness-retreats"
    },
    {
      name: "The Wellness Co",
      region: "NORTH INDIA",
      location: "Karma Lakelands, Gurgaon",
      category: "Spa & Therapies",
      img: "/images/wellness-co-real.webp",
      link: "/offerings/spa-healing"
    },
    {
      name: "Viveda Wellness Resort",
      region: "WEST INDIA",
      location: "Nashik, Maharashtra",
      category: "Wellness Retreat",
      img: "/images/viveda-resort-real.webp",
      link: "/offerings/wellness-retreats"
    },
    {
      name: "Niraamaya Retreats Backwaters & Beyond",
      region: "SOUTH INDIA",
      location: "Kumarakom, Kerala",
      category: "Spa & Therapies",
      img: "/images/niraamaya-backwaters-spa.webp",
      link: "/offerings/spa-healing"
    },
    {
      name: "Pema Wellness",
      region: "EAST INDIA",
      location: "Visakhapatnam, Andhra Pradesh",
      category: "Spa / Luxury Stay",
      img: "/images/pema-wellness-spa.webp",
      link: "/offerings/spa-healing"
    },
    {
      name: "Silhouette Salon",
      region: "NORTH INDIA",
      location: "Gurgaon, Haryana",
      category: "Spa & Salon",
      img: "/images/silhouette-salon-spa.webp",
      link: "/offerings/spa-healing"
    },
    {
      name: "Dhun Wellness",
      region: "WEST INDIA",
      location: "Mumbai, Maharashtra",
      category: "Holistic Spa",
      img: "/images/dhun-wellness-spa.webp",
      link: "/offerings/spa-healing"
    },
    {
      name: "Andaaz - Hyatt Hotel",
      region: "NORTH INDIA",
      location: "Aerocity, New Delhi",
      category: "Luxury Stay",
      img: "/images/andaz-stay.webp",
      link: "/offerings/luxury-stays"
    },
    {
      name: "Shangri-La Eros",
      region: "NORTH INDIA",
      location: "Connaught Place, New Delhi",
      category: "Luxury Stay",
      img: "/images/shangri-la-stay.webp",
      link: "/offerings/luxury-stays"
    },
    {
      name: "Viva Mayr",
      region: "INTERNATIONAL",
      location: "Maria Wörth, Austria",
      category: "Wellness Retreat",
      img: "/images/vivamayr-austria-real.webp",
      link: "/offerings/wellness-retreats"
    }
  ];

  const filteredRegions = regionCards.filter(
    (card) => activeFilter === "ALL" || card.region === activeFilter
  );

  const filteredProperties = partnerProperties.filter(
    (prop) => activeFilter === "ALL" || prop.region === activeFilter
  );

  const internationalDestinations = [
    { flag: "🇮🇩", name: "Bali, Indonesia", type: "WELLNESS RETREATS" },
    { flag: "🇲🇻", name: "Maldives", type: "LUXURY SPA RESORTS" },
    { flag: "🇹🇭", name: "Thailand", type: "HOLISTIC HEALING" },
    { flag: "🇨🇭", name: "Switzerland", type: "ALPINE WELLNESS" },
    { flag: "🇱🇰", name: "Sri Lanka", type: "AYURVEDA & NATURE" },
    { flag: "🇦🇪", name: "Dubai, UAE", type: "LUXURY SPA & STAYS" }
  ];

  const handleFilterClick = (value) => {
    setActiveFilter(value);
    if (value === "INTERNATIONAL") {
      const element = document.getElementById("international-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const element = document.getElementById("properties-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <article>
      {/* Hero Header */}
      <section className="destinations-hero" aria-label="Destinations Hero">
        <div className="container inner-hero-container">
          <h1 className="inner-hero-title">Discover Your Next <br /> Wellness Escape</h1>
          <p className="inner-hero-desc">
            From the Himalayas to coastal sanctuaries, from ancient Ayurvedic retreats to modern luxury spas - every WLC destination is handpicked for members who seek transformation.
          </p>
        </div>

        {/* Filter row */}
        <div className="filter-row">
          {filters.map((filter, idx) => (
            <button
              key={idx}
              className={`filter-btn ${filter.value === "INTERNATIONAL" ? "international-btn" : ""} ${activeFilter === filter.value ? "active" : ""
                }`}
              onClick={() => handleFilterClick(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Indian Pride Banner Removed */}

      {/* Interactive Map Section */}
      <section className="container" aria-label="India Map Visualizer" style={{ padding: "0 20px" }}>
        <div className="map-box">
          <div className="map-header">
            <span className="map-title-label">INDIA MAP</span>
            <span className="map-developer-note">[ Hover markers for exclusive partner details ]</span>
          </div>

          <div className="map-illustration-container">
            <svg
              viewBox="0 0 400 480"
              className="india-svg-graphic"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stylized outline of India replaced with dotted map image */}
              <image
                href="/images/india-dotted.webp"
                x="0"
                y="0"
                width="400"
                height="480"
                preserveAspectRatio="xMidYMid meet"
                style={{ mixBlendMode: "multiply" }}
              />

              {/* Dotted Constellation Lines */}
              <line x1="130" y1="100" x2="129" y2="150" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="129" y1="150" x2="90" y2="185" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="90" y1="185" x2="104" y2="285" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="104" y1="285" x2="80" y2="345" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="80" y1="345" x2="115" y2="425" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="115" y1="425" x2="125" y2="380" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="125" y1="380" x2="129" y2="150" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />

              {/* Interactive SVG Markers */}
              {markers.map((marker) => {
                const isDimmed = activeFilter !== "ALL" && marker.region !== activeFilter;
                const isHighlighted = activeFilter !== "ALL" && marker.region === activeFilter;

                return (
                  <g
                    key={marker.id}
                    className={`map-marker-group ${isDimmed ? "dimmed" : ""} ${isHighlighted ? "highlighted" : ""
                      }`}
                    onMouseEnter={() => setHoveredMarker(marker)}
                    onMouseLeave={() => setHoveredMarker(null)}
                    onClick={() => handleFilterClick(marker.region)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle cx={marker.x} cy={marker.y} r="10" fill="rgba(13, 86, 63, 0.18)" />
                    <circle cx={marker.x} cy={marker.y} r="4.5" fill="#0d563f" />
                    <text
                      x={marker.x + (marker.id === "goa" || marker.id === "rajasthan" ? -16 : marker.id === "kerala" || marker.id === "himalayas" ? 0 : 16)}
                      y={marker.y + (marker.id === "kerala" ? 22 : marker.id === "himalayas" ? -18 : 4)}
                      textAnchor={marker.id === "goa" || marker.id === "rajasthan" ? "end" : marker.id === "kerala" || marker.id === "himalayas" ? "middle" : "start"}
                      fill="#0d563f"
                      fontSize="9px"
                      fontFamily="Montserrat"
                      fontWeight="bold"
                      letterSpacing="0.5px"
                    >
                      {marker.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Dynamic Hover Tooltip inside Map Area */}
            {hoveredMarker && (
              <div
                className="map-tooltip"
                style={{
                  left: `${(hoveredMarker.x / 400) * 100}%`,
                  top: `${(hoveredMarker.y / 480) * 100}%`
                }}
              >
                <span className="tooltip-title">{hoveredMarker.name}</span>
                <span className="tooltip-region">{hoveredMarker.region}</span>
                <p className="tooltip-desc">{hoveredMarker.details}</p>
              </div>
            )}

            <div className="map-legend">
              <span className="legend-dot" />
              <span>WLC Destination</span>
            </div>
          </div>
        </div>
      </section>

      {/* Region Cards Grid Section */}
      <section className="regions-grid" aria-label="India Regions List">
        {filteredRegions.length > 0 ? (
          filteredRegions.map((region, idx) => (
            <div
              className={`region-card ${activeFilter === region.region ? "active" : ""}`}
              key={idx}
              onClick={() => handleFilterClick(region.region)}
              style={{ cursor: "pointer" }}
            >
              <span className="region-eyebrow">{region.region}</span>
              <h3 className="region-title">{region.title}</h3>
              <p className="region-cities">{region.cities}</p>
              <span className="region-stats">
                <span className="legend-dot" style={{ backgroundColor: "#0d563f" }} />
                {region.stats}
              </span>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#666666", fontFamily: "Montserrat" }}>
            Select a region to view summaries.
          </div>
        )}
      </section>

      {/* GlobalSpa Brand Sponsor Banner */}
      <div className="globalspa-banner">
        GlobalSpa | INDIA'S #1 WELLNESS & LUXURY LIFESTYLE MEDIA BRAND
        <a href="https://globalspaonline.com/" target="_blank" rel="noopener noreferrer">
          VISIT GLOBALSPAONLINE.COM ↗
        </a>
      </div>

      {/* Dynamic Properties Section */}
      <section id="properties-section" className="properties-section" aria-label="Partner Properties Grid" style={{ scrollMarginTop: "80px" }}>
        <div className="properties-header-wrapper">
          <div>
            <h2 className="properties-section-title">
              {activeFilter === "ALL" ? "All Handpicked Escapes" : `Featured in ${activeFilter}`}
            </h2>
            <p className="properties-section-subtitle">
              Exclusive properties offering tailored experiences and premium members benefits.
            </p>
          </div>
        </div>

        <div className="properties-grid">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((prop, idx) => (
              <Link
                href={prop.link}
                className="property-card"
                key={idx}
                style={{ textDecoration: "none" }}
              >
                <div className="property-img-container">
                  <span className="property-category-badge">{prop.category}</span>
                  <Image
                    src={prop.img}
                    alt={prop.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="property-card-content">
                  <h3 className="property-card-title">{prop.name}</h3>
                  <div className="property-card-location">
                    <span>📍</span> {prop.location}
                  </div>
                  <span className="property-card-link">
                    Explore Details <span>→</span>
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "#666666", fontFamily: "Montserrat" }}>
              Explore the international destinations list below.
            </div>
          )}
        </div>
      </section>

      {/* International Destinations Section */}
      <section
        id="international-section"
        className="inner-section"
        aria-label="Global Wellness Destinations"
        style={{ scrollMarginTop: "80px" }}
      >
        <div className="container">
          <div className="text-center inner-section-header">
            <span className="eyebrow" style={{ color: "#bca374" }}>BEYOND INDIA</span>
            <h2 className="inner-section-title">Global Wellness Destinations</h2>
            <p>
              For members who seek wellness beyond borders - our curated international partners bring the <br /> WLC standard of excellence to the world's finest destinations.
            </p>
          </div>

          <div className="global-grid">
            {internationalDestinations.map((dest, idx) => (
              <Link
                href="/contact"
                className="global-card"
                key={idx}
                style={{ textDecoration: "none" }}
              >
                <h3 className="global-name" style={{ marginTop: "12px" }}>{dest.name}</h3>
                <span className="global-type">{dest.type}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Quote & CTA strip */}
      <section className="quote-cta-strip" aria-label="Member Quote">
        <p className="quote-text">"Every destination, curated for your transformation."</p>
        <Link href="/membership" className="btn btn-gold">
          BECOME A MEMBER
        </Link>
      </section>
    </article>
  );
}
