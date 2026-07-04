"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ChevronDown, Check, Loader2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Mobile number is required").regex(/^\+?[0-9\s\-()]{7,15}$/, "Enter a valid phone number"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  profession: z.string().min(1, "Profession is required"),
  companyName: z.string().optional(),
  correspondenceAddress: z.string().min(1, "Address is required"),
  preferences: z.array(z.string()).min(1, "Select at least one preference"),
  password: z.string().min(8, "Min 8 characters").regex(/[A-Z]/, "Needs uppercase").regex(/[0-9]/, "Needs number").regex(/[^A-Za-z0-9]/, "Needs special char"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to Terms & Conditions" }) }),
  subscribeNewsletter: z.boolean().default(false),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

const PREFERENCE_OPTIONS = [
  "Curated Wellness Retreats",
  "Spa Offerings",
  "Masterclass with Wellness Experts",
  "Curated Wellness Cuisine Offerings",
  "Salon Offerings",
  "Beauty Products Offerings",
];

function FieldInput({ label, error, type = "text", placeholder, ...rest }) {
  const [showPwd, setShowPwd] = useState(false);
  const isPwd = type === "password";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={isPwd ? (showPwd ? "text" : "password") : type}
          placeholder={placeholder || "Your answer"}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: error ? "1.5px solid #f87171" : "1.25px solid rgba(255,255,255,0.2)",
            borderRadius: 0,
            padding: isPwd ? "8px 32px 8px 0" : "8px 0",
            fontSize: 13,
            color: "#fff",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={e => { e.target.style.borderBottomColor = "#0f8554"; }}
          onBlur={e => { e.target.style.borderBottomColor = error ? "#f87171" : "rgba(255,255,255,0.2)"; }}
          {...rest}
        />
        {isPwd && (
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2 }}
          >
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: 10, color: "#f87171" }}>{error}</span>}
    </div>
  );
}

