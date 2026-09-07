import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const WP_BASE = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.wellnessloversclub.com").replace(/\/$/, "");
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_session_token } = body;

  if (!razorpay_payment_id) {
    return NextResponse.json({ success: false, message: "Missing Razorpay payment ID." }, { status: 400 });
  }

  // 1. Authoritative WordPress backend verification (primary path)
  try {
    const authHeader = req.headers.get("authorization") || "";
    const wpHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (authHeader) wpHeaders["Authorization"] = authHeader;
    if (payment_session_token) wpHeaders["X-Payment-Session"] = payment_session_token;

    const wpRes = await fetch(`${WP_BASE}/wp-json/custom/v1/payment/verify-payment`, {
      method: "POST",
      headers: wpHeaders,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (wpRes.ok) {
      const data = await wpRes.json();
      return NextResponse.json(data.data || data);
    }
  } catch (wpErr) {
    console.warn("WordPress verify-payment proxy failed, attempting Next.js fallback HMAC verification:", wpErr);
  }

  // 2. Fallback: Cryptographic HMAC-SHA256 signature verification in Next.js Server
  // SECURITY: Signature is MANDATORY in the fallback path.
  // If neither signature nor server secret is present, we cannot safely verify — reject.
  if (!razorpay_signature || !razorpay_order_id) {
    return NextResponse.json(
      { success: false, message: "Payment verification failed: signature and order ID are required." },
      { status: 400 }
    );
  }

  if (!RAZORPAY_KEY_SECRET) {
    // Cannot perform HMAC without a server-side secret — do not accept the payment
    console.error("[WLC] RAZORPAY_KEY_SECRET is not configured. Cannot verify payment signature in fallback.");
    return NextResponse.json(
      { success: false, message: "Payment verification service is temporarily unavailable. Please contact support." },
      { status: 503 }
    );
  }

  const expectedSig = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json(
      { success: false, message: "Invalid payment signature. Verification failed." },
      { status: 400 }
    );
  }

  // Signature verified — return success (membership activation handled by WordPress primary path)
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const now = new Date();
  const startDay = String(now.getDate()).padStart(2, "0");
  const startMonth = String(now.getMonth() + 1).padStart(2, "0");
  const startYear = now.getFullYear();
  const startDate = `${startDay} / ${startMonth} / ${startYear}`;

  const expiry = new Date(now);
  expiry.setFullYear(expiry.getFullYear() + 1);
  const endDay = String(expiry.getDate()).padStart(2, "0");
  const endMonth = String(expiry.getMonth() + 1).padStart(2, "0");
  const endYear = expiry.getFullYear();
  const validTill = `${endDay} / ${endMonth} / ${endYear}`;

  return NextResponse.json({
    success: true,
    message: "Payment signature verified. Membership activation is being processed.",
    order_id: order_id || `WLC_ORD_${Date.now()}`,
    razorpay_order_id: razorpay_order_id || "",
    razorpay_payment_id: razorpay_payment_id,
    membership_id: "",
    membership_number: "",
    invoice_number: invoiceNumber,
    amount: 29000,
    status: "completed",
    start_date: startDate,
    valid_until: validTill,
    valid_till: validTill,
  });
}
