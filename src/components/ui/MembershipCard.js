"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Download, Copy, Check, Sparkles } from "lucide-react";
import "@/app/dashboard/Dashboard.css";

/**
 * Format membership number cleanly from WordPress user/profile data.
 * Priority: prop / direct raw -> membershipNumber -> membershipId -> wlc_membership_number -> wlc_membership_id -> "Pending Allocation"
 * NEVER generates or invents a fallback sequence number.
 */
export function formatMembershipNo(user, rawMembershipId) {
  const candidate =
    (rawMembershipId && String(rawMembershipId).trim().length > 0 && String(rawMembershipId).trim() !== "Pending Allocation"
      ? String(rawMembershipId).trim()
      : null) ||
    (user?.membershipNumber && String(user.membershipNumber).trim().length > 0 ? String(user.membershipNumber).trim() : null) ||
    (user?.membershipId && String(user.membershipId).trim().length > 0 ? String(user.membershipId).trim() : null) ||
    (user?.wlc_membership_number && String(user.wlc_membership_number).trim().length > 0 ? String(user.wlc_membership_number).trim() : null) ||
    (user?.wlc_membership_id && String(user.wlc_membership_id).trim().length > 0 ? String(user.wlc_membership_id).trim() : null) ||
    (user?.membership_id && String(user.membership_id).trim().length > 0 ? String(user.membership_id).trim() : null);

  if (candidate) {
    return candidate.toUpperCase();
  }
  return "Pending Allocation";
}

