export const SUPPLIER_PAYMENT_METHODS = [
  "CASH",
  "BANK",
  "UPI",
  "CARD",
  "CHEQUE",
  "CREDIT",
] as const;

export type SupplierPaymentMethod = (typeof SUPPLIER_PAYMENT_METHODS)[number];

/* -------------------------------------------------------------------------- */
/* PAYMENT TYPE                                                               */
/* -------------------------------------------------------------------------- */

export const SUPPLIER_PAYMENT_TYPES = [
  "CURRENT_PURCHASE",
  "PREVIOUS_DUE",
] as const;

export type SupplierPaymentType = (typeof SUPPLIER_PAYMENT_TYPES)[number];
