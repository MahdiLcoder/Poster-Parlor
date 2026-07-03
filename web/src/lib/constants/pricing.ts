// All Indian states for the dropdown
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

// Remote states that have additional shipping charges
export const REMOTE_STATES = [
  "Jammu and Kashmir",
  "Arunachal Pradesh",
  "Ladakh",
] as const;

// Pricing thresholds
export const PRICING_THRESHOLDS = {
  FREE_SHIPPING_THRESHOLD: 250,
  BASE_SHIPPING: 50,
  REMOTE_STATE_CHARGE: 150,
  GST_RATE: 0.18,
} as const;
