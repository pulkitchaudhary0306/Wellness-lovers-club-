/**
 * tokenStorage.ts
 *
 * Centralised helpers for reading and writing auth tokens & user data
 * to localStorage (Remember Me) or sessionStorage (session only).
 *
 * All keys are prefixed with "wlc_" to avoid conflicts with other scripts.
 */

const KEYS = {
  TOKEN: "wlc_auth_token",
  REFRESH: "wlc_auth_refresh",
  USER: "wlc_auth_user",
} as const;

// ─── Write ────────────────────────────────────────────────────────────────────

export function saveSession(
  token: string,
  refreshToken: string,
  user: object,
  persistent: boolean
): void {
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(KEYS.TOKEN, token);
  storage.setItem(KEYS.REFRESH, refreshToken);
  storage.setItem(KEYS.USER, JSON.stringify(user));
}

export function storeToken(token: string, persistent: boolean = true): void {
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(KEYS.TOKEN, token);
}

export function updateStoredUser(user: object): void {
  if (localStorage.getItem(KEYS.TOKEN)) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } else {
    sessionStorage.setItem(KEYS.USER, JSON.stringify(user));
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getStoredToken(): string | null {
  return (
    localStorage.getItem(KEYS.TOKEN) || sessionStorage.getItem(KEYS.TOKEN)
  );
}

export function getStoredRefreshToken(): string | null {
  return (
    localStorage.getItem(KEYS.REFRESH) || sessionStorage.getItem(KEYS.REFRESH)
  );
}

export function getStoredUser<T = unknown>(): T | null {
  const raw =
    localStorage.getItem(KEYS.USER) || sessionStorage.getItem(KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ─── Clear ────────────────────────────────────────────────────────────────────

export function clearSession(): void {
  const allKeys = [
    KEYS.TOKEN,
    KEYS.REFRESH,
    KEYS.USER,
    "wlc_token",
    "wlc_auth_token",
    "wlc_auth_user",
    "wlc_auth_refresh",
    "wlc_payment_session",
    "wlc_reg_session",
    "wlc_otp_verified",
    "wlc_reg_email",
    "wlc_reg_name",
    "wlc_reg_phone",
  ];
  [localStorage, sessionStorage].forEach((s) => {
    allKeys.forEach((k) => {
      try {
        s.removeItem(k);
      } catch {}
    });
  });
}
