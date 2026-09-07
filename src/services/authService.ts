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
    TOKEN_VALIDATE: "/wp-json/custom/v1/profile",
    REGISTER: "/wp-json/custom/v1/register",
    LOGOUT: "/wp-json/custom/v1/logout",
    FORGOT_PASSWORD: "/wp-json/custom/v1/forgot-password",
    RESET_PASSWORD: "/wp-json/custom/v1/reset-password",
    GOOGLE_LOGIN: "/wp-json/custom/v1/google-login",
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
    MEMBERSHIP_CARD: "/wp-json/custom/v1/membership-card",
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
  payment_session_token?: string;
  verified?: boolean;
}

/** Profile response shape — flat object returned by WP_REST_Response($data) */
interface ProfileResponse extends Omit<Partial<User>, "id"> {
  id?: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
  user_email?: string;
  phone?: string;
  roles?: string[];
  membership_status?: string;
  membership_tier?: string;
  // Membership number keys — all returned by class-profile-controller.php
  membershipId?: string;
  membershipNumber?: string;
  wlc_membership_id?: string;
  wlc_membership_number?: string;
  membership_id?: string;
  // Date fields
  validTill?: string;
  validUntil?: string;
  membershipValidUntil?: string;
  wlc_membership_valid_until?: string;
  membershipStartDate?: string;
  // Payment fields
  paymentStatus?: string;
  paidAt?: string;
  invoiceNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amountPaid?: number;
  // Extra profile fields
  designation?: string;
  company?: string;
  membershipPlan?: string;
  data?: any;
  user?: any;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapProfile(raw: ProfileResponse | Record<string, any>): User {
  if (!raw) {
    return {
      id: "",
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      phone: "",
      country: "",
      membershipStatus: "Inactive",
      membershipNumber: "",
      membershipId: "",
      wlc_membership_number: "",
      wlc_membership_id: "",
      validTill: "",
      validUntil: "",
    };
  }

  // Handle both flat and nested payloads (e.g. { data: { ... } } or { user: { ... } } or flat object)
  const source: Record<string, any> =
    (raw?.data && typeof raw.data === "object" && !Array.isArray(raw.data)
      ? raw.data
      : raw?.user && typeof raw.user === "object" && !Array.isArray(raw.user)
      ? raw.user
      : raw) || {};

  let firstName = source.firstName ?? source.first_name ?? raw.firstName ?? raw.first_name ?? "";
  let lastName = source.lastName ?? source.last_name ?? raw.lastName ?? raw.last_name ?? "";
  const rawName = source.name ?? raw.name ?? "";
  if (!firstName && rawName) {
    const parts = String(rawName).trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  const hasRole = (source.roles && source.roles.length > 0) || (raw.roles && raw.roles.length > 0);
  const membershipStatus = (source.membershipStatus ??
    source.membership_status ??
    raw.membershipStatus ??
    raw.membership_status ??
    (hasRole ? "Active" : "Inactive")) as User["membershipStatus"];

  // Resolve membership number from WordPress API payload:
  // priority: membershipNumber -> membershipId -> wlc_membership_number -> wlc_membership_id -> membership_id
  const membershipNumber: string = String(
    source.membershipNumber ||
    source.membershipId ||
    source.wlc_membership_number ||
    source.wlc_membership_id ||
    source.membership_id ||
    raw.membershipNumber ||
    raw.membershipId ||
    raw.wlc_membership_number ||
    raw.wlc_membership_id ||
    raw.membership_id ||
    ""
  ).trim();

  // Resolve valid-till — backend returns validTill, validUntil, wlc_membership_valid_until, or membershipValidUntil
  const validTill: string = String(
    source.validTill ||
    source.validUntil ||
    source.wlc_membership_valid_until ||
    source.membershipValidUntil ||
    raw.validTill ||
    raw.validUntil ||
    raw.wlc_membership_valid_until ||
    raw.membershipValidUntil ||
    ""
  ).trim();

  return {
    id: String(source.id ?? raw.id ?? ""),
    firstName,
    lastName,
    name: rawName || `${firstName} ${lastName}`.trim(),
    email: source.email ?? source.user_email ?? raw.email ?? raw.user_email ?? "",
    phone: source.phone ?? raw.phone ?? "",
    address: source.address ?? raw.address,
    profession: source.profession ?? raw.profession,
    designation: source.designation ?? source.profession ?? raw.designation ?? raw.profession,
    companyName: source.companyName ?? raw.companyName,
    company: source.company ?? source.companyName ?? raw.company ?? raw.companyName,
    country: source.country ?? raw.country ?? "",
    city: source.city ?? raw.city,
    membershipStatus,
    membershipTier: source.membershipTier ?? source.membership_tier ?? raw.membershipTier ?? raw.membership_tier ?? "",
    membershipPlan: source.membershipPlan ?? source.membershipTier ?? source.membership_tier ?? raw.membershipPlan ?? "",
    // Membership number — authoritative value from WordPress, never generated on frontend
    membershipNumber,
    membershipId: membershipNumber,
    wlc_membership_number: membershipNumber,
    wlc_membership_id: membershipNumber,
    // Dates from WordPress
    validTill,
    validUntil: validTill,
    membershipStartDate: source.membershipStartDate ?? source.validFrom ?? raw.membershipStartDate ?? "",
    // Payment info from WordPress payment ledger
    paymentStatus: source.paymentStatus ?? raw.paymentStatus ?? "",
    paidAt: source.paidAt ?? raw.paidAt ?? "",
    invoiceNumber: source.invoiceNumber ?? raw.invoiceNumber ?? "",
    razorpayOrderId: source.razorpayOrderId ?? raw.razorpayOrderId ?? "",
    razorpayPaymentId: source.razorpayPaymentId ?? raw.razorpayPaymentId ?? "",
    amountPaid: source.amountPaid ?? raw.amountPaid ?? 0,
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
   * Logs in or registers a user via Google OAuth with WordPress
   * POST /wp-json/custom/v1/google-login
   */
  async loginWithGoogle(googleData: {
    email: string;
    name: string;
    photoUrl?: string;
    idToken?: string;
  }): Promise<AuthResponse> {
    try {
      const data = await wpPost<{
        success: boolean;
        token: string;
        user: ProfileResponse;
      }>(
        WP_API_CONFIG.ENDPOINTS.GOOGLE_LOGIN,
        {
          email: googleData.email,
          name: googleData.name,
          photo_url: googleData.photoUrl || "",
          id_token: googleData.idToken || "",
        },
        { unauthenticated: true }
      );

      if (data && data.token && data.user) {
        return {
          user: mapProfile(data.user),
          token: data.token,
          refreshToken: "",
        };
      }
    } catch (err) {
      // Fallback: If custom google-login endpoint is not yet loaded on remote WP
      const parts = (googleData.name || "Member").trim().split(/\s+/);
      const generatedPwd = "WLCGoogle@" + googleData.email.replace(/[^a-zA-Z0-9]/g, "") + "!";

      try {
        await wpPost(
          WP_API_CONFIG.ENDPOINTS.REGISTER,
          {
            name: googleData.name,
            firstName: parts[0] || "Member",
            lastName: parts.slice(1).join(" ") || "",
            email: googleData.email,
            password: generatedPwd,
            profession: "Club Member",
            correspondenceAddress: "Global",
            preferences: ["Curated Wellness Retreats"],
            agreeTerms: true,
          },
          { unauthenticated: true }
        );
      } catch {
        // User might already exist, continue to login
      }

      const loginData = await wpPost<{ token: string; user: ProfileResponse }>(
        WP_API_CONFIG.ENDPOINTS.LOGIN,
        {
          username: googleData.email,
          password: generatedPwd,
        },
        { unauthenticated: true }
      );

      return {
        user: mapProfile(loginData.user),
        token: loginData.token,
        refreshToken: "",
      };
    }

    throw new Error("Unable to complete Google authentication with WordPress.");
  },

  /**
   * Sends a fresh OTP to the given email address.
   * POST /wp-json/custom/v1/send-otp
   */
  async sendOTP(email: string, name?: string): Promise<void> {
    await wpPost(
      WP_API_CONFIG.ENDPOINTS.SEND_OTP,
      { email, name, identifier: email },
      { unauthenticated: true }
    );
  },

  /**
   * Backward-compatible alias for sendOTP
   */
  async sendEmailOTP(email: string, name?: string): Promise<void> {
    return this.sendOTP(email, name);
  },

  /**
   * Verifies the 6-digit Email OTP entered by the user.
   * POST /wp-json/custom/v1/verify-otp
   *
   * On success returns { token, user } or { verified: true }
   */
  async verifyOTP(otp: string, email?: string): Promise<AuthResponse | { verified: boolean; message: string }> {
    const data = await wpPost<VerifyOTPResponse>(
      WP_API_CONFIG.ENDPOINTS.VERIFY_OTP,
      { otp, email, identifier: email },
      { unauthenticated: true }
    );

    if (data) {
      if (data.payment_session_token && typeof window !== "undefined") {
        sessionStorage.setItem("wlc_payment_session", data.payment_session_token);
        localStorage.setItem("wlc_payment_session", data.payment_session_token);
        sessionStorage.setItem("wlc_otp_verified", "true");
        localStorage.setItem("wlc_otp_verified", "true");
      }

      if (data.token && data.user) {
        return {
          user: mapProfile(data.user as ProfileResponse),
          token: data.token,
          refreshToken: "",
          payment_session_token: data.payment_session_token,
        } as any;
      }
    }

    return {
      verified: Boolean(data?.success || data?.verified),
      message: data?.message || "Email verified successfully.",
      payment_session_token: data?.payment_session_token,
    } as any;
  },

  /**
   * Resends Email OTP.
   * POST /wp-json/custom/v1/resend-otp
   * Backend enforces 60-second throttle and max 5 requests per hour.
   */
  async resendOTP(email: string, name?: string): Promise<void> {
    await wpPost(
      WP_API_CONFIG.ENDPOINTS.RESEND_OTP,
      { email, name, identifier: email },
      { unauthenticated: true }
    );
  },

  /**
   * Backward-compatible alias for resendOTP
   */
  async resendEmailOTP(email: string): Promise<void> {
    return this.resendOTP(email);
  },

  /**
   * Checks the status of OTP verification for an email address.
   * POST /wp-json/custom/v1/status
   */
  async getOTPStatus(email: string): Promise<{ success: boolean; verified: boolean; can_resend: boolean; seconds_remaining?: number }> {
    return await wpPost(
      WP_API_CONFIG.ENDPOINTS.STATUS_OTP,
      { email },
      { unauthenticated: true }
    );
  },

  /**
   * Sends a password-reset link to the user's registered email.
   * POST /wp-json/custom/v1/forgot-password
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return await wpPost(
      WP_API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
      { email },
      { unauthenticated: true }
    );
  },

  /**
   * Verifies a password reset OTP (if OTP reset mode is enabled on server).
   * POST /wp-json/custom/v1/verify-reset-otp
   */
  async verifyResetOtp(email: string, otp: string): Promise<{ success: boolean; resetToken: string; message: string }> {
    return await wpPost(
      "/wp-json/custom/v1/verify-reset-otp",
      { email, otp },
      { unauthenticated: true }
    );
  },

  /**
   * Sets a new password using the reset key and login from the email reset link.
   * POST /wp-json/custom/v1/reset-password
   * Expects canonical payload: { key, login, password }
   */
  async resetPassword(
    params: { key: string; login: string; password?: string; newPassword?: string } | string,
    resetKey?: string,
    userLogin?: string
  ): Promise<{ success: boolean; message: string }> {
    if (typeof params === "object") {
      return await wpPost(
        WP_API_CONFIG.ENDPOINTS.RESET_PASSWORD,
        {
          key: params.key,
          login: params.login,
          password: params.password || params.newPassword,
        },
        { unauthenticated: true }
      );
    }
    return await wpPost(
      WP_API_CONFIG.ENDPOINTS.RESET_PASSWORD,
      {
        key: resetKey,
        login: userLogin,
        password: params,
      },
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
      await wpGet(WP_API_CONFIG.ENDPOINTS.PROFILE);
      return true;
    } catch (err) {
      if (
        err instanceof WPApiError &&
        (err.isUnauthorized || err.isForbidden)
      ) {
        return false;
      }
      return false;
    }
  },

  /**
   * Fetches the authenticated user's profile.
   * GET /wp-json/custom/v1/profile
   */
  async getProfile(): Promise<User> {
    const data = await wpGet<ProfileResponse>(WP_API_CONFIG.ENDPOINTS.PROFILE, {
      cache: "no-store",
    });
    const mapped = mapProfile(data);
    return mapped;
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

  /**
   * Fetches authoritative live membership card data directly from WordPress backend.
   * GET /wp-json/custom/v1/membership-card
   */
  async getMembershipCard(): Promise<any> {
    const raw = await wpGet<any>(WP_API_CONFIG.ENDPOINTS.MEMBERSHIP_CARD);
    if (raw && raw.membershipCard) {
      return raw.membershipCard;
    }
    return raw;
  },
};
