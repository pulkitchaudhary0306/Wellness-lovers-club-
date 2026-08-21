"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import "./AppShell.css";

export default function AppShell({ children, header, footer }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname?.startsWith("/dashboard");

  const [showSplash, setShowSplash] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [contentFadeIn, setContentFadeIn] = useState(true);

  useEffect(() => {
    // If on dashboard, never show splash and show content immediately with header and footer
    if (isDashboard) {
      setShowSplash(false);
      setContentFadeIn(true);
      document.documentElement.classList.add("splash-complete");
      return;
    }

    // Check if session storage key is already set
    const visited = sessionStorage.getItem("wlc_splash_shown") === "true";
    
    if (visited) {
      setShowSplash(false);
      setContentFadeIn(true);
      document.documentElement.classList.add("splash-complete");
    } else {
      setShowSplash(true);
      setContentFadeIn(false);
      document.body.classList.add("splash-active");

      // Start fading in homepage content a bit early (1.8s)
      const contentFadeTimeout = setTimeout(() => {
        setContentFadeIn(true);
      }, 1800);

      // Start fading out the splash screen at 2.2s
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 2200);

      // Fully remove splash screen and enable scrolling at 2.6s
      const removeTimeout = setTimeout(() => {
        setShowSplash(false);
        document.body.classList.remove("splash-active");
        document.documentElement.classList.add("splash-complete");
        sessionStorage.setItem("wlc_splash_shown", "true");
      }, 2600);

      return () => {
        clearTimeout(contentFadeTimeout);
        clearTimeout(fadeTimeout);
        clearTimeout(removeTimeout);
        document.body.classList.remove("splash-active");
      };
    }
  }, [isDashboard]);

  return (
    <>
      {showSplash && <SplashScreen isFadingOut={isFadingOut} />}
      <div className={`site-content ${contentFadeIn ? "fade-in" : ""} ${isDashboard ? "dashboard-shell" : ""}`}>
        {header}
        <main className={isDashboard ? "dashboard-main-container" : ""}>
          {children}
        </main>
        {footer}
      </div>
    </>
  );
}
