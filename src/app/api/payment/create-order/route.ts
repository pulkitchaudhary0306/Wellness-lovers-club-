import { NextRequest, NextResponse } from "next/server";

const WP_BASE = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.wellnessloversclub.com").replace(/\/$/, "");
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const email = body.email || "";
  const name = body.name || "Valued Member";
  const phone = body.phone || "";

  // 1. First attempt: WordPress Backend create-order (if configured)
  try {
    const authHeader = req.headers.get("authorization") || "";
    const sessionToken = req.headers.get("x-payment-session") || body.payment_session_token || "";
    const wpHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (authHeader) wpHeaders["Authorization"] = authHeader;
    if (sessionToken) wpHeaders["X-Payment-Session"] = sessionToken;

    const wpRes = await fetch(`${WP_BASE}/wp-json/custom/v1/payment/create-order`, {
      method: "POST",
      headers: wpHeaders,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (wpRes.ok) {
      const wpData = await wpRes.json();
      if (wpData && (wpData.success || wpData.order_id || wpData.razorpay_order_id)) {
        return NextResponse.json(wpData.data || wpData);
      }
    }
  } catch (wpErr) {
    console.warn("[WLC] WordPress create-order proxy failed, falling back to direct Razorpay API:", wpErr);
  }

  // 2. Direct Razorpay Order Creation Fallback
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error("[WLC] Razorpay credentials not configured. NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing.");
    return NextResponse.json(
      { success: false, message: "Payment gateway is not configured. Please contact support." },
      { status: 503 }
    );
  }

  try {
    const orderId = `WLC_ORD_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const basicAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 2900000, // strictly 29,000.00 INR (2,900,000 paise)
        currency: "INR",
        receipt: orderId,
        payment_capture: 1,
        notes: {
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          item: "VIP Annual Membership Pass",
          total_price: "29000.00",
        },
      }),
    });

    if (rzpRes.ok) {
      const rzpData = await rzpRes.json();
      return NextResponse.json({
        success: true,
        order_id: orderId,
        razorpay_order_id: rzpData.id,
        key_id: RAZORPAY_KEY_ID,
        amount: 29000,
        amount_paise: 2900000,
        currency: "INR",
        customer: {
          name: name,
          email: email,
          contact: phone,
        },
        item: {
          title: "VIP Annual Membership Pass",
          total_payable: 29000,
        },
      });
    }

    const errBody = await rzpRes.text().catch(() => "");
    console.error(`[WLC] Razorpay order creation failed. HTTP ${rzpRes.status}: ${errBody}`);
    return NextResponse.json(
      { success: false, message: "Unable to create payment order. Please try again." },
      { status: 502 }
    );
  } catch (rzpErr) {
    console.error("[WLC] Razorpay gateway error:", rzpErr);
    return NextResponse.json(
      { success: false, message: "Payment gateway connection failed. Please try again." },
      { status: 503 }
    );
  }
}

