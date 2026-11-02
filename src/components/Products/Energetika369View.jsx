"use client";

import Image from "next/image";
import Link from "next/link";

export default function Energetika369View({ brand }) {
  const products = brand?.products || [];
  const pemfProduct =
    products.find((p) => p.id === "pemf-crystal-mat") || products[0];
  const aiProduct =
    products.find((p) => p.id === "hexa-sense-ai") || products[1];
  const pulseProduct = products.find((p) => p.id === "hexa-pulse");
  const syncProduct = products.find((p) => p.id === "hexa-sync");
  const luxProduct = products.find((p) => p.id === "hexa-lux");

  // Additional 5 studio-photographed Energetika369 products
  const dijiWaveProduct = products.find(
    (p) => p.id === "energetika-digi-wave-369"
  );
  const neuroPulseProduct = products.find(
    (p) => p.id === "neuropulse-tms-device"
  );
  const rifeProProduct = products.find((p) => p.id === "rifemachine-2nd-gen");
  const dermaVisionProduct = products.find(
    (p) => p.id === "digital-iridoscope"
  );
  const lumicareProduct = products.find((p) => p.id === "lumicare-line");

  const extendedShowcaseConfigs = [
    {
      product: dijiWaveProduct,
      cardBadge: "Millimeter Wave",
      cardEyebrow: "30–300 GHz Non-Thermal Resonance",
      cardHighlights: [
        "📡 30–300 GHz Millimeter Wave Band",
        "💧 Coherent Cellular & Hydration Resonance",
        "🎯 Directional Emitter Cone & Strap",
        "🧳 Zippered Protective Travel Case"
      ]
    },
    {
      product: neuroPulseProduct,
      cardBadge: "Made in Italy · CE",
      cardEyebrow: "Transcranial Magnetic Therapy",
      cardHighlights: [
        "🧠 Low-Intensity rTMS Neuromodulation",
        "🇮🇹 Made in Italy · CE Certified",
        "🎧 Adjustable Adult & Pediatric Headgear",
        "🌙 Focus, Calm & Restorative Sleep"
      ]
    },
    {
      product: rifeProProduct,
      cardBadge: "14-Piece Luxury Kit",
      cardEyebrow: "2nd Gen Quantum Rife System",
      cardHighlights: [
        "🖥️ Full-Color Touchscreen Console",
        "🧰 14 Specialized Therapy Applicators",
        "🔥 Ultrasound, Laser, Cupping & Thermal Belt",
        "👟 Reflexology Shoes & Meridian Eye Mask"
      ]
    },
    {
      product: dermaVisionProduct,
      cardBadge: "Iris · Skin · Scalp",
      cardEyebrow: "Optical Diagnostic System",
      cardHighlights: [
        "👁️ High-Definition Iridology Imaging",
        "🔬 Epidermal Skin & Pore Analysis",
        "💇 Trichology Hair & Follicle Inspection",
        "🖥️ Dedicated LCD Monitor & Aluminum Case"
      ]
    },
    {
      product: lumicareProduct,
      cardBadge: "660nm & 850nm PBM",
      cardEyebrow: "LumiBody & LumiPulse Neuro",
      cardHighlights: [
        "☀️ Dual 660 nm Red + 850 nm NIR Light",
        "🛌 LumiBody 3,600-LED Full-Body Cocoon",
        "🧠 LumiPulse Neuro Cranial Helmet",
        "⚡ Mitochondrial ATP & Recovery Support"
      ]
    }
  ].filter((cfg) => Boolean(cfg.product));

  return (
    <div className="energetika369-container" id="energetika369-catalog">
      {/* ─── Product Overview Cards Hub ────────────────────────────────────── */}
      <section
        className="visual-groups-overview"
        aria-label="Product Overview Cards"
      >
        <div className="visual-groups-header">
          <span className="eyebrow">PRODUCT OVERVIEW</span>
          <h3>Ten Advanced Technologies Across Curated Disciplines</h3>
          <p>
            Explore Energetika369’s specialized wellness systems designed for
            cellular rejuvenation, non-invasive bio magnetic analysis,
            multi-tier NLS frequency harmonization, transcranial
            neuromodulation, and targeted recovery.
          </p>
        </div>

        {/* ── Standalone Products Overview (Beyond PEMF Mat & HEXA SENSE AI) ── */}
        <div className="overview-standalone-section">
          <div className="overview-subgroup-header">
            <span className="overview-subgroup-eyebrow">
              STANDALONE WELLNESS INNOVATIONS
            </span>
            <h4 className="overview-subgroup-title">
              Cellular Recovery &amp; Bio Magnetic Analysis
            </h4>
          </div>

          <div className="overview-cards-grid standalone-grid">
            {/* Standalone Product 1: Beyond PEMF Wellness Mat */}
            <div className="product-overview-card">
              <div className="product-card-thumb-wrap">
                <Image
                  src={
                    pemfProduct?.image || "/images/products/pemf-mat-session.webp"
                  }
                  alt="Beyond PEMF Wellness Mat"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  priority
                />
                <span className="product-card-badge">Thermal &amp; PEMF</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">
                  Whole-Body Restoration
                </span>
                <h4 className="product-card-title">Beyond PEMF Wellness Mat</h4>
                <p className="product-card-desc">
                  Natural 7-crystal rainbow mat engineered with calibrated
                  low-frequency PEMF, deep-penetrating far-infrared heat, and
                  photon bio-spectrum arrays.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">
                    ⚡ Calibrated PEMF (1–30 Hz / Levels 1–9)
                  </span>
                  <span className="card-highlight-item">
                    🔥 Far Infrared Deep Heat
                  </span>
                  <span className="card-highlight-item">
                    💎 7 Natural Gemstone Crystals
                  </span>
                  <span className="card-highlight-item">
                    💡 Photon Light &amp; Negative Ions
                  </span>
                </div>
                <div className="product-card-actions">
                  <Link
                    href="/offerings/products/energetika369/pemf-crystal-mat"
                    className="btn-card-explore"
                    title="Explore Beyond PEMF Mat Details"
                  >
                    Explore Details →
                  </Link>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent(
                      "Energetika369 - Beyond PEMF Wellness Mat"
                    )}`}
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
                  src={
                    aiProduct?.image ||
                    "/images/products/hexa-sense-ai-kit.webp"
                  }
                  alt="HEXA SENSE AI Analysis System"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  priority
                />
                <span className="product-card-badge">Bio Magnetic Analysis</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">
                  Bio Magnetic Analysis
                </span>
                <h4 className="product-card-title">HEXA SENSE AI</h4>
                <p className="product-card-desc">
                  Bio magnetic analysis system mapping 59 comprehensive health
                  reports in 60 seconds through an ergonomic solid alloy
                  hand-grip sensor.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">
                    ⏱️ 60-Second Rapid Protocol
                  </span>
                  <span className="card-highlight-item">
                    📊 59 Comprehensive Reports*
                  </span>
                  <span className="card-highlight-item">
                    🖐️ Solid Alloy Hand-Grip Sensor
                  </span>
                  <span className="card-highlight-item">
                    🔒 Encrypted USB Security Dongle
                  </span>
                </div>
                <div className="product-card-actions">
                  <Link
                    href="/offerings/products/energetika369/hexa-sense-ai"
                    className="btn-card-explore"
                    title="Explore HEXA SENSE AI Details"
                  >
                    Explore Details →
                  </Link>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent(
                      "Energetika369 - HEXA SENSE AI"
                    )}`}
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
            <span className="overview-subgroup-eyebrow">
              HEXA FLOW FREQUENCY DEVICES
            </span>
            <h4 className="overview-subgroup-title">
              Modular Multi-Tier Bio-Frequency Suite
            </h4>
            <p className="overview-subgroup-desc">
              Three distinct frequency devices engineered for progressive levels
              of energetic scanning, radionic resonance, and comprehensive NLS
              biofeedback.
            </p>
          </div>

          <div className="overview-cards-grid hexaflow-grid">
            {/* Hexa Flow Product 1: Hexa Pulse */}
            <div className="product-overview-card">
              <div className="product-card-thumb-wrap">
                <Image
                  src={
                    pulseProduct?.image ||
                    "/images/products/hexa-pulse-studio.webp"
                  }
                  alt="Hexa Pulse Frequency Device"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <span className="product-card-badge">Entry-Level</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">
                  Hexa Flow Collection
                </span>
                <h4 className="product-card-title">Hexa Pulse</h4>
                <p className="product-card-desc">
                  Compact and accessible frequency assessment device designed
                  for intuitive full-body energetic scans, organ stress mapping,
                  and personalized frequency feedback.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">
                    ⚡ Intuitive Full-Body Scan
                  </span>
                  <span className="card-highlight-item">
                    🎧 2-Sensor Bio-Inductor Headset
                  </span>
                  <span className="card-highlight-item">
                    💧 External Resonance Imprinting Cup
                  </span>
                </div>
                <div className="product-card-actions">
                  <Link
                    href="/offerings/products/energetika369/hexa-pulse"
                    className="btn-card-explore"
                    title="Explore Hexa Pulse Details"
                  >
                    Explore Details →
                  </Link>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent(
                      "Energetika369 - Hexa Pulse"
                    )}`}
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
                  src={
                    syncProduct?.image || "/images/products/hexa-sync-main.webp"
                  }
                  alt="Hexa Sync Intermediate Bioenergetic Device"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <span className="product-card-badge">Intermediate</span>
              </div>
              <div className="product-card-body">
                <span className="product-card-eyebrow">
                  Hexa Flow Collection
                </span>
                <h4 className="product-card-title">Hexa Sync</h4>
                <p className="product-card-desc">
                  Versatile intermediate frequency system featuring a 6-sensor
                  headset, Spiral Energy Disc for remote sessions, and
                  vibrational remedy imprinting capabilities.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">
                    🎧 6-Sensor Bio-Inductor Headset
                  </span>
                  <span className="card-highlight-item">
                    🌀 Spiral Scalar Energy Disc Included
                  </span>
                  <span className="card-highlight-item">
                    💧 Vibrational Remedy Imprinting
                  </span>
                </div>
                <div className="product-card-actions">
                  <Link
                    href="/offerings/products/energetika369/hexa-sync"
                    className="btn-card-explore"
                    title="Explore Hexa Sync Details"
                  >
                    Explore Details →
                  </Link>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent(
                      "Energetika369 - Hexa Sync"
                    )}`}
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
                  src={
                    luxProduct?.image ||
                    "/images/products/hexa-lux-studio.webp"
                  }
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
                  Flagship NLS bioresonance platform featuring 4D visual organ
                  modeling, dual Adult &amp; Child 6-sensor headsets, remote
                  chamber, exclusive BioRod, and simultaneous metatherapy.
                </p>
                <div className="product-card-highlights">
                  <span className="card-highlight-item">
                    🧬 4D Visual Organ Scanning
                  </span>
                  <span className="card-highlight-item">
                    🎧 Dual Adult &amp; Pediatric Headsets
                  </span>
                  <span className="card-highlight-item">
                    🦯 Exclusive BioRod Sensor
                  </span>
                  <span className="card-highlight-item">
                    ⚡ Simultaneous Metatherapy
                  </span>
                </div>
                <div className="product-card-actions">
                  <Link
                    href="/offerings/products/energetika369/hexa-lux"
                    className="btn-card-explore"
                    title="Explore Hexa Lux Platform Details"
                  >
                    Explore Details →
                  </Link>
                  <Link
                    href={`/explore-offer?destination=${encodeURIComponent(
                      "Energetika369 - Hexa Lux"
                    )}`}
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

        {/* ── Clinical, Neuro & Bio-Frequency Innovation Suite Overview (5 Products) ── */}
        {extendedShowcaseConfigs.length > 0 && (
          <div
            className="overview-standalone-section"
            style={{ marginTop: "36px" }}
          >
            <div className="overview-subgroup-header">
              <span className="overview-subgroup-eyebrow">
                CLINICAL, NEURO &amp; BIO-FREQUENCY EXPANSION SUITE
              </span>
              <h4 className="overview-subgroup-title">
                Millimeter Wave, rTMS Neuromodulation, 2nd Gen Rife, Iridology &amp;
                Photobiomodulation
              </h4>
              <p className="overview-subgroup-desc">
                Five specialized clinical and home-sanctuary technologies
                expanding the Energetika369 ecosystem across targeted brain,
                cellular, and optical modalities.
              </p>
            </div>

            <div className="overview-cards-grid hexaflow-grid">
              {extendedShowcaseConfigs.map((cfg) => {
                const p = cfg.product;
                return (
                  <div className="product-overview-card" key={p.id}>
                    <div className="product-card-thumb-wrap">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <span className="product-card-badge">
                        {cfg.cardBadge}
                      </span>
                    </div>
                    <div className="product-card-body">
                      <span className="product-card-eyebrow">
                        {cfg.cardEyebrow}
                      </span>
                      <h4 className="product-card-title">{p.name}</h4>
                      <p className="product-card-desc">{p.shortDesc}</p>
                      <div className="product-card-highlights">
                        {cfg.cardHighlights.map((hl, i) => (
                          <span className="card-highlight-item" key={i}>
                            {hl}
                          </span>
                        ))}
                      </div>
                      <div className="product-card-actions">
                        <Link
                          href={`/offerings/products/energetika369/${p.id}`}
                          className="btn-card-explore"
                          title={`Explore ${p.name} Details`}
                        >
                          Explore Details →
                        </Link>
                        <Link
                          href={`/explore-offer?destination=${encodeURIComponent(
                            p.enquiryDestination ||
                              `Energetika369 - ${p.name}`
                          )}`}
                          className="btn-card-enquire"
                          title={`Request a quote for ${p.name}`}
                        >
                          Request Quote <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ─── Global Medical & Regulatory Disclaimer Banner ───────────────────── */}
      <section
        className="global-medical-disclaimer"
        aria-label="Global Wellness & Medical Disclaimer"
      >
        <div className="disclaimer-icon-col">⚕️</div>
        <div className="disclaimer-content">
          <h4>Wellness Lovers Club — Advisory &amp; Medical Disclaimer</h4>
          <p>
            The bio-frequency devices, quantum wellness systems, thermal mats,
            optical inspection units, neuromodulation consoles, and bio
            magnetic analysis instruments featured on this page—including
            the Beyond PEMF Wellness Mat, HEXA SENSE AI, Hexa Pulse, Hexa Sync,
            Hexa Lux, Energetika Diji-Wave 369, NeuroPulse™ rTMS, Rife Frequency
            Pro, DermaVision369, and the Lumicare Photobiomodulation
            Series—are non-invasive wellness technologies engineered for
            relaxation, lifestyle assessment, and personal energetic balancing.
          </p>
          <p>
            All operational metrics (such as the 60-second scan, 59 reports,
            millimeter-wave frequency ranges, and reference etalons) are
            manufacturer-supplied specifications. These systems are not medical
            diagnostic devices and are not intended to diagnose, treat,
            mitigate, or cure any disease or medical condition. Always consult a
            licensed healthcare practitioner for medical advice, diagnoses, and
            treatment plans.
          </p>
        </div>
      </section>
    </div>
  );
}
