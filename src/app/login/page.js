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

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    try {
      await login(data.usernameOrEmail, data.password, data.rememberMe);
      router.push("/dashboard");
    } catch (err) {
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
    <div style={{
      minHeight: "100vh", width: "100%", position: "relative",
      backgroundImage: "url('/images/buddha-bg.webp')", backgroundSize: "cover",
      backgroundPosition: "center", backgroundAttachment: "fixed",
      display: "flex", justifyContent: "center", alignItems: "center",
      padding: "3rem 1.5rem",
    }}>
      {/* Overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 0 }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 1, display: "flex", width: "100%", maxWidth: 900,
        borderRadius: 16, boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>

        {/* Left Panel */}
        <div style={{
          width: "45%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(24px)",
          padding: "4rem 3.5rem", display: "flex", flexDirection: "column", justifyContent: "center",
          borderRadius: "16px 0 0 16px", overflow: "hidden", flexShrink: 0,
        }}>
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
        <div style={{
          flex: 1, background: "#080c09", padding: "3.5rem 3rem",
          borderRadius: "0 16px 16px 0", display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Sign In</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {apiError && (
              <div style={{
                padding: "10px 14px", background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8,
                fontSize: 12, color: "#f87171", textAlign: "center",
              }}>
                {apiError}
              </div>
            )}

            <FieldInput
              label="Username or Email Address"
              type="text"
              placeholder="e.g. aria@example.com or aria_username"
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

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => alert("Google sign-in configured for WordPress integration.")}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => alert("Facebook sign-in configured for WordPress integration.")}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Footer link */}
            <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              New to the Club?{" "}
              <Link href="/register" style={{ color: "#0f8554", fontWeight: 700, textDecoration: "none" }}>
                Become a member
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  );
}
