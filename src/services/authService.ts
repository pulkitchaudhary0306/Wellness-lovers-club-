import { User, AuthResponse, Order, Payment, Membership } from "@/types/auth";

// Future WordPress REST API or WPGraphQL configuration
// When ready, replace the mock calls below with fetch() requests to these endpoints.
export const WP_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://your-wordpress-site.com",
  ENDPOINTS: {
    LOGIN: "/wp-json/custom/v1/login", // Or JWT auth: "/wp-json/jwt-auth/v1/token"
    REGISTER: "/wp-json/custom/v1/register",
    LOGOUT: "/wp-json/custom/v1/logout",
    FORGOT_PASSWORD: "/wp-json/custom/v1/forgot-password",
    RESET_PASSWORD: "/wp-json/custom/v1/reset-password",
    VERIFY_OTP: "/wp-json/custom/v1/verify-email",
    PROFILE: "/wp-json/custom/v1/profile", // GET /profile, PUT /profile
    ORDERS: "/wp-json/custom/v1/orders",
    PAYMENTS: "/wp-json/custom/v1/payments",
    MEMBERSHIP: "/wp-json/custom/v1/membership",
  }
};

// Mock User Data for Initial Development
const MOCK_USER: User = {
  id: "wlc_user_992",
  firstName: "Aria",
  lastName: "Sterling",
  email: "aria.sterling@wellnesslovers.com",
  phone: "+1 (555) 019-2834",
  profession: "Creative Director",
  companyName: "Zenith Design Studio",
  country: "United States",
  city: "San Francisco",
  address: "482 Pine Street, Apt 3B, San Francisco, CA 94104",
  membershipStatus: "Active",
  membershipTier: "Premium Lotus Club",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
};

const MOCK_ORDERS: Order[] = [
  { id: "WLC-8921", date: "June 14, 2026", status: "Completed", total: "$120.00", item: "Himalayan Sanctuary Yoga Retreat Pass" },
  { id: "WLC-7402", date: "April 29, 2026", status: "Completed", total: "$350.00", item: "Premium Lotus Club Annual Membership" },
  { id: "WLC-6310", date: "January 12, 2026", status: "Completed", total: "$95.00", item: "1-on-1 Mindfulness Coaching Session" }
];

const MOCK_PAYMENTS: Payment[] = [
  { id: "PAY-29831", date: "June 14, 2026", amount: "$120.00", status: "Successful", method: "Stripe (Visa)" },
  { id: "PAY-18291", date: "April 29, 2026", amount: "$350.00", status: "Successful", method: "PayPal" },
  { id: "PAY-09281", date: "January 12, 2026", amount: "$95.00", status: "Successful", method: "Apple Pay" }
];

const MOCK_MEMBERSHIPS: Membership[] = [
  {
    id: "MEM-8201",
    tier: "Premium Lotus Club",
    status: "Active",
    startDate: "April 29, 2026",
    endDate: "April 28, 2027",
    price: "$350.00",
    billingCycle: "Annually"
  }
];

// Helper to simulate API latency
const delay = (ms = 1200) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  /**
   * Performs user login
   */
  async login(email: string, password: string, rememberMe: boolean): Promise<AuthResponse> {
    await delay();
    
    // Simulate invalid login for testing if email is "error@test.com"
    if (email === "error@test.com") {
      throw new Error("Invalid email or password. Please try again.");
    }

    // Standard login behavior
    return {
      user: {
        ...MOCK_USER,
        email: email
      },
      token: "mock-jwt-access-token-xxx",
      refreshToken: rememberMe ? "mock-jwt-refresh-token-yyy" : ""
    };
  },

  /**
   * Registers a new user account
   */
  async register(userData: Partial<User> & { password?: string }): Promise<AuthResponse> {
    await delay(1500);

    if (userData.email === "exists@test.com") {
      throw new Error("An account with this email already exists.");
    }

    const newUser: User = {
      id: "wlc_user_" + Math.floor(Math.random() * 1000),
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
      profession: userData.profession || "",
      companyName: userData.companyName || "",
      country: userData.country || "",
      city: userData.city || "",
      membershipStatus: "Pending",
      avatarUrl: ""
    };

    return {
      user: newUser,
      token: "mock-jwt-access-token-xxx",
      refreshToken: ""
    };
  },

  /**
   * Logs out the user
   */
  async logout(): Promise<void> {
    await delay(600);
    // Future: call POST /wp-json/custom/v1/logout to invalidate tokens
  },

  /**
   * Requests a password reset link
   */
  async forgotPassword(email: string): Promise<void> {
    await delay(1000);
    if (email === "notfound@test.com") {
      throw new Error("No account found with this email address.");
    }
  },

  /**
   * Confirms a new password using a token
   */
  async resetPassword(password: string): Promise<void> {
    await delay(1200);
  },

  /**
   * Verifies an OTP code (6 digits)
   */
  async verifyOTP(otp: string): Promise<void> {
    await delay(1000);
    if (otp !== "123456" && otp !== "111111") {
      throw new Error("Invalid OTP code. Please enter the correct 6-digit code.");
    }
  },

  /**
   * Refreshes the session token
   */
  async refreshToken(token: string): Promise<{ token: string }> {
    await delay(500);
    return { token: token + "-refreshed" };
  },

  /**
   * Fetches the user profile from the server
   */
  async getProfile(): Promise<User> {
    await delay(800);
    return MOCK_USER;
  },

  /**
   * Updates profile data
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    await delay(1200);
    return {
      ...MOCK_USER,
      ...profileData
    };
  },

  /**
   * Changes the user's password
   */
  async changePassword(): Promise<void> {
    await delay(1200);
  },

  /**
   * Fetches the user's orders (WooCommerce compatible)
   */
  async getOrders(): Promise<Order[]> {
    await delay(800);
    return MOCK_ORDERS;
  },

  /**
   * Fetches user's payments
   */
  async getPayments(): Promise<Payment[]> {
    await delay(800);
    return MOCK_PAYMENTS;
  },

  /**
   * Fetches user's memberships (WooCommerce Memberships / MemberPress compatible)
   */
  async getMemberships(): Promise<Membership[]> {
    await delay(800);
    return MOCK_MEMBERSHIPS;
  }
};
