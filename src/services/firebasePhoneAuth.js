import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * Normalizes any Indian or international phone number to E.164 (+91XXXXXXXXXX)
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return "";
  let clean = phone.replace(/[^\d+]/g, "").trim();
  if (clean.startsWith("+")) return clean;
  if (/^[6-9]\d{9}$/.test(clean)) return `+91${clean}`;
  if (/^0[6-9]\d{9}$/.test(clean)) return `+91${clean.slice(1)}`;
  if (/^91[6-9]\d{9}$/.test(clean)) return `+${clean}`;
  return `+${clean}`;
}

/**
 * Validates whether a phone number matches valid mobile number formats
 */
export function validatePhoneNumber(phone) {
  const normalized = normalizePhoneNumber(phone);
  return /^\+91[6-9]\d{9}$/.test(normalized) || /^\+[1-9]\d{6,14}$/.test(normalized);
}

/**
 * Maps Firebase auth error codes to clear, user-friendly messages
 */
export function getFirebaseErrorMessage(error) {
  if (!error) return "An unexpected error occurred. Please try again.";
  const code = error.code || "";

  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid phone number format. Please enter a valid 10-digit mobile number.";
    case "auth/too-many-requests":
    case "auth/quota-exceeded":
      return "Too many OTP requests. Please wait a few minutes before trying again.";
    case "auth/invalid-verification-code":
      return "Incorrect OTP code. Please check and try again.";
    case "auth/code-expired":
      return "The OTP code has expired. Please request a new OTP.";
    case "auth/captcha-check-failed":
      return "Security verification failed. Please refresh and try again.";
    case "auth/missing-phone-number":
      return "Phone number is required.";
    default:
      return error.message || "Failed to process phone verification.";
  }
}

/**
 * Global singleton reference to prevent duplicate RecaptchaVerifier instances
 */
let recaptchaVerifierInstance = null;

/**
 * Initializes or resets the Firebase RecaptchaVerifier instance safely
 */
export function initializeRecaptcha(containerId = "recaptcha-container") {
  if (typeof window === "undefined") {
    throw new Error("RecaptchaVerifier can only be initialized on the client.");
  }

  if (!auth) {
    throw new Error("Firebase Auth instance is not initialized.");
  }

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`reCAPTCHA container element with id '${containerId}' was not found.`);
  }

  // Clear previous instance to prevent duplicate widgets
  if (recaptchaVerifierInstance) {
    try {
      recaptchaVerifierInstance.clear();
    } catch {
      // ignore cleanup errors
    }
    recaptchaVerifierInstance = null;
  }

  recaptchaVerifierInstance = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved
    },
    "expired-callback": () => {
      console.warn("Firebase reCAPTCHA expired.");
    },
  });

  return recaptchaVerifierInstance;
}

/**
 * Dispatches an SMS OTP via Firebase Authentication
 *
 * @param {string} phoneNumber User input phone number
 * @param {string} containerId DOM ID of the reCAPTCHA container
 * @returns {Promise<{ confirmationResult: object, normalizedPhone: string }>}
 */
export async function sendPhoneOtp(phoneNumber, containerId = "recaptcha-container") {
  if (typeof window === "undefined") {
    throw new Error("Phone OTP can only be sent from the browser.");
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  if (!validatePhoneNumber(normalizedPhone)) {
    throw new Error("Please enter a valid mobile phone number.");
  }

  try {
    const verifier = initializeRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, normalizedPhone, verifier);
    return { confirmationResult, normalizedPhone };
  } catch (error) {
    console.error("sendPhoneOtp error:", error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Verifies the 6-digit OTP code against Firebase
 *
 * @param {object} confirmationResult The Firebase ConfirmationResult object
 * @param {string} otp 6-digit OTP string
 * @returns {Promise<object>} The authenticated Firebase User object
 */
export async function verifyPhoneOtp(confirmationResult, otp) {
  if (!confirmationResult || typeof confirmationResult.confirm !== "function") {
    throw new Error("No active verification session. Please request a new OTP.");
  }

  const cleanOtp = String(otp).trim();
  if (cleanOtp.length < 6) {
    throw new Error("Please enter the full 6-digit OTP.");
  }

  try {
    const result = await confirmationResult.confirm(cleanOtp);
    return result.user;
  } catch (error) {
    console.error("verifyPhoneOtp error:", error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Retrieves the cryptographic Firebase ID Token from a verified user
 *
 * @param {object} user Authenticated Firebase User object
 * @returns {Promise<string>} Firebase ID token string
 */
export async function getFirebaseIdToken(user) {
  if (!user || typeof user.getIdToken !== "function") {
    throw new Error("Invalid user object. Cannot retrieve Firebase ID token.");
  }
  return await user.getIdToken(true);
}
