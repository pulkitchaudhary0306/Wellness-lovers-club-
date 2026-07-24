"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, LogOut, CheckCircle } from "lucide-react";

export default function LogoutPage() {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("signing-out"); // "signing-out" | "done"

  useEffect(() => {
    const doLogout = async () => {
      try {
        if (isAuthenticated) {
          await logout();
        }
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        setStatus("done");
        setTimeout(() => {
          router.push("/membership");
        }, 2000);
      }
    };

    doLogout();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", width: "100%", display: "flex",
      alignItems: "center", justifyContent: "center",
      backgroundImage: "url('/images/buddha-bg.webp')",
      backgroundSize: "cover", backgroundPosition: "center",
      backgroundAttachment: "fixed", position: "relative",
    }}>
      {/* Overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 0 }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 1,
        background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
        padding: "3rem 2.5rem", maxWidth: 380, width: "90%",
        textAlign: "center", display: "flex", flexDirection: "column",
        alignItems: "center", gap: "1.25rem",
        boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
      }}>

        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: status === "done" ? "rgba(15,133,84,0.15)" : "rgba(255,255,255,0.06)",
          border: status === "done" ? "1px solid rgba(15,133,84,0.35)" : "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.4s ease",
        }}>
          {status === "done"
            ? <CheckCircle size={30} color="#0f8554" />
            : <LogOut size={28} color="rgba(255,255,255,0.6)" />
          }
        </div>

        {/* Heading */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
            {status === "done" ? "Signed Out" : "Signing Out…"}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6, fontWeight: 300, lineHeight: 1.6 }}>
            {status === "done"
              ? "You've been securely signed out. Redirecting to membership page…"
              : "Please wait while we securely end your session."
            }
          </p>
        </div>

        {/* Loader or redirect indicator */}
        {status === "signing-out" ? (
          <Loader2 size={20} color="#0f8554" style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <div style={{
            display: "flex", gap: 6, alignItems: "center",
            fontSize: 11, color: "rgba(255,255,255,0.35)",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", background: "#0f8554",
              animation: "pulse 1.2s ease-in-out infinite",
            }} />
            Redirecting to membership page…
          </div>
        )}

        {/* Manual redirect link */}
        <a
          href="/membership"
          style={{
            fontSize: 12, color: "#0f8554", fontWeight: 600,
            textDecoration: "none", marginTop: "0.25rem",
          }}
        >
          Click here if not redirected
        </a>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
      `}</style>
    </div>
  );
}
