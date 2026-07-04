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
        className={isEmbed
          ? "w-full max-w-md bg-transparent border-0 p-0 shadow-none text-center"
          : "w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-[24px] shadow-xl text-center"
        }
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 size={36} />
          </motion.div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Account Verified
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
      className={isEmbed
        ? "w-full max-w-md bg-transparent border-0 p-0 shadow-none"
        : "w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-[24px] shadow-xl"
      }
    >
      <div className="flex flex-col gap-2 text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Verify Email
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We&apos;ve sent a 6-digit code to your inbox. Enter it below to verify.
          <br />
          <span className="text-slate-400 text-xs">(Enter code 123456 or 111111 to pass)</span>
        </p>
      </div>

      <motion.form
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        onSubmit={handleVerify}
        className="flex flex-col gap-6"
      >
        {apiError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200/80 text-rose-600 text-sm font-medium rounded-xl text-center">
            {apiError}
          </div>
        )}

        {/* 6 OTP boxes container */}
        <div className="flex justify-between gap-2.5" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
            />
          ))}
        </div>

        <div className="flex flex-col gap-1 items-center justify-center text-sm">
          {!canResend ? (
            <p className="text-slate-500">
              Resend code in <span className="font-bold text-slate-800">{formatTime(countdown)}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-transform"
            >
              <RefreshCw size={14} />
              Resend Code
            </button>
          )}
        </div>

        <Button type="submit" loading={isLoading}>
          Verify OTP
        </Button>
      </motion.form>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
