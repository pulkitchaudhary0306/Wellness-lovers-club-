/**
 * authService.ts
 *
 * All authentication and user-data calls wired to the WordPress REST API.
 * Uses:
 *   - JWT Authentication for WP REST API plugin  → /wp-json/jwt-auth/v1/token
 *   - Custom WP plugin endpoints                 → /wp-json/custom/v1/*
 *   - WooCommerce (optional)                     → /wp-json/wc/v3/*
 *
 * ─── WordPress plugins required ────────────────────────────────────────────
 *   1. JWT Authentication for WP REST API
 *      https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
 *      Add to wp-config.php:
 *        define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
 *        define('JWT_AUTH_CORS_ENABLE', true);
 *
 *   2. A custom plugin exposing /wp-json/custom/v1/* endpoints:
 *      register, forgot-password, reset-password, verify-email,
 *      profile (GET / PUT), orders, payments, membership, change-password
 *
 *   3. (Optional) WooCommerce + WC Memberships / MemberPress
 *      for orders, payments and membership data
 */

import { User, AuthResponse, Order, Payment, Membership } from "@/types/auth";
import { wpPost, wpGet, wpPut, WPApiError } from "@/lib/wpFetch";

// ─── Endpoint map ─────────────────────────────────────────────────────────────

export const WP_API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://your-wordpress-site.com",
  ENDPOINTS: {
    LOGIN: "/wp-json/jwt-auth/v1/token",
    TOKEN_VALIDATE: "/wp-json/jwt-auth/v1/token/validate",
    REGISTER: "/wp-json/custom/v1/register",
    LOGOUT: "/wp-json/custom/v1/logout",
    FORGOT_PASSWORD: "/wp-json/custom/v1/forgot-password",
    RESET_PASSWORD: "/wp-json/custom/v1/reset-password",
    VERIFY_OTP: "/wp-json/custom/v1/verify-email",
    PROFILE: "/wp-json/custom/v1/profile",
    CHANGE_PASSWORD: "/wp-json/custom/v1/change-password",
    ORDERS: "/wp-json/custom/v1/orders",
    PAYMENTS: "/wp-json/custom/v1/payments",
    MEMBERSHIP: "/wp-json/custom/v1/membership",
  },
};

// ─── WordPress response shapes ─────────────────────────────────────────────

/** Shape returned by /wp-json/jwt-auth/v1/token on success */
interface JWTLoginResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  /** Extended fields returned by the custom plugin */
  user?: Partial<User>;
}

/** Shape returned by the custom register endpoint */
interface RegisterResponse {
  token: string;
  refresh_token?: string;
  user: Partial<User>;
}

/** Shape returned by the profile endpoint /wp-json/wp/v2/users/me */
interface ProfileResponse extends Omit<Partial<User>, "id"> {
  id: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
  user_email?: string;
  avatar_url?: string;
  avatar_urls?: Record<string, string>;
  roles?: string[];
  membership_status?: string;
  membership_tier?: string;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

/**
 * Maps a WordPress profile response (snake_case) to the front-end User shape.
 */
function mapProfile(raw: ProfileResponse): User {
  const avatarUrl =
    raw.avatarUrl ??
    raw.avatar_url ??
    (raw.avatar_urls ? raw.avatar_urls["96"] ?? raw.avatar_urls["48"] ?? raw.avatar_urls["24"] : undefined);

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
    id: String(raw.id),
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
    avatarUrl,
  };
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Logs a user in via JWT Authentication plugin.
   * POST /wp-json/jwt-auth/v1/token
   */
  async login(
    username: string,
    password: string,
    _rememberMe: boolean
  ): Promise<AuthResponse> {
    const data = await wpPost<JWTLoginResponse>(
      WP_API_CONFIG.ENDPOINTS.LOGIN,
      { username, password },
      { unauthenticated: true }
    );

    // The JWT plugin returns minimal user info; merge with any extended fields.
    const user: User = data.user
      ? mapProfile(data.user as ProfileResponse)
      : {
          id: "",
          firstName: data.user_nicename ?? "",
          lastName: "",
          email: data.user_email,
          phone: "",
          country: "",
          membershipStatus: "Inactive",
        };

    return {
      user,
      token: data.token,
      refreshToken: "",
    };
  },

  /**
   * Registers a new user account.
   * POST /wp-json/custom/v1/register
   */
  async register(
    userData: Partial<User> & { password?: string }
  ): Promise<AuthResponse> {
    const data = await wpPost<RegisterResponse>(
      WP_API_CONFIG.ENDPOINTS.REGISTER,
      userData,
      { unauthenticated: true }
    );

    return {
      user: mapProfile(data.user as ProfileResponse),
      token: data.token,
      refreshToken: data.refresh_token ?? "",
    };
  },

  /**
   * Invalidates the token on the server (if the plugin supports it).
   * POST /wp-json/custom/v1/logout
   * JWT is stateless — token removal from storage is handled by AuthContext.
   */
  async logout(): Promise<void> {
    try {
      await wpPost(WP_API_CONFIG.ENDPOINTS.LOGOUT, {});
    } catch {
      // Silently ignore server-side logout errors;
      // local token cleanup in AuthContext is the source of truth.
    }
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
   * Sets a new password using the reset token from the email link.
   * POST /wp-json/custom/v1/reset-password
   *
   * @param password    New password
   * @param resetKey    Token from the reset email (read from URL in the page)
   * @param userLogin   WP user login / email (also from URL)
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
   * Verifies a one-time OTP / email verification code.
   * POST /wp-json/custom/v1/verify-email
   */
  async verifyOTP(otp: string, email?: string): Promise<void> {
    await wpPost(
      WP_API_CONFIG.ENDPOINTS.VERIFY_OTP,
      { otp, email },
      { unauthenticated: true }
    );
  },

  /**
   * Validates a stored JWT token against WordPress.
   * POST /wp-json/jwt-auth/v1/token/validate
   * Returns true when valid, false when expired / invalid.
   */
  async validateToken(): Promise<boolean> {
    try {
      await wpPost(WP_API_CONFIG.ENDPOINTS.TOKEN_VALIDATE, {});
      return true;
    } catch (err) {
      if (err instanceof WPApiError && err.isUnauthorized) return false;
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
   * (WooCommerce-compatible shape; can also call /wp-json/wc/v3/orders)
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
   * (Compatible with WooCommerce Memberships / MemberPress)
   */
  async getMemberships(): Promise<Membership[]> {
    return wpGet<Membership[]>(WP_API_CONFIG.ENDPOINTS.MEMBERSHIP);
  },
};
