"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OTPVerificationForm from "@/components/forms/OTPVerificationForm";
import "./verify-otp.css";
import Head from "next/head";

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
    <>
      <Head>
        <title>Verify OTP – Wellness Lovers Club</title>
        <meta name="description" content="Enter the OTP sent to your phone or email to complete registration for the Wellness Lovers Club." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="otp-root">
        <div className="otp-glow-1"></div>
        <div className="otp-glow-2"></div>
        <Suspense fallback={<div className="text-white text-center p-8">Loading…</div>}>
          <VerifyOTPContent />
        </Suspense>
      </div>
    </>
  );
}
