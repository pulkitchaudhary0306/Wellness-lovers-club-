export const PRODUCT_CATEGORIES = [
  {
    id: "all",
    label: "All Products",
    description: "Complete curated collection of advanced wellness technology and radiation protection systems."
  },
  {
    id: "pemf-thermal",
    label: "PEMF & Crystal Therapy",
    brandId: "energetika369",
    description: "Multi-therapy PEMF, far-infrared, crystal, and photobiomodulation wellness surfaces."
  },
  {
    id: "ai-diagnostics",
    label: "AI & Optical Assessment",
    brandId: "energetika369",
    description: "Non-invasive spectral, electromagnetic, and high-resolution optical assessment platforms."
  },
  {
    id: "hexa-flow-nls",
    label: "Hexa Flow Frequency Devices",
    brandId: "energetika369",
    description: "Non-Linear System (NLS) bioresonance scanning, frequency harmonization, and imprinting suites."
  },
  {
    id: "neuro-millimeter",
    label: "Neuro & Millimeter Wave",
    brandId: "energetika369",
    description: "Targeted rTMS brain neuromodulation, millimeter-wave cellular resonance, and photobiomodulation."
  },
  {
    id: "bio-frequency",
    label: "Rife & Bio-Frequency",
    brandId: "energetika369",
    description: "Multi-modality Rife frequency and electro-physical therapy consoles."
  },
  {
    id: "emr-protection",
    label: "EMR & Space Protection",
    brandId: "environics",
    description: "Scientifically tested electromagnetic radiation harmonization for personal devices and living spaces."
  }
];

