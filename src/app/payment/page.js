"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/* ─── Membership tiers ─────────────────────────────────────────────────────── */
const PLANS = {
  silver: {
    name: "Silver Lotus",
    price: 9999,
    currency: "₹",
    period: "/ year",
    color: "#94a3b8",
    gradient: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
    glow: "rgba(148,163,184,0.25)",
    features: [
      "Access to 5 wellness retreats / year",
      "Priority spa bookings",
      "Monthly wellness newsletter",
      "Member-only discounts (10%)",
    ],
  },
  gold: {
    name: "Gold Lotus",
    price: 24999,
    currency: "₹",
    period: "/ year",
    color: "#bca374",
    gradient: "linear-gradient(135deg, #bca374 0%, #7c5c2a 100%)",
    glow: "rgba(188,163,116,0.3)",
    features: [
      "Unlimited wellness retreats",
      "VIP spa & salon access",
      "Expert masterclasses (8 / year)",
      "Personalized longevity plan",
      "Member-only discounts (20%)",
    ],
    popular: true,
  },
  platinum: {
    name: "Platinum Lotus",
    price: 49999,
    currency: "₹",
    period: "/ year",
    color: "#c084fc",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #2d1b69 100%)",
    glow: "rgba(192,132,252,0.25)",
    features: [
      "All Gold benefits",
      "Dedicated concierge",
      "International retreat access",
      "Quarterly 1-on-1 coaching",
      "Exclusive longevity programmes",
      "Lifetime membership upgrades",
    ],
  },
};

/* ─── Payment method list ──────────────────────────────────────────────────── */
const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "upi",
    label: "UPI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "netbanking",
    label: "Net Banking",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "wallet",
    label: "Wallets",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V22H4V4a2 2 0 0 1 2-2h14v6" />
        <rect x="14" y="8" width="8" height="8" rx="1" />
        <circle cx="18" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

/* ─── Utility ──────────────────────────────────────────────────────────────── */
function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
}

