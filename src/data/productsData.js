/**
 * Wellness Lovers Club - Products Dataset
 * 
 * Sourced directly from official Energetika369 product catalogues and manuals
 * located in /public/products/
 * 
 * Enquiry-only offerings with zero prices, checkout, or cart functionality.
 */

export const PRODUCT_CATALOGUE_PDFS = [
  {
    id: "e369-main-cat",
    title: "Energetika369 Complete Catalogue",
    category: "Full Product Lineup",
    fileName: "Energetika369 Catalogue.pdf",
    filePath: "/products/Energetika369 Catalogue.pdf",
    description: "Complete product catalogue covering HexaFlow devices (Pulse, Sync, Lux), NeuroPulse TMS, Digital Iridoscope, Mini Rife Imprinter, AquaMAG, LumiPen Pro, LumiPulse Neuro, and Essential Bio-Frequency Oils.",
    icon: "📘"
  },
  {
    id: "pemf-mat-doc",
    title: "Beyond PEMF Wellness Mat Specification",
    category: "Technical Guide & Protocols",
    fileName: "Beyond PEMF Wellness Mat.pdf",
    filePath: "/products/Beyond PEMF Wellness Mat.pdf",
    description: "Comprehensive guide to natural crystal PEMF therapy, photon bio-light wavelengths, far-infrared thermal penetration, and cellular recovery protocols.",
    icon: "🧘"
  },
  {
    id: "diji-wave-doc",
    title: "Energetika Digi-Wave 369 Clinical Resonance",
    category: "Clinical Research & Protocols",
    fileName: "Energetika Diji-Wave 369.pdf",
    filePath: "/products/Energetika Diji-Wave 369.pdf",
    description: "Advanced millimeter wave therapy, clinical resonance studies, cellular frequency pathways, and application protocols.",
    icon: "⚡"
  },
  {
    id: "hexa-sense-manual",
    title: "Hexa Sense Ai Operation Manual",
    category: "User & Practitioner Manual",
    fileName: "Hexa Sense Ai Manual.pdf",
    filePath: "/products/Hexa Sense Ai Manual.pdf",
    description: "AI-powered bioresonance scanning guide, sensor calibration, bioenergetic signature analysis, and client report interpretation.",
    icon: "🔬"
  },
  {
    id: "aligne369-doc",
    title: "Aligne369 2026 Overview",
    category: "Brand & Strategic Vision",
    fileName: "Aligne369 2026.pdf",
    filePath: "/products/Aligne369 2026.pdf",
    description: "Comprehensive overview of the 369 Hz frequency resonance ecosystem, lifestyle integration, and holistic practitioner frameworks.",
    icon: "📑"
  }
];

