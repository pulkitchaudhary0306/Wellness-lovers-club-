"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import "./AppShell.css";

export default function AppShell({ children, header, footer }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [contentFadeIn, setContentFadeIn] = useState(false);

  useEffect(() => {
    // Check if session storage key is already set
    const visited = sessionStorage.getItem("wlc_splash_shown") === "true";
    
    if (visited) {
      setTimeout(() => {
        setShowSplash(false);
        setContentFadeIn(true);
      }, 0);
      // Ensure html class is set for instant rendering
      document.documentElement.classList.add("splash-complete");
    } else {
      // First visit: disable scrolling
      document.body.classList.add("splash-active");

      // Start fading in homepage content a bit early (4.5 seconds)
      const contentFadeTimeout = setTimeout(() => {
        setContentFadeIn(true);
      }, 4500);

      // Start fading out the splash screen at 4.8 seconds
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 4800);

      // Fully remove splash screen and enable scrolling at 6.0 seconds
      const removeTimeout = setTimeout(() => {
        setShowSplash(false);
        document.body.classList.remove("splash-active");
        document.documentElement.classList.add("splash-complete");
        sessionStorage.setItem("wlc_splash_shown", "true");
      }, 6000);

      return () => {
        clearTimeout(contentFadeTimeout);
        clearTimeout(fadeTimeout);
        clearTimeout(removeTimeout);
        document.body.classList.remove("splash-active");
      };
    }
  }, []);

  return (
    <>
      {showSplash && <SplashScreen isFadingOut={isFadingOut} />}
      <div className={`site-content ${contentFadeIn ? "fade-in" : ""}`}>
        {header}
        {children}
        {footer}
      </div>
    </>
  );
}
