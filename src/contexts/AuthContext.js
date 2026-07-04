"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from cache on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Check localStorage first (for Remember Me accounts)
        let storedToken = localStorage.getItem("wlc_auth_token");
        let storedUser = localStorage.getItem("wlc_auth_user");

        // Check sessionStorage if not found in localStorage
        if (!storedToken) {
          storedToken = sessionStorage.getItem("wlc_auth_token");
          storedUser = sessionStorage.getItem("wlc_auth_user");
        }

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify/refresh user data in the background
          try {
            const freshUser = await authService.getProfile();
            setUser(freshUser);
            if (localStorage.getItem("wlc_auth_token")) {
              localStorage.setItem("wlc_auth_user", JSON.stringify(freshUser));
            } else {
              sessionStorage.setItem("wlc_auth_user", JSON.stringify(freshUser));
            }
          } catch (err) {
            console.error("Failed to sync profile:", err);
          }
        }
      } catch (err) {
        console.error("Session restoration error:", err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password, rememberMe);
      setUser(response.user);
      setToken(response.token);

      // Save credentials based on Remember Me
      if (rememberMe) {
        localStorage.setItem("wlc_auth_token", response.token);
        localStorage.setItem("wlc_auth_user", JSON.stringify(response.user));
      } else {
        sessionStorage.setItem("wlc_auth_token", response.token);
        sessionStorage.setItem("wlc_auth_user", JSON.stringify(response.user));
      }

      return response.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      // Auto-login upon registration
      setUser(response.user);
      setToken(response.token);
      sessionStorage.setItem("wlc_auth_token", response.token);
      sessionStorage.setItem("wlc_auth_user", JSON.stringify(response.user));
      return response.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("wlc_auth_token");
      localStorage.removeItem("wlc_auth_user");
      sessionStorage.removeItem("wlc_auth_token");
      sessionStorage.removeItem("wlc_auth_user");
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    await authService.forgotPassword(email);
  };

  const resetPassword = async (password) => {
    await authService.resetPassword(password);
  };

  const verifyOTP = async (otp) => {
    await authService.verifyOTP(otp);
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      if (localStorage.getItem("wlc_auth_token")) {
        localStorage.setItem("wlc_auth_user", JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem("wlc_auth_user", JSON.stringify(updatedUser));
      }
      return updatedUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyOTP,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