export const PRODUCTS_BRANDS = [
  {
    id: "energetika369",
    name: "Energetika369",
    tagline: "Bio-Frequency Technology & Quantum Wellness",
    description: "Pioneering cellular restoration, scalar resonance, and bio-frequency systems engineered to restore energetic coherence, vitality, and cellular harmony.",
    badge: "Bio-Frequency & Quantum Medicine",
    logo: "/images/products/pemf-crystal-mat.webp",
    website: "https://energetika369.com/",
    catalogues: PRODUCT_CATALOGUE_PDFS,
    products: [
      {
        id: "pemf-crystal-mat",
        name: "PEMF Crystal Mat",
        brand: "Energetika369",
        category: "PEMF & Thermal Recovery",
        tag: "Cellular Recharging",
        image: "/images/products/pemf-crystal-mat.webp",
        pdfPath: "/products/Beyond PEMF Wellness Mat.pdf",
        pdfName: "Beyond PEMF Wellness Mat.pdf",
        shortDesc: "A multi-layer natural crystal PEMF mat integrating 3-color photon light therapy, far-infrared deep heat, 7 natural chakra healing crystal layers, and pulsed electromagnetic field frequencies.",
        features: [
          "7 Healing Crystal Layers (Amethyst, Tourmaline, Jade, Obsidian, Quartz)",
          "Far-Infrared Deep Thermal Rejuvenation",
          "3-Color Photon Bio-Light Therapy",
          "Calibrated Pulsed Electromagnetic Field (PEMF)"
        ]
      },
      {
        id: "energetika-digi-wave-369",
        name: "Energetika Digi-Wave 369",
        brand: "Energetika369",
        category: "Scalar Wave Technology",
        tag: "Harmonic Resonance",
        image: "/images/products/digi-wave-369.webp",
        pdfPath: "/products/Energetika Diji-Wave 369.pdf",
        pdfName: "Energetika Diji-Wave 369.pdf",
        shortDesc: "Advanced millimeter wave bio-frequency generator and scalar resonance system delivering clinical harmonic vibrational waveforms tuned to natural energetic frequencies for physiological renewal.",
        features: [
          "Advanced Millimeter Wave & Clinical Resonance",
          "Scalar Field Frequency Emission",
          "Multi-Band Cellular Balancing & Frequency Modulation",
          "Pre-Programmed Bio-Resonance Clinical Protocols"
        ]
      },
      {
        id: "hexa-sense-ai",
        name: "Hexa Sense Ai",
        brand: "Energetika369",
        category: "Bioenergetic Analysis",
        tag: "AI Bio-Scanning",
        image: "/images/products/hexa-sense-ai.webp",
        pdfPath: "/products/Hexa Sense Ai Manual.pdf",
        pdfName: "Hexa Sense Ai Manual.pdf",
        shortDesc: "Non-invasive AI-powered bioenergetic analysis and frequency scanning system designed to assess electromagnetic bio-signatures, stress patterns, organ coherence, and systemic balance.",
        features: [
          "Non-Invasive Sensor Bio-Feedback",
          "AI-Driven Energetic Signature Mapping",
          "Early Stress & Imbalance Detection",
          "Comprehensive Health Coherence Reporting"
        ]
      },
      {
        id: "bio-frequency-oils-and-patches",
        name: "Bio Frequency Oils and Patches",
        brand: "Energetika369",
        category: "Vibrational Botanicals",
        tag: "Transdermal & Aromatic",
        image: "/images/products/bio-frequency-oils.webp",
        pdfPath: "/products/Energetika369 Catalogue.pdf",
        pdfName: "Energetika369 Catalogue.pdf",
        shortDesc: "Harmonically imprinted Qi Oil Balance essential formulations and transdermal frequency patches crafted to provide localized energetic grounding, meridian support, and cellular calm.",
        features: [
          "Qi Oil Balance Frequency-Infused Pure Botanicals",
          "Hexa Chip Imprinted Quartz & Transdermal Patches",
          "Daily Stress Mitigation & Meridian Rebalancing",
          "Sustained Harmonizing Waveform Delivery"
        ]
      },
      {
        id: "hexa-flow-frequency-devices",
        name: "Hexa Flow Frequency Devices",
        brand: "Energetika369",
        category: "Frequency Systems",
        tag: "Clinical & Personal",
        image: "/images/products/hexa-flow-devices.webp",
        pdfPath: "/products/Energetika369 Catalogue.pdf",
        pdfName: "Energetika369 Catalogue.pdf",
        shortDesc: "Precision multi-channel frequency modulation devices including HexaFlow Pulse, HexaFlow Sync, and HexaFlow Lux engineered for structured clinical therapy rooms and home self-care routines.",
        features: [
          "HexaFlow Pulse, Sync & Lux Multi-Tier Configurations",
          "Remote Energy Disc & Multi-Sensor Headset Support",
          "Remedy Testing & Custom Frequency Imprinting Chamber",
          "Aluminium Portability Case & Professional Online Training"
        ]
      },
      {
        id: "neuropulse-tms-device",
        name: "NeuroPulse TMS Device",
        brand: "Energetika369",
        category: "Neuro-Wellness & TMS",
        tag: "Cognitive Balance",
        image: "/images/products/neuropulse-tms.webp",
        pdfPath: "/products/Energetika369 Catalogue.pdf",
        pdfName: "Energetika369 Catalogue.pdf",
        shortDesc: "Transcranial magnetic stimulation (TMS) and neuro-resonance device engineered to support neurological coherence, deep relaxation, cognitive recovery, and neuroelectric alignment.",
        features: [
          "Non-Invasive Brain Rehabilitation & Neuro-Stimulation",
          "Pulsed Magnetic Field Modulation for Neural Circuits",
          "Cognitive Focus, Calm & Sleep Support Protocols",
          "Audio-Tone Synced Headset Integration"
        ]
      },
      {
        id: "rifemachine-2nd-gen",
        name: "RifeMachine 2nd gen",
        brand: "Energetika369",
        category: "Rife Resonance Systems",
        tag: "Precision Frequency Sweeps",
        image: "/images/products/rifemachine-2nd-gen.webp",
        pdfPath: "/products/Energetika369 Catalogue.pdf",
        pdfName: "Energetika369 Catalogue.pdf",
        shortDesc: "Second-generation precision multi-frequency resonance generator with advanced programmable pulsed field modulation, electromagnetic sweeps, and harmonic cellular balancing.",
        features: [
          "Wide-Spectrum Programmable Frequency Sweeps",
          "Mini Rife Imprinter & Multi-Applicator Support",
          "Cellular Balancing Protocols",
          "High-Stability Pulsed Electromagnetic Output"
        ]
      },
      {
        id: "digital-iridoscope",
        name: "Digital Iridoscope",
        brand: "Energetika369",
        category: "Holistic Diagnostics",
        tag: "Optical Bio-Imaging",
        image: "/images/products/digital-iridoscope.webp",
        pdfPath: "/products/Energetika369 Catalogue.pdf",
        pdfName: "Energetika369 Catalogue.pdf",
        shortDesc: "High-resolution optical analysis station for iridological, dermatological, and trichological examination to evaluate constitutional vitality and tissue health states.",
        features: [
          "Ultra High-Definition Optical Sensor Array",
          "Iridological, Dermatological & Trichological Modes",
          "Computer-Linked Live High-Resolution Capture",
          "Non-Invasive Constitutional Assessment Tools"
        ]
      },
      {
        id: "lumicare-line",
        name: "Lumicare line",
        brand: "Energetika369",
        category: "Photobiomodulation",
        tag: "Light Spectrum Therapy",
        image: "/images/products/lumicare-line.webp",
        pdfPath: "/products/Energetika369 Catalogue.pdf",
        pdfName: "Energetika369 Catalogue.pdf",
        shortDesc: "Clinical-grade photobiomodulation line featuring LumiPen Pro (multi-wavelength red/blue/infrared) and LumiPulse Neuro therapeutic brain helmet for mitochondrial stimulation.",
        features: [
          "LumiPen Pro: Blue (460nm), Red (630/660nm) & Infrared (850/940nm)",
          "LumiPulse Neuro: Therapeutic Brain Photobiomodulation Helmet",
          "Mitochondrial ATP & Cellular Rejuvenation Support",
          "Deep Tissue Repair & Collagen Synthesis Stimulation"
        ]
      }
    ]
  }
];

