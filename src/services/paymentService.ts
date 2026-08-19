/**
 * Razorpay Payment Gateway Client Service
 * 
 * Strict Fixed Price Policy:
 * - Customer Payable: ₹29,000 (Tax Inclusive)
 * - Razorpay Order Amount: 2,900,000 paise
 */

export interface PaymentConfig {
  key_id: string;
  currency: string;
  amount: number;
  amount_paise: number;
  item_name: string;
  description: string;
  is_tax_inclusive: boolean;
}

export interface RazorpayOrderResponse {
  success: boolean;
  order_id: string;
  razorpay_order_id: string;
  key_id: string;
  amount: number;
  amount_paise: number;
  currency: string;
  customer?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  item?: {
    title?: string;
    total_payable?: number;
  };
}

export interface PaymentVerificationPayload {
  order_id?: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  message: string;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  membership_id: string;
  invoice_number: string;
  amount: number;
  status: string;
  valid_until: string;
}

const RAZORPAY_CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_SCRIPT}"]`);
    if (existing) {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      existing.addEventListener("load", () => resolve(Boolean((window as any).Razorpay)));
      existing.addEventListener("error", () => resolve(false));
      setTimeout(() => resolve(Boolean((window as any).Razorpay)), 1500);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve(Boolean((window as any).Razorpay));
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout SDK.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export const paymentService = {
  /**
   * Retrieves public payment configuration
   */
  async getConfig(): Promise<PaymentConfig> {
    try {
      const res = await fetch("/api/payment/config", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const payload = await res.json();
        return {
          key_id: payload.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TR9Dw0VTSvX6yH",
          currency: payload.currency || "INR",
          amount: payload.amount || 29000,
          amount_paise: payload.amount_paise || 2900000,
          item_name: payload.item_name || "Wellness Lovers Club - VIP Annual Membership",
          description: payload.description || "Annual Luxury VIP Membership Access & Privileges",
          is_tax_inclusive: true,
        };
      }
    } catch (err) {
      // Fallback
    }

    return {
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TR9Dw0VTSvX6yH",
      currency: "INR",
      amount: 29000,
      amount_paise: 2900000,
      item_name: "Wellness Lovers Club - VIP Annual Membership",
      description: "Annual Luxury VIP Membership Access & Privileges",
      is_tax_inclusive: true,
    };
  },

  /**
   * Creates server-side Razorpay order with strictly verified 2,900,000 paise (₹29,000)
   */
  async createOrder(customerEmail?: string): Promise<RazorpayOrderResponse> {
    let token = "";
    let sessionToken = "";
    let email = customerEmail || "";
    let name = "";
    let phone = "";

    if (typeof window !== "undefined") {
      token = sessionStorage.getItem("wlc_token") || localStorage.getItem("wlc_token") || "";
      sessionToken = sessionStorage.getItem("wlc_payment_session") || localStorage.getItem("wlc_payment_session") || "";
      if (!email) {
        email = sessionStorage.getItem("wlc_reg_email") || localStorage.getItem("wlc_reg_email") || "";
      }
      name = sessionStorage.getItem("wlc_reg_name") || localStorage.getItem("wlc_reg_name") || "";
      phone = sessionStorage.getItem("wlc_reg_phone") || localStorage.getItem("wlc_reg_phone") || "";
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (sessionToken) {
      headers["X-Payment-Session"] = sessionToken;
    }

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        name,
        phone,
        token,
        payment_session_token: sessionToken,
      }),
    });

    const json = await res.json();
    if (!res.ok || (!json.success && !json.order_id)) {
      throw new Error(json.message || json.error || "Unable to generate payment order.");
    }

    const payload: RazorpayOrderResponse = json.data || json;
    if (!payload.key_id) {
      payload.key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TR9Dw0VTSvX6yH";
    }

    return payload;
  },

  /**
   * Sends signature & payment details for HMAC SHA256 verification
   */
  async verifyPayment(payload: PaymentVerificationPayload): Promise<PaymentVerificationResult> {
    let token = "";
    let sessionToken = "";

    if (typeof window !== "undefined") {
      token = sessionStorage.getItem("wlc_token") || localStorage.getItem("wlc_token") || "";
      sessionToken = sessionStorage.getItem("wlc_payment_session") || localStorage.getItem("wlc_payment_session") || "";
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (sessionToken) {
      headers["X-Payment-Session"] = sessionToken;
    }

    const res = await fetch("/api/payment/verify-payment", {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...payload,
        payment_session_token: sessionToken,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || data.error || "Payment verification failed.");
    }

    return data.data || data;
  },
};
