"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Header.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

function Header() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => pathname === path;

  // Automatically close menu when path changes
  useEffect(() => {
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 0);
  }, [pathname]);

  // Close menu when resizing to desktop layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        closeMenu();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="site-header">
      <div className="logo-section">
        <Link href="/" onClick={closeMenu}>
          <img
            src="/logo/logo.png"
            alt="Wellness Lovers Club Logo"
            className="site-logo"
          />
        </Link>
      </div>
      <div className="navigation-section">
        <div className="header-container">
          <button
            className="mobile-menu-button"
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`main-navigation ${isMenuOpen ? "menu-open" : ""}`}>
            <Link
              href="/"
              className={isActive("/") ? "active-link" : ""}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={isActive("/about") ? "active-link" : ""}
              onClick={closeMenu}
            >
              Our Philosophy
            </Link>
            <Link
              href="/services"
              className={isActive("/services") ? "active-link" : ""}
              onClick={closeMenu}
            >
              Offerings
            </Link>
            <Link
              href="/destinations"
              className={isActive("/destinations") ? "active-link" : ""}
              onClick={closeMenu}
            >
              Destinations
            </Link>
            <Link
              href="/contact"
              className={isActive("/contact") ? "active-link" : ""}
              onClick={closeMenu}
            >
              Contact Us
            </Link>
          </nav>

          <div className="header-member-btn">
            <Link
              href={isAuthenticated ? "/dashboard" : "/membership"}
              className="member-button"
              onClick={closeMenu}
            >
              {isAuthenticated ? "MEMBER HUB →" : "BECOME A MEMBER →"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

