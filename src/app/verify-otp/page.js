"use client";

import React from "react";
import OTPVerificationForm from "@/components/forms/OTPVerificationForm";
import "./verify-otp.css";

export default function OTPVerificationPage() {
  return (
    <div className="otp-root">
      <div className="otp-glow-1"></div>
      <div className="otp-glow-2"></div>
      <OTPVerificationForm />
    </div>
  );
}
