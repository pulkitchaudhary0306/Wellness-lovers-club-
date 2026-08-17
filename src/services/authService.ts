/**
 * authService.ts
 *
 * All authentication and user-data calls wired to the WordPress REST API.
 * Uses the custom WLC plugin endpoints exclusively.
 *
 * Custom WLC plugin endpoints → /wp-json/custom/v1/*
 *
 * OTP Flow:
 *   POST /register          → {success, message, user_id}  — no token yet
 *   POST /send-email-otp    → {success, message}
 *   POST /verify-email-otp  → {success, message, token, user}
 *   POST /resend-email-otp  → {success, message}
 *   POST /login             → {success, token, user} OR 403 {success:false, code:"EMAIL_NOT_VERIFIED", email}
 */

import { User, AuthResponse, Order, Payment, Membership } from "@/types/auth";
import { wpPost, wpGet, wpPut, WPApiError } from "@/lib/wpFetch";
import { getStoredToken } from "@/lib/tokenStorage";

// ─── Endpoint map ─────────────────────────────────────────────────────────────

export const WP_API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.wellnessloversclub.com",
  ENDPOINTS: {
    // Auth — all via custom plugin (never jwt-auth/v1/token)
    LOGIN: "/wp-json/custom/v1/login",
    TOKEN_VALIDATE: "/wp-json/jwt-auth/v1/token/validate",
    REGISTER: "/wp-json/custom/v1/register",
    LOGOUT: "/wp-json/custom/v1/logout",
    FORGOT_PASSWORD: "/wp-json/custom/v1/forgot-password",
    RESET_PASSWORD: "/wp-json/custom/v1/reset-password",
    // Email OTP Verification (Brevo HTTPS REST API)
    SEND_OTP: "/wp-json/custom/v1/send-otp",
    VERIFY_OTP: "/wp-json/custom/v1/verify-otp",
    RESEND_OTP: "/wp-json/custom/v1/resend-otp",
    STATUS_OTP: "/wp-json/custom/v1/status",
    // Authenticated
    PROFILE: "/wp-json/custom/v1/profile",
    CHANGE_PASSWORD: "/wp-json/custom/v1/change-password",
    ORDERS: "/wp-json/custom/v1/orders",
    PAYMENTS: "/wp-json/custom/v1/payments",
    MEMBERSHIP: "/wp-json/custom/v1/membership",
  },
};

// ─── WordPress response shapes ─────────────────────────────────────────────

/** Shape returned by /wp-json/custom/v1/login on success */
interface LoginResponse {
  success: boolean;
  token: string;
  user: Partial<User>;
  /** Only present when phone/email is not verified */
  code?: string;
  phone?: string;
  email?: string;
  message?: string;
}

/** Shape returned by the custom register endpoint */
interface RegisterResponse {
  success: boolean;
  requires_verification?: boolean;
  message: string;
  user_id: number;
  phone?: string;
}

/** Shape returned by verify-otp */
interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Partial<User>;
}

