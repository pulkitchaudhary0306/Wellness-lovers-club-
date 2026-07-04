"use client";

import React from "react";
import OTPVerificationForm from "@/components/forms/OTPVerificationForm";

export default function OTPVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-5">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] aspect-square rounded-full bg-emerald-300 filter blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] aspect-square rounded-full bg-blue-300 filter blur-[120px]"></div>
      </div>
      <OTPVerificationForm />
    </div>
  );
}