export default function RegisterPage() {
  const { isAuthenticated, user, logout, register: signup } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("register");
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", phone: "", email: "", profession: "", companyName: "", correspondenceAddress: "", preferences: [], password: "", confirmPassword: "", agreeTerms: false, subscribeNewsletter: false },
  });

  useEffect(() => { register("preferences"); }, [register]);

  const togglePref = (opt, checked) => {
    let next = [...selectedPrefs];
    if (opt === "All Of The Above") {
      next = checked ? [...PREFERENCE_OPTIONS, "All Of The Above"] : [];
    } else {
      if (checked) {
        next.push(opt);
        if (PREFERENCE_OPTIONS.every(o => next.includes(o))) next.push("All Of The Above");
      } else {
        next = next.filter(p => p !== opt && p !== "All Of The Above");
      }
    }
    setSelectedPrefs(next);
    setValue("preferences", next, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    const parts = data.name.trim().split(/\s+/);
    try {
      await signup({ ...data, firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" });
      router.push("/verify-otp");
    } catch (err) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1.25px solid rgba(255,255,255,0.2)", borderRadius: 0,
    padding: "8px 0", fontSize: 13, color: "#fff", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", position: "relative",
      backgroundImage: "url('/images/buddha-bg.jpg')", backgroundSize: "cover",
      backgroundPosition: "center", backgroundAttachment: "fixed",
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      padding: "3rem 1.5rem 4rem",
    }}>
      {/* Overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 0 }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 1, display: "flex", width: "100%", maxWidth: 960,
        borderRadius: 16, overflow: "visible",
        boxShadow: "0 30px 70px rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.08)",
        marginTop: "2rem",
      }}>

        {/* Left Panel */}
        <div style={{
          width: "42%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(24px)",
          padding: "4rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center",
          borderRadius: "16px 0 0 16px", overflow: "hidden", flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0f8554", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Wellness Lovers Club
          </div>
          <h2 style={{ fontFamily: "Arial, sans-serif", fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Let&apos;s Get<br />Started
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
            Join the Wellness Lovers Club to unlock exclusive wellness privileges, priority bookings at luxury recovery sanctuaries, and tailored longevity guides.
          </p>
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["Exclusive Wellness Retreats", "Priority Spa Bookings", "Expert Masterclasses", "Personalized Longevity Plans"].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(15,133,84,0.2)", border: "1px solid #0f8554", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={10} color="#0f8554" />
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{
          flex: 1, background: "#080c09", padding: "3rem 2.5rem",
          borderRadius: "0 16px 16px 0", display: "flex", flexDirection: "column",
          position: "relative",
        }}>
          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 4, marginBottom: "1.75rem" }}>
            {["register", "login"].map(tab => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: "8px 0", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                borderRadius: 6, border: "none", cursor: "pointer",
                background: activeTab === tab ? "#0f8554" : "rgba(255,255,255,0.06)",
                color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.45)",
                transition: "all 0.2s",
              }}>
                {tab === "register" ? "Become a Member" : "Sign In"}
              </button>
            ))}
          </div>

          {activeTab === "login" ? (
            <LoginPanel onSwitchToRegister={() => setActiveTab("register")} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {apiError && (
                <div style={{ padding: "10px 14px", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, fontSize: 12, color: "#f87171", textAlign: "center" }}>
                  {apiError}
                </div>
              )}

              {/* 2-col grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem 1.5rem" }}>
                <FieldInput label="Full Name" error={errors.name?.message} {...register("name")} />
                <FieldInput label="Mobile Number" type="tel" error={errors.phone?.message} {...register("phone")} />
                <FieldInput label="Email Address" type="email" error={errors.email?.message} {...register("email")} />
                <FieldInput label="Profession" error={errors.profession?.message} {...register("profession")} />
                <FieldInput label="Company Name (Optional)" error={errors.companyName?.message} {...register("companyName")} />
                <FieldInput label="Correspondence Address" error={errors.correspondenceAddress?.message} {...register("correspondenceAddress")} />
                <FieldInput label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special" error={errors.password?.message} {...register("password")} />
                <FieldInput label="Confirm Password" type="password" placeholder="Re-enter password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
              </div>

              {/* Preferences dropdown — full width */}
              <div style={{ position: "relative", gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Preferences
                </label>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(v => !v)}
                  style={{
                    width: "100%", background: "transparent", border: "none",
                    borderBottom: errors.preferences ? "1.5px solid #f87171" : "1.25px solid rgba(255,255,255,0.2)",
                    borderRadius: 0, padding: "8px 0", fontSize: 13, color: "#fff",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", outline: "none",
                  }}
                >
                  <span style={{ color: selectedPrefs.length === 0 ? "rgba(255,255,255,0.3)" : "#fff" }}>
                    {selectedPrefs.length === 0 ? "Choose your preferences" :
                      selectedPrefs.includes("All Of The Above") ? "All Of The Above" :
                        selectedPrefs.join(", ")}
                  </span>
                  <ChevronDown size={15} color="rgba(255,255,255,0.4)" style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {errors.preferences && <span style={{ fontSize: 10, color: "#f87171" }}>{errors.preferences.message}</span>}

                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                    background: "#0d1410", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "12px", zIndex: 999,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                    display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    {PREFERENCE_OPTIONS.map(opt => (
                      <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "3px 0" }}>
                        <input
                          type="checkbox"
                          checked={selectedPrefs.includes(opt)}
                          onChange={e => togglePref(opt, e.target.checked)}
                          style={{ accentColor: "#0f8554", width: 14, height: 14, cursor: "pointer" }}
                        />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{opt}</span>
                      </label>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 4, paddingTop: 8 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={selectedPrefs.includes("All Of The Above")}
                          onChange={e => togglePref("All Of The Above", e.target.checked)}
                          style={{ accentColor: "#0f8554", width: 14, height: 14, cursor: "pointer" }}
                        />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>All Of The Above</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.25rem" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" {...register("agreeTerms")} style={{ accentColor: "#0f8554", width: 14, height: 14, marginTop: 1, cursor: "pointer", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                    I agree to the{" "}
                    <Link href="#" style={{ color: "#0f8554", fontWeight: 600, textDecoration: "none" }}>Terms &amp; Conditions</Link>
                  </span>
                </label>
                {errors.agreeTerms && <span style={{ fontSize: 10, color: "#f87171", marginLeft: 24 }}>{errors.agreeTerms.message}</span>}

                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" {...register("subscribeNewsletter")} style={{ accentColor: "#0f8554", width: 14, height: 14, marginTop: 1, cursor: "pointer", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                    Subscribe to Newsletter for luxury updates
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%", background: "#0f8554", color: "#fff",
                  border: "none", borderRadius: 6, padding: "13px 24px",
                  fontSize: 13, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1, marginTop: "0.5rem",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { if (!isLoading) e.target.style.background = "#0d7348"; }}
                onMouseLeave={e => { e.target.style.background = "#0f8554"; }}
              >
                {isLoading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Please wait...</> : "Become a Member"}
              </button>

              {/* Divider + Social */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0.25rem 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => alert("Google signup configured for WordPress.")} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 12, fontWeight: 500,
                  cursor: "pointer",
                }}>
                  <svg viewBox="0 0 24 24" width="16" height="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" onClick={() => alert("Facebook signup configured for WordPress.")} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 12, fontWeight: 500,
                  cursor: "pointer",
                }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
                  Facebook
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus, input[type="password"]:focus { border-bottom-color: #0f8554 !important; }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}

// ---- Inline Login Panel ----
function LoginPanel({ onSwitchToRegister }) {
  const { login } = useAuth();
  const router = useRouter();
  const loginSchema = z.object({
    email: z.string().min(1, "Email required").email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
    rememberMe: z.boolean().default(false),
  });
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "", rememberMe: false } });

  const onSubmit = async (data) => {
    setIsLoading(true); setApiError("");
    try { await login(data.email, data.password, data.rememberMe); router.push("/dashboard"); }
    catch (err) { setApiError(err.message || "Invalid credentials."); }
    finally { setIsLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {apiError && <div style={{ padding: "10px 14px", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, fontSize: 12, color: "#f87171", textAlign: "center" }}>{apiError}</div>}
      <FieldInput label="Email Address" type="email" error={errors.email?.message} {...register("email")} />
      <FieldInput label="Password" type="password" error={errors.password?.message} {...register("password")} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" {...register("rememberMe")} style={{ accentColor: "#0f8554", width: 13, height: 13 }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Remember Me</span>
        </label>
        <Link href="/forgot-password" style={{ fontSize: 11, color: "#0f8554", textDecoration: "none" }}>Forgot Password?</Link>
      </div>
      <button type="submit" disabled={isLoading} style={{ width: "100%", background: "#0f8554", color: "#fff", border: "none", borderRadius: 6, padding: "13px 24px", fontSize: 13, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {isLoading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Please wait...</> : "Sign In"}
      </button>
      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: "0.5rem" }}>
        New to the Club?{" "}
        <button type="button" onClick={onSwitchToRegister} style={{ background: "none", border: "none", color: "#0f8554", fontWeight: 700, cursor: "pointer", fontSize: 11, padding: 0 }}>
          Become a member
        </button>
      </p>
    </form>
  );
}
