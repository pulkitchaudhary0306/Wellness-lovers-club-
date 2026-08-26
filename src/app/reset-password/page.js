"use client";

import React, { Suspense } from "react";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="wlc-auth-page-root">
      <div className="wlc-auth-glow-1" />
      <div className="wlc-auth-glow-2" />
      <Suspense fallback={<div className="text-white text-center p-8">Loading…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
