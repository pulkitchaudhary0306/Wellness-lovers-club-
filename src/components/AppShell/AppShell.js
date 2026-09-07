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
    if (isDashboard) {
      document.documentElement.classList.add("splash-complete");
      return;
    }

    const visited = typeof window !== "undefined" && sessionStorage.getItem("wlc_splash_shown") === "true";
    if (visited) {
      document.documentElement.classList.add("splash-complete");
      return;
    }

    const startTimeout = setTimeout(() => {
      setShowSplash(true);
      setContentFadeIn(false);
      document.body.classList.add("splash-active");
    }, 0);

    const contentFadeTimeout = setTimeout(() => {
      setContentFadeIn(true);
    }, 1800);

    const fadeTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200);

    const removeTimeout = setTimeout(() => {
      setShowSplash(false);
      document.body.classList.remove("splash-active");
      document.documentElement.classList.add("splash-complete");
      try {
        sessionStorage.setItem("wlc_splash_shown", "true");
      } catch {}
    }, 2600);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(contentFadeTimeout);
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
      document.body.classList.remove("splash-active");
    };
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
