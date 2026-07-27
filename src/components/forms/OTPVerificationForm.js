"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OTPVerificationForm({ isEmbed = false }) {
  const { verifyOTP } = useAuth();
  const router = useRouter();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // References to the 6 input elements to manage focus
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setTimeout(() => {
        setCanResend(true);
      }, 0);
    }
  }, [countdown]);

  const handleChange = (value, index) => {
    // Only accept numeric digits
    if (value !== "" && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically shift focus forward if value entered
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Shift focus backward on Backspace
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^[0-9]{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      // Focus the last input box
      inputRefs[5].current.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setCountdown(60);
    setCanResend(false);
    setApiError("");
    inputRefs[0].current.focus();
    alert("Verification code has been resent to your email.");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setApiError("Please enter the full 6-digit verification code.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsLoading(true);
    setApiError("");
    setIsShaking(false);

    try {
      // Valid codes simulated: "123456" or "111111"
      await verifyOTP(otpCode);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setApiError(err.message || "Invalid code. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
            <CheckCircle2 size={36} />
          </motion.div>
          <h2 className="otp-success-title">
            Account Verified
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", fontWeight: 300 }}>
            Your email has been successfully verified. Logging you into the dashboard...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={isEmbed ? "otp-card border-0 bg-transparent shadow-none" : "otp-card"}
    >
      <div className="otp-header">
        <h2>Verify Email</h2>
        <p>
          We&apos;ve sent a 6-digit code to your inbox. Enter it below to verify.
          <span className="otp-demo-hint">(Enter code 123456 or 111111 to pass)</span>
        </p>
      </div>

      <motion.form
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        onSubmit={handleVerify}
        className="otp-form"
      >
        {apiError && (
          <div className="otp-error-alert">
            {apiError}
          </div>
        )}

        {/* 6 OTP boxes container */}
        <div className="otp-inputs-container" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input-field"
            />
          ))}
        </div>

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

        <button type="submit" className="otp-submit-btn" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </motion.form>

      <div>
        <Link href="/login" className="otp-back-link">
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
