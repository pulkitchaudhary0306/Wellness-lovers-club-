/**
 * WLC Member Privileges & Partner Dataset
 *
 * Dedicated partner-offer relational dataset for Wellness Lovers Club.
 * Each partner possesses a unique slug, partner ID, official website, and comprehensive privileges bundle.
 * All offers and package inclusions listed under a partner are received collectively by WLC members.
 */

export const PARTNERS_DATA = [
  {
    id: 1,
    slug: "niraamaya-retreats-surya-samudra",
    name: "Niraamaya Retreats Surya Samudra",
    location: "Kovalam, Trivandrum, Kerala",
    region: "SOUTH INDIA",
    shortDesc: "A cliffside luxury heritage sanctuary overlooking the Arabian Sea, renowned for authentic Ayurvedic healing, lush cliff-edge cottages, and pristine coastal wellness.",
    category: "Ayurvedic Sanctuary & Coastal Resort",
    image: "/images/niraamaya-retreat-real.webp",
    flag: "🇮🇳",
    website: "https://niraamaya.com/",
    bookingPeriod: "Booking and Travel Period: upto 31st March 2027",
    offers: [
      {
        id: "nss-1",
        title: "Exclusive Offer: Enjoy 20% Savings on Ayurveda Wellness Packages",
        discount: "20% SAVINGS",
        badge: "Ayurveda Wellness",
        duration: "5, 7, 14, or 21 Nights",
        description: "The Full Board Ayurveda program is thoughtfully curated to offer a holistic and immersive wellness experience.",
        inclusions: [
          "Accommodation in a well-appointed room",
          "Daily 90-minute Ayurvedic therapy, administered by a trained therapist",
          "Daily 60-minute guided yoga session",
          "Personalized consultation with an Ayurveda physician",
          "Prescribed internal herbal medications during the course of the program",
          "Wholesome meals (breakfast, lunch, and dinner) based on a customized Ayurvedic diet plan",
          "Round-trip transfers from the nearest airport or railway station",
          "One Ayurvedic cooking session during the stay",
          "One Yoga Nidra session during the stay",
          "Complimentary Wi-Fi access",
          "50% savings on laundry services"
        ],
        terms: "Duration: 5, 7, 14, or 21 nights. Booking and Travel Period: upto 31st March 2027."
      }
    ]
  },
  {
    id: 2,
    slug: "niraamaya-retreats-backwaters-beyond",
    name: "Niraamaya Retreats Backwaters & Beyond",
    location: "Kumarakom, Kerala",
    region: "SOUTH INDIA",
    shortDesc: "Nestled along the tranquil banks of Lake Vembanad, offering nature-immersed luxury villas, authentic Ayurvedic therapies, and serene backwater healing.",
    category: "Backwater Resort & Spa",
    image: "/images/niraamaya-backwaters-spa.webp",
    flag: "🇮🇳",
    website: "https://niraamaya.com/",
    bookingPeriod: "Booking and Travel Period: upto 31st March 2027",
    offers: [
      {
        id: "nbb-1",
        title: "Exclusive Offer: Enjoy 20% Savings on Ayurveda Wellness Packages",
        discount: "20% SAVINGS",
        badge: "Ayurveda Wellness",
        duration: "5, 7, 14, or 21 Nights",
        description: "The Full Board Ayurveda program is thoughtfully curated to offer a holistic and immersive wellness experience.",
        inclusions: [
          "Accommodation in a well-appointed room",
          "Daily 90-minute Ayurvedic therapy, administered by a trained therapist",
          "Daily 60-minute guided yoga session",
          "Personalized consultation with an Ayurveda physician",
          "Prescribed internal herbal medications during the course of the program",
          "Wholesome meals (breakfast, lunch, and dinner) based on a customized Ayurvedic diet plan",
          "Round-trip transfers from the nearest airport or railway station",
          "One Ayurvedic cooking session during the stay",
          "One Yoga Nidra session during the stay",
          "Complimentary Wi-Fi access",
          "50% savings on laundry services"
        ],
        terms: "Duration: 5, 7, 14, or 21 nights. Booking and Travel Period: upto 31st March 2027."
      }
    ]
  },
  {
    id: 3,
    slug: "swastik-luxury-wellbeing-sanctuary",
    name: "Swastik Luxury Wellbeing Sanctuary",
    location: "Pune, Maharashtra",
    region: "WEST INDIA",
    shortDesc: "An exclusive holistic retreat nestled in pristine Sahyadri hills, integrating ancient Vedic traditions, sacred healing rituals, and bespoke luxury sanctuaries.",
    category: "Holistic Sanctuary & Wellbeing",
    image: "/images/swastik-sanctuary-real.webp",
    flag: "🇮🇳",
    website: "https://swastikwellbeing.com/",
    offers: [
      {
        id: "sws-1",
        title: "Flat 20% Discount on Wellness Programs (3+ Nights)",
        discount: "FLAT 20% DISCOUNT",
        badge: "Published Rates",
        duration: "3 Nights and Above",
        description: "Flat 20% discount on published rates for all curated wellness programs of 3 nights and above.",
        terms: "Applicable on all published wellness programs for minimum 3 nights stay."
      },
      {
        id: "sws-2",
        title: "Complimentary Upgrade to Next Guha Category (5+ Nights)",
        discount: "COMPLIMENTARY UPGRADE",
        badge: "Guha Category Upgrade",
        duration: "5 Nights and Above",
        description: "Complimentary upgrade to the next Guha category for stays of 5 nights and above, subject to availability.",
        terms: "Valid for bookings of 5 nights or longer."
      },
      {
        id: "sws-3",
        title: "Complimentary Signature Experiences",
        discount: "COMPLIMENTARY EXPERIENCES",
        badge: "Signature Rituals",
        description: "Additional complimentary signature experiences including Swastik Swagat, Swastik Shuddhi & Swastik Agnihotra rituals.",
        inclusions: [
          "Swastik Swagat (Traditional Welcome Ritual)",
          "Swastik Shuddhi (Purification Experience)",
          "Swastik Agnihotra (Sacred Fire Meditation Ritual)"
        ],
        terms: "Included with every WLC member wellness stay."
      }
    ]
  },
  {
    id: 4,
    slug: "viveda-wellness-resort",
    name: "Viveda Wellness Resort",
    location: "Nashik, Maharashtra",
    region: "WEST INDIA",
    shortDesc: "An expansive naturopathy and wellness village in Trimbakeshwar, offering destress cures, authentic satvik nutrition, and mindful living.",
    category: "Integrated Wellness & Naturopathy",
    image: "/images/viveda-resort-real.webp",
    flag: "🇮🇳",
    website: "https://vivedawellness.com/",
    offers: [
      {
        id: "viv-1",
        title: "Viveda Destress & Unwind Program",
        discount: "20% SAVINGS",
        badge: "3-Night Retreat",
        duration: "3 Nights",
        description: "20% savings on a comprehensive 3-night Destress & Unwind wellness retreat designed for total mind-body calm.",
        terms: "Valid on 3-night Destress & Unwind program bookings."
      },
      {
        id: "viv-2",
        title: "Viveda Pamper Yourself Package",
        discount: "15% SAVINGS",
        badge: "Pampering Cure",
        description: "15% savings on the signature Viveda Pamper Yourself Package featuring restorative holistic therapies.",
        terms: "Applicable on Pamper Yourself package."
      },
      {
        id: "viv-3",
        title: "Welcome Gift & Personalized Yoga Session",
        discount: "COMPLIMENTARY PRIVILEGE",
        badge: "Member Gift & Yoga",
        description: "Welcome gift on arrival and one 30-minute personalised yoga session tailored to your body type.",
        inclusions: [
          "Special welcome gift on arrival",
          "One 30-minute personalised guided yoga session"
        ],
        terms: "Included complimentary with all WLC member reservations."
      }
    ]
  },
  {
    id: 5,
    slug: "the-wellness-co-karma-lakelands",
    name: "The Wellness Co. — Karma Lakelands",
    location: "Karma Lakelands, Gurgaon",
    region: "NORTH INDIA",
    shortDesc: "A serene eco-luxury sanctuary combining advanced non-invasive longevity tech, cryotherapy, and immersive multi-day wellness retreats in 300 acres of green.",
    category: "Integrative Wellness & Retreats",
    image: "/images/wellness-co-real.webp",
    flag: "🇮🇳",
    website: "https://www.karmalakelands.com/",
    bookingPeriod: "Offer Validity: 6 months, effective from: 1 August, 2026",
    offers: [
      {
        id: "twc-kl-1",
        title: "Signature Retreat Programs",
        discount: "40% SAVINGS",
        badge: "Multi-Day Retreats",
        duration: "2-Day, 3-Day, 5-Day, and 7-Day Programs",
        description: "40% savings on all 2-Day, 3-Day, 5-Day, and 7-Day Wellness Retreat Programs.",
        terms: "Offer Validity: 6 months, effective from: 1 August, 2026. Applicable on all published retreat programs during the validity period."
      },
      {
        id: "twc-kl-2",
        title: "Individual Wellness Therapies and Services",
        discount: "50% SAVINGS",
        badge: "A-la-carte Therapies",
        description: "50% savings on all individual wellness therapies and services.",
        terms: "Validity: 1 Year. Applicable on a-la-carte therapies and wellness services, subject to prior consultation and appointment availability."
      }
    ]
  },
  {
    id: 6,
    slug: "the-wellness-co-pan-india",
    name: "The Wellness Co. — PAN India",
    location: "PAN India (Delhi NCR, Mumbai, Hyderabad, Bengaluru, etc.)",
    region: "NORTH INDIA",
    shortDesc: "India's foremost network of advanced longevity clinics providing non-invasive recovery, cryo-wellness, and molecular rejuvenation.",
    category: "Longevity & Cryo Clinics",
    image: "/images/wellness-co-spa.webp",
    flag: "🇮🇳",
    website: "https://www.karmalakelands.com/",
    offers: [
      {
        id: "twc-pan-1",
        title: "5 General Wellness Therapies + 1 CRYO Facial",
        discount: "58% SAVINGS",
        badge: "Special Package",
        originalPrice: "₹34,125",
        memberPrice: "₹14,500",
        priceNote: "All Inclusive",
        description: "Comprehensive recovery package including 5 General Wellness Therapies plus 1 CRYO Facial.",
        terms: "MRP: Rs.34,125 / Offer - 14,500 All inclusive. Redeemable across all active The Wellness Co. clinics nationwide."
      }
    ]
  },
  {
    id: 7,
    slug: "silhouette-salon",
    name: "Silhouette Salon",
    location: "Gurgaon & Parfaire Tivoli, Delhi NCR",
    region: "NORTH INDIA",
    shortDesc: "High-end bespoke hair styling, luxury salon aesthetics, and indulgent personal care rituals in premium Gurgaon and Tivoli spaces.",
    category: "Luxury Hair & Beauty Salon",
    image: "/images/silhouette-salon-spa.webp",
    flag: "🇮🇳",
    website: "https://silhouettesalon.co.in/",
    offers: [
      {
        id: "sil-1",
        title: "Silhouette Salon — Gurgaon",
        discount: "20% DISCOUNT",
        badge: "Gurgaon Centre",
        description: "20% discount on all salon styling, treatments, and grooming services.",
        terms: "Valid on services at Silhouette Salon Gurgaon."
      },
      {
        id: "sil-2",
        title: "Silhouette Salon — Parfaire Tivoli",
        discount: "25% DISCOUNT",
        badge: "Parfaire Tivoli",
        description: "25% discount on all salon and styling services.",
        terms: "Valid on services at Silhouette Salon Parfaire Tivoli."
      }
    ]
  },
  {
    id: 8,
    slug: "viva-mayr",
    name: "Viva Mayr",
    location: "Maria Wörth / Altaussee, Austria",
    region: "INTERNATIONAL",
    shortDesc: "Pioneering Modern Mayr Medicine on the shores of Lake Wörthersee and Lake Altaussee, combining medical diagnostics, gut detoxification, and alpine vitality.",
    category: "Medical Wellness & Longevity Clinic",
    image: "/images/vivamayr-austria-real.webp",
    flag: "🇦🇹",
    website: "https://www.vivamayr.com/",
    offers: [
      {
        id: "vm-1",
        title: "7 Nights + 2 Nights Free (Accommodation)",
        discount: "2 NIGHTS COMPLIMENTARY",
        badge: "Stay Privilege",
        duration: "7+ Nights",
        description: "7 nights + 2 nights free (only on accommodation) for an extended regenerative stay in Austria.",
        terms: "Valid on accommodation charges for 7+ night stays."
      },
      {
        id: "vm-2",
        title: "€500 Discount on Wellness Packages",
        discount: "€500 DIRECT SAVINGS",
        badge: "Medical Package",
        description: "A €500 discount on any 7 night wellness package booked by WLC members.",
        terms: "Applicable on any 7-night medical wellness package."
      }
    ]
  },
  {
    id: 9,
    slug: "andaz-delhi-hyatt-hotel",
    name: "Andaz Delhi — Hyatt Hotel",
    location: "Hyatt Hotel, Vasant Vihar / Aerocity, Delhi",
    region: "NORTH INDIA",
    shortDesc: "A luxury lifestyle Hyatt hotel inspired by the soul of Delhi, featuring the serene Andaz Spa, curated organic apothecary treatments, and an oasis pool.",
    category: "Luxury Hotel & Day Spa",
    image: "/images/andaz-hyatt-spa.webp",
    flag: "🇮🇳",
    website: "https://www.hyatt.com/andaz/en-US/delaz-andaz-delhi",
    offers: [
      {
        id: "and-1",
        title: "25% Off Regular Spa Treatments + 1 Hr Gym/Pool",
        discount: "25% OFF",
        badge: "Spa & Wellness Access",
        description: "25% off on our regular spa treatments (Excluding packages) with one hour of Gym or pool complimentary.",
        terms: "Excludes packaged promotions. Subject to availability."
      },
      {
        id: "and-2",
        title: "30-Minute Complimentary Add-on with 90-Min Treatment",
        discount: "COMPLIMENTARY 30-MIN ADD-ON",
        badge: "Treatment Upgrade",
        description: "With 90 minutes treatment add on 30 minutes of complimentary: head massage / face cleansing / foot massage or Chakra healing (any one).",
        inclusions: [
          "Head Massage (30 min)",
          "Face Cleansing Ritual (30 min)",
          "Foot Reflexology Massage (30 min)",
          "Chakra Healing Session (30 min)"
        ],
        terms: "Choice of any one complimentary 30-min add-on with any 90-minute treatment."
      }
    ]
  },
  {
    id: 10,
    slug: "shangri-la-eros-new-delhi",
    name: "Shangri-La Eros",
    location: "Connaught Place, New Delhi",
    region: "NORTH INDIA",
    shortDesc: "An iconic luxury destination in the heart of the capital, home to CHI, The Spa, personalized holistic wellness memberships, and refined salon therapies.",
    category: "Luxury Hotel & Health Club",
    image: "/images/shangri-la-stay.webp",
    flag: "🇮🇳",
    website: "https://www.shangri-la.com/newdelhi/erosshangrila/",
    bookingPeriod: "Validity: 6 months",
    offers: [
      {
        id: "sh-1",
        title: "Exclusive Wellness Club Membership Offer",
        discount: "1 MONTH COMPLIMENTARY (13 MONTHS TOTAL)",
        badge: "Annual Health Club Pass",
        description: "Pay for 12 months and receive 1 additional month complimentary (total 13 months) on the rack rate of membership.",
        terms: "Validity: 6 months. Applicable on membership rack rate."
      },
      {
        id: "sh-2",
        title: "Spa and Salon Privileges",
        discount: "20% DISCOUNT",
        badge: "CHI Spa & Salon",
        description: "Avail 20% discount on all rejuvenating spa and salon services.",
        terms: "Validity: 6 months. Applicable on all spa and salon services."
      }
    ]
  },
  {
    id: 11,
    slug: "pema-wellness-resort",
    name: "Pema Wellness",
    location: "Visakhapatnam, India",
    region: "EAST INDIA",
    shortDesc: "Perched atop the Healing Hills overlooking the Bay of Bengal, delivering holistic naturopathy, integrative medicine, therapeutic diets, and yoga.",
    category: "Integrative Wellness & Longevity",
    image: "/images/pema-wellness-spa.webp",
    flag: "🇮🇳",
    website: "https://www.pemawellness.com/",
    bookingPeriod: "Validity: 1 year",
    offers: [
      {
        id: "pema-1",
        title: "15% Discount on All Wellness Services & Retreats",
        discount: "15% DISCOUNT",
        badge: "Holistic Programs",
        description: "15% (Fifteen Percent) discount on wellness services, treatments, programs, retreats, and experiences offered by Pema Wellness.",
        terms: "Validity: 1 year. Applicable across all treatments, retreats, and medical wellness programs."
      }
    ]
  },
  {
    id: 12,
    slug: "dhun-wellness-spa",
    name: "Dhun Wellness Spa",
    location: "Mumbai, India",
    region: "WEST INDIA",
    shortDesc: "A luxury biohacking and sensory recovery sanctuary in Mumbai specializing in thermal contrast, infrared sauna, red light collagen therapy, and cryo.",
    category: "Biohacking & Recovery Sanctuary",
    image: "/images/dhun-wellness-spa.webp",
    flag: "🇮🇳",
    website: "https://dhunwellness.com/",
    offers: [
      {
        id: "dhun-1",
        title: "Complimentary Recovery Session",
        discount: "FREE RECOVERY SESSION",
        badge: "Massage / Facial Add-on",
        description: "Book any 60 minute massage or any facial and receive one complimentary recovery treatment (infrared sauna, red light collagen bed or cryotherapy).",
        inclusions: [
          "Infrared Detox Sauna (Complimentary)",
          "Red Light Collagen Therapy Bed (Complimentary)",
          "Whole Body Cryotherapy Session (Complimentary)"
        ],
        terms: "Offer is limited to one time use per member, cannot be combined with any other promotions, packages or memberships, complimentary recovery treatment must be availed on the same day as the massage or facial appointment and cannot be carried forward to another date. Valid for the same individual only."
      }
    ]
  },
  {
    id: 13,
    slug: "florian-hurel-hair-couture-spa",
    name: "Florian Hurel Hair Couture & Spa",
    location: "Mumbai, Ahmedabad, Hyderabad, Pune",
    region: "WEST INDIA",
    shortDesc: "Celebrity hair stylist Florian Hurel's bespoke luxury beauty destination offering French salon craftsmanship, hair rituals, and spa treatments.",
    category: "Haute Hair Couture & Day Spa",
    image: "/images/community-experiences-lounge.webp",
    flag: "🇮🇳",
    website: "https://florianhurelhaircouture.com/",
    offers: [
      {
        id: "fh-1",
        title: "20% Privilege on All Salon and Spa Services",
        discount: "20% PRIVILEGE",
        badge: "Haute Couture Salon",
        description: "20% privilege on all salon and spa services to all registered Wellness Lovers Club members.",
        terms: "Valid across all locations in Mumbai, Ahmedabad, Hyderabad, and Pune upon displaying WLC membership pass."
      }
    ]
  },
  {
    id: 14,
    slug: "tre-wellness-retreat",
    name: "Trē Wellness",
    location: "Hyderabad, Telangana",
    region: "SOUTH INDIA",
    shortDesc: "A transformative wellness destination in Hyderabad offering multi-day health programs, scientific detox protocols, and holistic living programs.",
    category: "Transformational Health Retreat",
    image: "/images/wellness-retreat-cabin.webp",
    flag: "🇮🇳",
    website: "https://trewellness.in/",
    offers: [
      {
        id: "tre-1",
        title: "3–6 Day & 6–9 Day Packages",
        discount: "20% DISCOUNT + FREE TRANSFERS",
        badge: "Short Stays",
        duration: "3–6 Days & 6–9 Days",
        description: "20% discount on published package rates + Complimentary round-trip transfers between Hyderabad Airport (or Hyderabad City) and Trē Wellness.",
        terms: "Includes airport/city transfers."
      },
      {
        id: "tre-2",
        title: "10–14 Day, 15–21 Day & 28 Day Packages",
        discount: "25% DISCOUNT + FREE TRANSFERS",
        badge: "Deep Transformation",
        duration: "10–14 Days, 15–21 Days & 28 Days",
        description: "25% discount on published package rates + Complimentary round-trip transfers between Hyderabad Airport (or Hyderabad City) and Trē Wellness.",
        terms: "Includes airport/city transfers."
      },
      {
        id: "tre-3",
        title: "Complimentary Stay Extension Days",
        discount: "UP TO 2 COMPLIMENTARY DAYS",
        badge: "Free Stay Days",
        description: "14-day package: Receive 1 complimentary additional day. 28-day package: Receive 2 complimentary additional days.",
        terms: "Valid on 14-day and 28-day package bookings."
      },
      {
        id: "tre-4",
        title: "Priority Peak-Season Allocation",
        discount: "PRIORITY MEMBER ALLOCATION",
        badge: "VIP Allocation",
        description: "During peak seasons, Trē Wellness will reserve accommodation for up to 2 Wellness Lovers Club member bookings (double occupancy), ensuring priority access to the property, subject to availability under the agreed allocation.",
        terms: "Subject to allocation availability."
      }
    ]
  },
  {
    id: 15,
    slug: "sawadhee-traditional-thai-spa",
    name: "Sawadhee Spa",
    location: "Vasant Kunj, New Delhi",
    region: "NORTH INDIA",
    shortDesc: "An authentic Thai spa sanctuary providing certified Thai massages, herbal compress rituals, and deep tension release therapies.",
    category: "Traditional Thai Day Spa",
    image: "/images/spa-healing-room.webp",
    flag: "🇮🇳",
    website: "https://sawadhee.com/",
    offers: [
      {
        id: "saw-1",
        title: "20% Off on All Spa Therapies",
        discount: "20% OFF",
        badge: "Authentic Thai Healing",
        description: "Enjoy a flat 20% discount on all traditional Thai therapies, deep tissue massages, and signature body treatments.",
        terms: "Valid on all services at Sawadhee Spa."
      }
    ]
  },
  {
    id: 16,
    slug: "iosis-spa-sorin",
    name: "IOSIS Spa & Sorin",
    location: "Mumbai, Guwahati, Raipur, etc.",
    region: "NORTH INDIA",
    shortDesc: "A renowned PAN-India beauty and wellness brand founded by wellness visionaries, delivering slimming therapies, salon care, and spa treatments.",
    category: "Wellness, Slimming & Spa Chain",
    image: "/images/conscious-living.webp",
    flag: "🇮🇳",
    website: "https://www.iosiswellness.com/",
    offers: [
      {
        id: "ios-1",
        title: "20% Off on All Services + Complimentary Treatments",
        discount: "20% OFF + 2 FREE SESSIONS",
        badge: "PAN India Privilege",
        description: "20% off on all services (excluding retail products, memberships, packages, and existing promotional offers) + A complimentary 15-minute Face Sculpt Massage and a 15-minute Foot Reflexology session with every eligible visit.",
        inclusions: [
          "20% off all standard salon and spa services",
          "Complimentary 15-minute Face Sculpt Massage per visit",
          "Complimentary 15-minute Foot Reflexology session per visit"
        ],
        terms: "Excludes retail products, memberships, packages, and existing promotional offers."
      }
    ]
  },
  {
    id: 17,
    slug: "hyatt-regency-hua-hin-the-barai",
    name: "Hyatt Regency Hua Hin",
    location: "Prachuap Khiri Khan, Thailand",
    region: "INTERNATIONAL",
    shortDesc: "A peaceful coastal paradise on the Gulf of Thailand, home to THE BARAI — an award-winning residential wellness sanctuary with ancient Khmer-inspired architecture.",
    category: "Coastal Luxury & THE BARAI Spa",
    image: "/images/philosophy-resort.webp",
    flag: "🇹🇭",
    website: "https://www.hyatt.com/hyatt-regency/en-US/huahi-hyatt-regency-hua-hin",
    offers: [
      {
        id: "bar-1",
        title: "20% Off for Any Wellness Program or Experience",
        discount: "20% OFF",
        badge: "THE BARAI Spa & Wellness",
        description: "20% off for any wellness program or experience at THE BARAI and Hyatt Regency Hua Hin.",
        terms: "Valid on all wellness programs and spa therapies at THE BARAI."
      }
    ]
  },
  {
    id: 18,
    slug: "losinj-hotels-villas-alhambra",
    name: "Lošinj Hotels & Villas (Alhambra)",
    location: "Alhambra, Lošinj, Croatia",
    region: "INTERNATIONAL",
    shortDesc: "An Austro-Hungarian boutique sanctuary in Čikat Bay on Croatia's Island of Vitality, celebrated for pine microclimates, thermal Cube Spa, and Michelin dining.",
    category: "Island Boutique Sanctuary & Spa",
    image: "/images/luxury-stays-cabana.webp",
    flag: "🇭🇷",
    website: "https://www.losinj-hotels.com/",
    bookingPeriod: "Valid: Uptil 18 October 2026",
    offers: [
      {
        id: "los-1",
        title: "Alhambra Complete Wellness Experience",
        discount: "WLC EXCLUSIVE INCLUSIONS & PRIVILEGES",
        badge: "Island of Vitality",
        description: "Curated regenerative island wellness inclusions thoughtfully prepared for WLC members.",
        inclusions: [
          "Herbs de Lošinj Tea Ceremony (15 minutes)",
          "Aleppo Forest Bathing Therapy (60 minutes)",
          "Kurhaus Inhalation Bar Ritual",
          "Aleppo Pine Immunity Massage (60 minutes)",
          "20% savings on facial treatments",
          "Complimentary bicycle usage",
          "In-room artisanal bites inspired by local flavours",
          "Tickets to the Museum of Apoxyomenos",
          "Access to Cube Spa Alhambra, including the indoor seawater pool, sauna, Mediterranean bath, fitness and relaxation areas"
        ],
        terms: "Valid: Uptil 18 October 2026. Conditions: Minimum stay applies. Advance reservation required. Subject to availability and applicable terms & conditions."
      },
      {
        id: "los-2",
        title: "Suite Privileges & Butler Service",
        discount: "VIP SUITE AMENITIES",
        badge: "Suite Privileges",
        description: "Curated welcome gift, complimentary first minibar refill, Butler Service (selected suites, May–September), and luxury transfers within Mali and Veli Lošinj (subject to availability).",
        inclusions: [
          "Curated welcome gift",
          "Complimentary first minibar refill",
          "Butler Service (selected suites, May–September)",
          "Luxury transfers within Mali and Veli Lošinj (subject to availability)"
        ],
        terms: "Available for suite bookings. Valid uptil 18 October 2026."
      }
    ]
  },
  {
    id: 19,
    slug: "como-point-yamu-phuket",
    name: "COMO Point Yamu",
    location: "Phuket, Thailand",
    region: "INTERNATIONAL",
    shortDesc: "Perched on Cape Yamu with 360-degree views of Phang Nga Bay, featuring Italian design by Paola Navone, holistic COMO Shambhala retreats, and organic cuisine.",
    category: "Clifftop Wellness Sanctuary",
    image: "/images/journey-wellness.webp",
    flag: "🇹🇭",
    website: "https://www.comohotels.com/thailand/como-point-yamu",
    bookingPeriod: "Valid for stays till 31 August 2026. Book by 20 December 2026 for stays until 31 December 2026",
    offers: [
      {
        id: "como-py-1",
        title: "COMO Point Yamu Sanctuary Inclusions",
        discount: "HALF-BOARD + 60-MIN MASSAGE + SUNSET COCKTAIL",
        badge: "Shambhala Immersion",
        duration: "Minimum 3-Night Stay",
        description: "A comprehensive half-board wellness escape overlooking the limestone karsts of Phang Nga Bay.",
        inclusions: [
          "Minimum three-night stay at COMO Point Yamu",
          "Half-board dining included",
          "One complimentary 60-minute COMO Shambhala Massage per guest",
          "One sunset cocktail experience during the stay",
          "Daily access to COMO Shambhala wellness classes, including yoga and guided activities",
          "Full access to the wellness centre facilities featuring 24-hour gym, steam room, hydrotherapy pool",
          "In-room yoga and wellness sessions on demand"
        ],
        terms: "Valid for stays till 31 August 2026. Book by 20 December 2026 for stays until 31 December 2026. Terms & Conditions Applied."
      }
    ]
  },
  {
    id: 20,
    slug: "como-uma-paro-bhutan",
    name: "COMO Uma Paro",
    location: "Bhutan",
    region: "INTERNATIONAL",
    shortDesc: "Nestled in the mystical Himalayan kingdom of Bhutan, offering spiritual immersion, Bhutanese hot stone baths, and mindful forest adventures.",
    category: "Himalayan Spiritual Sanctuary",
    image: "/images/buddha-bg.webp",
    flag: "🇧🇹",
    website: "https://www.comohotels.com/bhutan/como-uma-paro",
    offers: [
      {
        id: "como-bt-1",
        title: "Four-Course Private Dinner & Monk Blessing Ceremony",
        discount: "DINNER + MONK BLESSING + TREATMENT UPGRADE",
        badge: "Sacred Bhutan Privilege",
        description: "Enjoy a four-course dinner complete with a bottle of house wine by firelight at COMO Uma Paro, or al fresco overlooking the river at COMO Uma Punakha.",
        inclusions: [
          "Blessing ceremony with 10 to 15 monks",
          "Gho and kira clothing rental",
          "Treatment upgrade to a 90-minute hot stone bath and massage",
          "Four-course private dinner, including a bottle of house wine (by firelight at COMO Uma Paro, or al fresco overlooking river at COMO Uma Punakha)"
        ],
        terms: "Valid with stays at COMO Uma Paro and COMO Uma Punakha."
      }
    ]
  },
  {
    id: 21,
    slug: "ja-palm-tree-court-calm-spa",
    name: "JA Palm Tree Court",
    location: "Dubai",
    region: "INTERNATIONAL",
    shortDesc: "An all-inclusive 5-star beachfront resort in Dubai surrounded by lush gardens, featuring the award-winning Calm Spa, thermal suites, and oceanfront pools.",
    category: "Luxury Beachfront Resort & Spa",
    image: "/images/philosophy-pool.webp",
    flag: "🇦🇪",
    website: "https://www.jaresortshotels.com/dubai/ja-palm-tree-court",
    offers: [
      {
        id: "ja-1",
        title: "Unwind Longer at Calm Spa",
        discount: "60-MIN COMPLIMENTARY EXTENSION",
        badge: "Calm Spa Special",
        memberPrice: "AED 800",
        priceNote: "Mon to Fri Only",
        description: "90-minute Deep Tissue Massage + Additional 60 minutes complimentary to extend your treatment or share with a guest.",
        inclusions: [
          "90-minute Deep Tissue Massage",
          "Additional 60 minutes complimentary (extend treatment or share with guest)",
          "Priced at AED 800 (Available Monday to Friday only)"
        ],
        terms: "Priced at AED 800. Available Monday to Friday only."
      },
      {
        id: "ja-2",
        title: "Full Day Reset",
        discount: "MASSAGE + 3-COURSE LUNCH + BEACH & POOLS",
        badge: "Full Day Pass",
        memberPrice: "AED 650 Mon-Fri / AED 800 Sat-Sun",
        priceNote: "Per Person",
        description: "75-minute Stress Release Massage, gourmet three-course set lunch on the Signature Pool terrace, full access to pools, private beach, jacuzzi, sauna, and steam room.",
        inclusions: [
          "75-minute Stress Release Massage",
          "Gourmet three-course set lunch on the Signature Pool terrace",
          "Access to jacuzzi, sauna, steam room and shower experience",
          "Access to serene pools and private beach",
          "20% savings on additional spa treatments on the same day",
          "20% savings on food and beverage at selected outlets on the same day"
        ],
        terms: "AED 650 per person Monday to Friday / AED 800 per person Saturday & Sunday."
      },
      {
        id: "ja-3",
        title: "Indulge without Limits at Calm Spa",
        discount: "UNLIMITED MASSAGES + SALON & F&B SAVINGS",
        badge: "Unlimited Day Privilege",
        memberPrice: "AED 800 Mon-Fri / AED 1,200 Sat-Sun",
        priceNote: "Per Person",
        description: "Unlimited choice of 30, 60 and 90-minute massages with special discounts on facials, salon, and dining.",
        inclusions: [
          "Unlimited choice of 30, 60 and 90-minute massages",
          "30% savings on facials and salon treatments",
          "15% savings on selected retail items",
          "20% savings on food and beverage at selected outlets on the same day",
          "Access to jacuzzi, sauna, steam room and shower experience",
          "Access to pools and private beach"
        ],
        terms: "AED 800 per person Monday to Friday / AED 1,200 per person Saturday & Sunday."
      }
    ]
  },
  {
    id: 22,
    slug: "energetika369",
    name: "Energetika369",
    location: "Global & PAN India Direct Consultation",
    region: "INDIA & GLOBAL",
    shortDesc: "Pioneering bio-frequency systems, scalar wave technology, and cellular resonance devices including PEMF Crystal Mats, Rife Machines, Hexa Flow, and NeuroPulse TMS.",
    category: "Bio-Frequency & Quantum Wellness",
    image: "/images/products/pemf-crystal-mat.webp",
    flag: "⚡",
    website: "https://energetika369.com/",
    bookingPeriod: "Member Allocations & Consultations: Available Year-Round",
    offers: [
      {
        id: "e369-1",
        title: "Exclusive WLC Member Concierge & Product Consultation",
        discount: "WLC EXCLUSIVE ALLOCATION",
        badge: "Bio-Frequency Technology",
        description: "Direct priority allocation, bespoke practitioner consultation, and preferred club pricing on all Energetika369 wellness systems.",
        inclusions: [
          "1-on-1 Bio-frequency and wellness technology consultation",
          "Personalized protocol recommendations for home or clinical practice",
          "Priority dispatch and allocation support",
          "Dedicated manufacturer onboarding and technical guidance"
        ],
        terms: "Exclusive to verified Wellness Lovers Club members. Inquire to claim member privileges."
      }
    ]
  },
  {
    id: 23,
    slug: "environics",
    name: "Environics",
    location: "Global & PAN India Environmental Wellness",
    region: "INDIA & GLOBAL",
    shortDesc: "Scientifically proven radiation management solutions and environmental health systems designed to neutralize harmful electromagnetic radiation (EMR/EMF).",
    category: "Radiation Management & Environmental Wellness",
    image: "/images/conscious-living.webp",
    flag: "🛡️",
    website: "https://environics.in/",
    bookingPeriod: "Member Allocations & Consultations: Available Year-Round",
    offers: [
      {
        id: "env-1",
        title: "WLC Member Environmental Wellness Audit & Allocation",
        discount: "WLC EXCLUSIVE PRIVILEGE",
        badge: "EMR Protection",
        description: "Priority member access to Environics radiation protection technology, environmental audits, and home/workplace protection systems.",
        inclusions: [
          "Home and workplace environmental radiation assessment guidance",
          "Priority allocation of radiation management systems",
          "Certified clinical research consultation and test data access",
          "Exclusive WLC member privileges on all upcoming allocations"
        ],
        terms: "Exclusive to verified Wellness Lovers Club members. Inquire to claim member privileges."
      }
    ]
  }
];
