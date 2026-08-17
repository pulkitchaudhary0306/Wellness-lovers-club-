"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Zod Login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false)
});

export default function LoginForm({ isEmbed = false }) {
  const { login } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    setIsShaking(false);

    try {
      await login(data.email, data.password, data.rememberMe);
      // Success — redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      const code = err?.code;
      const isUnverified =
        code === "EMAIL_NOT_VERIFIED" ||
        err?.message?.toLowerCase().includes("not verified") ||
        err?.message?.toLowerCase().includes("verify your email");

      if (isUnverified) {
        const unverifiedEmail = err?.email || data.email;
        setApiError(
          <>
            {err?.message || "Your email address is not verified yet."}{" "}
            <a
              href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
              className="underline font-semibold ml-1 hover:text-rose-700"
            >
              Verify Now →
            </a>
          </>
        );
      } else {
        setApiError(err?.message || "Something went wrong. Please check your credentials.");
      }
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={isEmbed 
        ? "w-full max-w-md bg-transparent border-0 p-0 shadow-none"
        : "w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-[24px] shadow-xl shadow-slate-100/50 dark:shadow-none"
      }
    >
      <div className="flex flex-col gap-2 text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your credentials to access your club membership.
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
          placeholder="e.g. aria@example.com"
          type="email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            placeholder="Enter password"
            type="password"
            icon={Lock}
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex items-center justify-between mt-1 px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                {...register("rememberMe")}
              />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Remember Me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={isLoading}>
          Sign In
        </Button>
      </motion.form>

      {/* Social login divider */}
      <div className="relative my-8 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
        </div>
        <span className="relative px-3.5 bg-white dark:bg-slate-900 text-xs font-medium text-slate-400 uppercase tracking-wider">
          Or continue with
        </span>
      </div>

      <button
        type="button"
        onClick={() => alert("Google sign in is configured for WordPress head integration.")}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 font-semibold text-sm text-slate-750 transition-colors select-none active:scale-[0.98]"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <div className="mt-8 text-center">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 hover:underline ml-1"
          >
            Create Account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
