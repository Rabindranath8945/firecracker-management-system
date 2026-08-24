export const PAYMENT_SESSION_STATUS = [
  "PENDING",
  "CONFIRMED",
  "EXPIRED",
  "CANCELLED",
] as const;

export type PaymentSessionStatus = (typeof PAYMENT_SESSION_STATUS)[number];

export const PAYMENT_STATUS = ["PENDING", "SUCCESS", "FAILED"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PAYMENT_CONFIRMATION = ["MANUAL", "AUTO"] as const;

export type PaymentConfirmationMethod = (typeof PAYMENT_CONFIRMATION)[number];
