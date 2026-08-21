"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Download, Copy, Check, Sparkles } from "lucide-react";

/**
 * Format membership number cleanly
 */
export function formatMembershipNo(user, rawMembershipId) {
  if (rawMembershipId && String(rawMembershipId).trim().length > 0) {
    return String(rawMembershipId).toUpperCase();
  }
  if (user?.membershipNumber && String(user.membershipNumber).trim().length > 0) {
    return String(user.membershipNumber).toUpperCase();
  }
  const idSeed = user?.id || "4104";
  const num = parseInt(String(idSeed).replace(/\D/g, ""), 10);
  if (!isNaN(num) && num >= 4104) {
    return `WLC-${num}`;
  }
  return "WLC-4104";
}

/**
 * Format date as MM/YY
 */
export function formatMonthYear(rawDate, offsetYears = 0) {
  let d = new Date();
  if (rawDate) {
    if (typeof rawDate === "string" && rawDate.includes("/")) {
      const parts = rawDate.split("/").map((p) => p.trim());
      if (parts.length === 3) {
        d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (parts.length === 2) {
        return rawDate.trim();
      }
    } else {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) d = parsed;
    }
  }

  if (offsetYears !== 0) {
    d.setFullYear(d.getFullYear() + offsetYears);
  }

  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

export function formatFullDate(rawDate, offsetYears = 0) {
  let d = new Date();
  if (rawDate) {
    if (typeof rawDate === "string" && rawDate.includes("/")) {
      const parts = rawDate.split("/").map((p) => p.trim());
      if (parts.length === 3) {
        d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    } else {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) d = parsed;
    }
  }

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

  // Dynamic Card Values
  const memberName = (
    propName ||
    user?.fullName ||
    user?.display_name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    "AARAV SHARMA"
  ).toUpperCase();

  const membershipNo = propMembershipNo || formatMembershipNo(user, user?.membershipNumber || user?.membershipId || "WLC-4104");
  
  // Format MM/YY for VALID TO (e.g. 08/27, or join date + 1 year)
  const validToMonthYear = formatMonthYear(propValidTo || propValidTill || user?.validTill || user?.validUntil, (propValidTo || propValidTill || user?.validTill) ? 0 : 1);
  const validToFull = formatFullDate(propValidTo || propValidTill || user?.validTill || user?.validUntil, (propValidTo || propValidTill || user?.validTill) ? 0 : 1);

  // Preload background image in memory on mount
  useEffect(() => {
    const img = new Image();
    img.src = "/images/wlc-card-clean-bg.jpg";
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
        bgImg.src = "/images/wlc-card-clean-bg.jpg";
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

      // Subtle contrast gradient overlay on the left side
      const overlayGrad = ctx.createLinearGradient(0, 0, width * 0.65, 0);
      overlayGrad.addColorStop(0, "rgba(6, 24, 17, 0.82)");
      overlayGrad.addColorStop(0.5, "rgba(8, 28, 20, 0.55)");
      overlayGrad.addColorStop(1, "rgba(10, 32, 23, 0)");
      ctx.fillStyle = overlayGrad;
      ctx.fillRect(0, 0, width * 0.65, height);

      // Gold Hairline Outer Border
      ctx.strokeStyle = "rgba(212, 184, 150, 0.4)";
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // ─── 2. TOP LEFT: WLC Monogram & Branding ───
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // WLC Monogram
      ctx.font = "700 135px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("W", 160, 240);
      ctx.font = "600 118px 'Playfair Display', Georgia, serif";
      ctx.fillText("L", 285, 240);
      ctx.font = "italic 400 135px 'Playfair Display', Georgia, serif";
      ctx.fillText("C", 355, 240);

      // WELLNESS LOVERS CLUB
      ctx.font = "700 38px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = "6px";
      ctx.fillText("WELLNESS LOVERS CLUB", 160, 355);

      // — BY GLOBALSPA —
      ctx.font = "600 24px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("—  BY GLOBALSPA  —", 220, 405);

      // ─── 3. TOP RIGHT: NOURISH / RELAX / THRIVE + Leaf Icon ───
      ctx.textAlign = "right";
      ctx.font = "700 26px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("NOURISH", width - 260, 185);
      ctx.fillText("RELAX", width - 260, 230);
      ctx.fillText("THRIVE", width - 260, 275);

      // Leaf Icon
      ctx.save();
      ctx.strokeStyle = "#8fa89b";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(width - 230, 215);
      ctx.bezierCurveTo(width - 200, 175, width - 160, 195, width - 170, 245);
      ctx.bezierCurveTo(width - 210, 255, width - 220, 235, width - 230, 215);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(width - 195, 215);
      ctx.bezierCurveTo(width - 170, 185, width - 130, 205, width - 140, 255);
      ctx.bezierCurveTo(width - 180, 265, width - 190, 240, width - 195, 215);
      ctx.stroke();
      ctx.restore();

      // ─── 4. MIDDLE: MEMBER NAME ───
      ctx.textAlign = "left";
      ctx.font = "700 32px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "5px";
      ctx.fillText("MEMBER NAME", 160, 685);

      ctx.font = "800 84px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = "4px";
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 14;
      ctx.fillText(memberName, 160, 780);
      ctx.shadowBlur = 0;

      // ─── 5. BOTTOM FIELDS: MEMBERSHIP NO. | VALID TO ───
      ctx.font = "700 30px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("MEMBERSHIP NO.", 160, 960);

      ctx.font = "800 72px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = "4px";
      ctx.fillText(membershipNo, 160, 1045);

      // Vertical Divider Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(850, 935);
      ctx.lineTo(850, 1065);
      ctx.stroke();

      // VALID TO
      ctx.font = "700 30px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("VALID TO", 920, 960);

      ctx.font = "800 72px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = "4px";
      ctx.fillText(validToMonthYear, 920, 1045);

      // ─── 6. BOTTOM FOOTER STRIP ───
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(120, 1260);
      ctx.lineTo(width - 120, 1260);
      ctx.stroke();

      // Lotus Badge
      ctx.save();
      ctx.strokeStyle = "rgba(212, 184, 150, 0.85)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(170, 1345, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.font = "600 24px 'Montserrat', Arial, sans-serif";
      ctx.fillStyle = "#8fa89b";
      ctx.letterSpacing = "4px";
      ctx.fillText("WELLNESS IS A LIFESTYLE.", 220, 1345);

      // Contactless Wave
      ctx.save();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(width - 200, 1345, 36, -Math.PI * 0.35, Math.PI * 0.35, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width - 200, 1345, 24, -Math.PI * 0.35, Math.PI * 0.35, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width - 200, 1345, 12, -Math.PI * 0.35, Math.PI * 0.35, false);
      ctx.stroke();
      ctx.restore();

      // ─── 7. Guaranteed File Trigger via Blob & Data URL ───
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
      console.error("Error generating membership card download:", err);
      alert("Error generating membership card download: " + (err?.message || "Please try again."));
    } finally {
      setIsDownloading(false);
    }
  }, [memberName, membershipNo, validToMonthYear, isDownloading]);

  return (
    <div className="wlc-membership-container">
      {/* ── Exact Visual Card from Reference Design ────────────── */}
      <div className="wlc-zen-card-wrapper" ref={cardRef}>
        <div className="wlc-zen-card">
          
          {/* Card Background Image with Leaves on Deep Forest Green */}
          <div className="wlc-zen-card-bg" />

          {/* Card Top Row: Monogram + Slogan */}
          <div className="wlc-zen-header">
            <div className="wlc-zen-brand-col">
              <div className="wlc-zen-monogram">W<span className="wlc-zen-l">L</span><span className="wlc-zen-c">C</span></div>
              <div className="wlc-zen-brand-text">WELLNESS LOVERS CLUB</div>
              <div className="wlc-zen-brand-sub">
                <span className="wlc-zen-dash">—</span> BY GLOBALSPA <span className="wlc-zen-dash">—</span>
              </div>
            </div>

            <div className="wlc-zen-slogan-col">
              <div className="wlc-zen-slogan-words">
                <span>NOURISH</span>
                <span>RELAX</span>
                <span>THRIVE</span>
              </div>
              <svg className="wlc-zen-leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8 6 6 11 8 16C10 21 16 22 20 20C22 16 21 10 16 8C11 6 6 8 2 12" />
                <path d="M8 16C12 12 16 8 20 4" />
              </svg>
            </div>
          </div>

          {/* Card Middle: MEMBER NAME */}
          <div className="wlc-zen-name-section">
            <span className="wlc-zen-field-label">MEMBER NAME</span>
            <h2 className="wlc-zen-member-name">{memberName}</h2>
          </div>

          {/* Card Bottom Row: MEMBERSHIP NO. | VALID TO */}
          <div className="wlc-zen-details-row">
            {/* Column 1: MEMBERSHIP NO. */}
            <div className="wlc-zen-col">
              <span className="wlc-zen-field-label">MEMBERSHIP NO.</span>
              <div className="wlc-zen-val-with-copy">
                <span className="wlc-zen-field-val">{membershipNo}</span>
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

            <div className="wlc-zen-divider" />

            {/* Column 2: VALID TO */}
            <div className="wlc-zen-col">
              <span className="wlc-zen-field-label">VALID TO</span>
              <span className="wlc-zen-field-val">{validToMonthYear}</span>
            </div>
          </div>

          {/* Card Bottom Strip: Lotus + Slogan + Contactless Wave */}
          <div className="wlc-zen-footer-strip">
            <div className="wlc-zen-footer-left">
              <div className="wlc-zen-lotus-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4b896" strokeWidth="2">
                  <path d="M12 3C13.5 9 18 12 18 16C18 19.3 15.3 22 12 22C8.7 22 6 19.3 6 16C6 12 10.5 9 12 3Z" />
                  <path d="M12 8C15 12 21 13.5 21 17C21 19.8 18.8 22 16 22" />
                  <path d="M12 8C9 12 3 13.5 3 17C3 19.8 5.2 22 8 22" />
                </svg>
              </div>
              <span className="wlc-zen-lifestyle-text">WELLNESS IS A LIFESTYLE.</span>
            </div>

            <div className="wlc-zen-contactless">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round">
                <path d="M15.5 6.5C18.5 9.5 18.5 14.5 15.5 17.5" />
                <path d="M12 9C13.8 10.8 13.8 13.2 12 15" />
                <path d="M8.5 11.5C9 12 9 12.5 8.5 13" />
              </svg>
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
