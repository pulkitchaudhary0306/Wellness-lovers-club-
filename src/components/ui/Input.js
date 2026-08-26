"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = forwardRef(
  ({ label, error, type = "text", icon: Icon, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`w-full flex flex-col gap-2 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full" style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
          {Icon && (
            <span
              className="absolute left-4 text-slate-400 pointer-events-none"
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              <Icon size={18} />
            </span>
          )}
          <input
            ref={ref}
            type={currentType}
            style={{
              paddingLeft: Icon ? "44px" : "16px",
              paddingRight: isPassword ? "44px" : "16px",
            }}
            className={`w-full px-4 py-3 rounded-2xl border text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200
              ${Icon ? "pl-11" : "pl-4"}
              ${isPassword ? "pr-11" : "pr-4"}
              ${error ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-200 hover:border-slate-300"}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                zIndex: 2,
              }}
              className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <span className="text-xs text-rose-500 font-medium ml-1" style={{ color: "#f87171", fontSize: "12px" }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
