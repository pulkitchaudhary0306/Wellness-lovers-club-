"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const heroImages = [
  "/images/hero-wellness.webp",
  "/images/wellness-retreat.webp",
  "/images/exclusive-privileges.webp",
  "/images/membership-spa.webp",
];

const membershipBannerImages = {
  spaStillLife: "/images/fukajaz.webp",
  loungeDeck: "/images/membership-resort.webp",
};

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-slides">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`hero-slide ${index === currentImageIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="lotus-icon-wrapper">
              <svg className="lotus-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.2 2.2M16.8 16.8L19 19M5 19l2.2-2.2M16.8 7.2L19 5" />
              </svg>
            </div>
            <h1 className="hero-title">Elevated Wellness, Beautifully Curated.</h1>
            <p className="hero-description">
              A members club for mindful living with handpicked experiences, privileges, and connections that inspire your best life.
            </p>
            <div className="hero-buttons">
              <Link href="/membership" className="btn btn-green">
                BECOME A MEMBER
              </Link>
              <Link href="/offerings" className="btn btn-outline">
                EXPLORE OUR OFFERINGS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10M12 10c1-2.5 3-4 6-4M12 13c-1.5-2-3.5-3-6-3" />
                <path d="M12 10c-1-2.5-3-4-6-4" />
              </svg>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Curated for Wellness</h3>
              <p className="feature-desc">Handpicked experiences for mind, body & soul.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                <path d="M6 14c2 0 4 2 6 2s4-2 6-2" />
              </svg>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Privileged Access</h3>
              <p className="feature-desc">Members-only benefits and preferred rates.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5">
                <rect x="3" y="8" width="18" height="12" rx="2" />
                <rect x="2" y="4" width="20" height="4" rx="1" />
                <line x1="12" y1="4" x2="12" y2="20" />
                <path d="M12 4A3 3 0 0 0 9 7a3 3 0 0 0 3-3z" />
                <path d="M12 4a3 3 0 0 1 3 3 3 3 0 0 1-3-3z" />
              </svg>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Exclusive Partners</h3>
              <p className="feature-desc">Trusted luxury wellness brands & resorts.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Global Community</h3>
              <p className="feature-desc">Connect with like-minded wellness lovers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy Split Section */}
      <section className="philosophy-section">
        <div className="philosophy-container-wrapper">
          <div className="philosophy-content-col">
            <div className="philosophy-inner">
              <span className="philosophy-subtitle">OUR PHILOSOPHY</span>
              <h2 className="philosophy-title">Conscious Living, Elevated.</h2>
              <div className="philosophy-separator"></div>
              <p className="philosophy-text" style={{ marginBottom: "20px" }}>
                We curate meaningful experiences that nurture, restore, and inspire. Wellness Lovers Club is built on the belief that true luxury is the freedom to live consciously to invest in your mind, body, and soul with intention.
              </p>
              <p className="philosophy-text" style={{ fontSize: "15px", lineHeight: "1.7", color: "#666" }}>
                Backed by GlobalSpa  India&apos;s leading wellness and luxury lifestyle media brand WLC is more than a club. It is a movement. A movement that brings together like-minded individuals who value holistic living, mindful experiences, and conscious indulgence.
              </p>
            </div>
          </div>
          <div className="philosophy-image-col">
            <div className="philosophy-collage">
              <div className="philosophy-main-image-wrapper">
                <Image
                  src="/homepage/Introimages/natalia-portilho.webp"
                  alt="Luxury pool at wellness resort"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="philosophy-main-img"
                />
              </div>
              <div className="philosophy-detail-image-wrapper">
                <Image
                  src="/homepage/Introimages/szymon-shields.webp"
                  alt="Lush green palm leaves close-up"
                  fill
                  sizes="200px"
                  className="philosophy-detail-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Offerings Grid Section */}
      <section className="offerings-section">
        <h4 className="offerings-subtitle">OUR OFFERINGS</h4>
        <h2 style={{ textAlign: "center", fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "clamp(24px, 3.2vw, 36px)", color: "#0d563f", marginBottom: "20px", marginTop: "10px" }}>
          How We Elevate Your Wellness
        </h2>
        <p style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 45px", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "16px", color: "#666666", lineHeight: "1.6", padding: "0 20px" }}>
          Explore a curated selection of wellness experiences, exclusive events, and premium lifestyle privileges designed to elevate every aspect of your wellbeing.
        </p>
        <div className="offerings-container">
          {/* Card 1 */}
          <Link href="/offerings/wellness-retreats" className="offering-card" style={{ textDecoration: "none" }}>
            <div className="offering-image-wrapper">
              <Image
                src="/images/wellness-retreat-cabin.webp"
                alt="Wellness retreats"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="offering-img"
              />
              <div className="offering-icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" className="offering-badge-icon">
                  <path d="M2 22C2 22 6 18 12 17C18 16 22 10 22 2C22 2 14 2 9 8C4 14 2 22 2 22Z" />
                  <path d="M12 12L17 7" />
                  <path d="M8 16L11 13" />
                </svg>
              </div>
            </div>
            <div className="offering-info">
              <h3 className="offering-title">Wellness Retreats</h3>
              <p className="offering-desc">
                Immersive escapes designed to restore your mind, body and perspective.
              </p>
            </div>
          </Link>
 
          {/* Card 2 */}
          <Link href="/offerings/movement-mindfulness" className="offering-card" style={{ textDecoration: "none" }}>
            <div className="offering-image-wrapper">
              <Image
                src="/images/movement-mindfulness-yoga.webp"
                alt="Movement & Mindfulness"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="offering-img"
              />
              <div className="offering-icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" className="offering-badge-icon" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 10h14c1.5 0 2.5-1.5 2.5-3s-1-3-2.5-3-2.5 1.5-2.5 3" />
                  <path d="M8 14h12c1.5 0 2.5 1.5 2.5 3s-1 3-2.5 3-2.5-1.5-2.5-3" />
                  <path d="M4 18h7c1.5 0 2.5-1.5 2.5-3s-1-3-2.5-3" />
                </svg>
              </div>
            </div>
            <div className="offering-info">
              <h3 className="offering-title">Movement & Mindfulness</h3>
              <p className="offering-desc">
                Move with intention. Pause with purpose. Build a healthier relationship with your body.
              </p>
            </div>
          </Link>
 
          {/* Card 3 */}
          <Link href="/contact" className="offering-card" style={{ textDecoration: "none" }}>
            <div className="offering-image-wrapper">
              <Image
                src="/images/community-experiences-lounge.webp"
                alt="Exclusive Community Experiences"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="offering-img"
              />
              <div className="offering-icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" className="offering-badge-icon">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <div className="offering-info">
              <h3 className="offering-title">Exclusive Community Experiences</h3>
              <p className="offering-desc">
                Meaningful connections that inspire growth, collaboration and conscious living.
              </p>
            </div>
          </Link>
 
          {/* Card 4 */}
          <Link href="/contact" className="offering-card" style={{ textDecoration: "none" }}>
            <div className="offering-image-wrapper">
              <Image
                src="/images/wellness-experience.webp"
                alt="Priority Access"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="offering-img"
              />
              <div className="offering-icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="offering-badge-icon">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
              </div>
            </div>
            <div className="offering-info">
              <h3 className="offering-title">Priority Access</h3>
              <p className="offering-desc">
                Exclusive experiences reserved for those who choose wellness first.
              </p>
            </div>
          </Link>
 
          {/* Card 5 */}
          <Link href="/offerings/spa-healing" className="offering-card" style={{ textDecoration: "none" }}>
            <div className="offering-image-wrapper">
              <Image
                src="/images/spa-healing-room.webp"
                alt="Spa & Holistic Healing Experiences"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="offering-img"
              />
              <div className="offering-icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" className="offering-badge-icon" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21a7 7 0 0 0 7-7H5a7 7 0 0 0 7 7z" />
                  <path d="M12 14v-4" />
                  <path d="M12 5.5c-.8 1.5-1.5 2.5-1.5 3.5 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-1-.7-2-1.5-3.5z" fill="#ffffff" />
                </svg>
              </div>
            </div>
            <div className="offering-info">
              <h3 className="offering-title">Spa & Holistic Healing Experiences</h3>
              <p className="offering-desc">
                Ancient wisdom and modern therapies curated for complete restoration.
              </p>
            </div>
          </Link>
 
          {/* Card 6 */}
          <Link href="/offerings/luxury-stays" className="offering-card" style={{ textDecoration: "none" }}>
            <div className="offering-image-wrapper">
              <Image
                src="/images/luxury-stays-cabana.webp"
                alt="Luxury Wellness Stays"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="offering-img"
              />
              <div className="offering-icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="offering-badge-icon">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            </div>
            <div className="offering-info">
              <h3 className="offering-title">Luxury Wellness Stays</h3>
              <p className="offering-desc">
                Preferred rates and VIP amenities at the world's most exclusive boutique wellness resorts and luxury hotels.
              </p>
            </div>
          </Link>
        </div>
      </section>


      {/* The Wellness Pillars Section */}
      <section className="pillars-section">
        <h4 className="pillars-subtitle">THE WELLNESS PILLARS</h4>
        <h2 style={{ textAlign: "center", fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "clamp(24px, 3.2vw, 36px)", color: "#0d563f", marginBottom: "35px", marginTop: "10px" }}>
          Five Dimensions of Elevated Living
        </h2>
        <div className="pillars-container">
          {/* Mind */}
          <div className="pillar-item">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5" className="pillar-icon" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span className="pillar-title">✦ Mind</span>
            <p style={{ fontSize: "12px", color: "#666666", marginTop: "4px", maxWidth: "160px", lineHeight: "1.4" }}>
              Mental clarity, focus, stress relief
            </p>
          </div>

          {/* Body */}
          <div className="pillar-item">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5" className="pillar-icon" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
              </svg>
            </div>
            <span className="pillar-title">✦ Body</span>
            <p style={{ fontSize: "12px", color: "#666666", marginTop: "4px", maxWidth: "160px", lineHeight: "1.4" }}>
              Fitness, nutrition, physical vitality
            </p>
          </div>

          {/* Soul */}
          <div className="pillar-item">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5" className="pillar-icon" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </div>
            <span className="pillar-title">✦ Soul</span>
            <p style={{ fontSize: "12px", color: "#666666", marginTop: "4px", maxWidth: "160px", lineHeight: "1.4" }}>
              Spirituality, purpose, inner peace
            </p>
          </div>

          {/* Lifestyle */}
          <div className="pillar-item">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5" className="pillar-icon" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10M12 10c1-2.5 3-4 6-4" />
                <path d="M12 10c-1-2.5-3-4-6-4" />
              </svg>
            </div>
            <span className="pillar-title">✦ Lifestyle</span>
            <p style={{ fontSize: "12px", color: "#666666", marginTop: "4px", maxWidth: "160px", lineHeight: "1.4" }}>
              Elevated, conscious daily living
            </p>
          </div>

          {/* Community */}
          <div className="pillar-item">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c8458" strokeWidth="1.5" className="pillar-icon" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="pillar-title">✦ Community</span>
            <p style={{ fontSize: "12px", color: "#666666", marginTop: "4px", maxWidth: "160px", lineHeight: "1.4" }}>
              Like-minded connections & network
            </p>
          </div>
        </div>
      </section>

      {/* Membership Banner Section */}
      {/* Membership Banner Section */}
      <section className="membership-banner-section">
        <div className="membership-banner-container">
          {/* Left image */}
          <div className="banner-still-life-col">
            <Image
              src={membershipBannerImages.spaStillLife}
              alt="Spa candles, essential oil, ferns, stones, and rolled towels"
              fill
              sizes="(max-width: 767px) 100vw, 32vw"
              loading="eager"
              className="banner-still-life-img"
            />
          </div>

          {/* Centre content */}
          <div className="banner-content-col">
            <span className="banner-eyebrow">MEMBERSHIP</span>

            <h2 className="banner-title">
              A Life of Wellness Privileges.
            </h2>

            <p className="banner-text">
              Curated experiences. Exclusive access. A community that inspires.
            </p>

            <Link
              href="/membership"
              className="btn btn-green banner-btn"
            >
              BECOME A MEMBER
            </Link>
          </div>

          {/* Right image */}
          <div className="banner-lounge-col">
            <div className="banner-lounge-clip">
              <Image
                src={membershipBannerImages.loungeDeck}
                alt="Sunlit spa lounge with a pool and tropical greenery"
                fill
                sizes="(max-width: 767px) 100vw, 34vw"
                className="banner-lounge-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <span className="why-choose-subtitle">WHY CHOOSE US</span>
          <h2 className="why-choose-title">Reasons WLC Stands Apart</h2>
          <div className="why-choose-grid">
            {/* Exclusive Global Offers */}
            <div className="why-choose-item">
              <div className="why-choose-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="why-choose-icon">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="why-choose-item-title">✦ Exclusive Global Offers</h3>
              <p className="why-choose-item-desc">
                Access to world-class retreats, luxury spas, and wellness destinations worldwide curated for members only.
              </p>
            </div>

            {/* Premier Community */}
            <div className="why-choose-item">
              <div className="why-choose-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="why-choose-icon">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="why-choose-item-title">✦ Premier Community</h3>
              <p className="why-choose-item-desc">
                A like-minded network of wellness-conscious individuals and premium brands, united by a shared commitment to elevated living.
              </p>
            </div>

            {/* Luxury Integration */}
            <div className="why-choose-item">
              <div className="why-choose-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="why-choose-icon">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="why-choose-item-title">✦ Luxury Integration</h3>
              <p className="why-choose-item-desc">
                Seamlessly blend wellness with luxury travel, gourmet dining, and premium hospitality through a single curated membership.
              </p>
            </div>

            {/* Trusted Partners */}
            <div className="why-choose-item">
              <div className="why-choose-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="why-choose-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="why-choose-item-title">✦ Trusted Partners</h3>
              <p className="why-choose-item-desc">
                Curated collaborations with premier wellness, beauty, and lifestyle brands vetted for quality and exclusivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Benefits Section */}
      <section className="membership-benefits-section">
        <div className="benefits-container">
          <div className="benefits-header">
            <span className="benefits-eyebrow">MEMBERSHIP BENEFITS</span>
            <div className="benefits-header-line"></div>
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "clamp(24px, 3.2vw, 36px)", color: "#0d563f", marginBottom: "45px", marginTop: "10px" }}>
            Everything Your Wellness Life Deserves
          </h2>
          <div className="benefits-grid">
            {/* Exclusive Access */}
            <div className="benefit-item">
              <div className="benefit-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" className="benefit-icon" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="benefit-content">
                <h3 className="benefit-title">Exclusive Access</h3>
                <p className="benefit-desc">Premium wellness experiences, retreats, and luxury collaborations reserved for members.</p>
              </div>
            </div>

            {/* Priority Privileges */}
            <div className="benefit-item">
              <div className="benefit-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" className="benefit-icon" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="benefit-content">
                <h3 className="benefit-title">Priority Privileges</h3>
                <p className="benefit-desc">Special member-only invitations, early access to events, and curated partner benefits.</p>
              </div>
            </div>

            {/* Spa & Holistic Healing */}
            <div className="benefit-item">
              <div className="benefit-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" className="benefit-icon" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
                </svg>
              </div>
              <div className="benefit-content">
                <h3 className="benefit-title">Spa & Holistic Healing</h3>
                <p className="benefit-desc">Premium spa rituals, Ayurvedic therapies, recovery treatments, and holistic healing experiences.</p>
              </div>
            </div>

            {/* Wellness Networking */}
            <div className="benefit-item">
              <div className="benefit-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" className="benefit-icon" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>
              <div className="benefit-content">
                <h3 className="benefit-title">Wellness Networking</h3>
                <p className="benefit-desc">Attend exclusive events, expert masterclasses, and connect with longevity pioneers from around the world.</p>
              </div>
            </div>

            {/* Curated Experiences */}
            <div className="benefit-item">
              <div className="benefit-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" className="benefit-icon" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <div className="benefit-content">
                <h3 className="benefit-title">Curated Experiences</h3>
                <p className="benefit-desc">Thoughtfully designed wellness journeys for conscious, elevated living.</p>
              </div>
            </div>

            {/* Wellness + Lifestyle */}
            <div className="benefit-item">
              <div className="benefit-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="1.5" className="benefit-icon" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="benefit-content">
                <h3 className="benefit-title">Wellness + Lifestyle</h3>
                <p className="benefit-desc">Fitness, mindfulness, luxury hospitality, and elevated living  all in one membership.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Begin Your Wellness Journey Section */}
      <section className="journey-section">
        <div className="journey-image-col">
          <Image
            src="/images/zen_stones.webp"
            alt="Stacked zen stones on a sandy beach at sunset"
            fill
            sizes="(max-width: 767px) 100vw, 35vw"
            className="journey-img"
          />
        </div>
        <div className="journey-content-col">
          <h2 className="journey-title">Begin Your Wellness Journey.</h2>
          <p className="journey-subtitle">Join Wellness Lovers Club today and step into a life of elevated, conscious, and joyful living.</p>
          <div className="journey-contacts">
            <a href="mailto:wlc@pinnacleconnect.in" className="journey-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="journey-contact-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              wlc@pinnacleconnect.in
            </a>
            <div className="journey-separator"></div>
            <a href="https://globalspaonline.com/" target="_blank" rel="noopener noreferrer" className="journey-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="journey-contact-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              globalspaonline.com
            </a>
          </div>
          <div className="journey-lotus-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0d563f" strokeWidth="0.75" opacity="0.15" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.2 2.2M16.8 16.8L19 19M5 19l2.2-2.2M16.8 7.2L19 5" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
