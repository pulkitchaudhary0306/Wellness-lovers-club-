"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) {
  const baseStyles = "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-250 select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-lg shadow-slate-900/10 focus:ring-2 focus:ring-slate-950/20",
    secondary: "bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white shadow-lg shadow-blue-900/10 focus:ring-2 focus:ring-blue-900/20",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 focus:ring-2 focus:ring-slate-100",
    text: "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
