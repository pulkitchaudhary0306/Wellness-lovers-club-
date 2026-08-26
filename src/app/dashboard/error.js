"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertCircle } from "lucide-react";

export default function DashboardErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "75vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
      color: "#e2e8f0",
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "rgba(188, 163, 116, 0.12)",
        border: "1px solid rgba(188, 163, 116, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.5rem",
        color: "var(--gold, #bca374)",
      }}>
        <AlertCircle size={32} />
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: "0.75rem", color: "#ffffff" }}>
        Unable to Load Dashboard
      </h2>

      <p style={{ maxWidth: 480, fontSize: 14, color: "#8fa89b", lineHeight: 1.6, marginBottom: "2rem" }}>
        We encountered a temporary issue while retrieving your membership portal. Please try reloading or returning to the home page.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #bca374 0%, #9c8458 100%)",
            color: "#071711",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={16} />
          Reload Dashboard
        </button>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 8,
            background: "rgba(255, 255, 255, 0.06)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            textDecoration: "none",
          }}
        >
          <Home size={16} />
          Return Home
        </Link>
      </div>
    </div>
  );
}
