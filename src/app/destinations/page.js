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
      details: "The home of Ayurveda, backwaters, and deep healing."
    }
  ];

  const regions = [
    {
      region: "NORTH INDIA",
      title: "Himalayan & Alpine",
      cities: "Rishikesh · Shimla · Dharamshala",
      stats: "6 properties"
    },
    {
      region: "SOUTH INDIA",
      title: "Ayurvedic & Coastal",
      cities: "Kerala · Gokarna · Coorg",
      stats: "8 properties"
    },
    {
      region: "WEST INDIA",
      title: "Heritage & Wellness",
      cities: "Rajasthan · Goa · Maharashtra",
      stats: "5 properties"
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
      link: "/explore-offer?destination=Niraamaya%20Retreats%20Surya%20Samudra"
    },
    {
      name: "Swastik Luxury Wellbeing Sanctuary",
      region: "WEST INDIA",
      location: "Pune, Maharashtra",
      category: "Wellness Retreat",
      img: "/images/swastik-sanctuary-real.webp",
      link: "/explore-offer?destination=Swastik%20Luxury%20Wellbeing%20Sanctuary"
    },
    {
      name: "The Wellness Co",
      region: "NORTH INDIA",
      location: "Karma Lakelands, Gurgaon",
      category: "Spa & Therapies",
      img: "/images/wellness-co-real.webp",
      link: "/explore-offer?destination=The%20Wellness%20Co"
    },
    {
      name: "Viveda Wellness Resort",
      region: "WEST INDIA",
      location: "Nashik, Maharashtra",
      category: "Wellness Retreat",
      img: "/images/viveda-resort-real.webp",
      link: "/explore-offer?destination=Viveda%20Wellness%20Resort"
    },
    {
      name: "Niraamaya Retreats Backwaters & Beyond",
      region: "SOUTH INDIA",
      location: "Kumarakom, Kerala",
      category: "Spa & Therapies",
      img: "/images/niraamaya-backwaters-spa.webp",
      link: "/explore-offer?destination=Niraamaya%20Retreats%20Backwaters%20%26%20Beyond"
    },
    {
      name: "Pema Wellness",
      region: "EAST INDIA",
      location: "Visakhapatnam, Andhra Pradesh",
      category: "Spa / Luxury Stay",
      img: "/images/pema-wellness-spa.webp",
      link: "/explore-offer?destination=Pema%20Wellness"
    },
    {
      name: "Silhouette Salon",
      region: "NORTH INDIA",
      location: "Gurgaon, Haryana",
      category: "Spa & Salon",
      img: "/images/silhouette-salon-spa.webp",
      link: "/explore-offer?destination=Silhouette%20Salon"
    },
    {
      name: "Andaaz Delhi — Hyatt Hotel",
      region: "NORTH INDIA",
      location: "Aerocity, New Delhi",
      category: "Urban Luxury Spa",
      img: "/images/andaz-hyatt-spa.webp",
      link: "/explore-offer?destination=Andaaz%20Delhi%20—%20Hyatt%20Hotel"
    },
    {
      name: "Shangri-La Eros",
      region: "NORTH INDIA",
      location: "Connaught Place, New Delhi",
      category: "5-Star Hotel & Club",
      img: "/images/shangri-la-stay.webp",
      link: "/explore-offer?destination=Shangri-La%20Eros"
    },
    {
      name: "Dhun Wellness Spa",
      region: "WEST INDIA",
      location: "Mumbai, Maharashtra",
      category: "Biohacking & Spa",
      img: "/images/dhun-wellness-spa.webp",
      link: "/explore-offer?destination=Dhun%20Wellness%20Spa"
    },
    {
      name: "Florian Hurel Hair Couture & Spa",
      region: "WEST INDIA",
      location: "Mumbai · Pune · Ahmedabad",
      category: "Hair Couture & Spa",
      img: "/images/community-experiences-lounge.webp",
      link: "/explore-offer?destination=Florian%20Hurel%20Hair%20Couture%20%26%20Spa"
    },
    {
      name: "Viva Mayr",
      region: "INTERNATIONAL",
      location: "Maria Wörth, Austria",
      category: "Medical Longevity",
      img: "/images/vivamayr-austria-real.webp",
      link: "/explore-offer?destination=Viva%20Mayr"
    }
  ];

  const filteredRegions = regions.filter(
    (reg) => activeFilter === "ALL" || reg.region === activeFilter
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
      {/* ─── Hero Header ─────────────────────────────────────────────────── */}
      <section className="destinations-hero" aria-label="Destinations Hero">
        <div className="destinations-hero-container">
          <span className="destinations-hero-eyebrow">CURATED SANCTUARIES & DESTINATIONS</span>
          <h1 className="destinations-hero-title">Discover Your Next <br /> Wellness Escape</h1>
          <p className="destinations-hero-desc">
            From the Himalayas to coastal sanctuaries, from ancient Ayurvedic retreats to modern luxury spas — every WLC destination is handpicked for members who seek transformation.
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

      {/* ─── Interactive Map Section ─────────────────────────────────────── */}
      <section className="map-section-wrapper" aria-label="India Map Visualizer">
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

      {/* ─── Region Cards Grid Section ───────────────────────────────────── */}
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

      {/* ─── GlobalSpa Brand Sponsor Banner ──────────────────────────────── */}
      <div className="globalspa-banner">
        GlobalSpa | INDIA'S #1 WELLNESS & LUXURY LIFESTYLE MEDIA BRAND
        <a href="https://globalspaonline.com/" target="_blank" rel="noopener noreferrer">
          VISIT GLOBALSPAONLINE.COM ↗
        </a>
      </div>

      {/* ─── Dynamic Properties Section ──────────────────────────────────── */}
      <section id="properties-section" className="properties-section" aria-label="Partner Properties Grid" style={{ scrollMarginTop: "80px" }}>
        <div className="properties-header-wrapper">
          <div>
            <h2 className="properties-section-title">
              {activeFilter === "ALL" ? "All Handpicked Escapes" : `Featured in ${activeFilter}`}
            </h2>
            <p className="properties-section-subtitle">
              Exclusive properties offering tailored experiences and premium member privileges.
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="property-card-content">
                  <h3 className="property-card-title">{prop.name}</h3>
                  <div className="property-card-location">
                    <span>📍</span> {prop.location}
                  </div>
                  <span className="property-card-link">
                    Explore Details & Privileges <span>→</span>
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

      {/* ─── International Destinations Section ──────────────────────────── */}
      <section
        id="international-section"
        className="international-section"
        aria-label="Global Wellness Destinations"
        style={{ scrollMarginTop: "80px" }}
      >
        <div className="international-header-wrapper">
          <span className="eyebrow">BEYOND INDIA</span>
          <h2>Global Wellness Destinations</h2>
          <p>
            For members who seek wellness beyond borders — our curated international partners bring the WLC standard of excellence to the world's finest destinations.
          </p>
        </div>

        <div className="global-grid">
          {internationalDestinations.map((dest, idx) => (
            <Link
              href="/explore-offer?destination=Viva%20Mayr"
              className="global-card"
              key={idx}
              style={{ textDecoration: "none" }}
            >
              <span className="global-flag">{dest.flag}</span>
              <h3 className="global-name">{dest.name}</h3>
              <span className="global-type">{dest.type}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Bottom Quote & CTA Strip ────────────────────────────────────── */}
      <section className="quote-cta-strip" aria-label="Member Quote">
        <div className="quote-cta-container">
          <p className="quote-text">"Every destination, curated for your transformation."</p>
          <Link href="/membership" className="btn btn-gold">
            BECOME A MEMBER
          </Link>
        </div>
      </section>
    </article>
  );
}
