"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import {
  saveSession,
  clearSession,
  getStoredToken,
  getStoredUser,
  updateStoredUser,
} from "@/lib/tokenStorage";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Internal: hard logout (clear state + storage) ───────────────────────
  const _clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    clearSession();
  }, []);

  // ─── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (!storedToken || !storedUser) {
          setLoading(false);
          return;
        }

        // Optimistically restore from storage first so the UI isn't blank
        setToken(storedToken);
        setUser(storedUser);

        // Validate token with WordPress (catches expired JWTs)
        const isValid = await authService.validateToken();
        if (!isValid) {
          _clearAuth();
          return;
        }

        // Sync fresh profile data in the background
        try {
          const freshUser = await authService.getProfile();
          setUser(freshUser);
          updateStoredUser(freshUser);
        } catch (err) {
          console.error("Failed to sync profile:", err);
          // Non-fatal: keep the cached user data
        }
      } catch (err) {
        console.error("Session restoration error:", err);
        _clearAuth();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [_clearAuth]);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = async (username, password, rememberMe) => {
    setLoading(true);
    try {
      const response = await authService.login(username, password, rememberMe);

      setUser(response.user);
      setToken(response.token);
      saveSession(response.token, response.refreshToken, response.user, rememberMe);

      // Fetch full profile immediately after login (JWT response has minimal data)
      try {
        const fullProfile = await authService.getProfile();
        setUser(fullProfile);
        updateStoredUser(fullProfile);
        return fullProfile;
      } catch {
        // Non-fatal; return the basic user from the JWT response
        return response.user;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ──────────────────────────────────────────────────────────────
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      // Auto-login upon successful registration
      setUser(response.user);
      setToken(response.token);
      saveSession(response.token, response.refreshToken, response.user, false);
      return response.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout(); // Notifies WP server (best-effort)
    } catch (err) {
      console.error("Server-side logout error:", err);
    } finally {
      _clearAuth();
      setLoading(false);
    }
  };

  // ─── Password flows ────────────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    await authService.forgotPassword(email);
  };

  const resetPassword = async (password, resetKey, userLogin) => {
    await authService.resetPassword(password, resetKey, userLogin);
  };

  const verifyOTP = async (otp, email) => {
    await authService.verifyOTP(otp, email);
  };

  // ─── Profile update ────────────────────────────────────────────────────────
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      updateStoredUser(updatedUser);
      return updatedUser;
    } catch (err) {
      // Auto-logout on 401 (expired token)
      if (err?.name === "WPApiError" && err?.isUnauthorized) {
        _clearAuth();
        throw new Error("Your session has expired. Please log in again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── 401 guard for data fetches in child components ───────────────────────
  /**
   * Wraps any authService call and automatically clears the session on a 401.
   * Usage in pages/components:
   *   const orders = await handleApiCall(() => authService.getOrders());
   */
  const handleApiCall = useCallback(
    async (fn) => {
      try {
        return await fn();
      } catch (err) {
        if (err?.name === "WPApiError" && err?.isUnauthorized) {
          _clearAuth();
          throw new Error("Your session has expired. Please log in again.");
        }
        throw err;
      }
    },
    [_clearAuth]
  );

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
        updateProfile,
        handleApiCall,
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
