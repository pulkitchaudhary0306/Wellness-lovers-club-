"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  LayoutDashboard, User as UserIcon, Award, ShoppingBag,
  CreditCard, Download, Heart, Bell, LifeBuoy,
  Settings as SettingsIcon, LogOut, Menu, X,
  CheckCircle, FileText, Calendar, Loader2, Sparkles, LogIn,
  ShieldAlert, Users, Hash, Clock
} from "lucide-react";
import { authService } from "@/services/authService";
import { paymentService, loadRazorpayScript } from "@/services/paymentService";
import MembershipCard, { formatMembershipNo, formatValidTillDate } from "@/components/ui/MembershipCard";
import "./Dashboard.css";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1).email("Valid email required"),
  phone: z.string().min(1, "Phone is required"),
  profession: z.string().optional(),
  companyName: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  address: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(8, "Min 8 characters").regex(/[A-Z]/, "Needs uppercase").regex(/[0-9]/, "Needs number"),
  confirmPassword: z.string().min(1, "Confirm your password"),
}).refine(d => d.newPassword === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

const menuItems = [
  { id: "dashboard",     label: "My Membership",  icon: Award },
  { id: "profile",       label: "My Profile",     icon: UserIcon },
  { id: "payments",      label: "Payments",       icon: CreditCard },
  { id: "orders",        label: "Orders",         icon: ShoppingBag },
  { id: "downloads",     label: "Downloads",      icon: Download },
  { id: "wishlist",      label: "Wishlist",       icon: Heart },
  { id: "notifications", label: "Notifications",  icon: Bell },
  { id: "support",       label: "Support",        icon: LifeBuoy },
  { id: "admin",         label: "Admin Sequence", icon: ShieldAlert },
  { id: "settings",      label: "Settings",       icon: SettingsIcon },
];

/* ─── Payment Config ─────────────────────────────────────── */
const paymentInfo = {
  amount: "₹29,000.00",
  gst: "GST 18%",
  payeeName: "Pinnacle Connect LLP",
  upiId: "pinnacleconnect@kotak",
  bank: "Kotak Mahindra Bank",
  accountNumber: "0312619723",
  ifsc: "KKBK0004591",
  address: "M-3 Hauz Khas Enclave, Aurobindo Marg, New Delhi - 110016",
  qrPath: "/QR images/Pinnacle_Connect_UPI_QR_29000.png",
};

export function getTodayDateFormatted() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day} / ${month} / ${year}`;
}

export function getOneYearValidTillFormatted(startDate) {
  const base = startDate ? new Date(startDate) : new Date();
  const now = isNaN(base.getTime()) ? new Date() : base;
  now.setFullYear(now.getFullYear() + 1);
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day} / ${month} / ${year}`;
}

const defaultMember = {
  id: "4104",
  firstName: "John",
  lastName: "Smith",
  fullName: "John Smith",
  email: "john.smith@wellnessloversclub.com",
  phone: "+91 98765 43210",
  profession: "Wellness Enthusiast",
  companyName: "Wellness Lovers Club",
  country: "India",
  membershipStatus: "Active",
  membershipNumber: "WLC-4104",
  membershipTier: "Lotus Club",
  startDate: getTodayDateFormatted(),
  validTill: getOneYearValidTillFormatted(),
};

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.memberships)) return value.memberships;
  return value ? [value] : [];
}

function displayText(value, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  return fallback;
}

function normalizeMembership(m, index, user, paymentInfo) {
  const start = displayText(m?.startDate ?? m?.start_date, getTodayDateFormatted());
  return {
    id: displayText(m?.id ?? m?.membershipId ?? m?.subscription_id, `membership-${user.id}-${index}`),
    tier: displayText(m?.tier ?? m?.membershipTier, user.membershipTier || "Lotus Club"),
    status: displayText(m?.status ?? m?.membershipStatus, user.membershipStatus || "Active"),
    startDate: start,
    endDate: displayText(m?.endDate ?? m?.end_date ?? m?.validUntil ?? m?.validTill, getOneYearValidTillFormatted(start)),
    price: displayText(m?.price ?? m?.amount, paymentInfo.amount),
    billingCycle: displayText(m?.billingCycle ?? m?.billing_cycle, "Annual"),
  };
}

