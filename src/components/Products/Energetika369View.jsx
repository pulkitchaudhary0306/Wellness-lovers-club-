"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Energetika369View({ brand }) {
  // State for interactive gallery images
  const [pemfImgIdx, setPemfImgIdx] = useState(0);
  const [aiImgIdx, setAiImgIdx] = useState(0);
  const [luxImgIdx, setLuxImgIdx] = useState(0);

  // State for HEXA SENSE AI reports category filter
  const [activeReportTab, setActiveReportTab] = useState("all");

  const pemfProduct = brand.products.find((p) => p.id === "pemf-crystal-mat") || brand.products[0];
  const aiProduct = brand.products.find((p) => p.id === "hexa-sense-ai") || brand.products[1];
  const pulseProduct = brand.products.find((p) => p.id === "hexa-pulse");
  const syncProduct = brand.products.find((p) => p.id === "hexa-sync");
  const luxProduct = brand.products.find((p) => p.id === "hexa-lux");

  // Filtered reports for HEXA SENSE AI
  const reportsData = aiProduct?.reportsBreakdown;
  const getFilteredReports = () => {
    if (!reportsData) return [];
    if (activeReportTab === "basic") return reportsData.basicReportsList || [];
    if (activeReportTab === "male") return reportsData.maleReportsList || [];
    if (activeReportTab === "female") return reportsData.femaleReportsList || [];
    if (activeReportTab === "children") return reportsData.childrenReportsList || [];
    // "all"
    return [
      ...(reportsData.basicReportsList || []),
      ...(reportsData.maleReportsList || []),
      ...(reportsData.femaleReportsList || []),
      ...(reportsData.childrenReportsList || [])
    ];
  };

  return (
    <div className="energetika369-container" id="energetika369-catalog">
      {/* ─── Product Overview Cards Hub ────────────────────────────────────── */}
      <section className="visual-groups-overview" aria-label="Product Overview Cards">
        <div className="visual-groups-header">
          <span className="eyebrow">PRODUCT OVERVIEW</span>
          <h3>Five Advanced Technologies Across Curated Disciplines</h3>
          <p>
            Explore Energetika369’s specialized wellness systems designed for cellular rejuvenation, non-invasive bio-energetic assessment, and multi-tier frequency harmonization.
          </p>
        </div>

        {/* ── Standalone Products Overview (Beyond PEMF Mat & HEXA SENSE AI) ── */}
        <div className="overview-standalone-section">
          <div className="overview-subgroup-header">
            <span className="overview-subgroup-eyebrow">STANDALONE WELLNESS INNOVATIONS</span>
            <h4 className="overview-subgroup-title">Cellular Recovery & AI Bio-Magnetic Analysis</h4>
          </div>

          <div className="overview-cards-grid standalone-grid">
            {/* Standalone Product 1: Beyond PEMF Wellness Mat */}
            <div className="product-overview-card">
              <div className="product-card-thumb-wrap">
                <Image
                  src="/images/products/pemf-crystal-mat.webp"
                  alt="Beyond PEMF Wellness Mat"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  priority
                />
                <span className="product-card-badge">Thermal & PEMF</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">Whole-Body Restoration</span>
                <h4 className="product-card-title">Beyond PEMF Wellness Mat</h4>
                <p className="product-card-desc">
                  Natural 7-crystal rainbow mat engineered with calibrated low-frequency PEMF, deep-penetrating far-infrared heat, and triple-color photon bio-spectrum arrays.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">⚡ 4 Calibrated PEMF Chips (Levels 1–9)</span>
                  <span className="card-highlight-item">🔥 Far Infrared Heat (25°C–75°C)</span>
                  <span className="card-highlight-item">💎 7 Natural Gemstone Crystals</span>
                  <span className="card-highlight-item">💡 3-Color Photon Arrays (470/520/660nm)</span>
                </div>
                <div className="product-card-actions">
                  <a href="#beyond-pemf-mat" className="btn-card-explore" title="Explore Beyond PEMF Mat Details">
                    Explore Details ↓
                  </a>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Beyond PEMF Wellness Mat")}`}
                    className="btn-card-enquire"
                    title="Request a quote for Beyond PEMF Mat"
                  >
                    Request Quote <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Standalone Product 2: HEXA SENSE AI */}
            <div className="product-overview-card">
              <div className="product-card-thumb-wrap">
                <Image
                  src="/images/products/hexa-sense-ai.webp"
                  alt="HEXA SENSE AI Analysis System"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  priority
                />
                <span className="product-card-badge">AI Bio-Resonance</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">Non-Invasive Baseline</span>
                <h4 className="product-card-title">HEXA SENSE AI</h4>
                <p className="product-card-desc">
                  AI-powered bio-magnetic analysis system mapping 59 comprehensive health reports in 60 seconds through an ergonomic solid alloy hand-grip sensor.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">⏱️ 60-Second Rapid Protocol</span>
                  <span className="card-highlight-item">📊 59 Comprehensive Reports*</span>
                  <span className="card-highlight-item">🖐️ Solid Alloy Hand-Grip Sensor</span>
                  <span className="card-highlight-item">🔒 Encrypted USB Security Dongle</span>
                </div>
                <div className="product-card-actions">
                  <a href="#hexa-sense-ai" className="btn-card-explore" title="Explore HEXA SENSE AI Details">
                    Explore Details ↓
                  </a>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - HEXA SENSE AI")}`}
                    className="btn-card-enquire"
                    title="Request a quote for HEXA SENSE AI"
                  >
                    Request Quote <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Grouped Section: HEXA FLOW FREQUENCY DEVICES Overview ── */}
        <div className="overview-hexaflow-section" id="hexa-flow-overview">
          <div className="overview-subgroup-header">
            <span className="overview-subgroup-eyebrow">HEXA FLOW FREQUENCY DEVICES</span>
            <h4 className="overview-subgroup-title">Modular Multi-Tier Bio-Frequency Suite</h4>
            <p className="overview-subgroup-desc">
              Three distinct frequency devices engineered for progressive levels of energetic scanning, radionic resonance, and comprehensive NLS biofeedback.
            </p>
          </div>

          <div className="overview-cards-grid hexaflow-grid">
            {/* Hexa Flow Product 1: Hexa Pulse */}
            <div className="product-overview-card">
              <div className="product-card-thumb-wrap">
                <Image
                  src={pulseProduct?.image || "/images/products/hexa-pulse.webp"}
                  alt="Hexa Pulse Frequency Device"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <span className="product-card-badge">Entry-Level</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">Hexa Flow Collection</span>
                <h4 className="product-card-title">Hexa Pulse</h4>
                <p className="product-card-desc">
                  Compact and accessible frequency assessment device designed for intuitive full-body energetic scans, organ stress mapping, and personalized frequency feedback.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">⚡ Intuitive Full-Body Scan</span>
                  <span className="card-highlight-item">🎯 Organ Stress Field Mapping</span>
                  <span className="card-highlight-item">🧳 Compact Portable Design</span>
                </div>
                <div className="product-card-actions">
                  <a href="#card-hexa-pulse" className="btn-card-explore" title="View Hexa Pulse Overview">
                    Explore Details ↓
                  </a>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Hexa Pulse")}`}
                    className="btn-card-enquire"
                    title="Enquire about Hexa Pulse"
                  >
                    Enquire Now <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hexa Flow Product 2: Hexa Sync */}
            <div className="product-overview-card">
              <div className="product-card-thumb-wrap">
                <Image
                  src={syncProduct?.image || "/images/products/hexa-sync-main.webp"}
                  alt="Hexa Sync Intermediate Bioenergetic Device"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <span className="product-card-badge">Intermediate</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">Hexa Flow Collection</span>
                <h4 className="product-card-title">Hexa Sync</h4>
                <p className="product-card-desc">
                  Versatile intermediate frequency system featuring multi-level spiral scanning, remote radionic sample testing, and vibrational remedy imprinting capabilities.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">🌀 Multi-Level Spiral Scanning</span>
                  <span className="card-highlight-item">🧪 Remote Radionic Chamber</span>
                  <span className="card-highlight-item">💧 Vibrational Remedy Imprinting</span>
                </div>
                <div className="product-card-actions">
                  <a href="#card-hexa-sync" className="btn-card-explore" title="View Hexa Sync Overview">
                    Explore Details ↓
                  </a>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Hexa Sync")}`}
                    className="btn-card-enquire"
                    title="Enquire about Hexa Sync"
                  >
                    Enquire Now <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hexa Flow Product 3: Hexa Lux */}
            <div className="product-overview-card flagship">
              <div className="product-card-thumb-wrap">
                <Image
                  src={luxProduct?.image || "/images/products/hexa-flow-lux.webp"}
                  alt="Hexa Lux Flagship NLS Bioresonance Platform"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <span className="product-card-badge gold">Flagship NLS</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">Hexa Flow Flagship</span>
                <h4 className="product-card-title">Hexa Lux</h4>
                <p className="product-card-desc">
                  Flagship NLS bioresonance platform featuring 4D visual organ modeling, 5,000+ reference etalons, remote biological chamber testing, BioRod, and simultaneous metatherapy.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">🧬 4D Visual Organ Scanning</span>
                  <span className="card-highlight-item">📚 5,000+ Reference Etalons*</span>
                  <span className="card-highlight-item">🦯 Exclusive BioRod Sensor</span>
                  <span className="card-highlight-item">⚡ Simultaneous Metatherapy</span>
                </div>
                <div className="product-card-actions">
                  <a href="#hexa-lux-platform" className="btn-card-explore" title="Deep dive into Hexa Lux platform">
                    Platform Details ↓
                  </a>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Hexa Lux")}`}
                    className="btn-card-enquire"
                    title="Enquire about Hexa Lux"
                  >
                    Enquire Now <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────────
          PRODUCT 1: BEYOND PEMF WELLNESS MAT
          ─────────────────────────────────────────────────────────────────────────── */}
      <section
        className="product-showcase-section"
        id="beyond-pemf-mat"
        aria-labelledby="pemf-mat-heading"
      >
        <div className="showcase-header">
          <div className="showcase-header-left">
            <span className="showcase-number-badge">
              <span>01</span> Thermal, Crystal & Cellular Recovery
            </span>
            <h2 id="pemf-mat-heading" className="showcase-title">
              Beyond PEMF Wellness Mat
            </h2>
            <p className="showcase-subtitle">
              Natural Crystal Rainbow PEMF Mat with 3-Color Photon Light
            </p>
            <div className="showcase-pills-row">
              <span className="spec-badge-pill gold">⚡ 4 Calibrated PEMF Chips (Levels 1–9)</span>
              <span className="spec-badge-pill">🔥 FIR Deep Heat (25°C–75°C)</span>
              <span className="spec-badge-pill">💎 7 Natural Crystals</span>
              <span className="spec-badge-pill">💡 3-Color Photon Light</span>
              <span className="spec-badge-pill">📐 190 × 80 cm</span>
              <span className="spec-badge-pill">⚡ 200 W Power</span>
            </div>
          </div>
        </div>

        {/* Media & Key Highlights Grid */}
        <div className="showcase-main-grid">
          <div className="showcase-gallery-col">
            <div className="showcase-main-img-wrap">
              <Image
                src={pemfProduct.gallery[pemfImgIdx] || pemfProduct.image}
                alt={`Beyond PEMF Wellness Mat - View ${pemfImgIdx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {pemfProduct.gallery && pemfProduct.gallery.length > 1 && (
              <div className="showcase-thumbs-strip" role="group" aria-label="PEMF Mat Gallery Views">
                {pemfProduct.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`showcase-thumb-btn ${idx === pemfImgIdx ? "active" : ""}`}
                    onClick={() => setPemfImgIdx(idx)}
                    aria-label={`Select PEMF Mat photo ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`PEMF Mat thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="showcase-narrative-col">
            <div>
              <h3 className="showcase-subheading">📖 Product Overview</h3>
              <p className="showcase-overview-text">
                {pemfProduct.overview}
              </p>

              <div className="highlight-chips-grid">
                <div className="highlight-chip">
                  <span className="highlight-chip-icon">⚡</span>
                  <div className="highlight-chip-content">
                    <strong>Pulsed Electromagnetic Fields</strong>
                    <span>4 chips (levels 1–9) delivering low-frequency cellular pulsing.</span>
                  </div>
                </div>
                <div className="highlight-chip">
                  <span className="highlight-chip-icon">🔥</span>
                  <div className="highlight-chip-content">
                    <strong>Far Infrared (FIR) Heating</strong>
                    <span>Penetrating heat adjustable from 25°C to 75°C for muscle relaxation.</span>
                  </div>
                </div>
                <div className="highlight-chip">
                  <span className="highlight-chip-icon">💎</span>
                  <div className="highlight-chip-content">
                    <strong>7-Crystal Gemstone Layer</strong>
                    <span>Amethyst, Sodalite, Blue Agate, Aventurine, Carnelian, Red Jasper.</span>
                  </div>
                </div>
                <div className="highlight-chip">
                  <span className="highlight-chip-icon">💡</span>
                  <div className="highlight-chip-content">
                    <strong>3-Color Photon Light</strong>
                    <span>Blue (470nm), Green (520nm), and Red (660nm) bio-spectrum arrays.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="showcase-action-bar">
              <Link
                href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Beyond PEMF Wellness Mat")}`}
                className="btn-cta-gold"
                title="Request a quote for Beyond PEMF Wellness Mat"
              >
                Request a Quote <span>→</span>
              </Link>
              <Link
                href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Demo Request - Beyond PEMF Wellness Mat")}`}
                className="btn-cta-secondary"
                title="Book a demo session"
              >
                Book a Demo
              </Link>
              <Link
                href="/contact"
                className="btn-cta-secondary"
                title="Contact WLC Concierge"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Sections: Key Features, Specifications, Package Contents, Safety */}
        <div className="showcase-details-box">
          {/* Key Features */}
          <h3 className="showcase-subheading">⚙️ Key Features</h3>
          <ul className="showcase-features-list">
            {pemfProduct.features.map((feat, idx) => (
              <li key={idx}>{feat}</li>
            ))}
          </ul>

          {/* Technical Specifications */}
          <h3 className="showcase-subheading">🔧 Technical Specifications</h3>
          <table className="specs-table" aria-label="Beyond PEMF Wellness Mat Technical Specifications">
            <tbody>
              <tr>
                <td className="spec-key">Model Name</td>
                <td className="spec-val">{pemfProduct.specs.modelName}</td>
              </tr>
              <tr>
                <td className="spec-key">Dimensions & Net Weight</td>
                <td className="spec-val">{pemfProduct.specs.dimensionsAndWeight}</td>
              </tr>
              <tr>
                <td className="spec-key">Temperature Regulation</td>
                <td className="spec-val">{pemfProduct.specs.temperatureRange}</td>
              </tr>
              <tr>
                <td className="spec-key">Power & Voltage</td>
                <td className="spec-val">{pemfProduct.specs.powerRating}</td>
              </tr>
              <tr>
                <td className="spec-key">PEMF Technology</td>
                <td className="spec-val">{pemfProduct.specs.pemfTechnology}</td>
              </tr>
              <tr>
                <td className="spec-key">Crystal Layers</td>
                <td className="spec-val">{pemfProduct.specs.crystalLayers}</td>
              </tr>
              <tr>
                <td className="spec-key">Photon Light Array</td>
                <td className="spec-val">{pemfProduct.specs.photonLightArray}</td>
              </tr>
              <tr>
                <td className="spec-key">Construction & Shielding</td>
                <td className="spec-val">{pemfProduct.specs.construction}</td>
              </tr>
              <tr>
                <td className="spec-key">Digital Controller</td>
                <td className="spec-val">{pemfProduct.specs.controller}</td>
              </tr>
              <tr>
                <td className="spec-key">Plug Standards</td>
                <td className="spec-val">{pemfProduct.specs.plugCompatibility}</td>
              </tr>
              <tr>
                <td className="spec-key">Manufacturer Warranty</td>
                <td className="spec-val">{pemfProduct.specs.warranty}</td>
              </tr>
            </tbody>
          </table>

          {/* Package Contents */}
          <h3 className="showcase-subheading">📦 Package Contents</h3>
          <div className="package-contents-grid">
            {pemfProduct.whatsIncluded.map((item, idx) => (
              <div className="package-item" key={idx}>
                <span className="package-item-icon">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Safety Information & Medical Advisory */}
          <div className="safety-callout-card">
            <h4 className="safety-callout-title">
              <span>🛡️</span> Safety Information & Manufacturer Advisory
            </h4>
            <ul>
              {pemfProduct.safetyInfo.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────────
          PRODUCT 2: HEXA SENSE AI
          ─────────────────────────────────────────────────────────────────────────── */}
      <section
        className="product-showcase-section"
        id="hexa-sense-ai"
        aria-labelledby="hexa-sense-heading"
      >
        <div className="showcase-header">
          <div className="showcase-header-left">
            <span className="showcase-number-badge">
              <span>02</span> Bio-Resonance & AI Bio-Magnetic Mapping
            </span>
            <h2 id="hexa-sense-heading" className="showcase-title">
              HEXA SENSE AI
            </h2>
            <p className="showcase-subtitle">
              AI-Powered Wellness Analysis System
            </p>
            <div className="showcase-pills-row">
              <span className="spec-badge-pill gold">⏱️ 60-Second Rapid Scan*</span>
              <span className="spec-badge-pill">📊 59 Comprehensive Reports*</span>
              <span className="spec-badge-pill">🖐️ Solid Alloy Hand-Grip Sensor</span>
              <span className="spec-badge-pill">🔑 USB Hardware Security Key</span>
              <span className="spec-badge-pill">💼 Protective Travel Case</span>
              <span className="spec-badge-pill">🛡️ 1-Year Warranty</span>
            </div>
          </div>
        </div>

        {/* Media & Key Highlights Grid (Alternating on Desktop) */}
        <div className="showcase-main-grid alternate-desktop">
          <div className="showcase-gallery-col">
            <div className="showcase-main-img-wrap">
              <Image
                src={aiProduct.gallery[aiImgIdx] || aiProduct.image}
                alt={`HEXA SENSE AI System - View ${aiImgIdx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            {aiProduct.gallery && aiProduct.gallery.length > 1 && (
              <div className="showcase-thumbs-strip" role="group" aria-label="HEXA SENSE AI Gallery Views">
                {aiProduct.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`showcase-thumb-btn ${idx === aiImgIdx ? "active" : ""}`}
                    onClick={() => setAiImgIdx(idx)}
                    aria-label={`Select HEXA SENSE AI photo ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`HEXA SENSE AI thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="showcase-narrative-col">
            <div>
              <h3 className="showcase-subheading">📖 Overview & Intended Applications</h3>
              <p className="showcase-overview-text">
                {aiProduct.overview}
              </p>

              <div className="highlight-chips-grid">
                <div className="highlight-chip">
                  <span className="highlight-chip-icon">🏥</span>
                  <div className="highlight-chip-content">
                    <strong>Integrative Clinics & Spas</strong>
                    <span>Rapid non-invasive baseline physiological mapping in 60 seconds.</span>
                  </div>
                </div>
                <div className="highlight-chip">
                  <span className="highlight-chip-icon">📊</span>
                  <div className="highlight-chip-content">
                    <strong>59 Detailed Health Reports</strong>
                    <span>41 Basic, 4 Male, 4 Female, and 10 Children’s assessment panels.</span>
                  </div>
                </div>
                <div className="highlight-chip">
                  <span className="highlight-chip-icon">🔒</span>
                  <div className="highlight-chip-content">
                    <strong>Encrypted USB Security Key</strong>
                    <span>Secure hardware dongle with authentic multilingual analysis suite.</span>
                  </div>
                </div>
                <div className="highlight-chip">
                  <span className="highlight-chip-icon">🧳</span>
                  <div className="highlight-chip-content">
                    <strong>Protective Hardware Case</strong>
                    <span>Heavy-duty travel case housing main unit, cable, and hand-grip sensor.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="showcase-action-bar">
              <Link
                href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - HEXA SENSE AI")}`}
                className="btn-cta-gold"
                title="Request a quote for HEXA SENSE AI"
              >
                Request a Quote <span>→</span>
              </Link>
              <Link
                href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Demo Request - HEXA SENSE AI")}`}
                className="btn-cta-secondary"
                title="Book a demonstration of HEXA SENSE AI"
              >
                Book a Demo
              </Link>
              <Link
                href="/contact"
                className="btn-cta-secondary"
                title="Contact WLC Concierge"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Four-Stage Operating Pipeline */}
        <div className="showcase-details-box">
          <h3 className="showcase-subheading">🔄 Four-Stage Operating Process</h3>
          <p style={{ fontSize: "14px", color: "var(--wlc-muted)", marginBottom: "16px" }}>
            The system operates through four distinct computational stages to translate subtle biological electromagnetic fields into actionable wellness reports:
          </p>
          <div className="stages-pipeline-grid">
            {aiProduct.operatingStages.map((stageItem, idx) => (
              <div className="stage-step-card" key={idx}>
                <span className="stage-step-num">{stageItem.stage}</span>
                <h4 className="stage-step-title">{stageItem.title}</h4>
                <p className="stage-step-desc">{stageItem.desc}</p>
              </div>
            ))}
          </div>

          {/* 59 Reports Breakdown */}
          <div className="reports-breakdown-container">
            <h3 className="showcase-subheading">
              📊 Comprehensive Report Breakdown (59 Total Reports)
            </h3>
            <p style={{ fontSize: "14px", color: "var(--wlc-muted)", marginBottom: "16px" }}>
              Manufacturer-provided report architecture organizing cellular and organ-system parameters into structured categories:
            </p>

            <div className="reports-tabs-nav" role="tablist" aria-label="Reports categories">
              <button
                type="button"
                className={`report-tab-btn ${activeReportTab === "all" ? "active" : ""}`}
                onClick={() => setActiveReportTab("all")}
                role="tab"
                aria-selected={activeReportTab === "all"}
              >
                All Reports <span className="badge-num">{aiProduct.reportsBreakdown.total}</span>
              </button>
              <button
                type="button"
                className={`report-tab-btn ${activeReportTab === "basic" ? "active" : ""}`}
                onClick={() => setActiveReportTab("basic")}
                role="tab"
                aria-selected={activeReportTab === "basic"}
              >
                Basic Reports <span className="badge-num">{aiProduct.reportsBreakdown.basicReportsCount}</span>
              </button>
              <button
                type="button"
                className={`report-tab-btn ${activeReportTab === "male" ? "active" : ""}`}
                onClick={() => setActiveReportTab("male")}
                role="tab"
                aria-selected={activeReportTab === "male"}
              >
                Male Specific <span className="badge-num">{aiProduct.reportsBreakdown.maleReportsCount}</span>
              </button>
              <button
                type="button"
                className={`report-tab-btn ${activeReportTab === "female" ? "active" : ""}`}
                onClick={() => setActiveReportTab("female")}
                role="tab"
                aria-selected={activeReportTab === "female"}
              >
                Female Specific <span className="badge-num">{aiProduct.reportsBreakdown.femaleReportsCount}</span>
              </button>
              <button
                type="button"
                className={`report-tab-btn ${activeReportTab === "children" ? "active" : ""}`}
                onClick={() => setActiveReportTab("children")}
                role="tab"
                aria-selected={activeReportTab === "children"}
              >
                Children’s Reports <span className="badge-num">{aiProduct.reportsBreakdown.childrenReportsCount}</span>
              </button>
            </div>

            <div className="reports-pills-matrix" role="tabpanel">
              {getFilteredReports().map((repName, idx) => (
                <span className="report-item-pill" key={idx}>
                  {repName}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <h3 className="showcase-subheading">🔧 Technical Specifications</h3>
          <table className="specs-table" aria-label="HEXA SENSE AI Technical Specifications">
            <tbody>
              <tr>
                <td className="spec-key">Scan Protocol Duration</td>
                <td className="spec-val">{aiProduct.specs.scanDuration}</td>
              </tr>
              <tr>
                <td className="spec-key">Report Coverage</td>
                <td className="spec-val">{aiProduct.specs.reportCoverage}</td>
              </tr>
              <tr>
                <td className="spec-key">Sensing Hardware</td>
                <td className="spec-val">{aiProduct.specs.sensorTechnology}</td>
              </tr>
              <tr>
                <td className="spec-key">Analysis Method</td>
                <td className="spec-val">{aiProduct.specs.analysisMethod}</td>
              </tr>
              <tr>
                <td className="spec-key">Claimed Accuracy Rate</td>
                <td className="spec-val">{aiProduct.specs.accuracyClaim}*</td>
              </tr>
              <tr>
                <td className="spec-key">Software OS Compatibility</td>
                <td className="spec-val">{aiProduct.specs.softwareCompatibility}</td>
              </tr>
              <tr>
                <td className="spec-key">Connectivity & Key</td>
                <td className="spec-val">{aiProduct.specs.connectivity}</td>
              </tr>
              <tr>
                <td className="spec-key">Packaging</td>
                <td className="spec-val">{aiProduct.specs.protectivePackaging}</td>
              </tr>
              <tr>
                <td className="spec-key">Manufacturer Warranty</td>
                <td className="spec-val">{aiProduct.specs.warranty}</td>
              </tr>
            </tbody>
          </table>

          {/* Package Contents */}
          <h3 className="showcase-subheading">📦 Hardware & What’s Included</h3>
          <div className="package-contents-grid">
            {aiProduct.whatsIncluded.map((item, idx) => (
              <div className="package-item" key={idx}>
                <span className="package-item-icon">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Preparation Guidance & Contraindications */}
          <div className="safety-callout-card">
            <h4 className="safety-callout-title">
              <span>📋</span> Preparation Guidance & Contraindications
            </h4>
            <p>
              <strong>Preparation:</strong> {aiProduct.specs.preparationGuidance}
            </p>
            <p style={{ marginTop: "8px" }}>
              <strong>Contraindications:</strong> {aiProduct.specs.contraindications}
            </p>
            <p style={{ marginTop: "12px", fontSize: "12.5px", color: "#666" }}>
              <em>*Note on Manufacturer Specifications: {aiProduct.manufacturerDisclaimer}</em>
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────────
          SHARED CATEGORY: HEXA FLOW FREQUENCY DEVICES
          ─────────────────────────────────────────────────────────────────────────── */}
      <section
        className="hexa-flow-category-section"
        id="hexa-flow-devices"
        aria-labelledby="hexa-flow-category-heading"
      >
        <div className="hexa-flow-category-banner">
          <span className="hexa-flow-eyebrow">BIO-FREQUENCY INNOVATION COLLECTION</span>
          <h2 id="hexa-flow-category-heading" className="hexa-flow-heading">
            HEXA FLOW FREQUENCY DEVICES
          </h2>
          <p className="hexa-flow-subtitle">
            Explore a collection of frequency-based wellness technologies designed for personalized wellness experiences.
          </p>
        </div>

        {/* Three Distinct Product Cards Grid */}
        <div className="hexa-flow-cards-grid">
          {/* Product 3: Hexa Pulse */}
          <div className="hexa-device-card" id="card-hexa-pulse">
            <div className="hexa-device-img-wrap">
              <Image
                src={pulseProduct?.image || "/images/products/hexa-pulse-front.png"}
                alt="Hexa Pulse Entry-Level Frequency Device"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <span className="hexa-tier-badge">Entry-Level</span>
            </div>
            <div className="hexa-device-content">
              <span className="hexa-device-tag">{pulseProduct?.tag || "Hexa Flow · Frequency"}</span>
              <h3 className="hexa-device-title">Hexa Pulse</h3>
              <p className="hexa-device-desc">
                {pulseProduct?.shortDesc ||
                  "A compact and accessible frequency assessment device designed for intuitive full-body energetic scans, organ stress mapping, and personalized frequency feedback."}
              </p>
              <div className="hexa-device-footer">
                <Link
                  href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Hexa Pulse")}`}
                  className="btn-card-enquiry"
                  title="Enquire about Hexa Pulse"
                >
                  Enquire About Hexa Pulse <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Product 4: Hexa Sync */}
          <div className="hexa-device-card" id="card-hexa-sync">
            <div className="hexa-device-img-wrap">
              <Image
                src={syncProduct?.image || "/images/products/hexa-sync-device.png"}
                alt="Hexa Sync Intermediate Bioenergetic Device"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <span className="hexa-tier-badge">Intermediate</span>
            </div>
            <div className="hexa-device-content">
              <span className="hexa-device-tag">{syncProduct?.tag || "Hexa Flow · Spiral Scan"}</span>
              <h3 className="hexa-device-title">Hexa Sync</h3>
              <p className="hexa-device-desc">
                {syncProduct?.shortDesc ||
                  "A versatile intermediate frequency system featuring multi-level spiral scanning, remote radionic sample testing, and vibrational remedy imprinting capabilities."}
              </p>
              <div className="hexa-device-footer">
                <Link
                  href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Hexa Sync")}`}
                  className="btn-card-enquiry"
                  title="Enquire about Hexa Sync"
                >
                  Enquire About Hexa Sync <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Product 5: Hexa Lux (Card) */}
          <div className="hexa-device-card flagship-card" id="card-hexa-lux">
            <div className="hexa-device-img-wrap">
              <Image
                src={luxProduct?.image || "/images/products/hexa-lux-device.png"}
                alt="Hexa Lux Flagship NLS Bioresonance Platform"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <span className="hexa-tier-badge gold">Flagship NLS</span>
            </div>
            <div className="hexa-device-content">
              <span className="hexa-device-tag">{luxProduct?.tag || "Hexa Flow · Flagship NLS"}</span>
              <h3 className="hexa-device-title">Hexa Lux</h3>
              <p className="hexa-device-desc">
                {luxProduct?.shortDesc ||
                  "The flagship NLS bioresonance platform featuring 4D visual organ modeling, a reference library of over 5,000 etalons, remote biological chamber testing, BioRod, and simultaneous metatherapy."}
              </p>
              <div className="hexa-device-footer">
                <Link
                  href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Hexa Lux")}`}
                  className="btn-card-enquiry"
                  title="Enquire about Hexa Lux"
                >
                  Enquire About Hexa Lux <span>→</span>
                </Link>
                <a
                  href="#hexa-lux-platform"
                  className="btn-card-details-jump"
                  title="Jump to Hexa Lux full platform specifications"
                >
                  Explore Platform Details ↓
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Dedicated Hexa Lux Deep-Dive Section ───────────────────────────── */}
        <div
          className="hexa-lux-spotlight-section"
          id="hexa-lux-platform"
          aria-labelledby="hexa-lux-heading"
        >
          <div className="showcase-header">
            <div className="showcase-header-left">
              <span className="showcase-number-badge">
                <span>05</span> Flagship Quantum NLS Bioresonance Platform
              </span>
              <h2 id="hexa-lux-heading" className="showcase-title">
                Hexa Lux Platform
              </h2>
              <p className="showcase-subtitle">
                Advanced Non-Linear System (NLS) Diagnostics & Harmonic Metatherapy
              </p>
              <div className="showcase-pills-row">
                <span className="spec-badge-pill gold">🧬 4D Visual Scanning</span>
                <span className="spec-badge-pill">📚 5,000+ Reference Etalons*</span>
                <span className="spec-badge-pill">🧪 Remote DNA/RNA Chamber</span>
                <span className="spec-badge-pill">🦯 Exclusive BioRod Sensor</span>
                <span className="spec-badge-pill">🎧 Dual Adult & Child Headphones</span>
                <span className="spec-badge-pill">⚡ Simultaneous Metatherapy</span>
              </div>
            </div>
          </div>

          {/* Media & Key Highlights */}
          <div className="showcase-main-grid">
            <div className="showcase-gallery-col">
              <div className="showcase-main-img-wrap">
                <Image
                  src={luxProduct?.gallery[luxImgIdx] || luxProduct?.image}
                  alt={`Hexa Lux Workstation - View ${luxImgIdx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              {luxProduct?.gallery && luxProduct.gallery.length > 1 && (
                <div className="showcase-thumbs-strip" role="group" aria-label="Hexa Lux Gallery Views">
                  {luxProduct.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`showcase-thumb-btn ${idx === luxImgIdx ? "active" : ""}`}
                      onClick={() => setLuxImgIdx(idx)}
                      aria-label={`Select Hexa Lux photo ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Hexa Lux thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="showcase-narrative-col">
              <div>
                <h3 className="showcase-subheading">📖 Platform Overview</h3>
                <p className="showcase-overview-text">
                  {luxProduct?.overview}
                </p>

                <h3 className="showcase-subheading" style={{ marginTop: "20px" }}>
                  🔬 NLS & Bioresonance Technology (Manufacturer’s Explanation)
                </h3>
                <p className="showcase-overview-text">
                  {luxProduct?.nlsExplanation}
                </p>
              </div>

              <div className="showcase-action-bar">
                <Link
                  href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Hexa Lux")}`}
                  className="btn-cta-gold"
                  title="Request a quote for Hexa Lux"
                >
                  Request a Quote <span>→</span>
                </Link>
                <Link
                  href={`/explore-offer?destination=${encodeURIComponent("Energetika369 - Demo Request - Hexa Lux")}`}
                  className="btn-cta-secondary"
                  title="Book a demonstration of Hexa Lux"
                >
                  Book a Demo
                </Link>
                <Link
                  href="/contact"
                  className="btn-cta-secondary"
                  title="Contact WLC Concierge"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Hexa Lux Core Capabilities Grid */}
          <div className="showcase-details-box">
            <h3 className="showcase-subheading">✨ Core Platform Capabilities</h3>
            <div className="lux-capabilities-grid">
              <div className="lux-capability-card">
                <span className="lux-capability-icon">🔍</span>
                <div>
                  <h5>Full-Body & Sectoral Scanning</h5>
                  <p>Comprehensive biological scan in under 5 minutes with deep sectoral organ zoom for high-resolution analysis.</p>
                </div>
              </div>
              <div className="lux-capability-card">
                <span className="lux-capability-icon">🧪</span>
                <div>
                  <h5>Remedy Compatibility & Imprinting</h5>
                  <p>Evaluate vibrational compatibility with Bach flowers, herbs, and supplements, and imprint balancing frequencies into carrier solutions.</p>
                </div>
              </div>
              <div className="lux-capability-card">
                <span className="lux-capability-icon">📚</span>
                <div>
                  <h5>5,000+ Reference Etalons*</h5>
                  <p>Manufacturer-stated extensive database of reference frequency models across physiological organs, allergens, and botanicals.</p>
                </div>
              </div>
              <div className="lux-capability-card">
                <span className="lux-capability-icon">📡</span>
                <div>
                  <h5>Remote Testing & 4D Visualization</h5>
                  <p>DNA/RNA biological sample chamber for remote telehealth assessments paired with interactive 4D visual biofield models.</p>
                </div>
              </div>
              <div className="lux-capability-card">
                <span className="lux-capability-icon">⚡</span>
                <div>
                  <h5>Simultaneous Metatherapy</h5>
                  <p>Deliver targeted harmonizing frequency feedback concurrently during active scans for streamlined session flow.</p>
                </div>
              </div>
              <div className="lux-capability-card">
                <span className="lux-capability-icon">📈</span>
                <div>
                  <h5>Detailed Client Reports</h5>
                  <p>Generate, archive, and export comprehensive client progression reports to design bespoke wellness protocols.</p>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <h3 className="showcase-subheading">🔧 Technical Specifications</h3>
            <table className="specs-table" aria-label="Hexa Lux Technical Specifications">
              <tbody>
                <tr>
                  <td className="spec-key">Core Technology</td>
                  <td className="spec-val">{luxProduct?.specs.technology}</td>
                </tr>
                <tr>
                  <td className="spec-key">Frequency Database</td>
                  <td className="spec-val">{luxProduct?.specs.frequencyLibrary}</td>
                </tr>
                <tr>
                  <td className="spec-key">Remote Testing Chamber</td>
                  <td className="spec-val">{luxProduct?.specs.remoteTesting}</td>
                </tr>
                <tr>
                  <td className="spec-key">Sensors Included</td>
                  <td className="spec-val">{luxProduct?.specs.sensorsIncluded}</td>
                </tr>
                <tr>
                  <td className="spec-key">Therapeutic Features</td>
                  <td className="spec-val">{luxProduct?.specs.therapyCapabilities}</td>
                </tr>
                <tr>
                  <td className="spec-key">Software Architecture</td>
                  <td className="spec-val">{luxProduct?.specs.softwareCompatibility}</td>
                </tr>
                <tr>
                  <td className="spec-key">Security Key Architecture</td>
                  <td className="spec-val">{luxProduct?.specs.dongleArchitecture}</td>
                </tr>
                <tr>
                  <td className="spec-key">Manufacturer Warranty</td>
                  <td className="spec-val">{luxProduct?.specs.warranty}</td>
                </tr>
              </tbody>
            </table>

            {/* What's Included */}
            <h3 className="showcase-subheading">📦 What’s Included in the Hexa Lux Suite</h3>
            <div className="package-contents-grid">
              {luxProduct?.whatsIncluded.map((item, idx) => (
                <div className="package-item" key={idx}>
                  <span className="package-item-icon">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Medical Disclaimer & Regulatory Notice */}
            <div className="safety-callout-card">
              <h4 className="safety-callout-title">
                <span>🛡️</span> Regulatory & Educational Notice
              </h4>
              <p>{luxProduct?.regulatoryNotice}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Global Medical & Regulatory Disclaimer Banner ───────────────────── */}
      <section className="global-medical-disclaimer" aria-label="Global Wellness & Medical Disclaimer">
        <div className="disclaimer-icon-col">⚕️</div>
        <div className="disclaimer-content">
          <h4>Wellness Lovers Club — Advisory & Medical Disclaimer</h4>
          <p>
            The bio-frequency devices, quantum wellness systems, thermal mats, and bio-resonance analysis instruments featured on this page—including the Beyond PEMF Wellness Mat, HEXA SENSE AI, Hexa Pulse, Hexa Sync, and Hexa Lux—are non-invasive wellness technologies engineered for relaxation, lifestyle assessment, and personal energetic balancing.
          </p>
          <p>
            All operational metrics (such as the 60-second scan, 59 reports, 85% accuracy claim, and 5,000+ reference etalons) are manufacturer-supplied specifications. These systems are not medical diagnostic devices and are not intended to diagnose, treat, mitigate, or cure any disease or medical condition. Always consult a licensed healthcare practitioner for medical advice, diagnoses, and treatment plans.
          </p>
        </div>
      </section>
    </div>
  );
}
