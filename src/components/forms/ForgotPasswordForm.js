"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
});

export default function ForgotPasswordForm({ isEmbed = false }) {
  const { forgotPassword } = useAuth();
  const [apiError, setApiError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    setIsShaking(false);

    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err) {
      setApiError(err.message || "Email address not found.");
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
        className={isEmbed
          ? "w-full max-w-md bg-transparent border-0 p-0 shadow-none text-center"
          : "w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-[24px] shadow-xl text-center"
        }
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 size={36} />
          </motion.div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Reset Link Sent
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We have sent a password reset link to your email address. Please check your inbox and spam folder.
          </p>
          <Link href="/login" className="w-full mt-4">
            <Button variant="outline">
              <ArrowLeft size={16} />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={isEmbed
        ? "w-full max-w-md bg-transparent border-0 p-0 shadow-none"
        : "w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-[24px] shadow-xl shadow-slate-100/50"
      }
    >
      <div className="flex flex-col gap-2 text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Forgot Password
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <motion.form
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {apiError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200/80 text-rose-600 text-sm font-medium rounded-xl text-center">
            {apiError}
          </div>
        )}

        <Input
          label="Email Address"
          placeholder="aria@example.com"
          type="email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" loading={isLoading}>
          Send Reset Link
        </Button>
      </motion.form>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
