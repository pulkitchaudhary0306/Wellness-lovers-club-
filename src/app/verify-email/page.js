"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OTPVerificationForm from "@/components/forms/OTPVerificationForm";
import "../verify-otp/verify-otp.css";

/**
 * /verify-email
 *
 * This page handles email OTP verification ONLY.
 * Link-based token verification has been removed — the flow is:
 *   Register → OTP emailed → User enters OTP here → JWT issued → Dashboard
 *
 * URL params:
 *   ?email=user@example.com   (pre-fills the OTP form so user knows where OTP was sent)
 */
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || searchParams.get("mobile") || "";
  const email = searchParams.get("email") || searchParams.get("identifier") || "";

  return (
    <div className="w-full flex flex-col items-center">
      <OTPVerificationForm prefilledIdentifier={phone || email} prefilledEmail={email} />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="otp-root">
      <div className="otp-glow-1"></div>
      <div className="otp-glow-2"></div>
      <Suspense fallback={<div className="text-white text-center p-8">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
