export interface OcrSupplier {
  id?: string;

  name: string;

  matched: boolean;

  confidence: number;
}

export interface OcrProduct {
  productId?: string;

  name: string;

  quantity: number;

  purchasePrice: number;

  total: number;

  matched: boolean;

  confidence: number;
}

export interface PurchaseOcrResult {
  supplier: OcrSupplier;

  invoiceNumber: string;

  invoiceDate: string;

  gstNumber: string;

  subtotal: number;

  taxAmount: number;

  grandTotal: number;

  items: OcrProduct[];

  rawText: string;
}
