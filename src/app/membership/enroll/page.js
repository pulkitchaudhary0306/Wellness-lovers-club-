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
  Crown,
  ChevronRight,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService, loadRazorpayScript } from "@/services/paymentService";
import Link from "next/link";

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "payment", label: "Payment" },
];

function MembershipEnrollmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0: Welcome, 1: Payment, 2: Success
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);

  // Initialize & pre-load Razorpay SDK
  useEffect(() => {
    loadRazorpayScript().catch(() => {});
  }, []);

  // Hydrate user and session details
  useEffect(() => {
    const paramEmail = searchParams?.get("email") || searchParams?.get("identifier") || "";
    const paramName = searchParams?.get("name") || "";
    const paramPhone = searchParams?.get("phone") || "";
    const paramStep = searchParams?.get("step");

    if (paramStep) {
      if (paramStep.toLowerCase() === "payment" || paramStep === "1") {
        setCurrentStepIndex(1);
      } else {
        setCurrentStepIndex(0);
      }
    }

    let storedEmail = "";
    let storedName = "";
    let storedPhone = "";
    if (typeof window !== "undefined") {
      storedEmail = sessionStorage.getItem("wlc_reg_email") || localStorage.getItem("wlc_reg_email") || "";
      storedName = sessionStorage.getItem("wlc_reg_name") || localStorage.getItem("wlc_reg_name") || "";
      storedPhone = sessionStorage.getItem("wlc_reg_phone") || localStorage.getItem("wlc_reg_phone") || "";
    }

    const resolvedEmail = paramEmail || user?.email || storedEmail || "";
    const resolvedName =
      paramName ||
      user?.name ||
      user?.displayName ||
      (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "") ||
      storedName ||
      "";
    const resolvedPhone = paramPhone || user?.phone || storedPhone || "";

    if (resolvedEmail) setCustomerEmail(resolvedEmail);
    if (resolvedName) setCustomerName(resolvedName);
    if (resolvedPhone) setCustomerPhone(resolvedPhone);
  }, [user, searchParams]);

  // Step transitions
  const nextStep = () => {
    setCurrentStepIndex(1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStepIndex(0);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      if (!sdkReady || typeof window === "undefined" || !(window).Razorpay) {
        throw new Error("Unable to initialize secure payment window. Please check your internet connection.");
      }

      setPaymentStatusText("Connecting to Club Gateway…");
      const activeEmail = customerEmail || (typeof window !== "undefined" ? (sessionStorage.getItem("wlc_reg_email") || localStorage.getItem("wlc_reg_email")) : "") || "";
      const activeName = customerName || (typeof window !== "undefined" ? (sessionStorage.getItem("wlc_reg_name") || localStorage.getItem("wlc_reg_name")) : "") || "Valued Member";
      const activePhone = customerPhone || (typeof window !== "undefined" ? (sessionStorage.getItem("wlc_reg_phone") || localStorage.getItem("wlc_reg_phone")) : "") || "";

      const orderData = await paymentService.createOrder({
        email: activeEmail,
        name: activeName,
        phone: activePhone,
      });

      if (!orderData) {
        throw new Error("Unable to create payment order. Please refresh and try again.");
      }

      const activeKeyId = orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
      const razorpayOrderId = orderData.razorpay_order_id || "";

      setPaymentStatusText("Opening Secure Payment…");

      const options = {
        key: activeKeyId,
        amount: orderData.amount_paise || 2900000,
        currency: orderData.currency || "INR",
        name: "Wellness Lovers Club",
        description: "VIP Annual Membership Pass",
        image: "/logo/logo.webp",
        order_id:
          razorpayOrderId && razorpayOrderId.startsWith("order_") && razorpayOrderId.length > 15
            ? razorpayOrderId
            : undefined,
        prefill: {
          name: orderData.customer?.name || activeName,
          email: orderData.customer?.email || activeEmail,
          contact: orderData.customer?.contact || activePhone,
        },
        theme: {
          color: "#0f8554",
          backdrop_color: "rgba(8, 12, 9, 0.9)",
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
              email: activeEmail || orderData.customer?.email,
              name: activeName || orderData.customer?.name,
            });

            if (typeof window !== "undefined") {
              sessionStorage.setItem("wlc_membership_status", "Active");
              localStorage.setItem("wlc_membership_status", "Active");
              if (verifyRes.membership_id) {
                sessionStorage.setItem("wlc_membership_id", verifyRes.membership_id);
                localStorage.setItem("wlc_membership_id", verifyRes.membership_id);
              }
            }

            setSuccessDetails(verifyRes);
            setCurrentStepIndex(2); // Step 2 = Confirmed state
          } catch (err) {
            setVerificationPending(true);
            setPaymentError(err?.message || "We're securely confirming your membership. Please wait.");
          } finally {
            setPaymentLoading(false);
          }
        },
      };

      const rzp = new (window).Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setPaymentLoading(false);
        const errMsg = resp?.error?.description || "Your payment could not be completed. No membership activation has been made.";
        setPaymentError(errMsg);
      });

      rzp.open();
    } catch (err) {
      setPaymentLoading(false);
      setPaymentError(err?.message || "Could not initialize checkout. Please try again.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS / MEMBERSHIP CONFIRMED SCREEN (Step 2)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentStepIndex === 2 && successDetails) {
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
                {successDetails.membership_id || "Active Member"}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Payment Reference</span>
              <span style={{ color: "rgba(255, 255, 255, 0.9)", fontFamily: "monospace" }}>
                {successDetails.razorpay_payment_id || successDetails.order_id || "Confirmed"}
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
              <span style={{ color: "#4ade80", fontWeight: "600" }}>Active (365 Days Access)</span>
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
            <span>Enter Your Club Dashboard</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN ONBOARDING SHELL (Welcome -> Direct Payment)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080c09", color: "#ffffff", padding: "100px 20px 80px", position: "relative", overflow: "hidden" }}>
      {/* Background Ambient Glow */}
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(15, 133, 84, 0.12) 0%, rgba(8, 12, 9, 0) 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "1080px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Progress Bar (2-step: Welcome -> Payment) */}
        <div style={{ marginBottom: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <React.Fragment key={step.id}>
                  <div
                    onClick={() => {
                      if (idx < currentStepIndex) setCurrentStepIndex(idx);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: idx < currentStepIndex ? "pointer" : "default",
                    }}
                  >
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
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          
          {/* ─────────────────────────────────────────────────────────────
              STEP 0: WELCOME & MEMBERSHIP OVERVIEW SCREEN
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
                    minHeight: "420px",
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
                      VIP Annual Membership
                    </h3>
                  </div>
                </div>

                {/* Welcome Editorial Copy */}
                <div style={{ padding: "3.5rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#4ade80", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
                    <Crown size={14} />
                    <span>VIP Enrollment</span>
                  </div>

                  <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: "700", color: "#ffffff", lineHeight: 1.15, margin: "0 0 1rem" }}>
                    Welcome to Wellness Lovers Club
                  </h1>

                  <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
                    Your bespoke VIP membership dossier is ready. Activate your pass to unlock 365 days of private wellness retreats, luxury stays, spa treatments, and bespoke club privileges.
                  </p>

                  <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(188, 163, 116, 0.3)", borderRadius: "14px", padding: "16px 20px", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#bca374", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Annual VIP Pass
                      </div>
                      <div style={{ fontSize: "26px", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em", marginTop: 2 }}>
                        ₹29,000
                      </div>
                    </div>
                    <div style={{ fontSize: "11px", background: "rgba(15, 133, 84, 0.15)", border: "1px solid rgba(15, 133, 84, 0.4)", color: "#4ade80", padding: "6px 12px", borderRadius: "8px", fontWeight: "600" }}>
                      All-Inclusive
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    style={{
                      background: "linear-gradient(135deg, #0f8554 0%, #0b6841 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "18px 28px",
                      fontSize: "15px",
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
                    <span>Proceed to Secure Payment</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 1: SECURE PAYMENT SCREEN (Direct from Welcome)
              ───────────────────────────────────────────────────────────── */}
          {currentStepIndex === 1 && (
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
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(15, 133, 84, 0.15)", border: "1px solid rgba(15, 133, 84, 0.35)", borderRadius: "30px", padding: "5px 14px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: "#4ade80", textTransform: "uppercase", marginBottom: "1rem" }}>
                  <Lock size={12} />
                  <span>Secure Payment</span>
                </div>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#fff", margin: "0 0 10px" }}>
                  Complete Your Membership
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.65)", margin: 0 }}>
                  Confirm your details and proceed to secure Razorpay checkout.
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
                  marginBottom: "1.75rem",
                }}
              >
                <div style={{ fontSize: "11px", color: "#bca374", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "700", marginBottom: 6 }}>
                  VIP Annual Membership
                </div>
                <div style={{ fontSize: "44px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" }}>
                  ₹29,000
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginTop: 4 }}>
                  Final membership amount (All-inclusive, 365 Days Access)
                </div>
              </div>

              {/* Member Details Review Box */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(188, 163, 116, 0.25)",
                  borderRadius: "14px",
                  padding: "1.25rem 1.5rem",
                  marginBottom: "1.75rem",
                }}
              >
                <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
                  Member Contact Details
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <User size={14} color="#bca374" style={{ flexShrink: 0 }} />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        color: "#fff",
                        fontSize: "13px",
                        flex: 1,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Mail size={14} color="#bca374" style={{ flexShrink: 0 }} />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email Address"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        color: "#fff",
                        fontSize: "13px",
                        flex: 1,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Phone size={14} color="#bca374" style={{ flexShrink: 0 }} />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile Number"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        color: "#fff",
                        fontSize: "13px",
                        flex: 1,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Feedback States */}
              {paymentError && (
                <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.35)", borderRadius: "12px", padding: "14px 18px", marginBottom: "1.5rem", color: "#fca5a5", fontSize: "13px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: "700", marginBottom: 2 }}>
                      {verificationPending ? "We're Confirming Your Payment" : "Payment Notice"}
                    </div>
                    <div>{paymentError}</div>
                  </div>
                </div>
              )}

              {paymentCancelled && !paymentError && (
                <div style={{ background: "rgba(234, 179, 8, 0.12)", border: "1px solid rgba(234, 179, 8, 0.35)", borderRadius: "12px", padding: "14px 18px", marginBottom: "1.5rem", color: "#fde047", fontSize: "13px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: "700", marginBottom: 2 }}>Payment Window Dismissed</div>
                    <div>No transaction was completed. Click below whenever you are ready to proceed.</div>
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
                  marginBottom: "1.5rem",
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
                    <span>Pay ₹29,000 via Razorpay</span>
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
                  <span>Razorpay Official Gateway</span>
                </div>
                <div style={{ color: "rgba(255, 255, 255, 0.35)" }}>
                  UPI • Cards • Net Banking • Wallets
                </div>
              </div>

              {/* Back to Welcome option */}
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={paymentLoading}
                  style={{ background: "none", border: "none", color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}
                >
                  ← Back to Welcome Overview
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
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
