"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PARTNERS_DATA } from "@/data/partnerOffers";
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
      name: "Himalayas & North",
      region: "NORTH INDIA",
      x: 130,
      y: 100,
      details: "Delhi NCR, Vasant Kunj, Karma Lakelands, luxury urban retreats and wellness spas."
    },
    {
      id: "delhi",
      name: "Delhi NCR",
      region: "NORTH INDIA",
      x: 129,
      y: 150,
      details: "Andaz Hyatt, Shangri-La Eros, Sawadhee Thai Spa, Silhouette Salon, and The Wellness Co."
    },
    {
      id: "maharashtra",
      name: "Maharashtra",
      region: "WEST INDIA",
      x: 104,
      y: 285,
      details: "Swastik Luxury Wellbeing (Pune), Viveda (Nashik), Dhun Wellness Spa & IOSIS (Mumbai)."
    },
    {
      id: "hyderabad",
      name: "Telangana & East",
      region: "SOUTH INDIA",
      x: 135,
      y: 340,
      details: "Trē Wellness (Hyderabad) and Pema Wellness (Visakhapatnam)."
    },
    {
      id: "kerala",
      name: "Kerala",
      region: "SOUTH INDIA",
      x: 115,
      y: 425,
      details: "Niraamaya Surya Samudra (Kovalam) and Niraamaya Backwaters & Beyond (Kumarakom)."
    }
  ];

  const regions = [
    {
      region: "NORTH INDIA",
      title: "Delhi NCR & Longevity",
      cities: "Delhi · Gurgaon · Karma Lakelands",
      stats: `${PARTNERS_DATA.filter((p) => p.region === "NORTH INDIA").length} partners`
    },
    {
      region: "SOUTH INDIA",
      title: "Ayurvedic & Holistic",
      cities: "Kovalam · Kumarakom · Hyderabad",
      stats: `${PARTNERS_DATA.filter((p) => p.region === "SOUTH INDIA").length} partners`
    },
    {
      region: "WEST INDIA",
      title: "Sanctuary & Naturopathy",
      cities: "Pune · Nashik · Mumbai · Ahmedabad",
      stats: `${PARTNERS_DATA.filter((p) => p.region === "WEST INDIA").length} partners`
    },
    {
      region: "EAST INDIA",
      title: "Coastal Lifestyle Medicine",
      cities: "Visakhapatnam · Bay of Bengal",
      stats: `${PARTNERS_DATA.filter((p) => p.region === "EAST INDIA").length} partners`
    },
    {
      region: "INTERNATIONAL",
      title: "Global Sanctuaries",
      cities: "Austria · Thailand · Croatia · Bhutan · Dubai",
      stats: `${PARTNERS_DATA.filter((p) => p.region === "INTERNATIONAL").length} partners`
    }
  ];

  const filteredRegions = regions.filter(
    (reg) => activeFilter === "ALL" || reg.region === activeFilter
  );

  const filteredProperties = PARTNERS_DATA.filter(
    (prop) => activeFilter === "ALL" || prop.region === activeFilter
  );

  const internationalPartners = PARTNERS_DATA.filter(
    (p) => p.region === "INTERNATIONAL"
  );

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
            From the coastal cliffs of Kerala to Austrian medical institutes, from Croatian pine island sanctuaries to serene Himalayan lodges — every WLC destination is handpicked for transformation.
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
              {/* Stylized outline of India */}
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
              <line x1="129" y1="150" x2="104" y2="285" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="104" y1="285" x2="135" y2="340" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="135" y1="340" x2="115" y2="425" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />
              <line x1="115" y1="425" x2="129" y2="150" stroke="rgba(200, 146, 58, 0.45)" strokeDasharray="3,3" />

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
                      x={marker.x + (marker.id === "maharashtra" ? -16 : marker.id === "kerala" || marker.id === "himalayas" ? 0 : 16)}
                      y={marker.y + (marker.id === "kerala" ? 22 : marker.id === "himalayas" ? -18 : 4)}
                      textAnchor={marker.id === "maharashtra" ? "end" : marker.id === "kerala" || marker.id === "himalayas" ? "middle" : "start"}
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
              <span>WLC Partner Sanctuary</span>
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
        GlobalSpa | INDIA&apos;S #1 WELLNESS &amp; LUXURY LIFESTYLE MEDIA BRAND
        <a href="https://globalspaonline.com/" target="_blank" rel="noopener noreferrer">
          VISIT GLOBALSPAONLINE.COM ↗
        </a>
      </div>

      {/* ─── Dynamic Properties Section ──────────────────────────────────── */}
      <section id="properties-section" className="properties-section" aria-label="Partner Properties Grid" style={{ scrollMarginTop: "80px" }}>
        <div className="properties-header-wrapper">
          <div>
            <h2 className="properties-section-title">
              {activeFilter === "ALL" ? "All Handpicked Partners & Sanctuaries" : `Featured in ${activeFilter}`}
            </h2>
            <p className="properties-section-subtitle">
              Exclusive properties offering all-inclusive member privileges, preferential rates, and direct booking support.
            </p>
          </div>
        </div>

        <div className="properties-grid">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((prop, idx) => (
              <div className="property-card" key={prop.slug || prop.id}>
                <div className="property-img-container">
                  <span className="property-category-badge">
                    {prop.flag} {prop.category}
                  </span>
                  <Image
                    src={prop.image}
                    alt={prop.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    priority={idx < 2}
                    loading={idx < 2 ? "eager" : "lazy"}
                  />
                </div>
                <div className="property-card-content">
                  <h3 className="property-card-title">{prop.name}</h3>
                  <div className="property-card-location">
                    <span>📍</span> {prop.location}
                  </div>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.5", margin: "4px 0 12px 0" }}>
                    {prop.shortDesc}
                  </p>

                  {/* Highlights of Member Offers */}
                  {Array.isArray(prop.offers) && prop.offers.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                      {prop.offers.map((off) => (
                        <span
                          key={off.id}
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#0d563f",
                            background: "rgba(13, 86, 63, 0.08)",
                            border: "1px solid rgba(13, 86, 63, 0.15)",
                            borderRadius: "14px",
                            padding: "3px 10px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <span style={{ color: "#9c8458" }}>✦</span> {off.discount || off.badge || off.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "auto", alignItems: "center", justifyContent: "space-between" }}>
                    <Link
                      href={`/explore-offer?destination=${encodeURIComponent(prop.name)}`}
                      className="property-card-link"
                      style={{ fontSize: "12px", fontWeight: 700, color: "#0d563f" }}
                    >
                      View All Privileges <span>→</span>
                    </Link>

                    {prop.website && (
                      <a
                        href={prop.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          color: "#9c8458",
                          textDecoration: "none",
                          borderBottom: "1px solid #9c8458",
                          paddingBottom: "1px"
                        }}
                      >
                        Official Website ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
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
          <h2>Global Wellness Sanctuaries</h2>
          <p>
            For members who seek wellness beyond borders — our curated international partners bring the WLC standard of excellence to the world&apos;s finest medical health institutes, island resorts, and Himalayan sanctuaries.
          </p>
        </div>

        <div className="global-grid">
          {internationalPartners.map((dest) => (
            <div className="global-card" key={dest.id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span className="global-flag">{dest.flag}</span>
                <h3 className="global-name">{dest.name}</h3>
                <span className="global-type">{dest.location}</span>
                <p style={{ fontSize: "12.5px", color: "#555", marginTop: "8px", lineHeight: "1.4" }}>
                  {dest.shortDesc}
                </p>

                {/* Offer Highlights */}
                {Array.isArray(dest.offers) && dest.offers.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "10px 0 14px 0", justifyContent: "center" }}>
                    {dest.offers.map((off) => (
                      <span
                        key={off.id}
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          color: "#0d563f",
                          background: "rgba(13, 86, 63, 0.08)",
                          border: "1px solid rgba(13, 86, 63, 0.15)",
                          borderRadius: "12px",
                          padding: "2px 8px"
                        }}
                      >
                        {off.discount || off.badge || off.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                <Link
                  href={`/explore-offer?destination=${encodeURIComponent(dest.name)}`}
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0d563f",
                    textDecoration: "none"
                  }}
                >
                  Explore Privileges →
                </Link>

                {dest.website && (
                  <a
                    href={dest.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "#9c8458",
                      textDecoration: "none"
                    }}
                  >
                    Resort Website ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bottom Quote & CTA Strip ────────────────────────────────────── */}
      <section className="quote-cta-strip" aria-label="Member Quote">
        <div className="quote-cta-container">
          <p className="quote-text">&ldquo;Every destination, curated for your transformation.&rdquo;</p>
          <Link href="/membership" className="btn btn-gold">
            BECOME A MEMBER
          </Link>
        </div>
      </section>
    </article>
  );
}