/** Profile response shape */
interface ProfileResponse extends Omit<Partial<User>, "id"> {
  id: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
  user_email?: string;
  phone?: string;
  roles?: string[];
  membership_status?: string;
  membership_tier?: string;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapProfile(raw: ProfileResponse): User {
  let firstName = raw.firstName ?? raw.first_name ?? "";
  let lastName = raw.lastName ?? raw.last_name ?? "";
  if (!firstName && raw.name) {
    const parts = raw.name.trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  const hasRole = raw.roles && raw.roles.length > 0;
  const membershipStatus = (raw.membershipStatus ??
    raw.membership_status ??
    (hasRole ? "Active" : "Inactive")) as User["membershipStatus"];

  return {
    id: String(raw.id ?? ""),
    firstName,
    lastName,
    email: raw.email ?? raw.user_email ?? "",
    phone: raw.phone ?? "",
    profession: raw.profession,
    companyName: raw.companyName,
    country: raw.country ?? "",
    city: raw.city,
    address: raw.address,
    membershipStatus,
    membershipTier: raw.membershipTier ?? raw.membership_tier ?? "Lotus Club",
  };
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Logs a user in via the custom WLC plugin endpoint.
   * POST /wp-json/custom/v1/login
   *
   * On unverified email, backend returns HTTP 403 with:
   *   { success: false, code: "email_not_verified", requires_verification: true, email: "...", message: "..." }
   */
  async login(
    usernameOrEmail: string,
    password: string,
    _rememberMe: boolean
  ): Promise<AuthResponse> {
    let data: LoginResponse;

    try {
      data = await wpPost<LoginResponse>(
        WP_API_CONFIG.ENDPOINTS.LOGIN,
        { email: usernameOrEmail, usernameOrEmail, password },
        { unauthenticated: true }
      );
    } catch (err) {
      if (
        err instanceof WPApiError &&
        (err.code === "email_not_verified" || err.code === "phone_not_verified" || err.code === "EMAIL_NOT_VERIFIED")
      ) {
        const unverifiedError: Error & { code?: string; email?: string } =
          new Error(err.message || "Please verify your email address before logging in.");
        unverifiedError.code = "email_not_verified";
        unverifiedError.email = usernameOrEmail;
        throw unverifiedError;
      }
      throw err;
    }

    if (
      !data.success ||
      data.code === "email_not_verified" ||
      data.code === "phone_not_verified"
    ) {
      const err: Error & { code?: string; email?: string } = new Error(
        data.message || "Please verify your email address first."
      );
      err.code = "email_not_verified";
      err.email = data.email ?? usernameOrEmail;
      throw err;
    }

    const user: User = data.user
      ? mapProfile(data.user as ProfileResponse)
      : {
          id: "",
          firstName: "",
          lastName: "",
          email: usernameOrEmail,
          phone: "",
          country: "",
          membershipStatus: "Active",
        };

    return {
      user,
      token: data.token,
      refreshToken: "",
    };
  },

  /**
   * Registers a new user account and sends Email OTP.
   * POST /wp-json/custom/v1/register
   */
  async register(
    userData: Partial<User> & { password?: string }
  ): Promise<{ success: boolean; message: string; user_id: number; email: string }> {
    const payload = {
      name: `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim() || userData.firstName || "Member",
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      profession: userData.profession,
      companyName: userData.companyName,
      correspondenceAddress: userData.address,
      preferences: userData.preferences,
    };

    const data = await wpPost<RegisterResponse>(
      WP_API_CONFIG.ENDPOINTS.REGISTER,
      payload,
      { unauthenticated: true }
    );

    return {
      success: data.success,
      message: data.message,
      user_id: data.user_id,
      email: userData.email ?? "",
    };
  },

  /**
   * Invalidates the token on the server (best-effort).
   * POST /wp-json/custom/v1/logout
   */
  async logout(): Promise<void> {
    try {
      await wpPost(WP_API_CONFIG.ENDPOINTS.LOGOUT, {});
    } catch {
      // Silently ignore; local token cleanup is the source of truth.
    }
  },

  /**
   * Sends a fresh OTP to the given email address.
   * POST /wp-json/wlc-otp/v1/send (fallback to /wp-json/custom/v1/send-otp)
   */
  async sendOTP(email: string, name?: string): Promise<void> {
    try {
      await wpPost(
        WP_API_CONFIG.ENDPOINTS.SEND_OTP,
        { email, name, identifier: email },
        { unauthenticated: true }
      );
    } catch (err: any) {
      if (err instanceof WPApiError && err.status === 404) {
        // Fallback to custom/v1 endpoint
        await wpPost(
          "/wp-json/custom/v1/send-otp",
          { email, identifier: email },
          { unauthenticated: true }
        );
        return;
      }
      throw err;
    }
  },

  /**
   * Backward-compatible alias for sendOTP
   */
  async sendEmailOTP(email: string, name?: string): Promise<void> {
    return this.sendOTP(email, name);
  },

  /**
   * Verifies the 6-digit Email OTP entered by the user.
   * POST /wp-json/wlc-otp/v1/verify (fallback to /wp-json/custom/v1/verify-email)
   *
   * On success returns { token, user } or { verified: true }
   */
  async verifyOTP(otp: string, email?: string): Promise<AuthResponse | { verified: boolean; message: string }> {
    let data: any;

    try {
      data = await wpPost<VerifyOTPResponse>(
        WP_API_CONFIG.ENDPOINTS.VERIFY_OTP,
        { otp, email, identifier: email },
        { unauthenticated: true }
      );
    } catch (err: any) {
      if (err instanceof WPApiError && err.status === 404) {
        // Fallback to alternative route /custom/v1/verify-otp
        data = await wpPost<VerifyOTPResponse>(
          "/wp-json/custom/v1/verify-otp",
          { otp, email, identifier: email },
          { unauthenticated: true }
        );
      } else {
        throw err;
      }
    }

    if (data && data.token && data.user) {
      return {
        user: mapProfile(data.user as ProfileResponse),
        token: data.token,
        refreshToken: "",
      };
    }

    return {
      verified: Boolean(data?.success || data?.verified),
      message: data?.message || "Email verified successfully.",
    };
  },

  /**
   * Resends Email OTP.
   * POST /wp-json/wlc-otp/v1/resend (fallback to /wp-json/custom/v1/resend-otp)
   * Backend enforces 60-second throttle and max 5 requests per hour.
   */
  async resendOTP(email: string, name?: string): Promise<void> {
    try {
      await wpPost(
        WP_API_CONFIG.ENDPOINTS.RESEND_OTP,
        { email, name, identifier: email },
        { unauthenticated: true }
      );
    } catch (err: any) {
      if (err instanceof WPApiError && err.status === 404) {
        await wpPost(
          "/wp-json/custom/v1/resend-otp",
          { email, identifier: email },
          { unauthenticated: true }
        );
        return;
      }
      throw err;
    }
  },

  /**
   * Backward-compatible alias for resendOTP
   */
  async resendEmailOTP(email: string): Promise<void> {
    return this.resendOTP(email);
  },

  /**
   * Checks the status of OTP verification for an email address.
   * POST /wp-json/wlc-otp/v1/status
   */
  async getOTPStatus(email: string): Promise<{ success: boolean; verified: boolean; can_resend: boolean; seconds_remaining?: number }> {
    return await wpPost(
      WP_API_CONFIG.ENDPOINTS.STATUS_OTP,
      { email },
      { unauthenticated: true }
    );
  },

  /**
   * Sends a password-reset email.
   * POST /wp-json/custom/v1/forgot-password
   */
  async forgotPassword(email: string): Promise<void> {
    await wpPost(
      WP_API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
      { email },
      { unauthenticated: true }
    );
  },

  /**
   * Sets a new password using the reset token/OTP from the email link.
   * POST /wp-json/custom/v1/reset-password
   */
  async resetPassword(
    password: string,
    resetKey?: string,
    userLogin?: string
  ): Promise<void> {
    await wpPost(
      WP_API_CONFIG.ENDPOINTS.RESET_PASSWORD,
      { password, key: resetKey, login: userLogin },
      { unauthenticated: true }
    );
  },

  /**
   * Validates a stored JWT token against WordPress.
   * Returns true when valid, false when expired/invalid.
   */
  async validateToken(): Promise<boolean> {
    if (!getStoredToken()) return false;

    try {
      await wpPost(WP_API_CONFIG.ENDPOINTS.TOKEN_VALIDATE, {});
      return true;
    } catch (err) {
      if (
        err instanceof WPApiError &&
        (err.isUnauthorized || err.isForbidden)
      ) {
        return false;
      }
      throw err;
    }
  },

  /**
   * Fetches the authenticated user's profile.
   * GET /wp-json/custom/v1/profile
   */
  async getProfile(): Promise<User> {
    const data = await wpGet<ProfileResponse>(WP_API_CONFIG.ENDPOINTS.PROFILE);
    return mapProfile(data);
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const data = await wpPut<ProfileResponse>(
      WP_API_CONFIG.ENDPOINTS.PROFILE,
      profileData
    );
    return mapProfile(data);
  },

  /**
   * Changes the authenticated user's password.
   * POST /wp-json/custom/v1/change-password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await wpPost(WP_API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  /**
   * Fetches the user's order history.
   * GET /wp-json/custom/v1/orders
   */
  async getOrders(): Promise<Order[]> {
    return wpGet<Order[]>(WP_API_CONFIG.ENDPOINTS.ORDERS);
  },

  /**
   * Fetches the user's payment history.
   * GET /wp-json/custom/v1/payments
   */
  async getPayments(): Promise<Payment[]> {
    return wpGet<Payment[]>(WP_API_CONFIG.ENDPOINTS.PAYMENTS);
  },

  /**
   * Fetches the user's membership records.
   * GET /wp-json/custom/v1/membership
   */
  async getMemberships(): Promise<Membership[]> {
    return wpGet<Membership[]>(WP_API_CONFIG.ENDPOINTS.MEMBERSHIP);
  },
};
