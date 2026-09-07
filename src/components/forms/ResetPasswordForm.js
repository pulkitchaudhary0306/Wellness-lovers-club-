"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ArrowLeft, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./AuthForm.css";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm({ isEmbed = false }) {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    setIsShaking(false);

    let key = "";
    let login = "";

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      key = params.get("key") || "";
      login = params.get("login") || "";
    }

    if (!key || !login) {
      setApiError("The password reset link is invalid or incomplete. Please request a new reset link.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword({
        key,
        login,
        password: data.password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login?message=reset_success");
      }, 2000);
    } catch (err) {
      setApiError(err.message || "Failed to reset password. Please try again.");
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
        className={`wlc-auth-card ${isEmbed ? "embed" : ""}`}
      >
        <div className="wlc-auth-icon-wrap" style={{ color: "#34d399", background: "rgba(16, 185, 129, 0.12)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 className="wlc-auth-title">Password Reset Complete</h2>
        <p className="wlc-auth-desc">
          Your password has been successfully updated. Redirecting you to the sign-in page...
        </p>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button type="button" className="wlc-auth-submit-btn">
            <ArrowLeft size={16} />
            Sign In Now
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

      <h2 className="wlc-auth-title">Reset Password</h2>
      <p className="wlc-auth-desc">
        Create a new strong password for your Wellness Lovers Club account.
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
          label="New Password"
          placeholder="Minimum 8 characters"
          type="password"
          icon={Lock}
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm Password"
          placeholder="Re-enter new password"
          type="password"
          icon={Lock}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <button type="submit" disabled={isLoading} className="wlc-auth-submit-btn">
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Updating Password...
            </>
          ) : (
            "Set New Password"
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
