import { z } from "zod";

export const PurchaseItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().min(1),

  purchasePrice: z.number().min(0),

  sellingPrice: z.number().min(0),

  discount: z.number().min(0),

  gstRate: z.number().min(0),
});

export const PurchaseSchema = z.object({
  supplierId: z.string().min(1, "Supplier required"),

  invoiceNo: z.string().optional(),

  purchaseDate: z.string(),

  dueDate: z.string().optional(),

  paymentStatus: z.enum(["PAID", "PARTIAL", "DUE"]),

  transportCharge: z.number(),

  paidAmount: z.number(),

  notes: z.string().optional(),

  items: z.array(PurchaseItemSchema).min(1),
});

export type PurchaseForm = z.infer<typeof PurchaseSchema>;
