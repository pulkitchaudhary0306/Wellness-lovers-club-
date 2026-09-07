"use client";

import Image from "next/image";
import "./SplashScreen.css";

export default function SplashScreen({ isFadingOut }) {
  return (
    <div className={`splash-screen ${isFadingOut ? "fade-out" : ""}`}>
      <div className="splash-logo-container">
        <div className="splash-logo-wrapper">
          <Image
            src="/logo/logo.webp"
            alt="Wellness Lovers Club Logo"
            width={440}
            height={125}
            priority
            className="splash-logo"
          />
          <div className="splash-shine"></div>
          <div className="splash-shine-secondary"></div>
        </div>
      </div>
      <div className="splash-progress-bar"></div>
    </div>
  );
}
