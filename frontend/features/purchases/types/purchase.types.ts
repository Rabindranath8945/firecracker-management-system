export type PaymentStatus = "PAID" | "PARTIAL" | "DUE";

export type PaymentMethod =
  | "CASH"
  | "BANK"
  | "UPI"
  | "CARD"
  | "CHEQUE"
  | "CREDIT";

/* -------------------------------------------------------------------------- */
/*                              Supplier                                      */
/* -------------------------------------------------------------------------- */

export interface PurchaseSupplier {
  _id: string;
  name: string;
  mobile?: string;
  supplierCode?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Purchase Item                                 */
/* -------------------------------------------------------------------------- */

export interface PurchaseItem {
  productId: string;
  productSku: string;
  productName: string;
  productImage?: string;

  quantity: number;

  purchasePrice: number;
  sellingPrice: number;

  discount: number;
  gstRate: number;

  subtotal: number;
  gstAmount: number;
  total: number;
}

/* -------------------------------------------------------------------------- */
/*                                Purchase                                    */
/* -------------------------------------------------------------------------- */

export interface Purchase {
  _id: string;

  purchaseNo: string;
  invoiceNo?: string;

  supplier: PurchaseSupplier;

  purchaseDate: string;
  dueDate?: string;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  subtotal: number;
  discount: number;
  gstTotal: number;
  transportCharge: number;
  grandTotal: number;

  paidAmount: number;
  dueAmount: number;

  notes?: string;

  items: PurchaseItem[];

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                            Purchase Item Request                            */
/* -------------------------------------------------------------------------- */

export interface PurchaseItemRequest {
  productId: string;

  quantity: number;

  purchasePrice: number;
  sellingPrice: number;

  discount: number;
  gstRate: number;
}

/* -------------------------------------------------------------------------- */
/*                           Create Purchase Request                           */
/* -------------------------------------------------------------------------- */

export interface CreatePurchaseRequest {
  supplierId: string;

  purchaseDate: string;

  dueDate?: string;

  paymentMethod: PaymentMethod;

  transportCharge: number;

  paidAmount: number;

  notes?: string;

  items: PurchaseItemRequest[];
}

/* -------------------------------------------------------------------------- */
/*                           Update Purchase Request                           */
/* -------------------------------------------------------------------------- */

export interface UpdatePurchaseRequest {
  supplierId?: string;

  purchaseDate?: string;

  dueDate?: string;

  paymentMethod?: PaymentMethod;

  transportCharge?: number;

  paidAmount?: number;

  notes?: string;

  items?: PurchaseItemRequest[];
}

/* -------------------------------------------------------------------------- */
/*                              Query Parameters                               */
/* -------------------------------------------------------------------------- */

export interface PurchaseQueryParams {
  page?: number;
  limit?: number;

  search?: string;
  supplier?: string;
  paymentStatus?: PaymentStatus;

  fromDate?: string;
  toDate?: string;

  sort?: string;
  order?: "asc" | "desc";

  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               OCR Response                                  */
/* -------------------------------------------------------------------------- */

export interface PurchaseOCRResponse {
  text: string;
  provider: "google-vision";
}
