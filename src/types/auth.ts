export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession?: string;
  companyName?: string;
  country: string;
  city?: string;
  address?: string;
  membershipStatus: "Inactive" | "Active" | "Lifetime" | "Pending";
  membershipTier?: string;
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
