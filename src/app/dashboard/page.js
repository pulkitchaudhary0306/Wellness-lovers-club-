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
  CheckCircle, FileText, Calendar, Loader2
} from "lucide-react";
import { authService } from "@/services/authService";
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
  { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { id: "profile",       label: "My Profile",    icon: UserIcon },
  { id: "membership",    label: "Membership",    icon: Award },
  { id: "orders",        label: "Orders",        icon: ShoppingBag },
  { id: "payments",      label: "Payments",      icon: CreditCard },
  { id: "downloads",     label: "Downloads",     icon: Download },
  { id: "wishlist",      label: "Wishlist",      icon: Heart },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "support",       label: "Support",       icon: LifeBuoy },
  { id: "settings",      label: "Settings",      icon: SettingsIcon },
];

/* ─── Sidebar Nav ────────────────────────────────────────── */
function SidebarNav({ activeTab, setActiveTab, onLogout, onClose }) {
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
      <button className="db-logout-btn" onClick={onLogout}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>
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

  const { register: rProfile, handleSubmit: hProfile, setValue: sProfile, formState: { errors: eProfile } } = useForm({ resolver: zodResolver(profileSchema) });
  const { register: rPwd, handleSubmit: hPwd, reset: resetPwd, formState: { errors: ePwd } } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });

  useEffect(() => { if (!loading && !isAuthenticated) router.push("/login"); }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      sProfile("firstName", user.firstName || "");
      sProfile("lastName", user.lastName || "");
      sProfile("email", user.email || "");
      sProfile("phone", user.phone || "");
      sProfile("profession", user.profession || "");
      sProfile("companyName", user.companyName || "");
      sProfile("country", user.country || "");
      sProfile("address", user.address || "");
    }
  }, [user, sProfile]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        setOrders(await authService.getOrders());
        setPayments(await authService.getPayments());
        setMemberships(await authService.getMemberships());
      } catch (e) { console.error(e); }
    })();
  }, [isAuthenticated]);

  if (loading || !user) {
    return (
      <div className="db-loading">
        <div className="db-loading-spinner" />
        <p className="db-loading-text">Syncing your membership…</p>
      </div>
    );
  }

  const handleLogout = () => { router.push("/logout"); };

  const handleProfileUpdate = async (data) => {
    setIsUpdatingProfile(true);
    try { await updateProfile(data); setProfileSuccess(true); setTimeout(() => setProfileSuccess(false), 3000); }
    catch (e) { alert("Update failed: " + e.message); }
    finally { setIsUpdatingProfile(false); }
  };

  const handlePasswordUpdate = async () => {
    setIsUpdatingPassword(true);
    try { await authService.changePassword(); setPasswordSuccess(true); resetPwd(); setTimeout(() => setPasswordSuccess(false), 3000); }
    catch (e) { setPasswordError(e.message || "Failed to update password."); }
    finally { setIsUpdatingPassword(false); }
  };

  const currentLabel = menuItems.find(i => i.id === activeTab)?.label || "";

  return (
    <div className="db-root">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="db-sidebar">
        <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile Overlay + Drawer ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="db-drawer-overlay"
              style={{ display: "block" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              style={{ display: "flex", position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: "var(--sidebar-bg)", zIndex: 49, padding: "2rem 1.25rem", flexDirection: "column" }}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
              <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} onClose={() => setMobileOpen(false)} />
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
            <p>Wellness Lovers Club · Member Portal</p>
          </div>
          <div className="db-topbar-right">
            <div className="db-topbar-avatar-pill">
              <UserIcon size={18} style={{ marginRight: 8, opacity: 0.7 }} />
              <div>
                <div className="db-topbar-avatar-name">{user.firstName} {user.lastName}</div>
                <div className="db-topbar-avatar-status">{user.membershipStatus}</div>
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

            {/* ═══ DASHBOARD TAB ══════════════════════════ */}
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" className="db-fadein" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

                {/* Welcome Banner */}
                <div className="db-welcome-banner">
                  <div className="db-welcome-bg" style={{ backgroundImage: "url('/images/eb9fb38adaf4e895f43ef0798cf67c3a.webp')" }} />
                  <div className="db-welcome-gradient" />
                  <div className="db-welcome-content">
                    <span className="db-welcome-eyebrow">Welcome back</span>
                    <h2 className="db-welcome-title">Elevated Wellness,<br />Mindfully Yours</h2>
                    <p className="db-welcome-body">You have an active Premium Lotus Club membership. Access wellness journals and book retreats below.</p>
                    <span className="db-welcome-badge">
                      <Award size={12} />
                      {user.membershipTier || "Premium Lotus Club"}
                    </span>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="db-stats-grid">
                  <div className="db-stat-card">
                    <div className="db-stat-icon gold"><Award size={22} /></div>
                    <div>
                      <div className="db-stat-label">Membership Tier</div>
                      <div className="db-stat-value">{user.membershipTier || "Lotus Club"}</div>
                    </div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-icon green"><ShoppingBag size={22} /></div>
                    <div>
                      <div className="db-stat-label">Total Orders</div>
                      <div className="db-stat-value">{orders.length} Completed</div>
                    </div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-icon amber"><Calendar size={22} /></div>
                    <div>
                      <div className="db-stat-label">Next Renewal</div>
                      <div className="db-stat-value">April 28, 2027</div>
                    </div>
                  </div>
                </div>

                {/* Promo Card */}
                <div className="db-card">
                  <div className="db-promo-card">
                    <img loading="lazy" src="/homepage/Introimages/pexels-cottonbro.webp" className="db-promo-img" alt="Retreat" />
                    <div>
                      <div className="db-promo-eyebrow">Longevity Highlight</div>
                      <div className="db-promo-title">Summer Solstice Himalayan Sanctuary</div>
                      <p className="db-promo-text">Unlock 15% Member-only preferred rates for the holistic 7-day Ayurvedic detoxification retreat at our Himalayan sanctuary in June.</p>
                      <button className="db-btn db-btn-outline" style={{ marginTop: "1rem" }}>Explore Member Rates</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ PROFILE TAB ════════════════════════════ */}
            {activeTab === "profile" && (
              <motion.div key="profile" className="db-fadein" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Profile Form */}
                <div className="db-card db-card-pad">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.5rem" }}>Profile Details</h3>
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
                        <label className="db-form-label">Membership Status</label>
                        <input className="db-form-input" disabled value={user.membershipStatus} />
                      </div>
                    </div>
                    <div className="db-form-field" style={{ gridColumn: "1 / -1" }}>
                      <label className="db-form-label">Address</label>
                      <input className="db-form-input" {...rProfile("address")} />
                    </div>

                    <button type="submit" className="db-btn db-btn-primary" disabled={isUpdatingProfile} style={{ width: "fit-content", marginTop: "0.5rem" }}>
                      {isUpdatingProfile ? <><Loader2 size={14} style={{ animation: "db-spin 0.75s linear infinite" }} /> Saving…</> : "Update Profile"}
                    </button>
                  </form>
                </div>

                {/* Password Card */}
                <div className="db-card db-card-pad">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.5rem" }}>Change Password</h3>
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

            {/* ═══ MEMBERSHIP TAB ═════════════════════════ */}
            {activeTab === "membership" && (
              <motion.div key="membership" className="db-fadein" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {memberships.map((m) => (
                  <div key={m.id} className="db-card db-card-pad">
                    <div className="db-membership-card-top">
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div className="db-membership-tier-icon"><Award size={26} /></div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: 4 }}>Active Subscription</div>
                          <div className="db-membership-tier-name">{m.tier}</div>
                        </div>
                      </div>
                      <span className="db-badge db-badge-green">{m.status}</span>
                    </div>
                    <div className="db-membership-meta-grid">
                      {[["Start Date", m.startDate], ["Renewal Date", m.endDate], ["Rate Price", m.price], ["Billing Cycle", m.billingCycle]].map(([k, v]) => (
                        <div className="db-membership-meta-item" key={k}>
                          <span>{k}</span>
                          <span>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button className="db-btn db-btn-primary">Manage Subscription</button>
                      <button className="db-btn db-btn-outline">View Tier Privileges</button>
                    </div>
                  </div>
                ))}
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ PAYMENTS TAB ═══════════════════════════ */}
            {activeTab === "payments" && (
              <motion.div key="payments" className="db-fadein">
                <div className="db-card">
                  <div className="db-card-header">
                    <div>
                      <div className="db-card-title">Transaction Logs</div>
                      <div className="db-card-subtitle">{payments.length} transactions</div>
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
                        {payments.map(p => (
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
                    { icon: <Bell size={16} />, iconBg: "#eff6ff", iconColor: "#3b82f6", title: "Welcome to Club Hub!", body: "We're excited to help you elevate your wellness journey. Check out the Himalayan Sanctuary special rates in the dashboard.", time: "2 hours ago" },
                    { icon: <CheckCircle size={16} />, iconBg: "var(--green-pale)", iconColor: "var(--green)", title: "Annual Membership Active", body: "Your Premium Lotus Club Annual Membership of $350.00 was successfully processed through PayPal.", time: "3 days ago" },
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
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>Contact Support</h3>
                  <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 4, marginBottom: "1.5rem", fontWeight: 300 }}>Need help with a booking or billing? Open a ticket below.</p>
                  <form
                    className="db-support-form"
                    onSubmit={e => { e.preventDefault(); alert("Ticket submitted. A WLC representative will respond within 4 hours."); e.target.reset(); }}
                  >
                    <div className="db-form-field">
                      <label className="db-form-label">Subject</label>
                      <input className="db-form-input" placeholder="e.g. Booking inquiry" required />
                    </div>
                    <div className="db-form-field">
                      <label className="db-form-label">Description</label>
                      <textarea className="db-form-textarea" placeholder="Explain your inquiry in detail…" rows={4} required />
                    </div>
                    <button type="submit" className="db-btn db-btn-primary">Submit Ticket</button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ═══ SETTINGS TAB ═══════════════════════════ */}
            {activeTab === "settings" && (
              <motion.div key="settings" className="db-fadein">
                <div className="db-card db-card-pad" style={{ maxWidth: 460 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "0.25rem" }}>Account Configurations</h3>
                  <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: "1.5rem" }}>Manage notifications, security, and interface preferences.</p>

                  {[
                    { title: "Email Notifications", desc: "Receive booking updates and receipts", defaultChecked: true },
                    { title: "Two-Factor Authentication", desc: "Secure your account with OTP logins", defaultChecked: false },
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

                  <div className="db-setting-row">
                    <div>
                      <div className="db-setting-title">System Theme</div>
                      <div className="db-setting-desc">Switch dark and light UI</div>
                    </div>
                    <select style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, fontWeight: 600, padding: "5px 10px", outline: "none", cursor: "pointer" }}>
                      <option>Light Mode</option>
                      <option>Dark Mode</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
