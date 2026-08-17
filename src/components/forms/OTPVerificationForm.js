"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const emptySubscribe = () => () => {};

function getStoredClientEmail() {
  if (typeof window === "undefined") return "";
  try {
    const stored = sessionStorage.getItem("wlc_reg_email") || localStorage.getItem("wlc_reg_email");
    if (stored) return stored;
    const params = new URLSearchParams(window.location.search);
    return params.get("email") || params.get("identifier") || "";
  } catch {
    return "";
  }
}

/**
 * OTPVerificationForm
 *
 * Production Email OTP verification form with fully responsive layout,
 * mobile autofill support, and smooth keyboard navigation.
 */
export default function OTPVerificationForm({ isEmbed = false, prefilledEmail = "", prefilledIdentifier = "" }) {
  const { verifyOTP, resendOTP, user } = useAuth();
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [apiError, setApiError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const clientEmail = useSyncExternalStore(emptySubscribe, getStoredClientEmail, () => "");
  const canResend = countdown <= 0;
  const activeEmail = prefilledEmail || prefilledIdentifier || user?.email || clientEmail || "";

  // References to the 6 OTP input boxes
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // 60-second countdown timer for resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (value, index) => {
    // Handle multi-character input (e.g., mobile SMS / email OTP autofill or copy-paste)
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      inputRefs[nextIdx]?.current?.focus();
      return;
    }

    // Single digit entry or clear
    if (value !== "" && !/^[0-9]$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs[index - 1]?.current?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs[index - 1]?.current?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "");
    if (pastedData.length > 0) {
      const digits = pastedData.slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const targetIdx = Math.min(digits.length, 5);
      inputRefs[targetIdx]?.current?.focus();
    }
  };

  const shake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendStatus("Sending new verification code...");
    setApiError("");

    try {
      const targetEmail = activeEmail || (typeof window !== "undefined" ? sessionStorage.getItem("wlc_reg_email") : "") || "";
      await resendOTP(targetEmail);
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setResendStatus("A new 6-digit verification code has been sent to your email.");
      inputRefs[0]?.current?.focus();
    } catch (err) {
      setApiError(err?.message || "Failed to resend verification code.");
      setResendStatus("");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      setApiError("Please enter the full 6-digit verification code.");
      shake();
      return;
    }

    setIsLoading(true);
    setApiError("");
    setResendStatus("");

    try {
      const targetEmail = activeEmail || (typeof window !== "undefined" ? sessionStorage.getItem("wlc_reg_email") : "") || "";
      await verifyOTP(otpCode, targetEmail);

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setApiError(err?.message || "Invalid or expired verification code. Please try again.");
      shake();
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ─── Success state ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={isEmbed ? "otp-card border-0 bg-transparent shadow-none" : "otp-card"}
      >
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="otp-success-icon"
          >
            <CheckCircle2 size={32} />
          </motion.div>
          <h2 className="otp-success-title">Email Verified!</h2>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", fontWeight: 300, lineHeight: "1.6" }}>
            Your account is now verified and active. Redirecting you to your dashboard...
          </p>
        </div>
      </motion.div>
    );
  }

  // ─── OTP form ───────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={isEmbed ? "otp-card border-0 bg-transparent shadow-none" : "otp-card"}
    >
      <div className="otp-header">
        <div className="otp-icon-wrapper">
          <ShieldCheck size={26} style={{ color: "#10b981" }} />
        </div>
        <h2>Verify Your Email</h2>
        <p>
          We&apos;ve sent a 6-digit verification code to
          {activeEmail ? (
            <> <span className="otp-email-badge">{activeEmail}</span></>
          ) : (
            " your email address"
          )}. Enter it below to activate your account.
        </p>
      </div>

      <motion.form
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        onSubmit={handleVerify}
        className="otp-form"
      >
        {apiError && (
          <div className="otp-error-alert">{apiError}</div>
        )}

        {resendStatus && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-medium rounded-lg text-center">
            {resendStatus}
          </div>
        )}

        {/* 6 OTP input boxes */}
        <div className="otp-inputs-container" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`otp-input-field ${digit ? "filled" : ""}`}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${index + 1} of verification code`}
            />
          ))}
        </div>

        {/* Countdown / Resend */}
        <div className="otp-timer-text">
          {!canResend ? (
            <p>
              Resend code in <span className="otp-timer-time">{formatTime(countdown)}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="otp-resend-btn"
            >
              <RefreshCw size={13} />
              Resend Code
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || otp.join("").length < 6}
          className="otp-submit-btn"
        >
          {isLoading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full" />
              Verifying...
            </span>
          ) : (
            "Verify & Continue"
          )}
        </button>

        <div className="otp-footer-links">
          <Link href="/register" className="otp-back-link">
            <ArrowLeft size={13} /> Back to Registration
          </Link>
          <Link href="/login" className="otp-back-link">
            Back to Sign In
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
}
