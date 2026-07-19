export type PaymentStatus = "DRAFT" | "COMPLETED" | "CANCELED";

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

export interface Purchase {
  _id: string;

  purchaseNo: string;
  invoiceNo: string;

  supplierId: string;
  supplierName: string;

  purchaseDate: string;
  dueDate?: string;

  paymentStatus: PaymentStatus;

  subtotal: number;
  discount: number;
  gstTotal: number;
  transportCharge: number;
  grandTotal: number;

  paidAmount: number;
  dueAmount: number;

  notes?: string;

  items: PurchaseItem[];

  createdAt: string;
  updatedAt: string;
}
