export interface CreateSaleRequest {
  customer?: string;

  saleDate: Date;

  items: {
    product: string;

    quantity: number;

    purchasePrice: number;

    sellingPrice: number;

    discount: number;

    tax: number;

    total: number;
  }[];

  subtotal: number;

  discount: number;

  taxAmount: number;

  grandTotal: number;

  paidAmount: number;

  dueAmount: number;

  payment: {
    method: "CASH" | "UPI" | "CARD" | "BANK" | "CREDIT" | "MIXED";

    cash: number;

    upi: number;

    card: number;

    bank: number;

    credit: number;
  };

  paymentStatus: "PAID" | "PARTIAL" | "UNPAID";

  notes?: string;
}
