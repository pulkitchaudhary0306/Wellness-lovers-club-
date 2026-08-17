<?php
/**
 * WLC Member Privileges Controller
 *
 * Provides partner-specific privileges and promotional offers via REST API.
 * Ensures partner-specific filtering so each partner page receives ONLY its own offers.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Privileges_Controller {

    /**
     * Get all partners or single partner if 'partner' query parameter or URL param is present
     */
    public function get_privileges( $request ) {
        $partner_slug = $request->get_param( 'partner' );
        if ( empty( $partner_slug ) ) {
            $partner_slug = $request->get_param( 'slug' );
        }

        $all_partners = self::get_all_partner_records();

        // If specific partner requested, return ONLY that partner's data & offers
        if ( ! empty( $partner_slug ) ) {
            $slug_clean = sanitize_title( $partner_slug );
            foreach ( $all_partners as $p ) {
                if ( $p['slug'] === $slug_clean || strval( $p['id'] ) === strval( $partner_slug ) ) {
                    return Wellness_API_Response::success( array(
                        'success' => true,
                        'partner' => $p,
                        'offers'  => $p['offers'],
                    ) );
                }
            }

            return new WP_Error(
                'partner_not_found',
                'Partner with the specified slug or ID was not found.',
                array( 'status' => 404 )
            );
        }

        // Return full list of partners
        return Wellness_API_Response::success( array(
            'success'  => true,
            'count'    => count( $all_partners ),
            'partners' => $all_partners,
        ) );
    }

    /**
     * Get static / database dataset of all partners and their specific offers
     */
    public static function get_all_partner_records() {
        return array(
            array(
                'id'        => 1,
                'slug'      => 'niraamaya-retreats-surya-samudra',
                'name'      => 'Niraamaya Retreats Surya Samudra',
                'location'  => 'Kovalam, Trivandrum, Kerala',
                'shortDesc' => 'A cliffside luxury heritage sanctuary overlooking the Arabian Sea, renowned for authentic Ayurvedic healing and serene coastal wellness.',
                'category'  => 'Ayurvedic Sanctuary',
                'image'     => '/images/niraamaya-retreat-real.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'nss-1',
                        'title'       => 'Ayurveda Wellness Packages',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Ayurveda',
                        'description' => 'Experience transformative rejuvenation with customized Ayurvedic healing and panchakarma programs guided by veteran vaidyas.',
                        'terms'       => 'Applicable on standard package rates. Advance reservation required.',
                    ),
                    array(
                        'id'          => 'nss-2',
                        'title'       => 'Yoga Sessions',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Mindfulness',
                        'description' => 'Daily sunrise and sunset mindful yoga and pranayama sessions overlooking the coastal cliffs.',
                        'terms'       => 'Valid on private and group guided yoga sessions.',
                    ),
                    array(
                        'id'          => 'nss-3',
                        'title'       => 'Ayurveda Treatments',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Therapies',
                        'description' => 'Traditional herbal massages, Abhyanga, Shirodhara, and therapeutic herbal compresses.',
                        'terms'       => 'Applicable to à la carte Ayurvedic treatment menu.',
                    ),
                    array(
                        'id'          => 'nss-4',
                        'title'       => 'Cooking Class',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Culinary',
                        'description' => 'Master the art of sattvic and authentic Kerala coastal wellness cuisine with executive chefs.',
                        'terms'       => 'Subject to masterclass scheduling and ingredient availability.',
                    ),
                    array(
                        'id'          => 'nss-5',
                        'title'       => 'Spa Treatments',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Spa & Beauty',
                        'description' => 'Holistic spa rituals, restorative body scrubs, and international wellness therapies.',
                        'terms'       => 'Cannot be combined with other seasonal spa promotions.',
                    ),
                ),
            ),
            array(
                'id'        => 2,
                'slug'      => 'niraamaya-retreats-backwaters-beyond',
                'name'      => 'Niraamaya Retreats Backwaters & Beyond',
                'location'  => 'Kumarakom, Kerala',
                'shortDesc' => 'Nestled along the tranquil banks of Lake Vembanad, offering nature-immersed luxury villas, holistic therapies, and peaceful backwater cruises.',
                'category'  => 'Backwater Resort',
                'image'     => '/images/niraamaya-backwaters-spa.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'nbb-1',
                        'title'       => 'Ayurveda Wellness Packages',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Ayurveda',
                        'description' => 'Multi-day restorative Ayurvedic cure packages tailored for stress management and detoxification.',
                        'terms'       => 'Minimum stay requirements may apply during peak seasons.',
                    ),
                    array(
                        'id'          => 'nbb-2',
                        'title'       => 'Yoga Sessions',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Mindfulness',
                        'description' => 'Private and open-air yoga practices on waterfront pavilions surrounded by tropical flora.',
                        'terms'       => 'Guided by resident yogic masters.',
                    ),
                    array(
                        'id'          => 'nbb-3',
                        'title'       => 'Ayurveda & Spa Therapies',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Therapies',
                        'description' => 'Complete menu of Western therapies, Eastern massages, and signature herbal body rituals.',
                        'terms'       => 'Valid on all individual spa and Ayurvedic therapies.',
                    ),
                    array(
                        'id'          => 'nbb-4',
                        'title'       => 'Cooking Class',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Culinary',
                        'description' => 'Interactive culinary session focused on indigenous backwater herbs and nourishing recipes.',
                        'terms'       => 'Prior booking required with the culinary concierge.',
                    ),
                    array(
                        'id'          => 'nbb-5',
                        'title'       => 'Shikara Ride',
                        'discount'    => '20% SAVINGS',
                        'badge'       => 'Experience',
                        'description' => 'Private wooden Shikara boat expedition across the serene canals and lotus-filled lagoons of Kumarakom.',
                        'terms'       => 'Subject to weather and lake navigation conditions.',
                    ),
                ),
            ),
            array(
                'id'        => 3,
                'slug'      => 'swastik-luxury-wellbeing-sanctuary',
                'name'      => 'Swastik Luxury Wellbeing Sanctuary',
                'location'  => 'Pune, Maharashtra',
                'shortDesc' => 'An exclusive holistic retreat nestled in pristine Sahyadri hills, integrating ancient Vedic traditions with luxury healing sanctuaries.',
                'category'  => 'Holistic Sanctuary',
                'image'     => '/images/swastik-sanctuary-real.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'sws-1',
                        'title'       => 'Wellness Programs (3+ Nights)',
                        'discount'    => 'FLAT 20% OFF',
                        'badge'       => 'Published Rates',
                        'description' => 'Flat 20% discount on published rates for all immersive wellness and healing programs of 3 nights and above.',
                        'terms'       => 'Valid on 3-night, 5-night, 7-night, and 14-night holistic residential programs.',
                    ),
                    array(
                        'id'          => 'sws-2',
                        'title'       => 'Complimentary Guha Upgrade (5+ Nights)',
                        'discount'    => 'FREE UPGRADE',
                        'badge'       => 'Room Privilege',
                        'description' => 'Complimentary room upgrade to the next higher Guha sanctuary category for stays of 5 nights and above.',
                        'terms'       => 'Subject to category availability at time of confirmed reservation.',
                    ),
                    array(
                        'id'          => 'sws-3',
                        'title'       => 'Complimentary Signature Experiences',
                        'discount'    => 'INCLUDED COMPLIMENTARY',
                        'badge'       => 'Signature Rituals',
                        'description' => 'Complimentary access to sacred signature rituals: Swastik Swagat (traditional welcome), Swastik Shuddhi (cellular detox), and Swastik Agnihotra (sacred fire purification).',
                        'terms'       => 'Included automatically for all WLC verified members during their stay.',
                    ),
                ),
            ),
            array(
                'id'        => 4,
                'slug'      => 'the-wellness-co-karma-lakelands',
                'name'      => 'The Wellness Co. — Karma Lakelands',
                'location'  => 'Karma Lakelands, Gurgaon',
                'shortDesc' => 'A premier integrated longevity and medical wellness sanctuary combining cutting-edge biohacking, cryotherapy, and natural tranquility.',
                'category'  => 'Longevity & Wellness',
                'image'     => '/images/wellness-co-real.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'twc-kl-1',
                        'title'       => 'Signature Wellness Retreat Programs',
                        'discount'    => '40% SAVINGS',
                        'badge'       => 'Retreats',
                        'description' => '40% savings on all 2-Day, 3-Day, 5-Day, and 7-Day Signature Wellness Retreat Programs designed for cellular rejuvenation and stress recovery.',
                        'terms'       => 'Valid on 2D/3D/5D/7D residential retreat programs at Karma Lakelands.',
                    ),
                    array(
                        'id'          => 'twc-kl-2',
                        'title'       => 'Individual Wellness Therapies',
                        'discount'    => '50% SAVINGS',
                        'badge'       => 'Therapies',
                        'description' => '50% savings on all individual wellness therapies, recovery treatments, IV drips, and functional wellness services.',
                        'terms'       => 'Applicable on à la carte services at the Karma Lakelands centre.',
                    ),
                ),
            ),
            array(
                'id'        => 5,
                'slug'      => 'the-wellness-co-pan-india',
                'name'      => 'The Wellness Co. — PAN India',
                'location'  => 'PAN India (Centres Nationwide)',
                'shortDesc' => 'India\'s foremost network of advanced longevity clinics providing non-invasive recovery, cryo-wellness, and molecular rejuvenation.',
                'category'  => 'Longevity Clinics',
                'image'     => '/images/wellness-co-spa.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'            => 'twc-pan-1',
                        'title'         => '5 General Wellness Therapies + 1 CRYO Facial',
                        'discount'      => '58% SAVINGS',
                        'badge'         => 'Special Package',
                        'originalPrice' => '₹34,125',
                        'memberPrice'   => '₹14,500',
                        'priceNote'     => 'All Inclusive',
                        'description'   => 'Comprehensive recovery package including 5 General Wellness Therapies (Infrared Sauna / Pressotherapy / Red Light) plus 1 Cryo Facial.',
                        'terms'         => 'Redeemable across all active The Wellness Co. clinics nationwide in India.',
                    ),
                ),
            ),
            array(
                'id'        => 6,
                'slug'      => 'viveda-wellness-resort',
                'name'      => 'Viveda Wellness Resort',
                'location'  => 'Nashik, Maharashtra',
                'shortDesc' => 'An integrated wellness village surrounded by the Sahyadri mountains, specializing in Naturopathy, Ayurveda, Yoga, and International Spa therapies.',
                'category'  => 'Naturopathy Resort',
                'image'     => '/images/viveda-resort-real.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'viv-1',
                        'title'       => 'Viveda Destress & Unwind Program',
                        'discount'    => '20% SAVINGS',
                        'badge'       => '3-Night Retreat',
                        'description' => '20% savings on the complete Viveda Destress & Unwind Program applicable to a 3-night wellness retreat.',
                        'terms'       => 'Includes consultation, prescribed therapies, satvik meals, and wellness villa accommodation.',
                    ),
                    array(
                        'id'          => 'viv-2',
                        'title'       => 'Viveda Pamper Yourself Package',
                        'discount'    => '15% SAVINGS',
                        'badge'       => 'Pampering',
                        'description' => '15% savings on the signature Viveda Pamper Yourself Package featuring organic skin rituals, aromatic massages, and herbal baths.',
                        'terms'       => 'Advance booking required. Valid for direct member reservations.',
                    ),
                ),
            ),
            array(
                'id'        => 7,
                'slug'      => 'silhouette-salon',
                'name'      => 'Silhouette Salon',
                'location'  => 'Gurgaon, India',
                'shortDesc' => 'High-end bespoke hair styling, luxury salon aesthetics, and indulgent personal care rituals in premium Gurgaon spaces.',
                'category'  => 'Luxury Salon',
                'image'     => '/images/silhouette-salon-spa.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'sil-1',
                        'title'       => 'All Salon Services',
                        'discount'    => '20% DISCOUNT',
                        'badge'       => 'Salon Menu',
                        'description' => '20% member privilege on all premium hair styling, treatments, manicures, pedicures, and grooming services.',
                        'terms'       => 'Valid on all standard salon services upon displaying digital WLC membership.',
                    ),
                    array(
                        'id'          => 'sil-2',
                        'title'       => 'Parfaire Tivoli Privileges',
                        'discount'    => '25% DISCOUNT',
                        'badge'       => 'Exclusive',
                        'description' => '25% exclusive member discount on Parfaire Tivoli premium treatments and packages.',
                        'terms'       => 'Prior appointment recommended.',
                    ),
                ),
            ),
            array(
                'id'        => 8,
                'slug'      => 'viva-mayr',
                'name'      => 'Viva Mayr',
                'location'  => 'Maria Wörth, Austria',
                'shortDesc' => 'World-renowned Austrian medical health institute on the pristine shores of Lake Wörthersee, pioneering Modern Mayr Medicine and longevity diagnostics.',
                'category'  => 'Medical Longevity',
                'image'     => '/images/vivamayr-austria-real.webp',
                'flag'      => '🇦🇹',
                'offers'    => array(
                    array(
                        'id'          => 'vm-1',
                        'title'       => 'Stay 7 Nights + 2 Complimentary Nights',
                        'discount'    => '7 = 9 NIGHTS',
                        'badge'       => 'Accommodation Privilege',
                        'description' => 'Book a 7-night health residency at Viva Mayr Maria Wörth and receive 2 additional nights complimentary.',
                        'terms'       => 'Complimentary nights apply strictly to accommodation only. Medical therapies, diagnostics, and meals during extension days billed separately.',
                    ),
                ),
            ),
            array(
                'id'        => 9,
                'slug'      => 'andaz-delhi-hyatt',
                'name'      => 'Andaaz Delhi — Hyatt Hotel',
                'location'  => 'Aerocity / Vasant Vihar, New Delhi',
                'shortDesc' => 'A luxury lifestyle Hyatt property blending contemporary Indian craftsmanship with urban wellness, heated pools, and artisanal spa sanctuaries.',
                'category'  => 'Urban Luxury Spa',
                'image'     => '/images/andaz-hyatt-spa.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'and-1',
                        'title'       => '25% Off Regular Spa Treatments',
                        'discount'    => '25% DISCOUNT',
                        'badge'       => 'Spa & Fitness',
                        'description' => '25% off regular spa treatments at Andaz Spa, plus 1 hour of complimentary Gym and Swimming Pool access.',
                        'terms'       => 'Packages excluded. Valid on regular à la carte spa treatments with prior slot confirmation.',
                    ),
                    array(
                        'id'          => 'and-2',
                        'title'       => 'Complimentary 30-Minute Add-On Treatment',
                        'discount'    => 'FREE 30-MIN ADD-ON',
                        'badge'       => 'With 90-Min Service',
                        'description' => 'Book any 90-minute treatment and receive 30 minutes complimentary of any ONE: Head massage, Face cleansing, Foot massage, or Chakra healing.',
                        'terms'       => 'Valid with any 90-minute treatment booking. Choose one add-on at check-in.',
                    ),
                ),
            ),
            array(
                'id'        => 10,
                'slug'      => 'shangri-la-eros',
                'name'      => 'Shangri-La Eros',
                'location'  => 'Connaught Place, New Delhi',
                'shortDesc' => 'An iconic luxury five-star hotel in the diplomatic heart of Delhi, housing the celebrated Chi The Spa and the state-of-the-art Wellness Club.',
                'category'  => '5-Star Hotel & Club',
                'image'     => '/images/shangri-la-stay.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'sh-1',
                        'title'       => 'Wellness Club Membership — 13 Months for Price of 12',
                        'discount'    => '1 MONTH FREE',
                        'badge'       => 'Annual Membership',
                        'description' => 'Pay for a 12-month Wellness Club Membership and receive 1 additional month complimentary (13 months total privilege).',
                        'terms'       => 'Applicable on the rack rate of membership. Full club fitness and wet area access included.',
                    ),
                    array(
                        'id'          => 'sh-2',
                        'title'       => 'Spa & Salon Services',
                        'discount'    => '20% DISCOUNT',
                        'badge'       => 'Chi The Spa',
                        'description' => '20% discount across all wellness treatments, therapeutic massages, and salon rituals.',
                        'terms'       => 'Available on standard à la carte spa and salon menu.',
                    ),
                ),
            ),
            array(
                'id'        => 11,
                'slug'      => 'pema-wellness',
                'name'      => 'Pema Wellness',
                'location'  => 'Visakhapatnam, Andhra Pradesh, India',
                'shortDesc' => 'A hilltop naturopathy and holistic healing resort overlooking the Bay of Bengal, offering evidence-based lifestyle medicine and bespoke longevity cures.',
                'category'  => 'Healing Sanctuary',
                'image'     => '/images/pema-wellness-spa.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'pem-1',
                        'title'       => '15% WLC Member Privilege Across All Services',
                        'discount'    => '15% DISCOUNT',
                        'badge'       => 'All Offerings',
                        'description' => '15% discount on wellness services, treatments, programs, retreats, and experiences offered by Pema Wellness.',
                        'terms'       => 'Applicable on residential retreat packages and outpatient wellness services.',
                    ),
                ),
            ),
            array(
                'id'        => 12,
                'slug'      => 'dhun-wellness-spa',
                'name'      => 'Dhun Wellness Spa',
                'location'  => 'Mumbai, Maharashtra, India',
                'shortDesc' => 'An avant-garde urban sanctuary in Mumbai specializing in biohacking, thermal contrast recovery, and non-invasive cellular renewal.',
                'category'  => 'Biohacking & Spa',
                'image'     => '/images/dhun-wellness-spa.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'dhun-1',
                        'title'       => 'Complimentary Recovery Treatment with 60-Min Service',
                        'discount'    => 'FREE RECOVERY SESSION',
                        'badge'       => 'Biohacking Privilege',
                        'description' => 'Book any 60-minute massage or any facial and receive 1 complimentary recovery treatment. Choose from: Infrared Sauna, Red Light Collagen Bed, or Whole Body Cryotherapy.',
                        'terms'       => 'One complimentary recovery treatment per 60-minute massage/facial booking.',
                    ),
                ),
            ),
            array(
                'id'        => 13,
                'slug'      => 'florian-hurel-hair-couture-spa',
                'name'      => 'Florian Hurel Hair Couture & Spa',
                'location'  => 'Mumbai, Ahmedabad, Hyderabad, Pune',
                'shortDesc' => 'Celebrity hair stylist Florian Hurel\'s signature luxury salons, bringing international haute couture styling and bespoke spa rituals across India.',
                'category'  => 'Hair Couture & Spa',
                'image'     => '/images/community-experiences-lounge.webp',
                'flag'      => '🇮🇳',
                'offers'    => array(
                    array(
                        'id'          => 'fh-1',
                        'title'       => '20% Privilege on Salon & Spa Services',
                        'discount'    => '20% PRIVILEGE',
                        'badge'       => 'PAN India',
                        'description' => '20% privilege on all salon styling, hair couture treatments, manicures, pedicures, and spa services across all branches.',
                        'terms'       => 'Applicable to all registered Wellness Lovers Club members at Mumbai, Ahmedabad, Hyderabad, and Pune centres.',
                    ),
                ),
            ),
        );
    }
}
