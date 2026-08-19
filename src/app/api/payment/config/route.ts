import { NextResponse } from "next/server";

const WP_BASE = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.wellnessloversclub.com").replace(/\/$/, "");

export async function GET() {
  try {
    const res = await fetch(`${WP_BASE}/wp-json/custom/v1/payment/config`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data.data || data);
    }
  } catch (err) {
    // Fallback below
  }

  return NextResponse.json({
    success: true,
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TR9Dw0VTSvX6yH",
    currency: "INR",
    amount: 29000,
    amount_paise: 2900000,
    item_name: "Wellness Lovers Club - VIP Annual Membership",
    description: "Annual Luxury VIP Membership Access & Privileges",
    is_tax_inclusive: true,
  });
}
