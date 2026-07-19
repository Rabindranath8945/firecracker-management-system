/* -------------------------------------------------------------------------- */
/* Customer */
/* -------------------------------------------------------------------------- */

export interface SaleCustomer {
  id: string;

  name: string;

  phone: string;

  due: number;

  lastVisit: string;

  walkIn?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Product */
/* -------------------------------------------------------------------------- */

export interface SaleItem {
  productId: string;

  productName: string;

  quantity: number;

  price: number;

  discount: number;

  total: number;
}

/* -------------------------------------------------------------------------- */
/* Payment */
/* -------------------------------------------------------------------------- */

export type PaymentMethod = "CASH" | "UPI" | "MIXED" | "CREDIT";
