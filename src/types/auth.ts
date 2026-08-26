export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;
  address?: string;
  profession?: string;
  designation?: string;
  companyName?: string;
  company?: string;
  country: string;
  city?: string;
  membershipStatus: "Inactive" | "Active" | "Lifetime" | "Pending" | "Expired" | "Cancelled";
  membershipTier?: string;
  membershipPlan?: string;

  // Digital Membership Number — authoritative value from WordPress backend
  membershipNumber?: string;
  membershipId?: string;
  wlc_membership_id?: string;
  wlc_membership_number?: string;

  // Membership Dates — from WordPress backend
  validTill?: string;
  validUntil?: string;
  membershipStartDate?: string;

  // Payment Info — from WordPress payment ledger
  paymentStatus?: string;
  paidAt?: string;
  invoiceNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amountPaid?: number;

  preferences?: any;
}

export interface Membership {
  id: string;
  tier: string;
  status: string;
  startDate: string;
  endDate: string;
  price: string;
  billingCycle: string;
}

export interface Order {
  id: string;
  date: string;
  status: "Completed" | "Pending" | "Failed" | "Processing";
  total: string;
  item: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: string;
  status: "Successful" | "Pending" | "Refunded";
  method: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