/* ─── Card Form ────────────────────────────────────────────────────────────── */
function CardForm({ onPay, isProcessing }) {
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [showCvv, setShowCvv] = useState(false);

  const fmt = (field, value) => {
    if (field === "number") value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (field === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (field === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setCard((c) => ({ ...c, [field]: value }));
  };

  const inp = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 14,
    color: "#fff",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={labelSt}>Card Number</label>
        <input style={inp} placeholder="0000 0000 0000 0000" value={card.number}
          onChange={(e) => fmt("number", e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#0f8554")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={labelSt}>Cardholder Name</label>
        <input style={inp} placeholder="Name as on card" value={card.name}
          onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
          onFocus={(e) => (e.target.style.borderColor = "#0f8554")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={labelSt}>Expiry Date</label>
          <input style={inp} placeholder="MM/YY" value={card.expiry}
            onChange={(e) => fmt("expiry", e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#0f8554")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={labelSt}>CVV</label>
          <div style={{ position: "relative" }}>
            <input style={{ ...inp, paddingRight: 40 }} placeholder="•••" type={showCvv ? "text" : "password"}
              value={card.cvv}
              onChange={(e) => fmt("cvv", e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#0f8554")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
            <button type="button" onClick={() => setShowCvv((v) => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0 }}>
              {showCvv ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <PayButton label="Pay Now" onPay={onPay} isProcessing={isProcessing} />
    </div>
  );
}

/* ─── UPI Form ─────────────────────────────────────────────────────────────── */
function UpiForm({ onPay, isProcessing }) {
  const [upi, setUpi] = useState("");
  const inp = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#fff",
    outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={labelSt}>UPI ID</label>
        <input style={inp} placeholder="yourname@upi" value={upi}
          onChange={(e) => setUpi(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#0f8554")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
      </div>
      <div style={{ padding: "12px 14px", background: "rgba(15,133,84,0.08)", border: "1px solid rgba(15,133,84,0.2)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
        Enter your UPI ID (e.g. mobile@paytm, name@ybl). You will receive a payment request on your UPI app.
      </div>
      <PayButton label="Send Payment Request" onPay={onPay} isProcessing={isProcessing} />
    </div>
  );
}

/* ─── Net Banking Form ─────────────────────────────────────────────────────── */
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda", "Yes Bank", "Canara Bank", "Union Bank of India"];
function NetbankingForm({ onPay, isProcessing }) {
  const [bank, setBank] = useState("");
  const sel = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "13px 16px", fontSize: 14, color: bank ? "#fff" : "rgba(255,255,255,0.35)",
    outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit",
    appearance: "none", cursor: "pointer",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={labelSt}>Select Your Bank</label>
        <select style={sel} value={bank} onChange={(e) => setBank(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#0f8554")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}>
          <option value="" disabled style={{ background: "#0a0f0c" }}>Choose bank</option>
          {BANKS.map((b) => <option key={b} value={b} style={{ background: "#0a0f0c" }}>{b}</option>)}
        </select>
      </div>
      <PayButton label="Proceed to Bank" onPay={onPay} isProcessing={isProcessing} />
    </div>
  );
}

/* ─── Wallets Form ─────────────────────────────────────────────────────────── */
const WALLETS = [
  { id: "paytm", name: "Paytm" },
  { id: "phonepe", name: "PhonePe" },
  { id: "amazonpay", name: "Amazon Pay" },
  { id: "mobikwik", name: "MobiKwik" },
  { id: "freecharge", name: "FreeCharge" },
];
function WalletsForm({ onPay, isProcessing }) {
  const [selected, setSelected] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <label style={labelSt}>Select Wallet</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WALLETS.map((w) => (
          <button key={w.id} type="button" onClick={() => setSelected(w.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              background: selected === w.id ? "rgba(15,133,84,0.12)" : "rgba(255,255,255,0.04)",
              border: selected === w.id ? "1px solid #0f8554" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "#fff", cursor: "pointer", fontSize: 14, transition: "all 0.2s",
            }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid", borderColor: selected === w.id ? "#0f8554" : "rgba(255,255,255,0.3)", background: selected === w.id ? "#0f8554" : "transparent", transition: "all 0.2s" }} />
            {w.name}
          </button>
        ))}
      </div>
      <PayButton label="Pay with Wallet" onPay={onPay} isProcessing={isProcessing} />
    </div>
  );
}

/* ─── Shared Pay Button ────────────────────────────────────────────────────── */
function PayButton({ label, onPay, isProcessing }) {
  return (
    <button type="button" onClick={onPay} disabled={isProcessing}
      style={{
        marginTop: 6, width: "100%", background: isProcessing ? "rgba(15,133,84,0.6)" : "linear-gradient(135deg,#0f8554,#0a5e3a)",
        color: "#fff", border: "none", borderRadius: 12, padding: "15px 24px",
        fontSize: 15, fontWeight: 700, cursor: isProcessing ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        boxShadow: isProcessing ? "none" : "0 8px 24px rgba(15,133,84,0.35)",
        transition: "all 0.25s", letterSpacing: "0.01em",
      }}>
      {isProcessing ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          {label}
        </>
      )}
    </button>
  );
}

/* ─── Shared label style ───────────────────────────────────────────────────── */
const labelSt = {
  fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)",
  textTransform: "uppercase", letterSpacing: "0.06em",
};

/* ─── Success Screen ───────────────────────────────────────────────────────── */
function SuccessScreen({ plan, method }) {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push("/dashboard"), 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "2rem 0", textAlign: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "linear-gradient(135deg,#0f8554,#0a5e3a)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 40px rgba(15,133,84,0.4)",
        animation: "pulse 2s ease-in-out infinite",
      }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>Payment Successful!</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 8, lineHeight: 1.6 }}>
          Welcome to the <strong style={{ color: PLANS[plan]?.color || "#bca374" }}>{PLANS[plan]?.name || "Lotus Club"}</strong>.<br />
          Your membership is now active.
        </p>
      </div>
      <div style={{ padding: "14px 24px", background: "rgba(15,133,84,0.1)", border: "1px solid rgba(15,133,84,0.25)", borderRadius: 12, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
        A confirmation has been sent to your registered email.
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Redirecting to dashboard in 5 seconds…</p>
      <Link href="/dashboard" style={{ textDecoration: "none" }}>
        <button style={{ background: "linear-gradient(135deg,#bca374,#9c8458)", color: "#0f172a", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
}

/* ─── Main Payment Page ────────────────────────────────────────────────────── */
function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planKey = searchParams.get("plan") || "gold";
  const memberName = searchParams.get("name") || "";
  const plan = PLANS[planKey] || PLANS.gold;

  const [selectedMethod, setSelectedMethod] = useState("card");
  const [selectedPlan, setSelectedPlan] = useState(planKey);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const activePlan = PLANS[selectedPlan] || plan;

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate payment gateway call — replace with real Razorpay / Stripe / PayU
    await new Promise((r) => setTimeout(r, 2500));
    setIsProcessing(false);
    setIsPaid(true);
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", position: "relative",
      backgroundImage: "url('/images/buddha-bg.webp')",
      backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      padding: "3rem 1.5rem 5rem",
    }}>
      {/* Overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 16px", color: "rgba(255,255,255,0.7)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#0f8554", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Wellness Lovers Club</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "4px 0 0" }}>Complete Your Membership</h1>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "2rem", alignItems: "start" }}>

          {/* Left Column: Plan Selector + Payment Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Plan Selection */}
            <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "1.75rem" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1.25rem" }}>Choose Your Plan</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {Object.entries(PLANS).map(([key, p]) => (
                  <button key={key} type="button" onClick={() => setSelectedPlan(key)}
                    style={{
                      position: "relative", padding: "18px 14px", borderRadius: 14, cursor: "pointer",
                      background: selectedPlan === key ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                      border: selectedPlan === key ? `2px solid ${p.color}` : "2px solid rgba(255,255,255,0.06)",
                      transition: "all 0.25s", textAlign: "center", outline: "none",
                      boxShadow: selectedPlan === key ? `0 0 24px ${p.glow}` : "none",
                    }}>
                    {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: p.gradient, borderRadius: 20, padding: "3px 12px", fontSize: 10, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>POPULAR</div>}
                    <div style={{ fontSize: 22, fontWeight: 800, color: p.color, marginBottom: 4 }}>{p.currency}{formatINR(p.price)}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{p.period}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: selectedPlan === key ? "#fff" : "rgba(255,255,255,0.6)" }}>{p.name}</div>
                    {selectedPlan === key && (
                      <div style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "1.25rem", padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>Includes</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {activePlan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(15,133,84,0.2)", border: "1px solid #0f8554", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0f8554" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Selector + Form */}
            <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "1.75rem" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1.25rem" }}>Payment Method</h2>

              {/* Method Tabs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: "1.5rem" }}>
                {PAYMENT_METHODS.map((m) => (
                  <button key={m.id} type="button" onClick={() => setSelectedMethod(m.id)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      padding: "14px 8px", borderRadius: 12, cursor: "pointer",
                      background: selectedMethod === m.id ? "rgba(15,133,84,0.12)" : "rgba(255,255,255,0.04)",
                      border: selectedMethod === m.id ? "1.5px solid #0f8554" : "1.5px solid rgba(255,255,255,0.08)",
                      color: selectedMethod === m.id ? "#0f8554" : "rgba(255,255,255,0.5)",
                      transition: "all 0.2s", outline: "none", fontSize: 11, fontWeight: 600,
                    }}>
                    {m.icon}
                    <span style={{ lineHeight: 1.2, textAlign: "center" }}>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Active Form */}
              {selectedMethod === "card" && <CardForm onPay={handlePay} isProcessing={isProcessing} />}
              {selectedMethod === "upi" && <UpiForm onPay={handlePay} isProcessing={isProcessing} />}
              {selectedMethod === "netbanking" && <NetbankingForm onPay={handlePay} isProcessing={isProcessing} />}
              {selectedMethod === "wallet" && <WalletsForm onPay={handlePay} isProcessing={isProcessing} />}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div style={{ position: "sticky", top: "2rem" }}>
            <div style={{
              background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden",
            }}>
              {/* Plan gradient header */}
              <div style={{ background: activePlan.gradient, padding: "2rem 1.75rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Order Summary</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>{activePlan.name}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "4px 0 0" }}>Annual Membership</p>
              </div>

              <div style={{ padding: "1.75rem" }}>
                {isPaid ? (
                  <SuccessScreen plan={selectedPlan} method={selectedMethod} />
                ) : (
                  <>
                    {memberName && (
                      <div style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(15,133,84,0.08)", borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                        👤 <strong style={{ color: "#fff" }}>{memberName}</strong>
                      </div>
                    )}

                    {/* Line items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                      {[
                        { label: activePlan.name + " Membership", value: `${activePlan.currency}${formatINR(activePlan.price)}` },
                        { label: "GST (18%)", value: `${activePlan.currency}${formatINR(Math.round(activePlan.price * 0.18))}` },
                        { label: "Processing Fee", value: "Free" },
                      ].map((item) => (
                        <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{item.label}</span>
                          <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Total Payable</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: activePlan.color }}>
                          {activePlan.currency}{formatINR(Math.round(activePlan.price * 1.18))}
                        </span>
                      </div>
                    </div>

                    {/* Security badges */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { icon: "🔒", text: "256-bit SSL Encrypted" },
                        { icon: "✅", text: "PCI DSS Compliant" },
                        { icon: "🔄", text: "7-day cancellation guarantee" },
                      ].map((b) => (
                        <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                          <span>{b.icon}</span>
                          <span>{b.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 40px rgba(15,133,84,0.4); } 50% { box-shadow: 0 0 60px rgba(15,133,84,0.7); } }
        input::placeholder { color: rgba(255,255,255,0.3) !important; }
        select option { background: #0a0f0c !important; }
      `}</style>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060a07" }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Loading payment options…</div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
