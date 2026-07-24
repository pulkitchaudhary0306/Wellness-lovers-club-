"use client";

import "./SplashScreen.css";

export default function SplashScreen({ isFadingOut }) {
  return (
    <div className={`splash-screen ${isFadingOut ? "fade-out" : ""}`}>
      <div className="splash-logo-container">
        <div className="splash-logo-wrapper">
          <img loading="lazy" src="/logo/logo.png"
            alt="Wellness Lovers Club Logo"
            className="splash-logo" />
          <div className="splash-shine"></div>
          <div className="splash-shine-secondary"></div>
        </div>
      </div>
      <div className="splash-progress-bar"></div>
    </div>
  );
}