export const PRODUCTS_DATA = [
  {
    id: "energetika369",
    brand: "Energetika369",
    tagline: "Quantum Wellness & Frequency Technology",
    heroSubtitle: "Non-Invasive Bio-Energetic Systems for Restorative Living",
    description:
      "Energetika369 brings together advanced bio-resonance engineering, pulsed electromagnetic field (PEMF) therapy, non-linear system (NLS) spectral diagnostics, and targeted frequency harmonization. Designed for holistic clinics, wellness sanctuaries, and discerning home practitioners.",
    website: "https://energetika369.com",
    name: "Energetika369",
    slug: "energetika369",
    route: "/offerings/products/energetika369",
    logo: "/images/products/pemf-mat-session.webp",
    heroImage: "/images/products/pemf-mat-session.webp",
    logoText: "ENERGETIKA 369",
    accentColor: "#14231b",
    products: [
      /* ==================================================================
         1. BEYOND PEMF WELLNESS MAT (Standalone Hero 1)
         ================================================================== */
      {
        id: "pemf-crystal-mat",
        anchorId: "beyond-pemf-mat",
        name: "Beyond PEMF Wellness Mat",
        tagline: "5-in-1 Multi-Therapy Cellular Grounding & Restorative Surface",
        category: "Multi-Therapy Wellness Mat",
        categoryId: "pemf-thermal",
        tag: "Flagship Innovation",
        image: "/images/products/pemf-mat-session.webp",
        gallery: [
          {
            src: "/images/products/pemf-mat-session.webp",
            alt: "Restorative wellness session on the Beyond PEMF Wellness Mat",
            caption: "Full-Body Restorative Studio Session"
          },
          {
            src: "/images/products/pemf-mat-crystal-detail.webp",
            alt: "Close-up of natural crystal ridges and photon LED nodes on the Beyond PEMF Mat",
            caption: "Natural Crystal Chambers & 660 nm Photon Nodes"
          },
          {
            src: "/images/products/pemf-mat-lifestyle.webp",
            alt: "Relaxation and reading on the Beyond PEMF Wellness Mat",
            caption: "Daily Home Sanctuary & Relaxation"
          },
          {
            src: "/images/products/pemf-mat-crystals-chart.webp",
            alt: "Seven natural crystals integrated into the Beyond PEMF Wellness Mat",
            caption: "7-Crystal Mineral Architecture"
          },
          {
            src: "/images/products/pemf-mat-controller.webp",
            alt: "Digital temperature and PEMF frequency controller for Beyond PEMF Wellness Mat",
            caption: "Precision Digital PEMF & Thermal Controller"
          }
        ],
        shortDesc:
          "A full-body restorative wellness mat uniting Pulsed Electromagnetic Fields (1–30 Hz), deep Far-Infrared thermal warmth, 660 nm Photon Red Light, Negative Ions, and seven natural crystal layers.",
        overview:
          "The Beyond PEMF Wellness Mat is engineered to transform any bed, treatment table, or relaxation space into a comprehensive five-modality recovery sanctuary. By layering Earth-inspired Pulsed Electromagnetic Fields (1–30 Hz) with deep-penetrating Far-Infrared thermal energy, 660 nm visible red photon light, and naturally emitted negative ions across seven distinct mineral crystal bands, it supports deep physical relaxation, microcirculation, and nervous system balance.",
        purpose:
          "Designed to counteract daily physical tension, sedentary fatigue, and sleep disruption through gentle, non-invasive full-body thermal and electromagnetic conditioning.",
        highlights: [
          "5 Synergistic Modalities (PEMF, FIR, 660 nm Red Light, Negative Ions, 7 Crystals)",
          "Earth-Resonant 1–30 Hz Frequency Range with 7.83 Hz Schumann Wave",
          "21 Multi-Functional Shielded Layers with Low-EMF Wiring Architecture"
        ],
        features: [
          {
            title: "Earth-Inspired PEMF (1–30 Hz)",
            desc: "Delivers gentle, tunable pulsed electromagnetic waves across Delta, Theta, Alpha, and Beta frequency bands—including the 7.83 Hz Schumann resonance—to support cellular recharging and autonomic calm."
          },
          {
            title: "Deep Far-Infrared Thermal Therapy (30°C–80°C)",
            desc: "Emits biocompatible 5–15 micron Far-Infrared rays that warm tissues comfortably from within, easing muscular stiffness and encouraging healthy peripheral blood flow."
          },
          {
            title: "660 nm Red Photon Light Nodes",
            desc: "Integrated 660 nm red light diodes deliver surface-level photobiomodulation to support skin vitality, localized tissue comfort, and cellular energy production."
          },
          {
            title: "Seven Natural Crystal Chakra Bands",
            desc: "Filled with Red Jasper, Golden Jade, Yellow Aventurine, Green Aventurine, Blue Lace Agate, Lapis Lazuli, and Amethyst—releasing steady warmth and up to 1,500/cm³ negative ions when heated."
          },
          {
            title: "21-Layer Shielded Construction",
            desc: "Crafted with waterproof vegan PU leather, high-grade silicone-insulated heating lines, charcoal cotton, and multi-sensor thermal protection for safe daily sessions."
          }
        ],
        benefits: [
          "Encourages deep muscular relaxation and relief from everyday physical stiffness.",
          "Supports restful sleep preparation through low-frequency Delta and Theta PEMF modes.",
          "Promotes healthy microcirculation and post-exercise recovery via gentle Far-Infrared warmth.",
          "Creates a grounding, stress-reducing environment for meditation, breathwork, or clinical bodywork."
        ],
        specs: {
          "Dimensions & Weight": "190 × 80 × 3 cm (74 × 31.5 × 1.2 in) | Approx. 15 kg",
          "PEMF Frequency Range": "1 – 30 Hz (Tunable, including 7.83 Hz Schumann Resonance)",
          "Photon Light Wavelength": "660 nm Visible Red Light",
          "Far-Infrared Wavelength": "5 – 15 µm (Biocompatible Thermal Spectrum)",
          "Negative Ion Output": "Up to 1,500 ions/cm³",
          "Temperature Control": "30°C – 80°C (86°F – 176°F) with Auto-Shutoff Timer",
          "Natural Crystal Array": "Amethyst, Lapis Lazuli, Blue Lace Agate, Green Aventurine, Yellow Aventurine, Golden Jade, Red Jasper",
          "Internal Architecture": "21 Multi-Functional Layers with EMF-Shielded Wiring"
        },
        whatsIncluded: [
          "Beyond PEMF Wellness Mat (190 × 80 cm)",
          "Digital PEMF, Photon & Temperature Controller",
          "Protective Waterproof Cover",
          "Heavy-Duty Padded Carrying & Storage Bag",
          "User Manual & Session Protocol Guide"
        ],
        idealFor: [
          "Deep Rest & Sleep Preparation",
          "Post-Workout Muscular Recovery",
          "Meditation, Yoga & Grounding Practices",
          "Holistic Clinics, Spas & Home Sanctuaries"
        ],
        usageSummary:
          "Place flat on a supportive surface, select your desired temperature (35°C–55°C for relaxation; higher for sauna-style warmth) and PEMF frequency mode, and relax for 30 to 60 minutes while staying well hydrated.",
        safetyInfo:
          "Wellness relaxation device. Consult a healthcare professional prior to use if pregnant, using an implanted electronic pacemaker/defibrillator, or managing acute medical conditions.",
        ctaText: "Enquire About Beyond PEMF Mat",
        enquiryDestination: "Energetika369 - Beyond PEMF Wellness Mat"
      },

      /* ==================================================================
         2. HEXA SENSE AI (Standalone Hero 2)
         ================================================================== */
      {
        id: "hexa-sense-ai",
        anchorId: "hexa-sense-ai",
        name: "HEXA SENSE AI",
        tagline: "AI-Assisted Multi-System Bio Magnetic Analysis & Spectral Assessment",
        category: "Bio Magnetic Analysis",
        categoryId: "ai-diagnostics",
        tag: "AI Wellness Intelligence",
        image: "/images/products/hexa-sense-ai-kit.webp",
        gallery: [
          {
            src: "/images/products/hexa-sense-ai-kit.webp",
            alt: "HEXA SENSE AI complete diagnostic console, hand-grip sensor, and carrying case",
            caption: "Complete HEXA SENSE AI Console & Sensor Kit"
          },
          {
            src: "/images/products/hexa-sense-ai-hardware.webp",
            alt: "Close-up of HEXA SENSE AI brushed metallic console, tactile hand sensor, and USB security keys",
            caption: "Precision Console, Hand-Grip Sensor & Dual USB Keys"
          },
          {
            src: "/images/products/hexa-sense-ai-session.webp",
            alt: "Practitioner conducting a non-invasive HEXA SENSE AI scan with live spectral software",
            caption: "Live 60-Second Non-Invasive Bio-Resonance Scan"
          },
          {
            src: "/images/products/hexa-sense-ai-studio.webp",
            alt: "HEXA SENSE AI studio showcase for early wellness trend detection",
            caption: "AI-Assisted Bio-Field & Organ Trend Visualization"
          }
        ],
        shortDesc:
          "A fast, non-invasive bio magnetic analysis platform that captures subtle frequency signals via a tactile hand sensor and generates 59 comprehensive wellness reports in 60 seconds.",
        overview:
          "HEXA SENSE AI combines Bio Magnetic Analysis with artificial intelligence pattern recognition to provide a rapid, non-invasive overview of functional wellness trends. Without drawing blood or requiring radiation exposure, a client simply holds the stainless-steel tactile sensor for approximately 60 seconds while the system compares subtle bio-electrical signals against an extensive reference spectrum—producing 59 structured wellness reports across cardiovascular, digestive, endocrine, skeletal, and nutritional domains.",
        purpose:
          "Created to empower wellness practitioners, nutritionists, and health-conscious individuals with rapid baseline screening, nutritional deficiency insights, and clear visual progress tracking.",
        highlights: [
          "Rapid 60-Second Non-Invasive Hand-Sensor Assessment",
          "59 Comprehensive Functional & Nutritional Report Modules",
          "4-Stage Signal Capture, Amplification, AI Comparison & Reporting"
        ],
        features: [
          {
            title: "60-Second Tactile Signal Capture",
            desc: "Uses a high-sensitivity hand-held biophoton and biofeedback frequency sensor to read cellular resonance patterns comfortably without needles, fasting, or invasive prep."
          },
          {
            title: "59 Multi-System Wellness Reports",
            desc: "Generates structured assessments covering cardiovascular elasticity, gastrointestinal function, liver/kidney indices, bone mineral density, trace elements, vitamins, amino acids, and coenzymes."
          },
          {
            title: "AI Reference Spectrum Matching",
            desc: "Amplifies micro-signals and processes them via Fourier transformation against a large-scale reference database to highlight functional imbalances and sub-optimal trends."
          },
          {
            title: "Dedicated Male, Female & Pediatric Profiles",
            desc: "Includes specialized report parameters for male and female endocrine/reproductive wellness as well as dedicated pediatric nutritional and ADHD/trace-element indices."
          },
          {
            title: "Longitudinal Progress Tracking",
            desc: "Allows practitioners and families to compare before-and-after scans side by side to evaluate how lifestyle, supplementation, and frequency sessions support balance over time."
          }
        ],
        benefits: [
          "Delivers an immediate, holistic snapshot of nutritional and functional wellness trends in one minute.",
          "Helps guide personalized supplementation, hydration, and lifestyle adjustments with clear visual metrics.",
          "Enhances client engagement in wellness clinics, gyms, and integrative nutrition practices.",
          "Completely painless, radiation-free, and suitable for regular wellness check-ins."
        ],
        howItWorksSteps: [
          {
            step: "01",
            title: "Signal Capture",
            desc: "The user holds the ergonomic hand sensor for 60 seconds while subtle biofeedback frequency signals are read."
          },
          {
            step: "02",
            title: "Signal Amplification",
            desc: "The console amplifies subtle cellular resonance data and converts it into digital frequency spectra."
          },
          {
            step: "03",
            title: "AI Data Comparison",
            desc: "Processed spectra are matched against reference wellness waveforms using Fourier analysis."
          },
          {
            step: "04",
            title: "59 Report Generation",
            desc: "The software compiles 59 color-coded system reports with actionable wellness and nutritional guidance."
          }
        ],
        reportCategories: [
          {
            group: "Core Organ & Vascular Systems (Reports 01–16)",
            items: [
              "01. Cardiovascular & Cerebrovascular",
              "02. Gastrointestinal Function",
              "03. Large Intestine Function",
              "04. Liver Function",
              "05. Gallbladder Function",
              "06. Pancreatic Function",
              "07. Kidney Function",
              "08. Lung Function",
              "09. Brain Nerve",
              "10. Bone Disease",
              "11. Bone Mineral Density",
              "12. Rheumatoid Bone Disease",
              "13. Bone Growth Index",
              "14. Blood Sugar",
              "15. Stomach & Small Intestine",
              "16. Channels & Collaterals"
            ]
          },
          {
            group: "Nutrients, Vitamins & Metabolic Indices (Reports 17–34)",
            items: [
              "17. Trace Elements",
              "18. Vitamins",
              "19. Amino Acids",
              "20. Coenzymes",
              "21. Fatty Acids",
              "22. Endocrine System",
              "23. Immune System",
              "24. Thyroid",
              "25. Human Toxin",
              "26. Heavy Metals",
              "27. Basic Physical Quality",
              "28. Allergy Index",
              "29. Obesity",
              "30. Skin",
              "31. Eye",
              "32. Collagen",
              "33. Pulse of Heart & Brain",
              "34. Blood Lipids"
            ]
          },
          {
            group: "Specialized Gender, Meridian & Summary Reports (Reports 35–59)",
            items: [
              "35. Prostate / Gynecology",
              "36. Male Sexual Function / Breast",
              "37. Sperm & Semen / Menstrual Cycle",
              "38. Element of Human",
              "39. Expert Analysis",
              "40. Hand Analysis",
              "41. Consciousness Energy (Chakra)",
              "42. Respiratory Functions",
              "43. Meridians Acupoint",
              "44. Spine",
              "45–52. Female & Male Specialized Hormones/Immunity",
              "53–58. Pediatric Trace Elements, Vitamins, Amino Acids, Coenzymes, Fatty Acids & ADHD",
              "59. Comprehensive Report Card"
            ]
          }
        ],
        specs: {
          "Analysis Method": "Bio Magnetic Analysis with AI Spectral Comparison",
          "Scan Duration": "Approx. 60 Seconds",
          "Report Output": "59 Functional, Nutritional, Gender-Specific & Pediatric Reports",
          "Sensor Interface": "High-Sensitivity Stainless Steel Biophoton Hand-Grip Sensor",
          "Connectivity": "USB 2.0 / 3.0 Hardware Interface + Encrypted USB Software Dongle",
          "OS Compatibility": "Windows 10 / Windows 11 (x64)",
          "Enclosure": "Compact Brushed Aluminum Console with Custom Padded Case"
        },
        whatsIncluded: [
          "HEXA SENSE AI Main Analysis Console",
          "Tactile Hand-Grip Biophoton Sensor & Cable",
          "USB Data Cable & Encrypted Software Dongles",
          "HEXA SENSE AI Windows Analysis Software Suite",
          "Custom Protective Travel Case & Practitioner Manual"
        ],
        idealFor: [
          "Wellness & Integrative Nutrition Clinics",
          "Fitness, Biohacking & Recovery Centers",
          "Preventive Health & Supplement Consultations",
          "Personal & Family Baseline Wellness Tracking"
        ],
        usageSummary:
          "Connect the console and security key to a Windows laptop, enter basic user profile details, and have the user hold the hand sensor calmly for 60 seconds to generate the full 59-report portfolio.",
        safetyInfo:
          "Intended for non-invasive wellness screening and educational lifestyle guidance only. Not a substitute for clinical medical diagnosis or laboratory blood testing.",
        ctaText: "Enquire About HEXA SENSE AI",
        enquiryDestination: "Energetika369 - HEXA SENSE AI"
      },

      /* ==================================================================
         3. HEXA PULSE (Grouped under HEXA FLOW FREQUENCY DEVICES)
         ================================================================== */
      {
        id: "hexa-pulse",
        anchorId: "hexa-pulse",
        group: "HEXA FLOW FREQUENCY DEVICES",
        name: "Hexa Pulse",
        tagline: "Essential Non-Linear System (NLS) Bioresonance Scanner & Harmonizer",
        category: "Hexa Flow Frequency Device",
        categoryId: "hexa-flow-nls",
        tag: "Personal & Starter Clinical NLS",
        image: "/images/products/hexa-pulse-studio.webp",
        gallery: [
          {
            src: "/images/products/hexa-pulse-studio.webp",
            alt: "Hexa Pulse Non-Linear System bioresonance console by Energetika369",
            caption: "Hexa Pulse Non-Linear System Console"
          },
          {
            src: "/images/products/hexa-pulse-headset.webp",
            alt: "Hexa Pulse 2-sensor bio-inductor headset",
            caption: "2-Sensor Bio-Inductor Headset"
          },
          {
            src: "/images/products/hexa-remedy-cup.webp",
            alt: "Hexa Pulse external resonance cup and dropper bottle for frequency imprinting",
            caption: "External Resonance Cup for Informational Imprinting"
          }
        ],
        shortDesc:
          "An accessible, portable Non-Linear System (NLS) bioresonance device with a 2-sensor bio-inductor headset and external resonance cup for foundational energetic scanning and meta-therapy.",
        overview:
          "Hexa Pulse is the foundational model in the Energetika369 Hexa Flow Frequency series. Utilizing Non-Linear System (NLS) bioresonance technology and a dual-sensor bio-inductor headset, it reads subtle electromagnetic oscillations from the body to map energetic stress across major organ systems. In addition to real-time Meta-Therapy frequency balancing, Hexa Pulse includes an external resonance cup for transferring corrective vibrational signatures into water, oils, or homeopathic carriers.",
        purpose:
          "Built for home wellness enthusiasts and entry-level holistic practitioners seeking reliable NLS bio-field scanning, chakra assessment, and basic informational remedy preparation.",
        highlights: [
          "Non-Linear System (NLS) Bioresonance Scanning & Meta-Therapy",
          "2-Sensor Bio-Inductor Headset for Comfortable Signal Detection",
          "External Resonance Cup for Water & Carrier Frequency Imprinting"
        ],
        features: [
          {
            title: "2-Sensor Bio-Inductor Headset",
            desc: "Features dual trigger sensors housed in an ergonomic headset to capture and transmit low-intensity biofeedback signals comfortably during sessions."
          },
          {
            title: "Foundational Organ & Chakra Mapping",
            desc: "Visualizes energetic balance across primary anatomical systems and energy centers using intuitive color-coded spectral scales."
          },
          {
            title: "Meta-Therapy Frequency Harmonization",
            desc: "Delivers targeted corrective frequency feedback directly through the bio-inductor headset to help restore energetic equilibrium."
          },
          {
            title: "External Resonance Imprinting Cup",
            desc: "Includes a plug-in resonance cup that allows users to imprint customized frequency patterns into purified water, tinctures, or sugar globules."
          }
        ],
        benefits: [
          "Provides an accessible entry point into authentic NLS bioresonance scanning and balancing.",
          "Compact and lightweight for convenient home use or mobile wellness consultations.",
          "Supports personalized daily wellness routines through custom frequency-imprinted water and drops.",
          "Non-invasive, gentle operation suitable for regular energetic maintenance."
        ],
        specs: {
          "System Architecture": "Non-Linear System (NLS) Bioresonance Scanner & Harmonizer",
          "Headset Configuration": "2-Sensor Bio-Inductor Headphones",
          "Resonance Chamber": "External Plug-In Resonance Cup",
          "Remote Spiral Disc": "Not Included (Available in Hexa Sync & Hexa Lux)",
          "BioRod Probe": "Not Included (Exclusive to Hexa Lux)",
          "Core Capabilities": "Basic Organ & System Scan, Meta-Therapy, Remedy Imprinting",
          "Certifications": "CE Marked Hardware Enclosure"
        },
        whatsIncluded: [
          "Hexa Pulse NLS Main Unit",
          "2-Sensor Bio-Inductor Headset",
          "External Resonance Imprinting Cup",
          "USB Interface Cable & Software Key",
          "Protective Carry Case & Quick-Start Guide"
        ],
        idealFor: [
          "Home Bioresonance & Personal Wellness",
          "Foundational Energetic Scanning",
          "Custom Frequency Water & Drop Preparation",
          "Entry-Level Holistic Practitioners"
        ],
        usageSummary:
          "Place the bio-inductor headset comfortably on the head, launch the NLS software to run an automated system scan, apply Meta-Therapy balancing, or place a glass dropper bottle in the external cup to imprint frequencies.",
        safetyInfo:
          "Bio-energetic wellness instrument. Not intended to diagnose, treat, cure, or prevent medical diseases.",
        ctaText: "Enquire About Hexa Pulse",
        enquiryDestination: "Energetika369 - Hexa Pulse"
      },

      /* ==================================================================
         4. HEXA SYNC (Grouped under HEXA FLOW FREQUENCY DEVICES)
         ================================================================== */
      {
        id: "hexa-sync",
        anchorId: "hexa-sync",
        group: "HEXA FLOW FREQUENCY DEVICES",
        name: "Hexa Sync",
        tagline: "Advanced 6-Sensor NLS Bioresonance Suite with Remote Scalar Disc",
        category: "Hexa Flow Frequency Device",
        categoryId: "hexa-flow-nls",
        tag: "Advanced Practitioner System",
        image: "/images/products/hexa-sync-main.webp",
        gallery: [
          {
            src: "/images/products/hexa-sync-main.webp",
            alt: "Hexa Sync console with bio-inductor headphones and remedy bottle on a studio desk",
            caption: "Hexa Sync Practitioner Desktop Setup"
          },
          {
            src: "/images/products/hexa-sync-studio.webp",
            alt: "Hexa Sync Non-Linear System front hardware view",
            caption: "Hexa Sync NLS Hardware Console"
          },
          {
            src: "/images/products/hexa-spiral-disc.webp",
            alt: "Hexa Sync remote scalar spiral energy disc",
            caption: "Spiral Energy Disc for Remote & Scalar Sessions"
          },
          {
            src: "/images/products/hexa-remedy-chamber.webp",
            alt: "Hexa Sync external resonance chamber on practitioner table",
            caption: "Precision Resonance Chamber for Remedy Testing"
          },
          {
            src: "/images/products/hexa-remedy-cup.webp",
            alt: "Hexa Sync remedy cup and amber glass dropper bottle",
            caption: "Remedy Imprinting Cup & Carrier Bottle"
          }
        ],
        shortDesc:
          "A professional mid-tier NLS bioresonance platform upgraded with a 6-sensor bio-inductor headset, external resonance chamber, and a dedicated Spiral Energy Disc for remote informational sessions.",
        overview:
          "Hexa Sync elevates the Hexa Flow series for active wellness practitioners and dedicated biohacking households. By upgrading to a 6-sensor bio-inductor headset, Hexa Sync captures higher-density AI biofeedback for deeper organ, tissue, and cellular-level spectral analysis. Crucially, Hexa Sync introduces the Spiral Energy Disc alongside the external resonance chamber—enabling both in-person Meta-Therapy and remote scalar/informational sessions using biological samples.",
        purpose:
          "Engineered for practitioners and advanced users who require deeper 6-sensor scanning accuracy, supplement/allergen compatibility testing, and remote informational balancing.",
        highlights: [
          "Upgraded 6-Sensor Bio-Inductor Headset for High-Precision Scanning",
          "Includes Spiral Energy Disc for Remote Informational Sessions",
          "Deep Organ, Tissue & Cellular Spectral Analysis + Vegeto-Testing"
        ],
        features: [
          {
            title: "6-Sensor Bio-Inductor Headset",
            desc: "Triples the sensor array compared to entry-level units, improving signal stability and resolution across organ, tissue, and cellular scan views."
          },
          {
            title: "Remote Spiral Energy Disc",
            desc: "Includes a specialized copper-trace spiral antenna disc designed for remote informational broadcasting and extended bio-field harmonization."
          },
          {
            title: "External Resonance Chamber & Vegeto-Test",
            desc: "Allows practitioners to test the energetic compatibility of supplements, herbs, or essential oils and imprint bespoke frequency remedies."
          },
          {
            title: "Expanded Etalon Reference Library",
            desc: "Provides broader access to spectral etalons including microorganisms, allergens, emotional/Bach flower profiles, and nutritional resonances."
          }
        ],
        benefits: [
          "Significantly faster and more detailed bio-field assessments via the 6-sensor headset.",
          "Supports both in-clinic sessions and distance wellness protocols using the Spiral Energy Disc.",
          "Helps practitioners fine-tune supplement regimens through real-time resonance compatibility testing.",
          "Bridges the gap between personal home units and full clinical flagship platforms."
        ],
        specs: {
          "System Architecture": "Advanced 6-Sensor Non-Linear System (NLS) Bioresonance Suite",
          "Headset Configuration": "6-Sensor Bio-Inductor Headphones",
          "Resonance Chamber": "External Resonance Cup + Built-In Sample Testing Support",
          "Remote Spiral Disc": "Included (Spiral Scalar Energy Disc)",
          "BioRod Probe": "Not Included (Exclusive to Hexa Lux)",
          "Core Capabilities": "Deep Organ/Tissue/Cell Scan, Meta-Therapy, Vegeto-Testing, Remote Sessions",
          "Certifications": "CE Marked Hardware Enclosure"
        },
        whatsIncluded: [
          "Hexa Sync NLS Main Console",
          "6-Sensor Bio-Inductor Headphones",
          "Spiral Energy Disc for Remote Sessions",
          "External Resonance Imprinting Cup",
          "USB Interface Cable, Software Dongle & Padded Case"
        ],
        idealFor: [
          "Holistic Practitioners & Naturopaths",
          "In-Person & Remote Bioresonance Sessions",
          "Supplement & Remedy Compatibility Testing",
          "Advanced Home Biohacking Suites"
        ],
        usageSummary:
          "Use the 6-sensor headset for comprehensive in-person scanning and Meta-Therapy, or connect the Spiral Energy Disc and Resonance Cup for remote informational protocols and remedy imprinting.",
        safetyInfo:
          "Bio-energetic wellness instrument for informational assessment and relaxation support. Does not replace medical care.",
        ctaText: "Enquire About Hexa Sync",
        enquiryDestination: "Energetika369 - Hexa Sync"
      },

      /* ==================================================================
         5. HEXA LUX (Grouped under HEXA FLOW FREQUENCY DEVICES)
         ================================================================== */
      {
        id: "hexa-lux",
        anchorId: "hexa-lux-platform",
        group: "HEXA FLOW FREQUENCY DEVICES",
        name: "Hexa Lux",
        tagline: "Flagship Clinical NLS Platform with Dual Headsets & Exclusive BioRod Probe",
        category: "Hexa Flow Frequency Device",
        categoryId: "hexa-flow-nls",
        tag: "Flagship Clinical NLS",
        image: "/images/products/hexa-lux-studio.webp",
        gallery: [
          {
            src: "/images/products/hexa-lux-studio.webp",
            alt: "Hexa Lux flagship Non-Linear System console by Energetika369",
            caption: "Hexa Lux Flagship Clinical NLS Console"
          },
          {
            src: "/images/products/hexa-lux-clinic.webp",
            alt: "Hexa Lux console with DNA/sample resonance chamber in clinical setting",
            caption: "Hexa Lux with High-Sensitivity Sample Chamber"
          },
          {
            src: "/images/products/hexa-lux-headphones.webp",
            alt: "Hexa Lux dual 6-sensor Adult and Child bio-inductor headsets",
            caption: "Dual 6-Sensor Headsets (Adult & Pediatric)"
          },
          {
            src: "/images/products/hexa-lux-biorod.webp",
            alt: "Exclusive BioRod handheld resonance wand sensor included with Hexa Lux",
            caption: "Exclusive BioRod Handheld Resonance Probe"
          },
          {
            src: "/images/products/hexa-spiral-disc.webp",
            alt: "Hexa Lux spiral scalar disc for remote sessions",
            caption: "Remote Scalar Spiral Disc"
          }
        ],
        shortDesc:
          "The pinnacle of the Hexa Flow series—featuring dual 6-sensor headsets (Adult & Child), the exclusive BioRod probe, Spiral Energy Disc, and up to 1,400+ anatomical and ultra-microscopic scan views.",
        overview:
          "Hexa Lux is Energetika369's flagship Non-Linear System (NLS) clinical platform, engineered for integrative clinics, family wellness centers, and master practitioners. It is the only system in the Hexa Flow lineup equipped with two dedicated 6-sensor bio-inductor headsets (ergonomically sized for both Adults and Children) plus the exclusive handheld BioRod probe for secondary point verification. Its advanced software unlocks up to 1,400+ anatomical, histological, chromosomal, and ultra-microscopic structures alongside multi-dimensional therapy modules including Phytotherapy, Lithotherapy, Bach Flowers, Fear Matrix, and Physiotherapy.",
        purpose:
          "Designed to provide uncompromising clinical versatility—supporting adult, pediatric, and remote bioresonance assessments with multi-layered corrective frequency protocols.",
        highlights: [
          "Dual 6-Sensor Bio-Inductor Headsets (Dedicated Adult & Child Sizes)",
          "Exclusive BioRod Handheld Probe + Spiral Remote Disc + Sample Chamber",
          "Up to 1,400+ Anatomical, Cellular, DNA & Ultra-Microscopic Scan Views"
        ],
        features: [
          {
            title: "Dual Adult & Pediatric 6-Sensor Headsets",
            desc: "Includes two precision 6-sensor bio-inductor headsets tailored for adults and children, ensuring optimal sensor contact and accurate readings across all age groups."
          },
          {
            title: "Exclusive BioRod Handheld Probe",
            desc: "Adds a tactile handheld resonance wand that provides an additional bio-feedback channel for localized point checks and deeper signal verification."
          },
          {
            title: "1,400+ Multi-Level Spectral Visualizations",
            desc: "Investigates energetic balance from whole-organ systems down to tissue cross-sections, cellular structures, chromosomes, and DNA helix segments."
          },
          {
            title: "Complete Multi-Modality Therapy Suite",
            desc: "Integrates Meta-Therapy, Phytotherapy (herbal resonance), Lithotherapy (mineral/crystal frequencies), Bach Flower & Fear Matrix emotional balancing, and Meridian/Chakra harmonization."
          },
          {
            title: "High-Precision Vegeto-Test & Remedy Imprinting",
            desc: "Features both an internal/external sample chamber and Spiral Energy Disc to test remedy resonance and imprint water, alcohol, sugar, or paraffin carriers."
          }
        ],
        benefits: [
          "All-in-one clinical flagship suitable for adult, pediatric, and remote family wellness care.",
          "Delivers the deepest analytical resolution in the Hexa Flow range with ultra-microscopic views.",
          "Combines physical, meridian, chakra, and emotional (Bach Flower / Fear Matrix) frequency balancing in one platform.",
          "Backed by complete hardware accessories including BioRod, Dual Headsets, Resonance Cup, and Spiral Disc."
        ],
        specs: {
          "System Architecture": "Flagship Clinical Non-Linear System (NLS) Bioresonance Platform",
          "Headset Configuration": "Dual 6-Sensor Bio-Inductor Headsets (1× Adult + 1× Child)",
          "Exclusive Sensor": "BioRod Handheld Tactile Resonance Probe",
          "Resonance & Remote Suite": "External Resonance Chamber + Spiral Scalar Energy Disc",
          "Anatomical & Micro Models": "Up to 1,400+ Organ, Tissue, Cellular & DNA Models",
          "Integrated Therapy Modules": "Meta-Therapy, Phytotherapy, Lithotherapy, Bach Flowers, Fear Matrix, Chakras & Meridians",
          "Imprinting Carriers": "Water, Alcohol, Sugar Globules, Paraffin / Oils"
        },
        whatsIncluded: [
          "Hexa Lux Flagship NLS Console",
          "Adult 6-Sensor Bio-Inductor Headset",
          "Pediatric (Child) 6-Sensor Bio-Inductor Headset",
          "Exclusive BioRod Handheld Resonance Probe",
          "Spiral Energy Disc & External Resonance Chamber",
          "USB Cables, Encrypted Software Key & Luxury Aluminum Case"
        ],
        idealFor: [
          "Integrative & Holistic Wellness Clinics",
          "Family & Pediatric Bioresonance Practices",
          "Comprehensive Organ, Cellular & Emotional Balancing",
          "Practitioners Requiring Full Accessories & Remote Capability"
        ],
        usageSummary:
          "Select the Adult or Child 6-sensor headset (plus the BioRod probe for enhanced sensitivity), perform a multi-level NLS scan across up to 1,400+ models, apply targeted Meta/Litho/Phytotherapy, or imprint custom frequency remedies.",
        safetyInfo:
          "Professional bio-energetic assessment and wellness harmonization system. Intended to complement, not replace, licensed medical evaluation.",
        ctaText: "Enquire About Hexa Lux",
        enquiryDestination: "Energetika369 - Hexa Lux"
      },

      /* ==================================================================
         6. ENERGETIKA DIJI-WAVE 369 (Millimeter Wave Therapy)
         ================================================================== */
      {
        id: "energetika-digi-wave-369",
        anchorId: "diji-wave-369",
        name: "Energetika Diji-Wave 369",
        tagline: "Clinical Resonance — Advanced Millimeter Wave (MMW) Therapy System",
        category: "Millimeter Wave Therapy",
        categoryId: "neuro-millimeter",
        tag: "Cellular Resonance Technology",
        image: "/images/products/diji-wave-369-hero.webp",
        gallery: [
          {
            src: "/images/products/diji-wave-369-hero.webp",
            alt: "Energetika Diji-Wave 369 millimeter wave therapy console, emitter cone, and travel case",
            caption: "Diji-Wave 369 Complete Console, Applicator & Travel Case"
          },
          {
            src: "/images/products/diji-wave-369-studio.webp",
            alt: "Studio view of Diji-Wave 369 controller, bronze millimeter-wave emitter, and fixation strap",
            caption: "Digital Controller & Precision Millimeter-Wave Emitter"
          },
          {
            src: "/images/products/diji-wave-369-features.webp",
            alt: "Diji-Wave 369 millimeter wave therapy key clinical highlights",
            caption: "Non-Thermal Extremely High Frequency (EHF) Delivery"
          },
          {
            src: "/images/products/diji-wave-369-resonance.webp",
            alt: "Diagram of coherent cellular oscillation and water molecule alignment with Diji-Wave 369",
            caption: "Coherent Cellular Oscillation & Hydration Resonance"
          },
          {
            src: "/images/products/diji-wave-369-cascade.webp",
            alt: "Physiological cascade of millimeter wave therapy from skin receptors to systemic balance",
            caption: "Three-Phase Physiological Signaling Cascade"
          }
        ],
        shortDesc:
          "A non-invasive, non-thermal Millimeter Wave (30–300 GHz / 1–10 mm) therapy system that delivers low-intensity coherent oscillations to support microcirculation, cellular energy, and localized recovery.",
        overview:
          "Energetika Diji-Wave 369 harnesses Extremely High Frequency (EHF) Millimeter Wave technology—operating in the 30 to 300 GHz spectrum (1 to 10 mm wavelength)—to communicate gently with the body's natural cellular oscillations. Unlike thermal heating devices, Diji-Wave 369 works via non-thermal informational resonance: its precision emitter cone delivers low-intensity millimeter waves to skin receptors, meridian points, or localized joints, initiating a neuro-humoral and microcirculatory cascade that supports tissue vitality, immune resilience, and comfort.",
        purpose:
          "Engineered to provide targeted, drug-free support for localized joint/muscle comfort, microcirculatory flow, post-exertion recovery, and acupoint stimulation.",
        highlights: [
          "Non-Thermal Millimeter Wave Spectrum (30–300 GHz | 1–10 mm Wavelength)",
          "Precision Directional Emitter Cone with Adjustable Fixation Strap",
          "Supports Microcirculation, ATP Vitality & Neuro-Humoral Balance"
        ],
        features: [
          {
            title: "Coherent Millimeter-Wave Emission (30–300 GHz)",
            desc: "Generates low-intensity, non-ionizing electromagnetic waves in the 1–10 mm band that match the natural resonant frequencies of cell membranes and structured water molecules."
          },
          {
            title: "Non-Thermal Informational Mechanism",
            desc: "Operates without heating or damaging tissue, making it gentle and comfortable for daily localized sessions on sensitive joints, acupoints, or soft tissue."
          },
          {
            title: "Three-Phase Physiological Cascade",
            desc: "Stimulates superficial skin receptors and micro-vessels within 0.5–1 mm depth, triggering systemic neuro-humoral signaling and improved nutrient/oxygen transport."
          },
          {
            title: "Hands-Free Clinical & Home Ergonomics",
            desc: "Includes a lightweight bronze-finished emitter cone, flexible fixation strap, digital timer controller, and custom zippered protective case."
          }
        ],
        benefits: [
          "Promotes localized comfort and mobility in joints, tendons, and fatigued muscles.",
          "Supports healthy capillary microcirculation and cellular oxygenation.",
          "Ideal for needle-free stimulation of traditional meridian and reflexology points.",
          "Portable, intuitive operation for both clinical physiotherapy and home recovery."
        ],
        specs: {
          "Operating Spectrum": "Extremely High Frequency (EHF) Millimeter Waves (30 – 300 GHz)",
          "Wavelength Range": "1 – 10 Millimeters (Non-Ionizing, Non-Thermal)",
          "Penetration Profile": "0.5 – 1.0 mm Surface Receptor & Capillary Resonance",
          "Applicator Type": "Directional Millimeter-Wave Emitter Cone with Elastic Fixation Strap",
          "Control Unit": "Digital Push-Button Timer & Mode Console",
          "Portability": "Custom Zippered Hard-Shell Protective Carry Case"
        },
        whatsIncluded: [
          "Energetika Diji-Wave 369 Digital Control Console",
          "Directional Millimeter-Wave Emitter Cone & Cable",
          "Elastic Hands-Free Fixation Strap",
          "Power Adapter & Zippered Protective Case",
          "Application & Acupoint Protocol Guide"
        ],
        idealFor: [
          "Localized Joint & Muscular Comfort",
          "Microcirculation & Cellular Recovery",
          "Needle-Free Acupoint & Meridian Stimulation",
          "Physiotherapy, Sports Recovery & Home Wellness"
        ],
        usageSummary:
          "Position the emitter cone over the target area or meridian point using the adjustable strap, select the session duration on the digital console (typically 15–30 minutes), and relax during the non-thermal session.",
        safetyInfo:
          "Non-ionizing, non-thermal wellness device. Do not apply directly over the eyes or active implanted electronic devices.",
        ctaText: "Enquire About Diji-Wave 369",
        enquiryDestination: "Energetika369 - Diji-Wave 369"
      },

      /* ==================================================================
         7. NEUROPULSE™ rTMS BRAIN THERAPY SYSTEM
         ================================================================== */
      {
        id: "neuropulse-tms-device",
        anchorId: "neuropulse-rtms",
        name: "NeuroPulse™ rTMS Brain Therapy System",
        tagline: "Non-Invasive Repetitive Transcranial Magnetic Stimulation for Cognitive Balance",
        category: "Neuro-Modulation System",
        categoryId: "neuro-millimeter",
        tag: "Made in Italy • CE Certified",
        image: "/images/products/neuropulse-tms-hero.webp",
        gallery: [
          {
            src: "/images/products/neuropulse-tms-hero.webp",
            alt: "NeuroPulse rTMS Brain Therapy System console, ergonomic headgear, and cables",
            caption: "NeuroPulse™ rTMS Console & Ergonomic Transcranial Headgear"
          },
          {
            src: "/images/products/neuropulse-tms-studio.webp",
            alt: "Studio presentation of NeuroPulse rTMS console and headgear on travertine pedestal",
            caption: "Italian-Engineered Console & Multi-Point Headpiece"
          },
          {
            src: "/images/products/neuropulse-tms-session.webp",
            alt: "Adult client relaxing in clinic chair during a non-invasive NeuroPulse rTMS session",
            caption: "Comfortable, Non-Invasive Clinical & Home Sessions"
          },
          {
            src: "/images/products/neuropulse-tms-pediatric.webp",
            alt: "Pediatric client wearing adjustable NeuroPulse headgear in a calm clinical setting",
            caption: "Gentle, Adjustable Fit for Adults & Children"
          },
          {
            src: "/images/products/neuropulse-tms-banner.webp",
            alt: "NeuroPulse rTMS Brain Therapy System overview for focus, calm, and mental wellness",
            caption: "Designed for Focus, Calm, Sleep & Emotional Equilibrium"
          }
        ],
        shortDesc:
          "An Italian-engineered, CE-certified low-intensity rTMS neuromodulation system with ergonomic multi-point headgear designed to support focus, emotional calm, sleep quality, and neuroplasticity.",
        overview:
          "The NeuroPulse™ rTMS Brain Therapy System brings gentle, non-invasive Repetitive Transcranial Magnetic Stimulation (rTMS) into integrative wellness clinics and supervised home environments. Engineered and manufactured in Italy, NeuroPulse delivers weak, targeted electromagnetic pulses through an adjustable multi-coil headpiece to encourage balanced neuronal activity, healthy synaptic communication, and autonomic calm—without discomfort, sedation, or recovery downtime.",
        purpose:
          "Developed to support mental clarity, stress resilience, restful sleep architecture, and cognitive vitality in both adults and children.",
        highlights: [
          "Non-Invasive Low-Intensity rTMS Neuromodulation Technology",
          "Made in Italy with CE-Certified Hardware & Ergonomic Headgear",
          "Supports Focus, Emotional Calm, Sleep Quality & Neuroplasticity"
        ],
        features: [
          {
            title: "Targeted Low-Intensity rTMS Pulses",
            desc: "Generates gentle, rhythmic magnetic pulses across cortical regions to encourage balanced brainwave entrainment and healthy neuroplasticity."
          },
          {
            title: "Ergonomic Multi-Point Headgear",
            desc: "Features a lightweight, fully adjustable cranial harness with precision-positioned induction nodes that fit comfortably on both adults and children."
          },
          {
            title: "Pre-Programmed Cognitive & Calm Protocols",
            desc: "Equipped with an intuitive digital console offering structured session programs for focus enhancement, deep relaxation, sleep support, and mood balance."
          },
          {
            title: "Italian Engineering & CE Certification",
            desc: "Built to rigorous European quality standards in Italy, combining clinical reliability with simple push-button operation."
          }
        ],
        benefits: [
          "Encourages mental clarity, sustained attention, and reduced cognitive fatigue.",
          "Promotes a calm nervous system response during periods of high stress or emotional overload.",
          "Supports healthier sleep onset and restorative nighttime rest.",
          "Completely non-invasive, painless, and comfortable to wear while seated and relaxing."
        ],
        specs: {
          "Modality": "Low-Intensity Repetitive Transcranial Magnetic Stimulation (rTMS)",
          "Applicator": "Adjustable Multi-Coil Cranial Headgear (Adult & Pediatric Fit)",
          "Control Interface": "Digital LCD Console with Pre-Set Wellness Programs",
          "Origin & Compliance": "Made in Italy | CE-Certified Wellness Equipment",
          "Session Experience": "Non-Invasive, Drug-Free, Seated Relaxation (20–30 Min)",
          "Dual Output Ports": "Supports Cranial Headgear & Auxiliary Applicator Connections"
        },
        whatsIncluded: [
          "NeuroPulse™ Digital rTMS Control Unit",
          "Adjustable Multi-Node Cranial Headgear",
          "Connection Cables & Power Supply",
          "Protective Storage Case & Clinical Protocol Manual"
        ],
        idealFor: [
          "Focus, Attention & Cognitive Clarity",
          "Stress Reduction & Emotional Calm",
          "Restorative Sleep Support",
          "Neuro-Wellness Clinics & Supervised Home Use"
        ],
        usageSummary:
          "Fit the adjustable headgear comfortably over the crown and temples while seated, select the desired wellness program on the NeuroPulse console, and relax quietly for the duration of the automated session.",
        safetyInfo:
          "Contraindicated for individuals with cochlear implants, intracranial metal clips, or cardiac pacemakers. Consult a qualified practitioner before use in individuals with a history of seizure disorders.",
        ctaText: "Enquire About NeuroPulse™ rTMS",
        enquiryDestination: "Energetika369 - NeuroPulse rTMS"
      },

      /* ==================================================================
         8. RIFE FREQUENCY PRO (2nd Gen Rife System)
         ================================================================== */
      {
        id: "rifemachine-2nd-gen",
        anchorId: "rife-frequency-pro",
        name: "Rife Frequency Pro (2nd Gen Rife System)",
        tagline: "Intelligent Quantum Health System — Multi-Modality Frequency & Electro-Therapy Suite",
        category: "Multi-Modality Rife System",
        categoryId: "bio-frequency",
        tag: "14-Piece Luxury Clinical Configuration",
        image: "/images/products/rife-frequency-pro-hero.webp",
        gallery: [
          {
            src: "/images/products/rife-frequency-pro-hero.webp",
            alt: "Energetika369 Rife Frequency Pro touchscreen console and luxury aluminum case",
            caption: "Rife Frequency Pro Touchscreen Console & Luxury Case"
          },
          {
            src: "/images/products/rife-frequency-pro-kit.webp",
            alt: "Rife Frequency Pro complete studio setup with electrode pads and accessories",
            caption: "Complete Multi-Modality Frequency & Electro-Therapy Kit"
          },
          {
            src: "/images/products/rife-frequency-pro-config.webp",
            alt: "Rife Frequency Pro 14-piece luxury configuration chart showing all applicators",
            caption: "14-Piece Luxury Applicator Configuration"
          }
        ],
        shortDesc:
          "An all-in-one touchscreen Rife frequency and physical therapy station complete with 14 specialized applicators—including ultrasound, laser wire, electrical cupping, therapy shoes, thermal pads, and eye mask.",
        overview:
          "The Energetika369 Rife Frequency Pro (2nd Generation) unites classical Rife frequency modulation with a comprehensive suite of modern physical therapy modalities in a single touchscreen console. Housed in a custom aluminum flight case, this luxury configuration features dual independent output channels and 14 specialized applicators—allowing practitioners and home users to deliver targeted frequency waves through adhesive electrodes, thermal waist belts, reflexology therapy shoes, electrical vacuum cups, 1 MHz ultrasound probe, laser wire, and meridian eye patches.",
        purpose:
          "Designed as a versatile, multi-applicator frequency and physical recovery station for holistic clinics, physiotherapy practices, and comprehensive home wellness rooms.",
        highlights: [
          "High-Resolution Touchscreen Console with Dual Independent Channels",
          "Complete 14-Piece Luxury Applicator Suite in Aluminum Flight Case",
          "Combines Rife Frequencies, Thermal Belt, Ultrasound, Cupping & Reflexology Shoes"
        ],
        features: [
          {
            title: "Interactive Touchscreen Frequency Console",
            desc: "Features a large color touchscreen interface with pre-loaded Rife frequency programs, adjustable intensity dials, and dual-user output channels."
          },
          {
            title: "14-Piece Multi-Applicator Ecosystem",
            desc: "Includes 4×6 and 6×6 electrode pads, butterfly pads, far-infrared heating waist pad, therapy reflexology shoes, meridian eye patch, electrical cupping set, ultrasound probe, and laser wire."
          },
          {
            title: "Synergistic Ultrasound & Laser Attachments",
            desc: "Combines bio-frequency pulses with a handheld ultrasound probe for localized deep tissue comfort and a low-level laser wire applicator."
          },
          {
            title: "Dual-Channel Simultaneous Operation",
            desc: "Allows two body zones—or two users—to receive customized frequency and thermal sessions simultaneously with independent intensity controls."
          }
        ],
        benefits: [
          "Replaces multiple standalone physical therapy gadgets with one integrated 14-piece station.",
          "Targets feet, eyes, lower back, joints, and acupoints with purpose-built ergonomic applicators.",
          "Supports muscular relaxation, localized circulation, and full-body bio-energetic conditioning.",
          "Organized in a heavy-duty aluminum carrying case for effortless storage and clinic portability."
        ],
        specs: {
          "System Type": "2nd Gen Intelligent Quantum Rife Frequency & Multi-Modality Therapy Console",
          "Display Interface": "Full-Color Touchscreen with Dual Rotary Intensity Controls",
          "Included Applicators (14-Piece Set)": "Main Unit, 4×6 Pads, 6×6 Pads, Butterfly Pad, Heating Waist Pad, Heating Electrodes, Therapy Shoes, Eye Patch, Electrical Cupping, Ultrasound Probe, Laser Wire, Lead Wires",
          "Output Channels": "Dual Independent Therapy Channels + Thermal & Ultrasound Ports",
          "Enclosure": "Custom Foam-Lined Aluminum Flight Case"
        },
        whatsIncluded: [
          "Rife Frequency Pro Touchscreen Main Unit",
          "4×6, 6×6 & Butterfly Adhesive Electrode Pads",
          "Thermal Heating Waist Belt & Heating Electrodes",
          "Bio-Frequency Reflexology Therapy Shoes & Meridian Eye Patch",
          "Electrical Cupping Set, Ultrasound Probe & Laser Wire",
          "Lead Wires, Power Adapter, User Manual & Aluminum Case"
        ],
        idealFor: [
          "Multi-Modality Holistic & Physiotherapy Clinics",
          "Full-Body Muscular & Joint Recovery",
          "Reflexology, Cupping & Meridian Conditioning",
          "Comprehensive Home Frequency Suites"
        ],
        usageSummary:
          "Connect your chosen applicator (such as the therapy shoes, heating belt, cupping set, or electrode pads), select the desired frequency program and timer on the touchscreen, and gradually adjust the channel intensity to a comfortable level.",
        safetyInfo:
          "Do not use over the chest/heart area if wearing a pacemaker, during pregnancy, or over open skin wounds.",
        ctaText: "Enquire About Rife Frequency Pro",
        enquiryDestination: "Energetika369 - Rife Frequency Pro"
      },

      /* ==================================================================
         9. DERMAVISION369 — DIGITAL IRIDOSCOPE
         ================================================================== */
      {
        id: "digital-iridoscope",
        anchorId: "dermavision-369",
        name: "DermaVision369 — Digital Iridoscope",
        tagline: "3-in-1 High-Definition Iris, Skin & Scalp Optical Analysis System",
        category: "Optical Diagnostic System",
        categoryId: "ai-diagnostics",
        tag: "Iris • Skin • Hair & Scalp",
        image: "/images/products/dermavision-369-hero.webp",
        gallery: [
          {
            src: "/images/products/dermavision-369-hero.webp",
            alt: "DermaVision369 digital iridoscope handheld probe, docking stand, and HD monitor",
            caption: "DermaVision369 Optical Handset, Dock & High-Resolution Display"
          },
          {
            src: "/images/products/dermavision-369-handset.webp",
            alt: "Close-up of DermaVision369 optical probe for Iris, Skin, and Hair & Scalp analysis",
            caption: "Ergonomic Optical Probe for Iris, Skin & Scalp Imaging"
          },
          {
            src: "/images/products/dermavision-369-case.webp",
            alt: "DermaVision369 complete kit in protective aluminum case with iridology chart",
            caption: "Complete Kit in Protective Aluminum Case with Iridology Chart"
          }
        ],
        shortDesc:
          "A professional 3-in-1 optical inspection platform for high-magnification Iris (Iridology), Epidermal Skin, and Hair/Scalp follicle imaging—complete with dedicated display monitor and aluminum case.",
        overview:
          "DermaVision369 is a precision optical imaging system engineered for iridologists, naturopaths, aesthetic clinics, and trichology specialists. Equipped with a high-resolution digital micro-camera handset, LED ring illumination, freeze-frame capture buttons, and interchangeable magnification capability, it enables crystal-clear visualization of iris fiber structures, skin texture/hydration, and hair follicle density—displaying live imagery on its dedicated LCD monitor or connected computer.",
        purpose:
          "Created to elevate visual client consultations in holistic iridology, skincare aesthetics, and scalp wellness with immediate, high-magnification optical evidence.",
        highlights: [
          "3-in-1 Optical Analysis: Iridology (Iris), Skin Texture & Hair/Scalp Follicles",
          "Ergonomic Micro-Camera Handset with Freeze-Frame & LED Illumination Control",
          "Includes Dedicated Display Monitor, Iridology Reference Chart & Aluminum Case"
        ],
        features: [
          {
            title: "High-Definition Iris & Sclera Imaging",
            desc: "Captures sharp, evenly illuminated macro photographs of the iris and sclera to assist practitioners in constitutional iridology mapping."
          },
          {
            title: "Epidermal Skin & Pore Inspection",
            desc: "Evaluates surface skin texture, lipid balance, pore congestion, and pigmentation trends for personalized aesthetic and nutritional protocols."
          },
          {
            title: "Trichology Hair & Scalp Follicle View",
            desc: "Magnifies scalp condition, hair shaft thickness, and follicular density to support holistic hair and scalp restoration programs."
          },
          {
            title: "Turnkey Monitor & Portable Aluminum Kit",
            desc: "Comes complete with a tabletop docking base, dedicated viewing screen, USB software key, iridology map, and custom foam-fitted aluminum case."
          }
        ],
        benefits: [
          "Builds instant client trust by showing live, high-magnification visuals on screen.",
          "Combines three lucrative consultation services (Iris, Skin, Scalp) in one compact instrument.",
          "Simple one-touch image freeze and capture for client records and before/after comparisons.",
          "Completely non-invasive, hygienic, and portable for clinic or mobile consultations."
        ],
        specs: {
          "Analysis Modes": "3-in-1 Optical Inspection (Iris / Iridology, Skin Analysis, Hair & Scalp Analysis)",
          "Handset Controls": "Integrated Freeze-Frame Capture & Adjustable LED Ring Brightness",
          "Display Setup": "Included Dedicated LCD Monitor + USB PC Connectivity",
          "Reference Material": "Professional Constitutional Iridology Chart Included",
          "Storage": "Custom Foam-Lined Aluminum Carrying Case"
        },
        whatsIncluded: [
          "DermaVision369 Optical Micro-Camera Handset & Cradle",
          "Dedicated Tabletop LCD Display Monitor & Stand",
          "Interchangeable Optical Lens Attachment & Protective Caps",
          "USB Cable, Software Dongle & Constitutional Iridology Chart",
          "Protective Aluminum Carrying Case"
        ],
        idealFor: [
          "Naturopaths & Constitutional Iridologists",
          "Holistic Skincare & Aesthetic Clinics",
          "Trichology, Hair & Scalp Wellness Centers",
          "Integrative Health Consultations"
        ],
        usageSummary:
          "Place the optical probe gently near the eye (for iris imaging) or against the skin/scalp, adjust the LED illumination and focus ring, and press the handset capture button to freeze and review the magnified image.",
        safetyInfo:
          "Optical inspection and educational consultation tool only. Not intended for clinical ophthalmic or dermatological disease diagnosis.",
        ctaText: "Enquire About DermaVision369",
        enquiryDestination: "Energetika369 - DermaVision369 Iridoscope"
      },

      /* ==================================================================
         10. LUMICARE PHOTOBIOMODULATION SERIES
         ================================================================== */
      {
        id: "lumicare-line",
        anchorId: "lumicare-line",
        name: "Lumicare Photobiomodulation Series",
        tagline: "Dual-Wavelength Red (660 nm) & Near-Infrared (850 nm) Cellular Light Therapy",
        category: "Photobiomodulation (PBM)",
        categoryId: "neuro-millimeter",
        tag: "LumiBody & LumiPulse Neuro",
        image: "/images/products/lumicare-neuro-helmet.webp",
        gallery: [
          {
            src: "/images/products/lumicare-neuro-helmet.webp",
            alt: "LumiPulse Neuro transcranial photobiomodulation helmet with digital controller",
            caption: "LumiPulse Neuro Brain Photobiomodulation Helmet (660 nm & 850 nm)"
          },
          {
            src: "/images/products/lumicare-lumibody-bag.webp",
            alt: "LumiBody full-body red and near-infrared LED photobiomodulation sleeping bag",
            caption: "LumiBody Full-Body 3,600-LED Photobiomodulation Cocoon (180 × 90 cm)"
          },
          {
            src: "/images/products/Energetika369_Catalogue_p16_img3.png",
            alt: "Open interior view of LumiBody 3,600 LED red and near-infrared array",
            caption: "3,600 High-Density Red (660 nm) & NIR (850 nm) LED Array"
          }
        ],
        shortDesc:
          "Professional Red (660 nm) and Near-Infrared (850 nm) photobiomodulation systems—featuring the 3,600-LED LumiBody full-body cocoon and the LumiPulse Neuro cranial helmet for mitochondrial vitality.",
        overview:
          "The Lumicare Photobiomodulation Series harnesses the clinically studied optical window of 660 nm Red Light and 850 nm Near-Infrared (NIR) light to stimulate mitochondrial cytochrome c oxidase and support cellular ATP energy production. The series features two flagship configurations: LumiBody, a 180 × 90 cm full-body enclosure lined with 3,600 high-density LEDs for systemic tissue recovery, circulation, and skin rejuvenation; and LumiPulse Neuro, an ergonomic cranial helmet with targeted 660 nm/850 nm diodes and handheld digital timer designed to support cerebral vitality, mental clarity, and neuro-wellness.",
        purpose:
          "Engineered to deliver high-irradiance, non-thermal red and near-infrared light therapy for full-body athletic recovery, skin vitality, and transcranial cognitive support.",
        highlights: [
          "Synergistic Dual Wavelengths: 660 nm Red Light + 850 nm Near-Infrared (NIR)",
          "LumiBody: 3,600-LED Full-Body Cocoon (180 × 90 cm) for Systemic Recovery",
          "LumiPulse Neuro: Ergonomic Cranial Helmet with Digital Timer Controller"
        ],
        features: [
          {
            title: "LumiBody 3,600-LED Full-Body Cocoon",
            desc: "Surrounds the body in 360° photobiomodulation across a generous 180 × 90 cm surface with 3,600 red (660 nm) and near-infrared (850 nm) LEDs."
          },
          {
            title: "LumiPulse Neuro Cranial Helmet",
            desc: "A lightweight, adjustable helmet equipped with strategically positioned 660 nm and 850 nm light sources and a digital timer remote for targeted brain photobiomodulation."
          },
          {
            title: "Mitochondrial ATP & Cellular Support",
            desc: "Delivers bioactive light wavelengths that penetrate skin, muscle, and cranial tissue to encourage mitochondrial energy production and microcirculation."
          },
          {
            title: "Clinic & Home Ready Ergonomics",
            desc: "Features wipe-clean medical-grade interior surfaces, intuitive session timers, and modular configurations for longevity clinics and home gyms."
          }
        ],
        benefits: [
          "Accelerates post-exercise muscular recovery and eases joint stiffness across the entire body.",
          "Supports collagen synthesis, skin tone luminosity, and peripheral circulation.",
          "Promotes mental clarity, cognitive resilience, and relaxation via LumiPulse Neuro.",
          "Non-invasive, UV-free, and comfortable for 15–20 minute restorative sessions."
        ],
        specs: {
          "Optical Wavelengths": "660 nm (Visible Red) & 850 nm (Near-Infrared / NIR)",
          "LumiBody LED Count": "3,600 High-Density LEDs",
          "LumiBody Dimensions": "180 × 90 cm Full-Body Sleeping Bag / Mat Format",
          "LumiPulse Neuro Format": "Ergonomic Adjustable Cranial Helmet with Digital Timer Remote",
          "Typical Session Time": "15 – 25 Minutes",
          "Intended Environment": "Longevity Clinics, Physiotherapy Studios, Spas & Home Suites"
        },
        whatsIncluded: [
          "Selected Lumicare System (LumiBody 3,600-LED Cocoon and/or LumiPulse Neuro Helmet)",
          "Digital Timer & Mode Controller",
          "Power Supply, Protective Eyewear & User Protocol Guide"
        ],
        idealFor: [
          "Longevity, Biohacking & Sports Recovery Studios",
          "Full-Body Mitochondrial & Skin Rejuvenation",
          "Cognitive Clarity & Transcranial Light Support",
          "Physiotherapy & Aesthetic Wellness Centers"
        ],
        usageSummary:
          "Recline inside the LumiBody cocoon or wear the LumiPulse Neuro helmet for 15 to 20 minutes per session using the preset digital timer.",
        safetyInfo:
          "UV-free photobiomodulation equipment. Avoid looking directly into active LED/laser diodes; consult a physician if taking photosensitive medications.",
        ctaText: "Enquire About Lumicare Series",
        enquiryDestination: "Energetika369 - Lumicare Photobiomodulation"
      }
    ]
  },

  /* ====================================================================
     BRAND 2: ENVIRONICS (Preserved Approved Content + 50% Member Offer)
     ==================================================================== */
  {
    id: "environics",
    name: "Environics",
    brand: "Environics",
    slug: "environics",
    category: "environics",
    tagline: "Radiation Management & Environmental Wellness",
    heroSubtitle: "Exclusive 50% OFF Privilege for Wellness Lovers Club Members",
    heading: "Create a Healthier Environment with Environics",
    description:
      "Dedicated to creating healthier, safer and more balanced spaces through science-backed environmental and electromagnetic solutions designed for modern living.",
    badge: "50% OFF EXCLUSIVE PRIVILEGE",
    discountOffer: "50% OFF",
    memberOfferBadge: "50% OFF for WLC Members",
    logo: "/images/products/environics-main-cover.webp",
    heroImage: "/images/products/environics-main-cover.webp",
    website: "https://environics.in/",
    route: "/offerings/products/environics",
    logoText: "ENVIRONICS",
    accentColor: "#14231b",
    bodyParagraphs: [
      "Your environment plays a significant role in your overall wellbeing. Environics is dedicated to creating healthier, safer and more balanced spaces through science-backed environmental and electromagnetic solutions designed for modern living.",
      "With a thoughtfully developed range of products, including Envirochips, Enviroglobe, Envirocare, Enviromat and more, Environics offers innovative solutions that help address invisible environmental influences and support a healthier everyday environment.",
      "Rooted in the belief that wellbeing extends beyond the individual to the spaces we inhabit, Environics combines science, innovation and conscious living to create solutions for homes, workplaces and everyday life.",
      "As a Wellness Lovers Club member, you can now enjoy an exclusive 50% OFF on the entire range of Environics products.",
      "Explore thoughtful solutions designed to help you create a healthier and a more balanced environment."
    ],
    products: [
      /* ==================================================================
         1. ENVIROCHIPS
         ================================================================== */
      {
        id: "envirochips",
        anchorId: "envirochips",
        name: "Envirochips",
        brand: "Environics",
        tagline: "Electrosmog Neutralizer for Personal Smart Devices",
        category: "Personal EMR Protection",
        categoryId: "emr-protection",
        tag: "Electrosmog Neutralizer",
        memberPrivilege: "50% OFF for WLC Members",
        memberOffer: "50% OFF for WLC Members",
        image: "/products/Envirochips.webp",
        gallery: [
          {
            src: "/products/Envirochips.webp",
            alt: "Envirochips radiation protection chip for mobile phones, laptops, and routers",
            caption: "Envirochips — Personal EMR Protection"
          },
          {
            src: "/images/products/environics-main-cover.webp",
            alt: "Environics radiation management and environmental wellness suite",
            caption: "Environics Environmental Wellness Collection"
          }
        ],
        shortDesc:
          "Clinically tested and patented radiation protection chip designed to neutralize the harmful biological effects of electromagnetic radiation emitted from mobile phones, laptops, Wi-Fi routers, and smart devices without altering signal strength.",
        overview:
          "Clinically tested and patented radiation protection chip designed to neutralize the harmful biological effects of electromagnetic radiation emitted from mobile phones, laptops, Wi-Fi routers, and smart devices without altering signal strength.",
        purpose:
          "Addresses invisible electromagnetic radiation from personal smart devices to support a healthier everyday environment.",
        highlights: [
          "Patented & CE Certified Radiation Protection Technology",
          "Changes the Nature of Harmful EMR to Bio-Friendly Frequencies",
          "Compatible with All Smartphones, Laptops, Tablets & Routers"
        ],
        features: [
          "Patented & CE Certified Radiation Protection Technology",
          "Changes the Nature of Harmful EMR to Bio-Friendly Frequencies",
          "Compatible with All Smartphones, Laptops, Tablets & Routers",
          "Maintains Device Battery Life & Full Network Signal Integrity"
        ],
        benefits: [
          "Neutralizes the harmful biological effects of electromagnetic radiation from mobile phones, laptops, and routers.",
          "Changes the nature of harmful EMR to bio-friendly frequencies without altering signal strength.",
          "Maintains device battery life and full network signal integrity.",
          "Exclusive 50% OFF privilege for Wellness Lovers Club members."
        ],
        specs: {
          "Category": "Personal EMR Protection",
          "Type": "Electrosmog Neutralizer",
          "Certification": "Patented & CE Certified Radiation Protection Technology",
          "Compatibility": "Smartphones, Laptops, Tablets & Wi-Fi Routers",
          "Signal Integrity": "Maintains Device Battery Life & Full Network Signal Strength",
          "WLC Member Privilege": "50% OFF for WLC Members"
        },
        whatsIncluded: [
          "Authentic Environics Envirochips Unit",
          "Device Placement & Application Guide",
          "50% OFF WLC Member Privilege Allocation"
        ],
        idealFor: [
          "Smartphones & Mobile Devices",
          "Laptops & Tablets",
          "Wi-Fi Routers & Smart Devices",
          "Home & Workplace Electronics"
        ],
        ctaText: "Enquire Now (50% OFF)",
        enquiryDestination: "Environics - Envirochips"
      },

      /* ==================================================================
         2. ENVIROGLOBE
         ================================================================== */
      {
        id: "enviroglobe",
        anchorId: "enviroglobe",
        name: "Enviroglobe",
        brand: "Environics",
        tagline: "360° Living Space Shield",
        category: "Ambient Space Protection",
        categoryId: "emr-protection",
        tag: "360° Living Space Shield",
        memberPrivilege: "50% OFF for WLC Members",
        memberOffer: "50% OFF for WLC Members",
        image: "/products/Enviroglobe.webp",
        gallery: [
          {
            src: "/products/Enviroglobe.webp",
            alt: "Enviroglobe 360-degree ambient environmental radiation protection system",
            caption: "Enviroglobe — 360° Living Space Shield"
          },
          {
            src: "/images/products/environics-main-cover.webp",
            alt: "Environics radiation management and environmental wellness suite",
            caption: "Environics Environmental Wellness Collection"
          }
        ],
        shortDesc:
          "Comprehensive 360-degree ambient environmental radiation protection system engineered to neutralize electro-smog across areas up to 300-350 sq.ft in homes, luxury suites, executive offices, and vehicles.",
        overview:
          "Comprehensive 360-degree ambient environmental radiation protection system engineered to neutralize electro-smog across areas up to 300-350 sq.ft in homes, luxury suites, executive offices, and vehicles.",
        purpose:
          "Engineered to neutralize electro-smog from external and ambient sources across homes, offices, luxury suites, and vehicles.",
        highlights: [
          "360° Spherical Radiation Neutralization (Up to 350 sq.ft coverage)",
          "Neutralizes Radiation from Mobile Towers, High-Tension Lines & Wi-Fi",
          "Improves Sleep Quality, Cellular Energy & Heart Rate Variability"
        ],
        features: [
          "360° Spherical Radiation Neutralization (Up to 350 sq.ft coverage)",
          "Neutralizes Radiation from Mobile Towers, High-Tension Lines & Wi-Fi",
          "Improves Sleep Quality, Cellular Energy & Heart Rate Variability",
          "Elegant Brass & Copper Handcrafted Design for Refined Interiors"
        ],
        benefits: [
          "Provides 360-degree spherical radiation neutralization across areas up to 300–350 sq.ft.",
          "Neutralizes radiation from mobile towers, high-tension lines, and Wi-Fi networks.",
          "Supports sleep quality, cellular energy, and heart rate variability.",
          "Exclusive 50% OFF privilege for Wellness Lovers Club members."
        ],
        specs: {
          "Category": "Ambient Space Protection",
          "Type": "360° Living Space Shield",
          "Coverage": "Up to 300–350 sq.ft (360° Spherical Neutralization)",
          "Target Sources": "Mobile Towers, High-Tension Lines & Wi-Fi",
          "Craftsmanship": "Elegant Brass & Copper Handcrafted Design",
          "WLC Member Privilege": "50% OFF for WLC Members"
        },
        whatsIncluded: [
          "Authentic Environics Enviroglobe Unit",
          "Placement & Care Instructions",
          "50% OFF WLC Member Privilege Allocation"
        ],
        idealFor: [
          "Homes & Bedrooms",
          "Luxury Suites",
          "Executive Offices",
          "Vehicles & Travel"
        ],
        ctaText: "Enquire Now (50% OFF)",
        enquiryDestination: "Environics - Enviroglobe"
      },

      /* ==================================================================
         3. ENVIROCARE
         ================================================================== */
      {
        id: "envirocare",
        anchorId: "envirocare",
        name: "Envirocare",
        brand: "Environics",
        tagline: "Vitality & Bio-Harmonizer for Personal Living Spaces",
        category: "Environmental Wellness & Air Balance",
        categoryId: "emr-protection",
        tag: "Vitality & Bio-Harmonizer",
        memberPrivilege: "50% OFF for WLC Members",
        memberOffer: "50% OFF for WLC Members",
        image: "/products/Envirocare.webp",
        gallery: [
          {
            src: "/products/Envirocare.webp",
            alt: "Envirocare holistic environmental device for geopathic stress and ambient balance",
            caption: "Envirocare — Vitality & Bio-Harmonizer"
          },
          {
            src: "/images/products/environics-main-cover.webp",
            alt: "Environics radiation management and environmental wellness suite",
            caption: "Environics Environmental Wellness Collection"
          }
        ],
        shortDesc:
          "Intelligent holistic environmental device formulated to optimize atmospheric resonance, neutralize geopathic stresses, and promote restorative ambient air quality across personal living spaces.",
        overview:
          "Intelligent holistic environmental device formulated to optimize atmospheric resonance, neutralize geopathic stresses, and promote restorative ambient air quality across personal living spaces.",
        purpose:
          "Formulated to optimize atmospheric resonance, mitigate geopathic grid stress fields, and promote restorative personal spaces.",
        highlights: [
          "Mitigates Hartmann & Curry Geopathic Grid Stress Fields",
          "Bio-Energetic Ambient Field Harmonization",
          "Supports Deep Relaxation, Immunity & Mental Clarity"
        ],
        features: [
          "Mitigates Hartmann & Curry Geopathic Grid Stress Fields",
          "Bio-Energetic Ambient Field Harmonization",
          "Supports Deep Relaxation, Immunity & Mental Clarity",
          "Compact & Portable for Travel, Bedside & Desk Integration"
        ],
        benefits: [
          "Mitigates Hartmann and Curry geopathic grid stress fields.",
          "Promotes bio-energetic ambient field harmonization across personal living spaces.",
          "Supports deep relaxation, immunity, and mental clarity with compact portability.",
          "Exclusive 50% OFF privilege for Wellness Lovers Club members."
        ],
        specs: {
          "Category": "Environmental Wellness & Air Balance",
          "Type": "Vitality & Bio-Harmonizer",
          "Geopathic Action": "Mitigates Hartmann & Curry Geopathic Grid Stress Fields",
          "Field Action": "Bio-Energetic Ambient Field Harmonization",
          "Portability": "Compact & Portable for Travel, Bedside & Desk Integration",
          "WLC Member Privilege": "50% OFF for WLC Members"
        },
        whatsIncluded: [
          "Authentic Environics Envirocare Unit",
          "Placement & Integration Guide",
          "50% OFF WLC Member Privilege Allocation"
        ],
        idealFor: [
          "Personal Living Spaces",
          "Bedside & Sleep Sanctuaries",
          "Work Desk Integration",
          "Travel & On-the-Go Use"
        ],
        ctaText: "Enquire Now (50% OFF)",
        enquiryDestination: "Environics - Envirocare"
      },

      /* ==================================================================
         4. ENVIROMAT
         ================================================================== */
      {
        id: "enviromat",
        anchorId: "enviromat",
        name: "Enviromat",
        brand: "Environics",
        tagline: "Conductive Bio-Neutralizer & Grounding Mat",
        category: "Grounding & EMF Mitigation",
        categoryId: "emr-protection",
        tag: "Conductive Bio-Neutralizer",
        memberPrivilege: "50% OFF for WLC Members",
        memberOffer: "50% OFF for WLC Members",
        image: "/products/Enviromat.webp",
        gallery: [
          {
            src: "/products/Enviromat.webp",
            alt: "Enviromat multi-layer electromagnetic radiation neutralizing and grounding mat",
            caption: "Enviromat — Conductive Bio-Neutralizer"
          },
          {
            src: "/images/products/environics-main-cover.webp",
            alt: "Environics radiation management and environmental wellness suite",
            caption: "Environics Environmental Wellness Collection"
          }
        ],
        shortDesc:
          "Advanced multi-layer electromagnetic radiation neutralizing and grounding mat engineered for work desks, meditation rooms, and sleeping areas to drain static charges and shield against low-frequency EMF.",
        overview:
          "Advanced multi-layer electromagnetic radiation neutralizing and grounding mat engineered for work desks, meditation rooms, and sleeping areas to drain static charges and shield against low-frequency EMF.",
        purpose:
          "Engineered for work desks, meditation rooms, and sleeping areas to drain static charges and shield against low-frequency electromagnetic fields.",
        highlights: [
          "Conductive Carbon & Natural Mineral Grid Layering",
          "Direct Earth Grounding & Static Voltage Dissipation",
          "Mitigates Computer & Electrical Equipment Electromagnetic Fields"
        ],
        features: [
          "Conductive Carbon & Natural Mineral Grid Layering",
          "Direct Earth Grounding & Static Voltage Dissipation",
          "Mitigates Computer & Electrical Equipment Electromagnetic Fields",
          "Premium Eco-Friendly Textured Surface for Daily Grounding"
        ],
        benefits: [
          "Combines conductive carbon and natural mineral grid layering for daily grounding.",
          "Supports direct earth grounding and static voltage dissipation.",
          "Mitigates computer and electrical equipment electromagnetic fields across desks and sleeping areas.",
          "Exclusive 50% OFF privilege for Wellness Lovers Club members."
        ],
        specs: {
          "Category": "Grounding & EMF Mitigation",
          "Type": "Conductive Bio-Neutralizer",
          "Architecture": "Conductive Carbon & Natural Mineral Grid Layering",
          "Primary Function": "Direct Earth Grounding & Static Voltage Dissipation",
          "Surface": "Premium Eco-Friendly Textured Surface",
          "WLC Member Privilege": "50% OFF for WLC Members"
        },
        whatsIncluded: [
          "Authentic Environics Enviromat Unit",
          "Grounding & Surface Placement Guide",
          "50% OFF WLC Member Privilege Allocation"
        ],
        idealFor: [
          "Work Desks & Computer Stations",
          "Meditation & Mindfulness Rooms",
          "Sleeping Areas & Restorative Spaces",
          "Daily Grounding & EMF Mitigation"
        ],
        ctaText: "Enquire Now (50% OFF)",
        enquiryDestination: "Environics - Enviromat"
      }
    ]
  }
];