export function formatMonthYear(rawDate, offsetYears = 0) {
  if (!rawDate && offsetYears === 0) return "—";
  if (typeof rawDate === "string") {
    const trimmed = rawDate.trim();
    if (!trimmed || trimmed === "—") return "—";

    if (trimmed.includes("/")) {
      const parts = trimmed.split("/").map((p) => p.trim());
      if (parts.length === 3) {
        if (parts[2].length === 4) {
          const m = parts[1].padStart(2, "0");
          const y = parts[2].slice(-2);
          return `${m}/${y}`;
        }
        if (parts[0].length === 4) {
          const m = parts[1].padStart(2, "0");
          const y = parts[0].slice(-2);
          return `${m}/${y}`;
        }
      } else if (parts.length === 2) {
        const m = parts[0].padStart(2, "0");
        const y = parts[1].slice(-2);
        return `${m}/${y}`;
      }
    }

    if (trimmed.includes("-")) {
      const datePart = trimmed.split(/\s+/)[0];
      const parts = datePart.split("-").map((p) => p.trim());
      if (parts.length >= 2) {
        if (parts[0].length === 4) {
          const y = parts[0].slice(-2);
          const m = parts[1].padStart(2, "0");
          return `${m}/${y}`;
        } else if (parts[parts.length - 1].length === 4) {
          const y = parts[parts.length - 1].slice(-2);
          const m = parts[1].padStart(2, "0");
          return `${m}/${y}`;
        }
      }
    }
  }

  let d = new Date(rawDate);
  if (isNaN(d.getTime())) return "—";
  if (offsetYears !== 0) {
    d.setFullYear(d.getFullYear() + offsetYears);
  }
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

export function formatFullDate(rawDate, offsetYears = 0) {
  if (!rawDate && offsetYears === 0) return "—";
  if (typeof rawDate === "string") {
    const trimmed = rawDate.trim();
    if (!trimmed || trimmed === "—") return "—";

    if (trimmed.includes("/")) {
      const parts = trimmed.split("/").map((p) => p.trim());
      if (parts.length === 3) {
        if (parts[2].length === 4) {
          return `${parts[0].padStart(2, "0")} / ${parts[1].padStart(2, "0")} / ${parts[2]}`;
        }
        if (parts[0].length === 4) {
          return `${parts[2].padStart(2, "0")} / ${parts[1].padStart(2, "0")} / ${parts[0]}`;
        }
      }
    }

    if (trimmed.includes("-")) {
      const datePart = trimmed.split(/\s+/)[0];
      const parts = datePart.split("-").map((p) => p.trim());
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2].padStart(2, "0")} / ${parts[1].padStart(2, "0")} / ${parts[0]}`;
      }
    }
  }

  let d = new Date(rawDate);
  if (isNaN(d.getTime())) return "—";
  if (offsetYears !== 0) {
    d.setFullYear(d.getFullYear() + offsetYears);
  }
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day} / ${month} / ${year}`;
}

export const formatValidTillDate = formatFullDate;

export default function MembershipCard({
  user,
  membershipCard,
  name: propName,
  membershipNo: propMembershipNo,
  validTo: propValidTo,
  validTill: propValidTill,
}) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const cardRef = useRef(null);
  const preloadedImgRef = useRef(null);

  // Dynamic Card Values — sourced strictly from live backend
  const memberName = (
    membershipCard?.displayName ||
    membershipCard?.name ||
    (membershipCard?.firstName
      ? `${membershipCard.firstName} ${membershipCard?.lastName || ""}`.trim()
      : "") ||
    propName ||
    user?.fullName ||
    user?.display_name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    "VALUED MEMBER"
  ).toUpperCase();

  const membershipNo = formatMembershipNo(
    user,
    membershipCard?.membershipNumber || membershipCard?.membershipId || propMembershipNo
  );
  
  // Format MM/YY for VALID TO from WordPress backend date
  const rawValidTo =
    membershipCard?.validUntil ||
    membershipCard?.validTill ||
    propValidTo ||
    propValidTill ||
    user?.validTill ||
    user?.validUntil ||
    user?.membershipValidUntil ||
    "";
  const validToMonthYear = formatMonthYear(rawValidTo, 0);
  const validToFull = formatFullDate(rawValidTo, 0);

  // Preload background image in memory on mount
  useEffect(() => {
    const img = new Image();
    img.src = "/images/wlc-membership-card-bg.webp";
    preloadedImgRef.current = img;
  }, []);

  const handleCopyNo = async () => {
    try {
      await navigator.clipboard.writeText(membershipNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  /**
   * Guaranteed High-Resolution Card Download Handler (2400 x 1500 PNG)
   */
  const handleDownloadCard = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const width = 2400;
      const height = 1500;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context unavailable");

      // 1. Draw Background Image or Luxury Emerald Fallback
      let bgImg = preloadedImgRef.current;
      if (!bgImg || !bgImg.complete || bgImg.naturalWidth === 0) {
        bgImg = new Image();
        bgImg.src = "/images/wlc-membership-card-bg.webp";
        await new Promise((resolve) => {
          bgImg.onload = () => resolve(true);
          bgImg.onerror = () => resolve(false);
          setTimeout(() => resolve(false), 1200); // 1.2s timeout fallback
        });
      }

      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, width, height);
      } else {
        // Gradient Fallback
        const bgGrad = ctx.createRadialGradient(
          width * 0.3, height * 0.25, 100,
          width * 0.5, height * 0.5, width * 0.8
        );
        bgGrad.addColorStop(0, "#1b4233");
        bgGrad.addColorStop(0.5, "#0d2b1f");
        bgGrad.addColorStop(1, "#061811");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // ─── 2. TOP RIGHT: NOURISH / RELAX / THRIVE + Leaf Loops Icon ───
      ctx.save();
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.font = "700 20px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "3px";
      ctx.fillText("NOURISH", width - 260, 150);
      ctx.fillText("RELAX", width - 260, 185);
      ctx.fillText("THRIVE", width - 260, 220);

      // Overlapping Leaf Loop Curves
      ctx.strokeStyle = "#8fa89b";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(width - 200, 185, 36, 20, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(width - 170, 185, 36, 20, -Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ─── 3. MIDDLE: MEMBER NAME (Left Zone) ───
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = "700 26px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("MEMBER NAME", 150, 680);

      ctx.font = "800 72px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = "2px";
      ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
      ctx.shadowBlur = 14;
      ctx.fillText(memberName, 150, 765);
      ctx.shadowBlur = 0;

      // ─── 4. BOTTOM FIELDS: MEMBERSHIP NO. | VALID TO (Left Zone) ───
      // Column 1: MEMBERSHIP NO.
      ctx.font = "700 24px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("MEMBERSHIP NO.", 150, 950);

      const isPending = membershipNo.toUpperCase() === "PENDING ALLOCATION";
      ctx.font = isPending ? "700 42px 'Montserrat', Arial, sans-serif" : "800 62px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = isPending ? "rgba(255, 255, 255, 0.85)" : "#ffffff";
      ctx.letterSpacing = "2px";
      ctx.fillText(membershipNo, 150, 1030);

      // Vertical Divider Line (between Member No and Valid To)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(850, 940);
      ctx.lineTo(850, 1060);
      ctx.stroke();

      // Column 2: VALID TO
      ctx.font = "700 24px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("VALID TO", 910, 950);

      ctx.font = "800 62px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = "2px";
      ctx.fillText(validToMonthYear, 910, 1030);

      // ─── 5. BOTTOM DIVIDER & FOOTER ───
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 1260);
      ctx.lineTo(width - 120, 1260);
      ctx.stroke();

      // Bottom-Left: Circle Outline + WELLNESS IS A LIFESTYLE.
      ctx.save();
      ctx.strokeStyle = "#8fa89b";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(160, 1345, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = "600 22px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("WELLNESS IS A LIFESTYLE.", 205, 1345);
      ctx.restore();

      // Bottom-Right: Contactless NFC Waves
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(width - 170, 1345, 32, -Math.PI * 0.35, Math.PI * 0.35, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width - 170, 1345, 22, -Math.PI * 0.35, Math.PI * 0.35, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width - 170, 1345, 12, -Math.PI * 0.35, Math.PI * 0.35, false);
      ctx.stroke();
      ctx.restore();

      // ─── 6. Guaranteed File Trigger via Blob & Data URL ───
      const triggerDownload = (url) => {
        const downloadLink = document.createElement("a");
        downloadLink.style.display = "none";
        downloadLink.href = url;
        downloadLink.download = `WLC-Membership-Card-${membershipNo}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          document.body.removeChild(downloadLink);
          if (url.startsWith("blob:")) URL.revokeObjectURL(url);
        }, 1500);
      };

      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            triggerDownload(blobUrl);
          } else {
            const dataUrl = canvas.toDataURL("image/png", 1.0);
            triggerDownload(dataUrl);
          }
        }, "image/png", 1.0);
      } else {
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        triggerDownload(dataUrl);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to generate membership card:", err);
      alert("Could not generate card image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [memberName, membershipNo, validToMonthYear, isDownloading]);

  const isPendingAllocation = membershipNo.toUpperCase() === "PENDING ALLOCATION";

  return (
    <div className="wlc-membership-container">
      {/* ── Exact Visual Card from Reference Design ────────────── */}
      <div className="wlc-zen-card-wrapper" ref={cardRef}>
        <div className="wlc-zen-card">
          
          {/* Card Background Image with Leaves on Deep Forest Green */}
          <div className="wlc-zen-card-bg" />

          {/* Top-Right: NOURISH / RELAX / THRIVE + Leaf Loops Icon */}
          <div className="wlc-zen-top-right">
            <div className="wlc-zen-motto">
              <span>NOURISH</span>
              <span>RELAX</span>
              <span>THRIVE</span>
            </div>
            <div className="wlc-zen-motto-icon">
              <svg width="30" height="22" viewBox="0 0 36 24" fill="none" stroke="#8fa89b" strokeWidth="1.8">
                <ellipse cx="13" cy="12" rx="11" ry="8" transform="rotate(-15 13 12)" />
                <ellipse cx="23" cy="12" rx="11" ry="8" transform="rotate(15 23 12)" />
              </svg>
            </div>
          </div>

          {/* Member Name Section */}
          <div className="wlc-zen-name-section">
            <span className="wlc-zen-field-label">MEMBER NAME</span>
            <h2 className="wlc-zen-member-name">{memberName}</h2>
          </div>

          {/* Details Row: MEMBERSHIP NO. | VALID TO */}
          <div className="wlc-zen-details-row">
            {/* Column 1: MEMBERSHIP NO. */}
            <div className="wlc-zen-col">
              <span className="wlc-zen-field-label">MEMBERSHIP NO.</span>
              <div className="wlc-zen-val-with-copy">
                <span className={`wlc-zen-field-val ${isPendingAllocation ? "pending" : ""}`}>
                  {membershipNo}
                </span>
                <button
                  type="button"
                  className="wlc-zen-copy-btn"
                  onClick={handleCopyNo}
                  title="Copy Membership No."
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="wlc-zen-vertical-divider" />

            {/* Column 2: VALID TO */}
            <div className="wlc-zen-col valid-to-col">
              <span className="wlc-zen-field-label">VALID TO</span>
              <span className="wlc-zen-field-val">{validToMonthYear}</span>
            </div>
          </div>

          {/* Card Bottom Divider & Brand Line */}
          <div className="wlc-zen-bottom-section">
            <div className="wlc-zen-bottom-line" />
            <div className="wlc-zen-bottom-row">
              <div className="wlc-zen-bottom-left">
                <div className="wlc-zen-circle-badge" />
                <span className="wlc-zen-lifestyle-text">WELLNESS IS A LIFESTYLE.</span>
              </div>
              <div className="wlc-zen-nfc-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M15.5 6.5C18.5 9.5 18.5 14.5 15.5 17.5" />
                  <path d="M12 9C13.8 10.8 13.8 13.2 12 15" />
                  <path d="M8.5 11.5C9 12 9 12.5 8.5 13" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metadata Summary & Download Button ──────────────────────── */}
      <div className="wlc-actions-bar">
        <div className="wlc-membership-summary-meta">
          <div className="wlc-meta-pill">
            <span className="wlc-meta-label">Member Name:</span>
            <strong className="wlc-meta-val">{memberName}</strong>
          </div>
          <div className="wlc-meta-pill">
            <span className="wlc-meta-label">Membership No.:</span>
            <strong className="wlc-meta-val gold">{membershipNo}</strong>
          </div>
          <div className="wlc-meta-pill">
            <span className="wlc-meta-label">Valid To:</span>
            <strong className="wlc-meta-val active">{validToFull}</strong>
          </div>
        </div>

        <button
          type="button"
          className={`wlc-download-btn ${downloadSuccess ? "success" : ""}`}
          onClick={handleDownloadCard}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <div className="wlc-btn-spinner" />
              <span>Generating High-Res Card…</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check size={18} />
              <span>Membership Card Downloaded!</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>DOWNLOAD MEMBERSHIP CARD</span>
            </>
          )}
        </button>

        <p className="wlc-download-caption">
          High-resolution printable digital membership card format (PNG).
        </p>
      </div>
    </div>
  );
}
