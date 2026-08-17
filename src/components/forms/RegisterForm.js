"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Briefcase, Building2, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Zod Registration validation schema matching the questionnaire screenshot
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    phone: z
      .string()
      .min(1, "Mobile Number is required")
      .regex(/^\+?[0-9\s-()]{7,15}$/, "Please enter a valid phone number"),
    email: z
      .string()
      .min(1, "Email Address is required")
      .email("Please enter a valid email address"),
    profession: z.string().min(1, "Profession is required"),
    companyName: z.string().optional(),
    correspondenceAddress: z.string().min(1, "Correspondence Address is required"),
    preferences: z.array(z.string()).min(1, "Please select at least one preference"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the Terms & Conditions" })
    }),
    subscribeNewsletter: z.boolean().default(false)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

const preferenceOptions = [
  "Curated Wellness Retreats",
  "Spa Offerings",
  "Masterclass with Wellness Experts",
  "Curated Wellness Cuisine Offerings",
  "Salon Offerings",
  "Beauty Products Offerings",
];

export default function RegisterForm({ isEmbed = false }) {
  const { register: signup } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      profession: "",
      companyName: "",
      correspondenceAddress: "",
      preferences: [],
      password: "",
      confirmPassword: "",
      agreeTerms: false,
      subscribeNewsletter: false
    }
  });

  // Register custom preferences array input field
  useEffect(() => {
    register("preferences");
  }, [register]);

  const handlePreferenceChange = (optionValue, checked) => {
    let newPrefs = [...selectedPrefs];
    if (optionValue === "All Of The Above") {
      if (checked) {
        newPrefs = [...preferenceOptions, "All Of The Above"];
      } else {
        newPrefs = [];
      }
    } else {
      if (checked) {
        newPrefs.push(optionValue);
        // If all standard options are checked, also check "All Of The Above"
        if (preferenceOptions.every((opt) => newPrefs.includes(opt))) {
          newPrefs.push("All Of The Above");
        }
      } else {
        newPrefs = newPrefs.filter((p) => p !== optionValue && p !== "All Of The Above");
      }
    }
    setSelectedPrefs(newPrefs);
    setValue("preferences", newPrefs, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    setIsShaking(false);

    // Split Name into firstName and lastName for backend compatibility
    const nameParts = data.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const submitData = {
      ...data,
      firstName,
      lastName,
    };

    try {
      const result = await signup(submitData);
      // result = { success: true, message: "...", user_id: N, email: "..." }
      // No token returned — redirect to OTP verification
      const targetEmail = result?.email || data.email;
      router.push(`/verify-email?email=${encodeURIComponent(targetEmail)}`);
    } catch (err) {
      setApiError(err?.message || "Registration failed. Please try again.");
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
        ? "w-full max-w-2xl bg-transparent border-0 p-0 shadow-none"
        : "w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-[24px] shadow-xl shadow-slate-100/50 dark:shadow-none"
      }
    >
      <div className="flex flex-col gap-2 text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Create Account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Join Wellness Lovers Club to access luxury offers and bespoke retreats.
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

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            placeholder="Your answer"
            icon={User}
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Mobile Number"
            placeholder="Your answer"
            type="tel"
            icon={Phone}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Email Address"
            placeholder="Your answer"
            type="email"
            icon={Mail}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Profession"
            placeholder="Your answer"
            icon={Briefcase}
            error={errors.profession?.message}
            {...register("profession")}
          />
          <Input
            label="Company's Name"
            placeholder="Your answer"
            icon={Building2}
            error={errors.companyName?.message}
            {...register("companyName")}
          />
          <Input
            label="Correspondence Address"
            placeholder="Your answer"
            icon={MapPin}
            error={errors.correspondenceAddress?.message}
            {...register("correspondenceAddress")}
          />
          <Input
            label="Password"
            placeholder="Enter password"
            type="password"
            icon={Lock}
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter password"
            type="password"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {/* Preferences Dropdown Options from the Mockup */}
          <div className="relative flex flex-col gap-2 w-full col-span-1 md:col-span-2 mt-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Preferences
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="preferences-dropdown-btn flex items-center justify-between text-left focus:outline-none transition-all"
            >
              <span className="truncate" style={{ color: selectedPrefs.length === 0 ? 'rgba(255, 255, 255, 0.35)' : '#ffffff' }}>
                {selectedPrefs.length === 0 
                  ? "Choose your preferences" 
                  : selectedPrefs.includes("All Of The Above")
                    ? "All Of The Above"
                    : selectedPrefs.join(", ")}
              </span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-[65px] left-0 right-0 bg-[#080c09] border border-slate-800 rounded-xl p-3.5 z-50 shadow-2xl flex flex-col gap-2.5 max-h-[220px] overflow-y-auto">
                {preferenceOptions.map((opt) => (
                  <label key={opt} className="flex items-start gap-2.5 cursor-pointer select-none text-slate-300 hover:text-white transition-colors py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedPrefs.includes(opt)}
                      onChange={(e) => handlePreferenceChange(opt, e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-750 text-[#0f8554] focus:ring-[#0f8554]/20"
                    />
                    <span className="text-xs font-light">{opt}</span>
                  </label>
                ))}
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-slate-300 hover:text-white transition-colors py-0.5 border-t border-slate-800/80 pt-1.5">
                  <input
                    type="checkbox"
                    checked={selectedPrefs.includes("All Of The Above")}
                    onChange={(e) => handlePreferenceChange("All Of The Above", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-750 text-[#0f8554] focus:ring-[#0f8554]/20"
                  />
                  <span className="text-xs font-semibold text-slate-200">All Of The Above</span>
                </label>
              </div>
            )}
            {errors.preferences && (
              <span className="text-xs text-rose-500 font-medium ml-1">
                {errors.preferences.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2 px-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4.5 h-4.5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
              {...register("agreeTerms")}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              I agree to the{" "}
              <Link href="#" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Terms & Conditions
              </Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <span className="text-xs text-rose-500 font-medium ml-1">
              {errors.agreeTerms.message}
            </span>
          )}

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
              {...register("subscribeNewsletter")}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Subscribe to Newsletter for luxury updates.
            </span>
          </label>
        </div>

        <Button type="submit" loading={isLoading} className="mt-2">
          {isEmbed ? "Become a member" : "Create Account"}
        </Button>
      </motion.form>

      {/* Social Register Divider */}
      <div className="relative my-8 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
        </div>
        <span className="relative px-3.5 bg-white dark:bg-slate-900 text-xs font-medium text-slate-400 uppercase tracking-wider">
          Or sign up with
        </span>
      </div>

      <button
        type="button"
        onClick={() => alert("Google signup is configured for WordPress head integration.")}
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

      <div className="mt-8 text-center font-semibold text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline ml-1">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
}
