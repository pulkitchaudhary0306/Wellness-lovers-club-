"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Header.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Compass,
  Gift,
  MapPin,
  Mail,
  User,
  LayoutDashboard,
  Award,
  LogOut,
  ChevronDown,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = async () => {
    closeMenu();
    try {
      await logout();
      router.push("/");
    } catch (err) {
      router.push("/");
    }
  };

  const isActive = (path) => pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMenuOpen(false);
      setIsUserDropdownOpen(false);
    }, 0);
    return () => clearTimeout(timer);
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

  const displayName = user?.firstName || user?.display_name || user?.username || "Member";

  return (
    <header className="site-header">
      <div className="logo-section">
        <Link href="/" onClick={closeMenu}>
          <Image
            src="/logo/logo.webp"
            alt="Wellness Lovers Club Logo"
            width={220}
            height={220}
            priority
            className="site-logo"
          />
        </Link>
      </div>
      <div className="navigation-section">
        <div className="header-container">
          <button
            className={`mobile-menu-button ${isMenuOpen ? "active" : ""}`}
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" width="25" height="25" stroke="#0d563f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="25" height="25" stroke="#0d563f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <line x1="3.5" y1="7" x2="20.5" y2="7"></line>
                <line x1="3.5" y1="12" x2="15.5" y2="12"></line>
                <line x1="3.5" y1="17" x2="20.5" y2="17"></line>
              </svg>
            )}
          </button>

          <nav className={`main-navigation ${isMenuOpen ? "menu-open" : ""}`}>
            <Link
              href="/"
              className={isActive("/") ? "active-link" : ""}
              onClick={closeMenu}
            >
              <Home size={22} strokeWidth={1.8} className="nav-link-icon" />
              <span>Home</span>
            </Link>
            <Link
              href="/our-philosophy"
              className={isActive("/our-philosophy") ? "active-link" : ""}
              onClick={closeMenu}
            >
              <Compass size={22} strokeWidth={1.8} className="nav-link-icon" />
              <span>Our Philosophy</span>
            </Link>
            <Link
              href="/offerings"
              className={isActive("/offerings") ? "active-link" : ""}
              onClick={closeMenu}
            >
              <Gift size={22} strokeWidth={1.8} className="nav-link-icon" />
              <span>Offerings</span>
            </Link>
            <Link
              href="/destinations"
              className={isActive("/destinations") ? "active-link" : ""}
              onClick={closeMenu}
            >
              <MapPin size={22} strokeWidth={1.8} className="nav-link-icon" />
              <span>Destinations</span>
            </Link>
            <Link
              href="/contact"
              className={isActive("/contact") ? "active-link" : ""}
              onClick={closeMenu}
            >
              <Mail size={22} strokeWidth={1.8} className="nav-link-icon" />
              <span>Contact Us</span>
            </Link>
            
            {/* Mobile Only: Member action buttons placed inside mobile drawer */}
            <div className="mobile-only-member-btn">
              {isAuthenticated ? (
                <div className="mobile-auth-actions">
                  <Link
                    href="/dashboard"
                    className="member-button mobile-member-button"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard size={16} style={{ marginRight: 6 }} />
                    <span>DASHBOARD ({displayName})</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mobile-logout-btn"
                  >
                    <LogOut size={15} style={{ marginRight: 6 }} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="mobile-guest-actions">
                  <Link
                    href="/login"
                    className="mobile-login-link"
                    onClick={closeMenu}
                  >
                    <User size={15} style={{ marginRight: 6, display: "inline-block", verticalAlign: "middle" }} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/membership"
                    className="member-button mobile-member-button"
                    onClick={closeMenu}
                  >
                    <CreditCard size={15} style={{ marginRight: 6 }} />
                    <span>BECOME A MEMBER →</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Only: Dynamic E-commerce Auth & Member Button */}
          <div className="header-member-btn desktop-only">
            {isAuthenticated ? (
              <div className="header-user-menu-wrapper">
                <Link
                  href="/dashboard"
                  className="member-button logged-in-member-btn"
                  title="Go to Member Dashboard"
                >
                  <span className="user-avatar-circle">
                    <User size={14} />
                  </span>
                  <span className="user-btn-name">Hi, {displayName}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="header-quick-signout-btn"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="guest-header-actions">
                <Link
                  href="/login"
                  className="header-signin-link"
                >
                  <User size={15} className="nav-btn-icon" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/membership"
                  className="member-button"
                >
                  <CreditCard size={15} className="nav-btn-icon" />
                  <span>BECOME A MEMBER →</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
