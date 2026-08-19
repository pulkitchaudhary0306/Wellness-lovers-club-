"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Award,
  Crown,
  ChevronRight,
  Compass,
  HeartHandshake,
  Sparkle,
  BedDouble,
  Flower2,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService, loadRazorpayScript } from "@/services/paymentService";
import Link from "next/link";

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "membership", label: "Membership" },
  { id: "benefits", label: "Benefits" },
  { id: "review", label: "Review" },
  { id: "payment", label: "Payment" },
];

function MembershipEnrollmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0: welcome, 1: membership, 2: benefits, 3: review, 4: payment, 5: success
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Payment states
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  // Initialize customer & pre-load Razorpay SDK
  useEffect(() => {
    loadRazorpayScript().catch(() => {});

    let regEmail = "";
    let regName = "";
    let regPhone = "";

    if (typeof window !== "undefined") {
      regEmail = sessionStorage.getItem("wlc_reg_email") || localStorage.getItem("wlc_reg_email") || "";
      regName = sessionStorage.getItem("wlc_reg_name") || localStorage.getItem("wlc_reg_name") || "";
      regPhone = sessionStorage.getItem("wlc_reg_phone") || localStorage.getItem("wlc_reg_phone") || "";
    }

    const emailParam = searchParams.get("email") || "";
    const activeEmail = emailParam || regEmail || user?.email || "";
    const activeName = regName || user?.name || user?.firstName || "Valued Member";
    const activePhone = regPhone || user?.phone || "";

    setCustomerEmail(activeEmail);
    setCustomerName(activeName);
    setCustomerPhone(activePhone);
  }, [user, searchParams]);

  // Step transitions
  const nextStep = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Razorpay Checkout Trigger
  const handleInitiatePayment = async () => {
    if (paymentLoading) return;
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentCancelled(false);
    setVerificationPending(false);
    setPaymentStatusText("Preparing Secure Checkout…");

    try {
      const sdkReady = await loadRazorpayScript();
      if (!sdkReady || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Unable to initialize secure payment window. Please check your internet connection.");
      }

      setPaymentStatusText("Connecting to Club Gateway…");
      const orderData = await paymentService.createOrder(customerEmail);
      if (!orderData) {
        throw new Error("Unable to create payment order. Please refresh and try again.");
      }

      const activeKeyId = orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TR9Dw0VTSvX6yH";
      const razorpayOrderId = orderData.razorpay_order_id || "";

      setPaymentStatusText("Opening Secure Payment…");

      const options = {
        key: activeKeyId,
        amount: orderData.amount_paise || 2900000,
        currency: orderData.currency || "INR",
        name: "Wellness Lovers Club",
        description: "VIP Annual Membership Pass",
        image: "/logo/logo.png",
        order_id: razorpayOrderId && razorpayOrderId.startsWith("order_") && razorpayOrderId.length > 15
          ? razorpayOrderId
          : undefined,
        prefill: {
          name: orderData.customer?.name || customerName,
          email: orderData.customer?.email || customerEmail,
          contact: orderData.customer?.contact || customerPhone,
        },
        theme: {
          color: "#0f8554",
          backdrop_color: "rgba(8, 12, 9, 0.9)",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI / Payment Apps",
                instruments: [
                  {
                    method: "upi",
                    flows: ["intent", "qr", "collect"],
                    apps: ["google_pay", "phonepe", "paytm", "bhim", "cred"],
                  },
                ],
              },
              cards: {
                name: "Cards / Net Banking",
                instruments: [
                  {
                    method: "card",
                  },
                  {
                    method: "netbanking",
                  },
                ],
              },
            },
            sequence: ["block.upi", "block.cards"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            setPaymentCancelled(true);
            setPaymentStatusText("");
          },
          escape: true,
          backdropclose: false,
        },
        handler: async (response) => {
          setPaymentLoading(true);
          setPaymentStatusText("Verifying Payment…");
          try {
            const verifyRes = await paymentService.verifyPayment({
              order_id: orderData.order_id,
              razorpay_order_id: response.razorpay_order_id || orderData.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || "",
            });

            setSuccessDetails(verifyRes);
            setCurrentStepIndex(5); // Step 5 = Confirmed state
          } catch (err) {
            setVerificationPending(true);
            setPaymentError(err?.message || "We're securely confirming your membership. Please wait.");
          } finally {
            setPaymentLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setPaymentLoading(false);
        setPaymentError("Your payment could not be completed. No membership activation has been made.");
      });

      rzp.open();
    } catch (err) {
      setPaymentLoading(false);
      setPaymentError(err?.message || "Could not initialize checkout. Please try again.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS / MEMBERSHIP CONFIRMED SCREEN (Step 5)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentStepIndex === 5 && successDetails) {
    return (
      <div style={{ minHeight: "100vh", background: "#070c09", color: "#ffffff", padding: "120px 20px 80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: "580px",
            width: "100%",
            background: "linear-gradient(180deg, #111a14 0%, #0c120f 100%)",
            border: "1px solid rgba(188, 163, 116, 0.4)",
            borderRadius: "24px",
            padding: "3.5rem 2.5rem",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(188, 163, 116, 0.15)",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(15, 133, 84, 0.18)",
              border: "2px solid #0f8554",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
              color: "#4ade80",
            }}
          >
            <CheckCircle2 size={44} />
          </motion.div>

          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: "#bca374", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            VIP Membership Activated
          </span>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "36px", fontWeight: "700", color: "#ffffff", margin: "0 0 10px 0", letterSpacing: "-0.01em" }}>
            You&apos;re In
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.7)", margin: "0 auto 2rem", maxWidth: "440px", lineHeight: 1.6 }}>
            Welcome to Wellness Lovers Club. Your VIP Annual Membership has been successfully activated.
          </p>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
              textAlign: "left",
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Membership ID</span>
              <strong style={{ color: "#4ade80", letterSpacing: "0.06em", fontFamily: "monospace", fontSize: "14px" }}>
                {successDetails.membership_id || "WLC-2026-VIP"}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Invoice Reference</span>
              <span style={{ color: "rgba(255, 255, 255, 0.9)", fontFamily: "monospace" }}>
                {successDetails.invoice_number || "INV-2026-ANNUAL"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Membership Tier</span>
              <span style={{ color: "#bca374", fontWeight: "600" }}>VIP Annual Membership</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Amount Paid</span>
              <strong style={{ color: "#ffffff", fontSize: "15px" }}>₹29,000</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Status</span>
              <span style={{ color: "#4ade80", fontWeight: "600" }}>Active (365 Days)</span>
            </div>
          </div>

          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              background: "linear-gradient(135deg, #0f8554 0%, #0b6841 100%)",
              color: "#ffffff",
              padding: "16px 28px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 12px 30px rgba(15, 133, 84, 0.4)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <span>Enter Your Club</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN MULTI-STEP ONBOARDING SHELL
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080c09", color: "#ffffff", padding: "100px 20px 80px", position: "relative", overflow: "hidden" }}>
      {/* Background Ambient Glow */}
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(15, 133, 84, 0.12) 0%, rgba(8, 12, 9, 0) 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "1080px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Subtle Progress Bar */}
        <div style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Desktop Steps */}
          <div className="enroll-progress-desktop" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <React.Fragment key={step.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: isActive ? "#0f8554" : isPast ? "rgba(15, 133, 84, 0.3)" : "rgba(255, 255, 255, 0.06)",
                        border: isActive ? "1px solid #4ade80" : isPast ? "1px solid #0f8554" : "1px solid rgba(255, 255, 255, 0.15)",
                        color: isActive || isPast ? "#fff" : "rgba(255, 255, 255, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "700",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isPast ? <CheckCircle2 size={14} color="#4ade80" /> : idx + 1}
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: isActive ? "700" : "500",
                        color: isActive ? "#ffffff" : isPast ? "#4ade80" : "rgba(255, 255, 255, 0.45)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{ width: "32px", height: "1px", background: isPast ? "#0f8554" : "rgba(255, 255, 255, 0.12)" }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile Progress Pill */}
          <div className="enroll-progress-mobile" style={{ display: "none" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "6px 16px", borderRadius: "30px", fontSize: "11px", color: "#bca374", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Step {currentStepIndex + 1} of 5 • {STEPS[currentStepIndex]?.label}
            </div>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          
          {/* ─────────────────────────────────────────────────────────────
              STEP 0: WELCOME SCREEN
              ───────────────────────────────────────────────────────────── */}
          {currentStepIndex === 0 && (
            <motion.div
              key="step-welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "linear-gradient(180deg, rgba(17, 26, 20, 0.85) 0%, rgba(12, 18, 14, 0.95) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.6)",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
                {/* Hero Visual Banner */}
                <div
                  style={{
                    minHeight: "380px",
                    backgroundImage: "url('/images/buddha-bg.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8, 12, 9, 0.2) 0%, rgba(8, 12, 9, 0.8) 100%)" }} />
                  <div style={{ position: "absolute", bottom: "2rem", left: "2rem", right: "2rem" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#bca374", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      Curated Sanctuary
                    </span>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#fff", margin: "6px 0 0" }}>
                      Elevated Wellbeing
                    </h3>
                  </div>
                </div>

                {/* Welcome Editorial Copy */}
                <div style={{ padding: "3.5rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#4ade80", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
                    <Crown size={14} />
                    <span>VIP Enrollment</span>
                  </div>

                  <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: "700", color: "#ffffff", lineHeight: 1.15, margin: "0 0 1rem" }}>
                    Welcome to Wellness Lovers Club
                  </h1>

                  <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
                    Your journey toward elevated wellness begins here. You have completed email verification, and your bespoke VIP membership dossier is ready for activation.
                  </p>

                  <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "12px 16px", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: 10 }}>
                    <Sparkles size={18} color="#bca374" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "#e6dfd5" }}>Your VIP Annual Membership awaits.</span>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    style={{
                      background: "linear-gradient(135deg, #0f8554 0%, #0b6841 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "16px 28px",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      boxShadow: "0 10px 25px rgba(15, 133, 84, 0.35)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <span>Discover Your Membership</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 1: DISCOVER YOUR MEMBERSHIP
              ───────────────────────────────────────────────────────────── */}
          {currentStepIndex === 1 && (
            <motion.div
              key="step-membership"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "linear-gradient(180deg, #111a14 0%, #0a0f0c 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                padding: "3.5rem 3rem",
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.6)",
              }}
            >
              <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3rem" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#bca374", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Membership Architecture
                </span>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "34px", color: "#fff", margin: "8px 0 12px" }}>
                  A Membership Designed Around You
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.6 }}>
                  Wellness Lovers Club grants private access to curated wellness experiences, world-class resort sanctuaries, and bespoke privileges.
                </p>
              </div>

              {/* Large Premium Card */}
              <div
                style={{
                  maxWidth: "520px",
                  margin: "0 auto 3rem",
                  background: "linear-gradient(135deg, rgba(20, 32, 24, 0.95) 0%, rgba(10, 16, 12, 0.95) 100%)",
                  border: "1px solid rgba(188, 163, 116, 0.5)",
                  borderRadius: "20px",
                  padding: "2.5rem",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 30px rgba(188, 163, 116, 0.08)",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(188, 163, 116, 0.15)", border: "1px solid #bca374", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", color: "#bca374", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  <Crown size={12} />
                  <span>VIP Member</span>
                </div>

                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: "#fff", margin: "0 0 6px" }}>
                  Annual VIP Membership
                </h3>
                <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
                  365 Days of Unrestricted Privileges
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "12px", padding: "1.25rem", marginBottom: "2rem" }}>
                  {["Exclusive Curated Experiences", "Priority Spa & Sanctuary Bookings", "Handpicked Luxury Stays", "Global Wellness Community Access"].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CheckCircle2 size={15} color="#4ade80" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "#e6dfd5" }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "1.5rem" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    Annual Membership
                  </div>
                  <div style={{ fontSize: "38px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em" }}>
                    ₹29,000
                  </div>
                </div>
              </div>

              {/* Step Actions */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#ffffff", padding: "14px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  style={{ background: "#0f8554", color: "#ffffff", border: "none", padding: "14px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 10px 25px rgba(15, 133, 84, 0.35)" }}
                >
                  <span>Explore Your Benefits</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 2: MEMBERSHIP BENEFITS
              ───────────────────────────────────────────────────────────── */}
          {currentStepIndex === 2 && (
            <motion.div
              key="step-benefits"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "linear-gradient(180deg, #111a14 0%, #0a0f0c 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                padding: "3.5rem 3rem",
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.6)",
              }}
            >
              <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 3rem" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#bca374", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Curated Suite
                </span>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "34px", color: "#fff", margin: "8px 0 12px" }}>
                  Membership Privileges
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.6 }}>
                  Every benefit is meticulously crafted to support a lifestyle of vitality, mindful balance, and tranquil restoration.
                </p>
              </div>

              {/* 6 Editorial Benefit Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "3rem" }}>
                {[
                  {
                    icon: <Sparkle size={20} color="#4ade80" />,
                    title: "Curated Wellness",
                    desc: "Access thoughtfully selected wellness experiences designed to support a balanced, restorative lifestyle.",
                  },
                  {
                    icon: <BedDouble size={20} color="#bca374" />,
                    title: "Luxury Stays",
                    desc: "Discover premium hospitality, private suites, and handpicked wellness partner destinations.",
                  },
                  {
                    icon: <Flower2 size={20} color="#4ade80" />,
                    title: "Spa & Healing",
                    desc: "Explore restorative spa therapies, thermal baths, and holistic healing sanctuaries with VIP booking privileges.",
                  },
                  {
                    icon: <Compass size={20} color="#bca374" />,
                    title: "Retreats & Destinations",
                    desc: "Preferential access to transformative mindfulness retreats and immersive longevity programs.",
                  },
                  {
                    icon: <Award size={20} color="#4ade80" />,
                    title: "Exclusive Privileges",
                    desc: "Enjoy preferential club rates, personalized concierge booking assistance, and bespoke amenities.",
                  },
                  {
                    icon: <Users size={20} color="#bca374" />,
                    title: "Global Community",
                    desc: "Connect with like-minded wellness connoisseurs committed to health, vitality, and mindful living.",
                  },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      borderRadius: "16px",
                      padding: "1.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      transition: "transform 0.2s, border-color 0.2s",
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {card.icon}
                    </div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: 0 }}>
                      {card.title}
                    </h4>
                    <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.5, margin: 0 }}>
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Step Actions */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#ffffff", padding: "14px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  style={{ background: "#0f8554", color: "#ffffff", border: "none", padding: "14px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 10px 25px rgba(15, 133, 84, 0.35)" }}
                >
                  <span>Continue to Membership Review</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 3: MEMBERSHIP REVIEW
              ───────────────────────────────────────────────────────────── */}
          {currentStepIndex === 3 && (
            <motion.div
              key="step-review"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "linear-gradient(180deg, #111a14 0%, #0a0f0c 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                padding: "3.5rem 3rem",
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.6)",
              }}
            >
              <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3rem" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#bca374", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Confirmation
                </span>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "34px", color: "#fff", margin: "8px 0 12px" }}>
                  Almost There
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.6 }}>
                  Review your membership summary before completing your enrollment.
                </p>
              </div>

              {/* Review Summary Card */}
              <div
                style={{
                  maxWidth: "560px",
                  margin: "0 auto 3rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(188, 163, 116, 0.4)",
                  borderRadius: "20px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <span style={{ fontSize: "10px", color: "#bca374", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Selected Tier
                  </span>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginTop: 4 }}>
                    VIP Annual Membership
                  </div>
                  <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.5)", marginTop: 2 }}>
                    365 Days of Comprehensive Access
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem" }}>
                  <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Registered Member
                  </span>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginTop: 4 }}>
                    {customerName || "Valued Member"}
                  </div>
                  <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", marginTop: 2 }}>
                    {customerEmail}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Amount Payable
                    </span>
                    <div style={{ fontSize: "32px", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em" }}>
                      ₹29,000
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", background: "rgba(15, 133, 84, 0.15)", border: "1px solid rgba(15, 133, 84, 0.4)", color: "#4ade80", padding: "6px 12px", borderRadius: "8px", fontWeight: "600" }}>
                    Annual Membership
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1rem", display: "flex", alignItems: "center", gap: 8, fontSize: "12px", color: "rgba(255, 255, 255, 0.45)" }}>
                  <Lock size={14} color="#4ade80" />
                  <span>Secure 256-bit encrypted transaction powered by Razorpay.</span>
                </div>
              </div>

              {/* Step Actions */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#ffffff", padding: "14px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  style={{ background: "#0f8554", color: "#ffffff", border: "none", padding: "14px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 10px 25px rgba(15, 133, 84, 0.35)" }}
                >
                  <span>Continue to Secure Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 4: SECURE PAYMENT SCREEN
              ───────────────────────────────────────────────────────────── */}
          {currentStepIndex === 4 && (
            <motion.div
              key="step-payment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "linear-gradient(180deg, #111a14 0%, #0a0f0c 100%)",
                border: "1px solid rgba(15, 133, 84, 0.35)",
                borderRadius: "24px",
                padding: "3.5rem 3rem",
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.6)",
                maxWidth: "640px",
                margin: "0 auto",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(15, 133, 84, 0.15)", border: "1px solid rgba(15, 133, 84, 0.35)", borderRadius: "30px", padding: "5px 14px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: "#4ade80", textTransform: "uppercase", marginBottom: "1rem" }}>
                  <Lock size={12} />
                  <span>Secure Payment</span>
                </div>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#fff", margin: "0 0 10px" }}>
                  Complete Your Membership
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.65)", margin: 0 }}>
                  Secure your place in the Wellness Lovers Club.
                </p>
              </div>

              {/* Price Banner */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  textAlign: "center",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ fontSize: "11px", color: "#bca374", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "700", marginBottom: 6 }}>
                  VIP Annual Membership
                </div>
                <div style={{ fontSize: "44px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" }}>
                  ₹29,000
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginTop: 4 }}>
                  Final membership amount (All-inclusive)
                </div>
              </div>

              {/* Supported Direct Payment Apps Banner */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginBottom: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={13} color="#4ade80" />
                  <span>Direct Payment Apps Supported via Razorpay</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Google Pay", "PhonePe", "Paytm", "BHIM UPI", "CRED", "Debit / Credit Cards", "Net Banking"].map((app, i) => (
                    <span
                      key={i}
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        fontSize: "11px",
                        color: "#e2e8f0",
                        fontWeight: "500",
                      }}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feedback States */}
              {paymentError && (
                <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.35)", borderRadius: "12px", padding: "14px 18px", marginBottom: "1.5rem", color: "#fca5a5", fontSize: "13px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: "700", marginBottom: 2 }}>
                      {verificationPending ? "We're Confirming Your Payment" : "Payment Unsuccessful"}
                    </div>
                    <div>{paymentError}</div>
                  </div>
                </div>
              )}

              {paymentCancelled && !paymentError && (
                <div style={{ background: "rgba(234, 179, 8, 0.12)", border: "1px solid rgba(234, 179, 8, 0.35)", borderRadius: "12px", padding: "14px 18px", marginBottom: "1.5rem", color: "#fde047", fontSize: "13px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: "700", marginBottom: 2 }}>Payment Cancelled</div>
                    <div>No payment was completed. You can try again whenever you&apos;re ready.</div>
                  </div>
                </div>
              )}

              {/* Primary Payment Button */}
              <button
                type="button"
                onClick={handleInitiatePayment}
                disabled={paymentLoading}
                style={{
                  width: "100%",
                  background: "#0f8554",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "18px 28px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: paymentLoading ? "not-allowed" : "pointer",
                  opacity: paymentLoading ? 0.8 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: "0 12px 30px rgba(15, 133, 84, 0.4)",
                  marginBottom: "1.75rem",
                  transition: "background 0.2s, transform 0.1s",
                }}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                    <span>{paymentStatusText || "Connecting Secure Checkout…"}</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Pay ₹29,000</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16, fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <ShieldCheck size={14} color="#4ade80" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <CreditCard size={14} color="#4ade80" />
                  <span>Razorpay Direct Gateway</span>
                </div>
                <div style={{ color: "rgba(255, 255, 255, 0.35)" }}>
                  UPI • Cards • Net Banking • Wallets
                </div>
              </div>

              {/* Back to review option */}
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={paymentLoading}
                  style={{ background: "none", border: "none", color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}
                >
                  ← Back to Membership Review
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .enroll-progress-desktop { display: none !important; }
          .enroll-progress-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default function MembershipEnrollPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080c09", color: "#fff" }}>
        <Loader2 size={32} style={{ color: "#0f8554", animation: "spin 1s linear infinite" }} />
      </div>
    }>
      <MembershipEnrollmentContent />
    </Suspense>
  );
}