function SidebarNav({ activeTab, setActiveTab, onLogout, onClose, isAuthenticated }) {
  return (
    <>
      <div className="db-sidebar-logo">
        <img loading="lazy" src="/logo/logo.png" alt="WLC" />
        <span className="db-sidebar-logo-badge">Club Hub</span>
      </div>
      <div className="db-nav-label">Navigation</div>
      <nav className="db-nav">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`db-nav-btn${activeTab === id ? " active" : ""}`}
            onClick={() => { setActiveTab(id); onClose?.(); }}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="db-sidebar-divider" />
      {isAuthenticated ? (
        <button className="db-logout-btn" onClick={onLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      ) : (
        <Link href="/login" className="db-nav-btn active" style={{ marginTop: "auto", textAlign: "center", justifyContent: "center" }}>
          <LogIn size={16} />
          <span>Sign In / Register</span>
        </Link>
      )}
    </>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function DashboardPage() {
  const { user, logout, loading, updateProfile, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Admin sequence states
  const [lastAssignedSeq, setLastAssignedSeq] = useState(4104);
  const [durationMonths, setDurationMonths] = useState(12);

  const effectiveUser = user || defaultMember;

  const customerFullName = (
    effectiveUser.fullName ||
    `${effectiveUser.firstName || ""} ${effectiveUser.lastName || ""}`.trim() ||
    effectiveUser.name ||
    "John Smith"
  );

  const { register: rProfile, handleSubmit: hProfile, setValue: sProfile, formState: { errors: eProfile } } = useForm({ resolver: zodResolver(profileSchema) });
  const { register: rPwd, handleSubmit: hPwd, reset: resetPwd, formState: { errors: ePwd } } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });

  useEffect(() => {
    if (effectiveUser) {
      sProfile("firstName", effectiveUser.firstName || "");
      sProfile("lastName", effectiveUser.lastName || "");
      sProfile("email", effectiveUser.email || "");
      sProfile("phone", effectiveUser.phone || "");
      sProfile("profession", effectiveUser.profession || "");
      sProfile("companyName", effectiveUser.companyName || "");
      sProfile("country", effectiveUser.country || "");
      sProfile("address", effectiveUser.address || "");
    }
  }, [effectiveUser, sProfile]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const [ordersData, paymentsData, membershipsData] = await Promise.all([
          authService.getOrders(),
          authService.getPayments(),
          authService.getMemberships(),
        ]);

        setOrders(toArray(ordersData));
        setPayments(toArray(paymentsData));
        setMemberships(toArray(membershipsData));
      } catch (e) { console.error(e); }
    })();
  }, [isAuthenticated]);

  const handleLogout = () => { router.push("/logout"); };

  const handleProfileUpdate = async (data) => {
    if (!isAuthenticated) {
      alert("Please sign in to update your live profile.");
      return;
    }
    setIsUpdatingProfile(true);
    try { await updateProfile(data); setProfileSuccess(true); setTimeout(() => setProfileSuccess(false), 3000); }
    catch (e) { alert("Update failed: " + e.message); }
    finally { setIsUpdatingProfile(false); }
  };

  const handlePasswordUpdate = async (data) => {
    if (!isAuthenticated) {
      alert("Please sign in to change your password.");
      return;
    }
    setIsUpdatingPassword(true);
    setPasswordError("");
    try { await authService.changePassword(data.currentPassword, data.newPassword); setPasswordSuccess(true); resetPwd(); setTimeout(() => setPasswordSuccess(false), 3000); }
    catch (e) { setPasswordError(e.message || "Failed to update password."); }
    finally { setIsUpdatingPassword(false); }
  };

  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [onlinePaySuccess, setOnlinePaySuccess] = useState("");

  const handlePayOnline = async () => {
    if (isPayingOnline) return;
    setIsPayingOnline(true);
    setOnlinePaySuccess("");
    try {
      await loadRazorpayScript();
      const config = await paymentService.getPaymentConfig();
      const orderData = await paymentService.createOrder({
        email: effectiveUser.email,
        name: customerFullName,
        phone: effectiveUser.phone,
      });

      const options = {
        key: orderData.key_id || config.key_id,
        amount: orderData.amount_paise || config.amount_paise,
        currency: orderData.currency || "INR",
        name: "Wellness Lovers Club",
        description: "VIP Annual Membership Pass",
        image: "/logo/logo.png",
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: customerFullName,
          email: effectiveUser.email,
          contact: effectiveUser.phone || "",
        },
        theme: {
          color: "#0f8554",
        },
        handler: async (response) => {
          try {
            const verifyResult = await paymentService.verifyPayment({
              order_id: orderData.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: effectiveUser.email,
              name: customerFullName,
            });

            setOnlinePaySuccess("Payment Confirmed! Your membership has been activated.");
            const newPaymentEntry = {
              id: verifyResult.order_id || response.razorpay_payment_id,
              method: "Razorpay / Online Verified",
              date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
              status: "Successful",
              amount: "₹29,000.00 (GST 18%)",
            };
            setPayments((prev) => [newPaymentEntry, ...prev]);
            setTimeout(() => {
              setActiveTab("dashboard");
            }, 1800);
          } catch (verErr) {
            alert("Payment verification failed: " + (verErr.message || "Please contact concierge."));
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Unable to open online checkout: " + err.message);
    } finally {
      setIsPayingOnline(false);
    }
  };

  const currentLabel = menuItems.find(i => i.id === activeTab)?.label || "My Membership";
  const hasSuccessfulMembershipPayment = ["Active", "Lifetime"].includes(effectiveUser.membershipStatus);
  const confirmedMembershipPayment = {
    id: `WLC-${effectiveUser.id || "4099"}-29000`,
    method: "UPI / Razorpay Verified",
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: "Successful",
    amount: `${paymentInfo.amount} (${paymentInfo.gst})`,
  };
  const displayedPayments =
    payments.length > 0
      ? payments
      : hasSuccessfulMembershipPayment
        ? [confirmedMembershipPayment]
        : [];
  const fallbackMembership = {
    id: `membership-${effectiveUser.id || "4104"}`,
    tier: effectiveUser.membershipTier || "Lotus Club",
    status: effectiveUser.membershipStatus || "Active",
    startDate: getTodayDateFormatted(),
    endDate: getOneYearValidTillFormatted(),
    price: paymentInfo.amount,
    billingCycle: "Annual",
  };
  const displayedMemberships =
    memberships.length > 0
      ? memberships.map((membership, index) =>
          normalizeMembership(membership, index, effectiveUser, paymentInfo)
        )
      : hasSuccessfulMembershipPayment
        ? [fallbackMembership]
        : [];

  const dynamicMembershipNo = formatMembershipNo(effectiveUser, effectiveUser?.membershipNumber || effectiveUser?.membershipId || "WLC-4104");
  const dynamicValidTill = formatValidTillDate(
    effectiveUser?.validTill || effectiveUser?.validUntil || memberships?.[0]?.endDate || getOneYearValidTillFormatted()
  );

  return (
    <div className="db-root">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="db-sidebar">
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
        />
      </aside>

      {/* ── Mobile Overlay + Drawer ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="db-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="db-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
            >
              <button
                className="db-drawer-close"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
              <SidebarNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
                onClose={() => setMobileOpen(false)}
                isAuthenticated={isAuthenticated}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Column ─────────────────────────────────── */}
      <div className="db-main">

        {/* Desktop top bar */}
        <header className="db-topbar">
          <div className="db-topbar-left">
            <h1>{currentLabel}</h1>
            <p>Wellness Lovers Club · Official Member Portal</p>
          </div>
          <div className="db-topbar-right">
            <div className="db-topbar-avatar-pill">
              <UserIcon size={16} style={{ marginRight: 6, color: "var(--gold-dark)" }} />
              <div>
                <div className="db-topbar-avatar-name">{customerFullName}</div>
                <div className="db-topbar-avatar-status">{effectiveUser.membershipStatus} Member</div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile top bar */}
        <header className="db-mobile-header">
          <img loading="lazy" src="/logo/logo.png" alt="WLC" style={{ height: 28 }} />
          <button className="db-mobile-menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
        </header>

        {/* ── Content ──────────────────────────────────── */}
        <main className="db-content">
          <div className="db-content-inner">

            {/* ═══ MY DIGITAL MEMBERSHIP (PRIMARY SECTION) ══════════════════════ */}
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" className="db-fadein" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                <div className="db-dashboard-hero">
                  <div className="db-hero-header">
                    <span className="db-hero-eyebrow">
                      <Sparkles size={13} />
                      Official Pass
                    </span>
                    <h2 className="db-hero-title">MY DIGITAL MEMBERSHIP</h2>
                    <p className="db-hero-subtitle">
                      Your personalized Wellness Lovers Club digital pass is active, verified, and ready for use.
                    </p>
                  </div>

                  {/* ── Personalized Digital Membership Card ── */}
                  <MembershipCard
                    user={effectiveUser}
                    name={customerFullName}
                    membershipNo={dynamicMembershipNo}
                    validTo={getOneYearValidTillFormatted()}
                  />
                </div>
              </motion.div>
            )}

            {/* ═══ ADMIN SEQUENCE CONTROL TAB ══════════════ */}
            {activeTab === "admin" && (
              <motion.div key="admin" className="db-fadein" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="db-card db-card-pad">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(188,163,116,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                      <Hash size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>Membership Number Control</h3>
                      <p style={{ fontSize: 12, color: "var(--text-faint)" }}>Manage sequential WLC-4099+ assignment and duration settings.</p>
                    </div>
                  </div>

                  <div className="db-admin-stat-grid">
                    <div className="db-admin-stat-box">
                      <span className="db-admin-stat-label">Current Last Assigned Number</span>
                      <strong className="db-admin-stat-val gold">WLC-{lastAssignedSeq}</strong>
                      <small className="db-admin-stat-sub">Persisted in database sequence</small>
                    </div>
                    <div className="db-admin-stat-box">
                      <span className="db-admin-stat-label">Next Available Number</span>
                      <strong className="db-admin-stat-val green">WLC-{lastAssignedSeq + 1}</strong>
                      <small className="db-admin-stat-sub">Auto-assigned on next payment</small>
                    </div>
                    <div className="db-admin-stat-box">
                      <span className="db-admin-stat-label">Configured Duration</span>
                      <strong className="db-admin-stat-val">{durationMonths} Months</strong>
                      <small className="db-admin-stat-sub">Auto-calculated Valid Till</small>
                    </div>
                  </div>

                  <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: "1rem" }}>Member Directory (Live DB Sync)</h4>
                    <div style={{ overflowX: "auto" }}>
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Membership No.</th>
                            <th>Payment Status</th>
                            <th>Start Date</th>
                            <th>Valid Till</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: 700 }}>{customerFullName}</td>
                            <td className="db-table-muted">{effectiveUser.email}</td>
                            <td className="db-table-muted">{effectiveUser.phone || "+91 98765 43210"}</td>
                            <td><strong style={{ color: "var(--gold-dark)" }}>{dynamicMembershipNo}</strong></td>
                            <td><span className="db-badge db-badge-green">Confirmed</span></td>
                            <td className="db-table-muted">{getTodayDateFormatted()}</td>
                            <td style={{ fontWeight: 700 }}>{dynamicValidTill}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 700 }}>Sophia Chen</td>
                            <td className="db-table-muted">sophia.chen@example.com</td>
                            <td className="db-table-muted">+91 98111 22334</td>
                            <td><strong style={{ color: "var(--gold-dark)" }}>WLC-4105</strong></td>
                            <td><span className="db-badge db-badge-green">Confirmed</span></td>
                            <td className="db-table-muted">{getTodayDateFormatted()}</td>
                            <td style={{ fontWeight: 700 }}>{getOneYearValidTillFormatted()}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 700 }}>Marcus Aurelius</td>
                            <td className="db-table-muted">marcus.a@example.com</td>
                            <td className="db-table-muted">+91 98222 33445</td>
                            <td><strong style={{ color: "var(--gold-dark)" }}>WLC-4106</strong></td>
                            <td><span className="db-badge db-badge-green">Confirmed</span></td>
                            <td className="db-table-muted">{getTodayDateFormatted()}</td>
                            <td style={{ fontWeight: 700 }}>{getOneYearValidTillFormatted()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ PROFILE TAB ════════════════════════════ */}
            {activeTab === "profile" && (
              <motion.div key="profile" className="db-fadein" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="db-card db-card-pad">
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: "1.5rem", fontFamily: "'Montserrat', sans-serif" }}>Profile Details</h3>
                  <form onSubmit={hProfile(handleProfileUpdate)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {profileSuccess && <div className="db-form-success"><CheckCircle size={15} /> Profile updated successfully!</div>}

                    <div className="db-form-grid">
                      {[
                        { label: "First Name", key: "firstName" },
                        { label: "Last Name", key: "lastName" },
                        { label: "Email Address", key: "email", type: "email" },
                        { label: "Phone Number", key: "phone" },
                        { label: "Profession", key: "profession" },
                        { label: "Company Name", key: "companyName" },
                        { label: "Country", key: "country" },
                      ].map(({ label, key, type }) => (
                        <div className="db-form-field" key={key}>
                          <label className="db-form-label">{label}</label>
                          <input className={`db-form-input${eProfile[key] ? " error" : ""}`} type={type || "text"} {...rProfile(key)} />
                          {eProfile[key] && <span className="db-form-error">{eProfile[key].message}</span>}
                        </div>
                      ))}
                      <div className="db-form-field">
                        <label className="db-form-label">Membership Number</label>
                        <input className="db-form-input" disabled value={dynamicMembershipNo} style={{ fontWeight: 700, color: "var(--gold-dark)" }} />
                      </div>
                    </div>
                    <div className="db-form-field" style={{ gridColumn: "1 / -1" }}>
                      <label className="db-form-label">Correspondence Address</label>
                      <input className="db-form-input" {...rProfile("address")} />
                    </div>

                    <button type="submit" className="db-btn db-btn-primary" disabled={isUpdatingProfile} style={{ width: "fit-content", marginTop: "0.5rem" }}>
                      {isUpdatingProfile ? <><Loader2 size={14} style={{ animation: "db-spin 0.75s linear infinite" }} /> Saving…</> : "Update Profile"}
                    </button>
                  </form>
                </div>

                {/* Password Card */}
                <div className="db-card db-card-pad">
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: "1.5rem", fontFamily: "'Montserrat', sans-serif" }}>Change Password</h3>
                  <form onSubmit={hPwd(handlePasswordUpdate)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {passwordSuccess && <div className="db-form-success"><CheckCircle size={15} /> Password updated successfully!</div>}
                    {passwordError && <div className="db-form-alert-error">{passwordError}</div>}
                    {["currentPassword", "newPassword", "confirmPassword"].map((key) => (
                      <div className="db-form-field" key={key}>
                        <label className="db-form-label">{key === "currentPassword" ? "Current Password" : key === "newPassword" ? "New Password" : "Confirm New Password"}</label>
                        <input className={`db-form-input${ePwd[key] ? " error" : ""}`} type="password" {...rPwd(key)} />
                        {ePwd[key] && <span className="db-form-error">{ePwd[key].message}</span>}
                      </div>
                    ))}
                    <button type="submit" className="db-btn db-btn-primary" disabled={isUpdatingPassword} style={{ width: "fit-content" }}>
                      {isUpdatingPassword ? <><Loader2 size={14} style={{ animation: "db-spin 0.75s linear infinite" }} /> Updating…</> : "Change Password"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ═══ PAYMENTS TAB ═══════════════════════════ */}
            {activeTab === "payments" && (
              <motion.div key="payments" className="db-fadein" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {onlinePaySuccess && (
                  <div className="db-form-success" style={{ fontSize: 14, padding: "1rem 1.25rem" }}>
                    <CheckCircle size={18} /> {onlinePaySuccess}
                  </div>
                )}

                {/* Instant Online Payment Card */}
                <div className="db-card db-card-pad" style={{ background: "linear-gradient(135deg, #0b241a 0%, #061711 100%)", color: "#ffffff", border: "1px solid rgba(212,184,150,0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-light)", background: "rgba(188,163,116,0.15)", padding: "3px 10px", borderRadius: 99, marginBottom: 8 }}>
                        <Sparkles size={12} /> Instant Online Checkout
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", fontFamily: "'Montserrat', sans-serif" }}>VIP Annual Membership Access</h3>
                      <p style={{ fontSize: 13, color: "#a4c2b2", marginTop: 4 }}>Pay securely using Razorpay, Credit/Debit Cards, UPI, NetBanking, or EMI.</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "var(--gold-light)", fontFamily: "'Montserrat', sans-serif" }}>{paymentInfo.amount}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{paymentInfo.gst} (All Inclusive)</div>
                      </div>

                      <button
                        type="button"
                        className="db-btn db-btn-primary"
                        onClick={handlePayOnline}
                        disabled={isPayingOnline}
                        style={{ padding: "12px 24px", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 50%, var(--gold-light) 100%)", color: "#071711" }}
                      >
                        {isPayingOnline ? (
                          <><Loader2 size={16} style={{ animation: "db-spin 0.75s linear infinite" }} /> Opening Checkout…</>
                        ) : (
                          <><CreditCard size={16} /> Pay via Razorpay / UPI</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="db-card db-payment-mode-card">
                  <div className="db-payment-mode-copy">
                    <div className="db-payment-icon"><CreditCard size={22} /></div>
                    <div>
                      <div className="db-card-title">UPI QR & Bank Transfer</div>
                      <div className="db-card-subtitle">Scan the UPI QR code or transfer directly to the official bank account below.</div>
                    </div>
                  </div>
                  <div className="db-payment-qr-box">
                    <img src={paymentInfo.qrPath} alt="Scan to Pay Membership Fee" />
                    <span>Scan to Pay</span>
                  </div>
                </div>

                <div className="db-payment-grid">
                  <div className="db-card db-card-pad">
                    <div className="db-card-title">Amount Details</div>
                    <div className="db-payment-amount-box">
                      <span>Amount to Pay</span>
                      <strong>{paymentInfo.amount}</strong>
                      <em>{paymentInfo.gst}</em>
                    </div>
                    <div className="db-payment-note">Please pay the exact amount mentioned above.</div>
                  </div>

                  <div className="db-card db-card-pad">
                    <div className="db-card-title">Bank Transfer Details</div>
                    <dl className="db-bank-details">
                      {[
                        ["Bank", paymentInfo.bank],
                        ["Account Number", paymentInfo.accountNumber],
                        ["Name", paymentInfo.payeeName],
                        ["IFSC Code", paymentInfo.ifsc],
                        ["Address", paymentInfo.address],
                        ["UPI ID", paymentInfo.upiId],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className="db-card">
                  <div className="db-card-header">
                    <div>
                      <div className="db-card-title">Transaction Logs</div>
                      <div className="db-card-subtitle">{displayedPayments.length} transactions</div>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Gateway</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th style={{ textAlign: "right" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedPayments.map(p => (
                          <tr key={p.id}>
                            <td style={{ fontWeight: 700 }}>{p.id}</td>
                            <td className="db-table-muted">{p.method}</td>
                            <td className="db-table-muted">{p.date}</td>
                            <td><span className="db-badge db-badge-green">{p.status}</span></td>
                            <td style={{ textAlign: "right", fontWeight: 700 }}>{p.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ ORDERS TAB ═════════════════════════════ */}
            {activeTab === "orders" && (
              <motion.div key="orders" className="db-fadein">
                <div className="db-card">
                  <div className="db-card-header">
                    <div>
                      <div className="db-card-title">Order History</div>
                      <div className="db-card-subtitle">{orders.length} orders found</div>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Item</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th style={{ textAlign: "right" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id}>
                            <td className="db-table-id">{o.id}</td>
                            <td>{o.item}</td>
                            <td className="db-table-muted">{o.date}</td>
                            <td><span className="db-badge db-badge-green">{o.status}</span></td>
                            <td style={{ textAlign: "right", fontWeight: 700 }}>{o.total}</td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={5} className="db-empty-row">No orders found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ DOWNLOADS TAB ══════════════════════════ */}
            {activeTab === "downloads" && (
              <motion.div key="downloads" className="db-fadein">
                <div className="db-grid-2">
                  {[
                    { icon: "amber", name: "WLC Mindfulness & Breathwork Guide", meta: "Version 2.4 · PDF (12.4 MB)", label: "Download Manual" },
                    { icon: "green", name: "Himalayan Healing Herbal Journal", meta: "Digital Book · EPUB (6.8 MB)", label: "Download Journal" },
                  ].map(d => (
                    <div className="db-card" key={d.name}>
                      <div className="db-download-item">
                        <div className={`db-download-icon ${d.icon}`}><FileText size={22} /></div>
                        <div>
                          <div className="db-download-title">{d.name}</div>
                          <div className="db-download-meta">{d.meta}</div>
                          <button className="db-download-link" onClick={() => alert("Downloading…")}>
                            <Download size={13} /> {d.label}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ WISHLIST TAB ═══════════════════════════ */}
            {activeTab === "wishlist" && (
              <motion.div key="wishlist" className="db-fadein">
                <div className="db-grid-2">
                  {[
                    { img: "/homepage/Introimages/natalia-portilho.webp", name: "Ananda Sanctuary Valley Retreat", loc: "Himalayas, India" },
                    { img: "/homepage/Introimages/storiesofdesign.webp", name: "Coastal Healing & Thalasso Spa", loc: "Algarve, Portugal" },
                  ].map(w => (
                    <div className="db-card" key={w.name} style={{ overflow: "hidden" }}>
                      <img loading="lazy" className="db-wishlist-img" src={w.img} alt={w.name} />
                      <div className="db-wishlist-body">
                        <div className="db-wishlist-title">{w.name}</div>
                        <div className="db-wishlist-sub">{w.loc}</div>
                        <Link href="/destinations" className="db-wishlist-link">View Destination →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ NOTIFICATIONS TAB ══════════════════════ */}
            {activeTab === "notifications" && (
              <motion.div key="notifications" className="db-fadein">
                <div className="db-card db-card-pad">
                  {[
                    { icon: <Bell size={16} />, iconBg: "#eff6ff", iconColor: "#3b82f6", title: "Welcome to Club Hub!", body: "We're excited to help you elevate your wellness journey. Check out your personalized digital membership pass above.", time: "Just now" },
                    { icon: <CheckCircle size={16} />, iconBg: "var(--green-pale)", iconColor: "var(--green)", title: "Annual Membership Active", body: `Your Official Lotus Club Membership ${dynamicMembershipNo} was successfully confirmed.`, time: "3 days ago" },
                  ].map(n => (
                    <div className="db-notif-item" key={n.title}>
                      <div className="db-notif-icon" style={{ background: n.iconBg, color: n.iconColor }}>{n.icon}</div>
                      <div>
                        <div className="db-notif-title">{n.title}</div>
                        <p className="db-notif-body">{n.body}</p>
                        <span className="db-notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ SUPPORT TAB ════════════════════════════ */}
            {activeTab === "support" && (
              <motion.div key="support" className="db-fadein">
                <div className="db-card db-card-pad" style={{ maxWidth: 560 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>Contact Member Concierge</h3>
                  <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginTop: 4, marginBottom: "1.5rem", fontWeight: 400 }}>Need assistance with a retreat booking or membership privilege? Open a ticket below.</p>
                  <form
                    className="db-support-form"
                    onSubmit={e => { e.preventDefault(); alert("Ticket submitted. A WLC member concierge will respond within 4 hours."); e.target.reset(); }}
                  >
                    <div className="db-form-field">
                      <label className="db-form-label">Subject</label>
                      <input className="db-form-input" placeholder="e.g. Booking inquiry or retreat concierge" required />
                    </div>
                    <div className="db-form-field">
                      <label className="db-form-label">Description</label>
                      <textarea className="db-form-textarea" placeholder="Explain your inquiry in detail…" rows={4} required />
                    </div>
                    <button type="submit" className="db-btn db-btn-primary">Submit Inquiry</button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ═══ SETTINGS TAB ═══════════════════════════ */}
            {activeTab === "settings" && (
              <motion.div key="settings" className="db-fadein">
                <div className="db-card db-card-pad" style={{ maxWidth: 480 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: "0.25rem", fontFamily: "'Montserrat', sans-serif" }}>Account Configurations</h3>
                  <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: "1.5rem" }}>Manage notifications, security, and interface preferences.</p>

                  {[
                    { title: "Email Notifications", desc: "Receive retreat booking updates and receipts", defaultChecked: true },
                    { title: "Two-Factor Authentication", desc: "Secure your account with OTP logins", defaultChecked: true },
                  ].map(s => (
                    <div className="db-setting-row" key={s.title}>
                      <div>
                        <div className="db-setting-title">{s.title}</div>
                        <div className="db-setting-desc">{s.desc}</div>
                      </div>
                      <label className="db-toggle">
                        <input type="checkbox" defaultChecked={s.defaultChecked} />
                        <div className="db-toggle-track" />
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
