import api from "@/lib/api";

import type {
  CreatePurchaseRequest,
  PurchaseOCRResponse,
  PurchaseQueryParams,
} from "../types/purchase.types";

export interface PurchaseItemPayload {
  product: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  discount: number;
  gstRate: number;
  tax: number;
  subtotal: number;
  total: number;
}

export interface PurchasePayload {
  supplier: string;
  invoiceNo?: string;
  purchaseDate: string;
  dueDate?: string;
  items: PurchaseItemPayload[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  transportCharge: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: "CASH" | "BANK" | "UPI" | "CARD" | "CHEQUE" | "CREDIT";
  paymentStatus: "PAID" | "PARTIAL" | "DUE";
  notes?: string;
}

interface PurchaseOCRApiResponse {
  success: boolean;
  message: string;
  data: PurchaseOCRResponse;
}

function calculateItem(item: CreatePurchaseRequest["items"][number]) {
  const subtotal = item.quantity * item.purchasePrice;

  const discountAmount = subtotal * (item.discount / 100);

  const taxableAmount = subtotal - discountAmount;

  const taxAmount = taxableAmount * (item.gstRate / 100);

  const total = taxableAmount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}

export function buildPurchasePayload(
  data: CreatePurchaseRequest,
): PurchasePayload {
  let subtotal = 0;
  let discount = 0;
  let taxAmount = 0;

  const items: PurchaseItemPayload[] = data.items.map((item) => {
    const calculated = calculateItem(item);

    subtotal += calculated.subtotal;
    discount += calculated.discountAmount;
    taxAmount += calculated.taxAmount;

    return {
      product: item.productId,
      quantity: item.quantity,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      discount: item.discount,
      gstRate: item.gstRate,
      tax: calculated.taxAmount,
      subtotal: calculated.subtotal,
      total: calculated.total,
    };
  });

  const grandTotal = subtotal - discount + taxAmount + data.transportCharge;

  const paidAmount = Math.max(0, data.paidAmount);

  if (paidAmount > grandTotal) {
    throw new Error("Paid amount cannot be greater than grand total.");
  }

  const dueAmount = Math.max(0, grandTotal - paidAmount);

  const paymentStatus: "PAID" | "PARTIAL" | "DUE" =
    paidAmount >= grandTotal ? "PAID" : paidAmount > 0 ? "PARTIAL" : "DUE";

  const payload: PurchasePayload = {
    supplier: data.supplierId,
    purchaseDate: data.purchaseDate,
    items,
    subtotal,
    taxAmount,
    discount,
    transportCharge: data.transportCharge,
    grandTotal,
    paidAmount,
    dueAmount,
    paymentMethod: data.paymentMethod,
    paymentStatus,
  };

  if (data.dueDate) {
    payload.dueDate = data.dueDate;
  }

  if (data.notes?.trim()) {
    payload.notes = data.notes.trim();
  }

  return payload;
}

export const purchaseApi = {
  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async create(data: CreatePurchaseRequest) {
    const payload = buildPurchasePayload(data);

    return api.post("/purchases", payload);
  },

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async update(id: string, data: CreatePurchaseRequest) {
    const payload = buildPurchasePayload(data);

    return api.put(`/purchases/${id}`, payload);
  },

  /* ---------------------------------------------------------------------- */
  /* GET ALL                                                                */
  /* ---------------------------------------------------------------------- */

  async getAll(params: PurchaseQueryParams = {}) {
    return api.get("/purchases", {
      params,
    });
  },

  /* ---------------------------------------------------------------------- */
  /* GET BY ID                                                              */
  /* ---------------------------------------------------------------------- */

  async getById(id: string) {
    return api.get(`/purchases/${id}`);
  },

  /* ---------------------------------------------------------------------- */
  /* OCR                                                                    */
  /* ---------------------------------------------------------------------- */

  async ocr(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return api.post<{
      success: boolean;
      message: string;
      data: PurchaseOCRResponse;
    }>("/purchases/ocr", formData);
  },

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                 */
  /* ---------------------------------------------------------------------- */

  async remove(id: string) {
    return api.delete(`/purchases/${id}`);
  },
};
