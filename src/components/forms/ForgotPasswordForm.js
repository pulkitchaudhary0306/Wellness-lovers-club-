"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./AuthForm.css";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
});

export default function ForgotPasswordForm({ isEmbed = false }) {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    setIsShaking(false);
    setSubmittedEmail(data.email);

    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err) {
      setApiError(err.message || "Unable to send reset link. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`wlc-auth-card ${isEmbed ? "embed" : ""}`}
      >
        <div className="wlc-auth-icon-wrap" style={{ color: "#34d399", background: "rgba(16, 185, 129, 0.12)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 className="wlc-auth-title">Reset Link Sent</h2>
        <p className="wlc-auth-desc">
          We have sent password reset instructions to <strong>({submittedEmail})</strong>. Please check your inbox and click the link inside to set a new password.
        </p>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button type="button" className="wlc-auth-submit-btn">
            <ArrowLeft size={16} />
            Return to Sign In
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`wlc-auth-card ${isEmbed ? "embed" : ""}`}
    >
      <div className="wlc-auth-icon-wrap">
        <KeyRound size={28} />
      </div>

      <h2 className="wlc-auth-title">Forgot Password</h2>
      <p className="wlc-auth-desc">
        Enter your registered email address and we&apos;ll send you a link to reset your password.
      </p>

      <motion.form
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit(onSubmit)}
        className="wlc-auth-form"
      >
        {apiError && (
          <div className="wlc-auth-error">
            {apiError}
          </div>
        )}

        <Input
          label="Registered Email Address"
          placeholder="aria@example.com"
          type="email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <button type="submit" disabled={isLoading} className="wlc-auth-submit-btn">
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </motion.form>

      <div style={{ textAlign: "center" }}>
        <Link href="/login" className="wlc-auth-back-link">
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