export const PRODUCTS_BRANDS = PRODUCTS_DATA;

export function getProductBrand(id) {
  return PRODUCTS_DATA.find(
    (b) =>
      b.id?.toLowerCase() === String(id || "").toLowerCase() ||
      b.slug?.toLowerCase() === String(id || "").toLowerCase()
  );
}

export function getAllProductBrands() {
  return PRODUCTS_DATA;
}

/**
 * Returns a flat array of all products across all brands with brand metadata attached.
 */
export function getAllProducts() {
  const all = [];
  for (const brandGroup of PRODUCTS_DATA) {
    for (const product of brandGroup.products) {
      all.push({
        ...product,
        brandId: brandGroup.id,
        brandName: brandGroup.brand || brandGroup.name,
        brandTagline: brandGroup.tagline,
        brandWebsite: brandGroup.website,
        detailUrl: `/offerings/products/${brandGroup.id}/${product.id}`
      });
    }
  }
  return all;
}

/**
 * Finds a single product and its parent brand by brandId and productId.
 */
export function getProductBySlug(brandId, productId) {
  const brandGroup = PRODUCTS_DATA.find(
    (b) => b.id.toLowerCase() === String(brandId || "").toLowerCase()
  );
  if (!brandGroup) return null;

  const product = brandGroup.products.find(
    (p) => p.id.toLowerCase() === String(productId || "").toLowerCase()
  );
  if (!product) return null;

  return {
    brand: brandGroup,
    product: {
      ...product,
      brandId: brandGroup.id,
      brandName: brandGroup.brand || brandGroup.name,
      brandTagline: brandGroup.tagline,
      brandWebsite: brandGroup.website,
      detailUrl: `/offerings/products/${brandGroup.id}/${product.id}`
    }
  };
}

/**
 * Returns related products for a given productId (prioritizing same category, then same brand).
 */
export function getRelatedProducts(productId, limit = 3) {
  const all = getAllProducts();
  const current = all.find((p) => p.id === productId);
  if (!current) return all.slice(0, limit);

  const others = all.filter((p) => p.id !== productId);
  const sameCategory = others.filter((p) => p.categoryId === current.categoryId);
  const sameBrand = others.filter(
    (p) => p.brandId === current.brandId && p.categoryId !== current.categoryId
  );
  const differentBrand = others.filter((p) => p.brandId !== current.brandId);

  return [...sameCategory, ...sameBrand, ...differentBrand].slice(0, limit);
}
