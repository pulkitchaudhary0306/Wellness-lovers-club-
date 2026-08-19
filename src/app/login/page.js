"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Award, ArrowRight, Check } from "lucide-react";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

function PasswordInput({ error, ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        style={{
          width: "100%", background: "transparent", border: "none",
          borderBottom: error ? "1.5px solid #f87171" : "1.25px solid rgba(255,255,255,0.2)",
          borderRadius: 0, padding: "8px 32px 8px 0",
          fontSize: 13, color: "#fff", outline: "none", boxSizing: "border-box",
        }}
        onFocus={e => { e.target.style.borderBottomColor = "#0f8554"; }}
        onBlur={e => { e.target.style.borderBottomColor = error ? "#f87171" : "rgba(255,255,255,0.2)"; }}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2 }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

function FieldInput({ label, error, type = "text", ...rest }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      {type === "password" ? (
        <PasswordInput error={error} {...rest} />
      ) : (
        <input
          type={type}
          style={{
            width: "100%", background: "transparent", border: "none",
            borderBottom: error ? "1.5px solid #f87171" : "1.25px solid rgba(255,255,255,0.2)",
            borderRadius: 0, padding: "8px 0",
            fontSize: 13, color: "#fff", outline: "none", boxSizing: "border-box",
          }}
          onFocus={e => { e.target.style.borderBottomColor = "#0f8554"; }}
          onBlur={e => { e.target.style.borderBottomColor = error ? "#f87171" : "rgba(255,255,255,0.2)"; }}
          {...rest}
        />
      )}
      {error && <span style={{ fontSize: 10, color: "#f87171" }}>{error}</span>}
    </div>
  );
}

export default function LoginPage() {
  const { login, isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { usernameOrEmail: "", password: "", rememberMe: false },
  });

  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    try {
      await login(data.usernameOrEmail, data.password, data.rememberMe);
      router.push("/dashboard");
    } catch (err) {
      if (err?.code === "email_not_verified" || err?.code === "phone_not_verified" || err?.code === "EMAIL_NOT_VERIFIED") {
        const unverifiedEmail = err?.email || (data.usernameOrEmail.includes("@") ? data.usernameOrEmail : "");
        if (typeof window !== "undefined" && unverifiedEmail) {
          sessionStorage.setItem("wlc_reg_email", unverifiedEmail);
        }
        router.push("/verify-otp?email=" + encodeURIComponent(unverifiedEmail));
        return;
      }
      setApiError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Already logged in view ── */
  if (isAuthenticated && user) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        backgroundImage: "url('/images/buddha-bg.webp')", backgroundSize: "cover",
        backgroundPosition: "center", backgroundAttachment: "fixed", position: "relative",
      }}>
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        <div style={{
          position: "relative", zIndex: 1,
          background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24,
          padding: "3rem 2.5rem", maxWidth: 460, width: "90%",
          textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem",
        }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(188,163,116,0.1)", border: "1px solid rgba(188,163,116,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={32} color="#bca374" />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>You&apos;re Signed In</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
            Welcome back, <strong style={{ color: "#fff" }}>{user.firstName} {user.lastName}</strong>.<br />
            Your {user.membershipTier || "Lotus Club"} membership is active.
          </p>
          <div style={{ display: "flex", gap: 12, width: "100%" }}>
            <Link href="/dashboard" style={{ flex: 1, textDecoration: "none" }}>
              <button style={{
                width: "100%", background: "linear-gradient(135deg,#bca374,#9c8458)",
                color: "#0f172a", border: "none", borderRadius: 10, padding: "12px",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                Go to Dashboard <ArrowRight size={14} />
              </button>
            </Link>
            <button
              onClick={() => router.push("/logout")}
              style={{
                flex: 1, background: "rgba(255,255,255,0.08)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10,
                padding: "12px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Login form view ── */
  return (
    <div className="auth-page-wrapper">
      {/* Overlay */}
      <div className="auth-overlay" />

      {/* Card */}
      <div className="auth-card-container">

        {/* Left Panel */}
        <div className="auth-left-panel">
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0f8554", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Wellness Lovers Club
          </div>
          <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: "1.25rem" }}>
            Welcome<br />Back
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Sign in to access your exclusive membership benefits, retreat bookings, and personalised wellness programs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["Priority retreat bookings", "Exclusive member rates", "Personalised wellness plans", "Access to expert masterclasses"].map(b => (
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
        <div className="auth-right-panel">
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Sign In</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
              Enter your credentials to access your account
            </p>
          </div>

          {apiError && (
            <div style={{
              padding: "10px 14px", background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8,
              fontSize: 12, color: "#f87171", textAlign: "center", marginBottom: "1.25rem",
            }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onPasswordSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <FieldInput
              label="Email Address or Username"
              type="text"
              placeholder="e.g. aria@example.com"
              error={errors.usernameOrEmail?.message}
              {...register("usernameOrEmail")}
            />

            <FieldInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Remember Me + Forgot Password row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  style={{ accentColor: "#0f8554", width: 14, height: 14, cursor: "pointer" }}
                />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Remember Me</span>
              </label>
              <Link href="/forgot-password" style={{ fontSize: 11, color: "#0f8554", fontWeight: 600, textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", background: "#0f8554", color: "#fff",
                border: "none", borderRadius: 8, padding: "13px 24px",
                fontSize: 14, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.2s", marginTop: "0.25rem",
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#0d7348"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0f8554"; }}
            >
              {isLoading
                ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Signing in…</>
                : "Sign In"
              }
            </button>
          </form>

          <div style={{ marginTop: "2rem" }}>
            <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              New to the Club?{" "}
              <Link href="/membership" style={{ color: "#0f8554", fontWeight: 700, textDecoration: "none" }}>
                Become a member
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  );
}

