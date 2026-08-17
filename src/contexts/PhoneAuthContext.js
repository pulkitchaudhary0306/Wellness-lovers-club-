"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";

const PhoneAuthContext = createContext(null);

export function PhoneAuthProvider({ children }) {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [registrationData, setRegistrationData] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  
  const recaptchaVerifierRef = useRef(null);

  /**
   * Helper to normalize Indian and international numbers to E.164
   */
  const normalizePhoneNumber = (phone) => {
    if (!phone) return "";
    let clean = phone.replace(/[^\d+]/g, "").trim();
    if (clean.startsWith("+")) return clean;
    if (/^[6-9]\d{9}$/.test(clean)) return `+91${clean}`;
    if (/^0[6-9]\d{9}$/.test(clean)) return `+91${clean.slice(1)}`;
    if (/^91[6-9]\d{9}$/.test(clean)) return `+${clean}`;
    return `+${clean}`;
  };

  /**
   * Initialize or reset the reCAPTCHA verifier instance
   */
  const setupRecaptcha = (containerId = "recaptcha-container") => {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized.");
    }

    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch {
        // ignore reset errors
      }
      recaptchaVerifierRef.current = null;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`reCAPTCHA container '#${containerId}' not found.`);
    }

    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved
      },
      "expired-callback": () => {
        setError("Security verification expired. Please try again.");
      },
    });

    return recaptchaVerifierRef.current;
  };

  /**
   * Sends an SMS OTP to the phone number using Firebase
   */
  const sendPhoneOTP = async (rawPhone, containerId = "recaptcha-container", extraData = null) => {
    setError("");
    setIsSending(true);
    try {
      const normalized = normalizePhoneNumber(rawPhone);
      if (!/^\+91[6-9]\d{9}$/.test(normalized) && !/^\+[1-9]\d{6,14}$/.test(normalized)) {
        throw new Error("Please enter a valid mobile number.");
      }

      const verifier = setupRecaptcha(containerId);
      const confirmation = await signInWithPhoneNumber(auth, normalized, verifier);

      setConfirmationResult(confirmation);
      setPhoneNumber(normalized);
      if (extraData) {
        setRegistrationData(extraData);
      }

      return { success: true, phone: normalized };
    } catch (err) {
      console.error("Firebase sendPhoneOTP error:", err);
      let userFriendlyMsg = "Failed to send SMS OTP. Please try again.";
      if (err.code === "auth/invalid-phone-number") {
        userFriendlyMsg = "Invalid mobile number. Please check the number format.";
      } else if (err.code === "auth/too-many-requests" || err.code === "auth/quota-exceeded") {
        userFriendlyMsg = "Too many OTP requests. Please wait a few minutes before trying again.";
      } else if (err.code === "auth/captcha-check-failed") {
        userFriendlyMsg = "Security verification failed. Please refresh and try again.";
      } else if (err.message) {
        userFriendlyMsg = err.message;
      }
      setError(userFriendlyMsg);
      throw new Error(userFriendlyMsg);
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Resends the SMS OTP using existing phone and container
   */
  const resendPhoneOTP = async (containerId = "recaptcha-container") => {
    if (!phoneNumber) {
      throw new Error("No phone number is currently active for OTP resend.");
    }
    return sendPhoneOTP(phoneNumber, containerId, registrationData);
  };

  /**
   * Confirms the OTP with Firebase and returns the Firebase ID token
   */
  const verifyPhoneOTP = async (otpCode) => {
    setError("");
    setIsVerifying(true);
    try {
      if (!confirmationResult) {
        throw new Error("No active OTP verification session. Please request a new OTP.");
      }

      const result = await confirmationResult.confirm(otpCode);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken(true);

      return {
        idToken,
        firebaseUser,
        phone: phoneNumber,
        registrationData,
      };
    } catch (err) {
      console.error("Firebase verifyPhoneOTP error:", err);
      let userFriendlyMsg = "Invalid or expired OTP code.";
      if (err.code === "auth/invalid-verification-code") {
        userFriendlyMsg = "The OTP code you entered is incorrect.";
      } else if (err.code === "auth/code-expired") {
        userFriendlyMsg = "The OTP code has expired. Please click Resend OTP.";
      } else if (err.message) {
        userFriendlyMsg = err.message;
      }
      setError(userFriendlyMsg);
      throw new Error(userFriendlyMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const clearPhoneAuth = () => {
    setConfirmationResult(null);
    setPhoneNumber("");
    setRegistrationData(null);
    setError("");
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch {
        // ignore
      }
      recaptchaVerifierRef.current = null;
    }
  };

  const value = {
    confirmationResult,
    phoneNumber,
    registrationData,
    isSending,
    isVerifying,
    error,
    setError,
    sendPhoneOTP,
    resendPhoneOTP,
    verifyPhoneOTP,
    clearPhoneAuth,
    normalizePhoneNumber,
  };

  return (
    <PhoneAuthContext.Provider value={value}>
      {children}
    </PhoneAuthContext.Provider>
  );
}

export function usePhoneAuth() {
  const context = useContext(PhoneAuthContext);
  if (!context) {
    throw new Error("usePhoneAuth must be used within a PhoneAuthProvider");
  }
  return context;
}
