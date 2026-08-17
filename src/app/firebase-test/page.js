"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  getFirebaseIdToken,
  normalizePhoneNumber,
} from "@/services/firebasePhoneAuth";
import { ShieldCheck, CheckCircle2, Phone, KeyRound, Loader2, ArrowRight, RefreshCw } from "lucide-react";

export default function FirebaseTestPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("phone"); // "phone" | "otp" | "success"
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userResult, setUserResult] = useState(null);

  const otpInputsRef = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await sendPhoneOtp(phoneNumber, "firebase-test-recaptcha");
      setConfirmationResult(res.confirmationResult);
      setNormalizedPhone(res.normalizedPhone);
      setStep("otp");
    } catch (err) {
      setErrorMessage(err.message || "Failed to send SMS OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const user = await verifyPhoneOtp(confirmationResult, otpCode);
      const idToken = await getFirebaseIdToken(user);

      setUserResult({
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        tokenPreview: idToken.slice(0, 24) + "...",
      });
      setStep("success");
    } catch (err) {
      setErrorMessage(err.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (val !== "" && !/^[0-9]$/.test(val)) return;
    const nextOtp = [...otp];
    nextOtp[idx] = val;
    setOtp(nextOtp);
    if (val !== "" && idx < 5) {
      otpInputsRef[idx + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      otpInputsRef[idx - 1]?.current?.focus();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #09130e 0%, #030806 100%)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 520,
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 20,
        padding: "2.5rem 2rem",
        backdropFilter: "blur(20px)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(15, 133, 84, 0.15)",
            border: "1px solid rgba(15, 133, 84, 0.3)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem"
          }}>
            <ShieldCheck size={28} color="#10b981" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px 0", color: "#fff" }}>
            Firebase Phone Auth Tester
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.5)", margin: 0 }}>
            Standalone testing sandbox for Firebase SMS OTP & reCAPTCHA
          </p>
        </div>

        {/* reCAPTCHA Container */}
        <div id="firebase-test-recaptcha" style={{ margin: "0 auto" }}></div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            padding: "12px 16px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 10,
            fontSize: 13,
            color: "#fca5a5",
            marginBottom: "1.5rem",
            textAlign: "center"
          }}>
            {errorMessage}
          </div>
        )}

        {/* Step 1: Phone Input */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Indian Mobile Number
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  placeholder="9876543210 or +919876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    padding: "14px 16px 14px 44px",
                    fontSize: 15,
                    color: "#fff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <Phone size={18} color="rgba(255,255,255,0.4)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                Format: 10-digit number or test numbers configured in Firebase
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !phoneNumber.trim()}
              style={{
                width: "100%",
                background: "#0f8554",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontSize: 14,
                fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s"
              }}
            >
              {isLoading ? (
                <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending OTP...</>
              ) : (
                <>Send SMS OTP <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 1rem 0" }}>
                Enter the 6-digit OTP code sent to <strong style={{ color: "#10b981" }}>{normalizedPhone}</strong>
              </p>

              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputsRef[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    style={{
                      width: 46,
                      height: 52,
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#fff",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 10,
                      outline: "none"
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join("").length < 6}
              style={{
                width: "100%",
                background: "#0f8554",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontSize: 14,
                fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              {isLoading ? (
                <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Verifying OTP...</>
              ) : (
                "Verify OTP"
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); setErrorMessage(""); }}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              ← Change mobile number
            </button>
          </form>
        )}

        {/* Step 3: Success Info */}
        {step === "success" && userResult && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.2)",
              border: "1px solid #10b981",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <CheckCircle2 size={32} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 8px 0" }}>
              Firebase Phone Verified!
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 1.5rem 0" }}>
              Firebase successfully authenticated the user and generated a valid ID token.
            </p>

            <div style={{
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              padding: "16px",
              textAlign: "left",
              fontSize: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Firebase UID: </span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>{userResult.uid}</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Phone Number: </span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{userResult.phoneNumber}</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Firebase ID Token: </span>
                <span style={{ color: "#bca374", fontFamily: "monospace" }}>{userResult.tokenPreview}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setPhoneNumber("");
                setOtp(["", "", "", "", "", ""]);
                setUserResult(null);
                setErrorMessage("");
              }}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10,
                color: "#fff",
                padding: "12px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Test Another Number
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
