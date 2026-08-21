"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OTPVerificationForm from "@/components/forms/OTPVerificationForm";
import "./verify-otp.css";

function VerifyOTPContent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || searchParams.get("mobile") || "";
  const email = searchParams.get("email") || searchParams.get("identifier") || "";

  return (
    <div className="w-full flex flex-col items-center">
      <OTPVerificationForm prefilledIdentifier={phone || email} prefilledEmail={email} />
    </div>
  );
}

export default function OTPVerificationPage() {
  return (
    <div className="otp-root">
      <div className="otp-glow-1"></div>
      <div className="otp-glow-2"></div>
      <Suspense fallback={<div className="text-white text-center p-8">Loading…</div>}>
        <VerifyOTPContent />
      </Suspense>
    </div>
  );
}
