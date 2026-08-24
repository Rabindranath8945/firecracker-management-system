/* -------------------------------------------------------------------------- */
/* Payment                                                                    */
/* -------------------------------------------------------------------------- */

export type PaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK"
  | "CREDIT"
  | "MIXED";

export type PaymentStatus = "PAID" | "PARTIAL" | "DUE";

/* -------------------------------------------------------------------------- */
/* Customer                                                                   */
/* -------------------------------------------------------------------------- */

export interface SaleCustomer {
  _id: string;

  name: string;

  mobile?: string;

  email?: string;

  address?: string;

  dueAmount?: number;

  lastVisit?: string;

  walkIn?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Sale Item                                                                  */
/* -------------------------------------------------------------------------- */

export interface SaleItem {
  product: string;

  productCode: string;

  productName: string;

  image?: string;

  category?: {
    _id: string;
    name: string;
  };

  subCategory?: {
    _id: string;
    name: string;
  };

  brand?: string;

  unit: string;

  stock: number;

  tax: number;

  quantity: number;

  sellingPrice: number;

  discount: number;

  total: number;

  profit: number;
}

/* -------------------------------------------------------------------------- */
/* Payment                                                                    */
/* -------------------------------------------------------------------------- */

export interface SalePayment {
  method: PaymentMethod;

  cash: number;

  upi: number;

  card: number;

  bank: number;

  credit: number;
}

/* -------------------------------------------------------------------------- */
/* Sale                                                                       */
/* -------------------------------------------------------------------------- */

export interface Sale {
  _id: string;

  saleNo: string;

  invoiceNo: string;

  customer?: SaleCustomer | null;

  saleDate: string;

  items: SaleItem[];

  subtotal: number;

  discount: number;

  taxAmount: number;

  grandTotal: number;

  paidAmount: number;

  dueAmount: number;

  payment: SalePayment;

  paymentStatus: PaymentStatus;

  notes?: string;

  createdAt: string;

  updatedAt: string;
}
/* -------------------------------------------------------------------------- */
/* Create Sale                                                                */
/* -------------------------------------------------------------------------- */

export interface SaleFormData {
  customer?: string;

  items: {
    product: string;
    quantity: number;
    price: number;
  }[];

  paymentMethod: "CASH" | "UPI" | "CARD" | "BANK" | "CREDIT" | "MIXED";

  discount: number;

  paidAmount: number;

  notes?: string;
}

/* -------------------------------------------------------------------------- */
/* Sales Summary                                                              */
/* -------------------------------------------------------------------------- */

export interface SalesSummary {
  todaySales: number;

  todayOrders: number;

  itemsSold: number;

  todayProfit: number;
}

/* -------------------------------------------------------------------------- */
/* Sales Query                                                                */
/* -------------------------------------------------------------------------- */

export interface SalesQueryParams {
  page?: number;

  limit?: number;

  search?: string;

  customer?: string;

  paymentStatus?: string;

  paymentMethod?: string;

  fromDate?: string;

  toDate?: string;

  sort?: string;

  order?: "asc" | "desc";
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

export interface Pagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

/* -------------------------------------------------------------------------- */
/* API Responses                                                              */
/* -------------------------------------------------------------------------- */

export interface SalesListResponse {
  success: boolean;

  message: string;

  data: {
    items: Sale[];

    pagination: Pagination;
  };
}
