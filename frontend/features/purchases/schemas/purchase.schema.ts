import { z } from "zod";

export const PurchaseItemSchema = z.object({
  productId: z.string().min(1, "Product required"),

  quantity: z.number().min(1, "Quantity must be at least 1"),

  purchasePrice: z.number().min(0, "Purchase price cannot be negative"),

  sellingPrice: z.number().min(0, "Selling price cannot be negative"),

  discount: z.number().min(0, "Discount cannot be negative"),

  gstRate: z.number().min(0, "GST rate cannot be negative"),
});

export const PurchaseSchema = z.object({
  supplierId: z.string().min(1, "Supplier required"),

  invoiceNo: z.string().optional(),

  purchaseDate: z.string().min(1, "Purchase date required"),

  dueDate: z.string().optional(),

  paymentStatus: z.enum(["PAID", "PARTIAL", "DUE"]),

  paymentMethod: z.enum(["CASH", "BANK", "UPI", "CARD", "CHEQUE", "CREDIT"]),

  transportCharge: z.number().min(0, "Transport charge cannot be negative"),

  paidAmount: z.number().min(0, "Paid amount cannot be negative"),

  notes: z.string().optional(),

  items: z.array(PurchaseItemSchema).min(1, "Add at least one product"),
});

export type PurchaseForm = z.infer<typeof PurchaseSchema>;
