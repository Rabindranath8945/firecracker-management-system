import { z } from "zod";

const purchaseItemSchema = z.object({
  product: z.string().trim().min(1),

  quantity: z.number().positive(),

  purchasePrice: z.number().min(0),

  tax: z.number().min(0),

  total: z.number().min(0),
});

export const createPurchaseSchema = z.object({
  purchaseNo: z.string().trim().min(1),

  supplier: z.string().trim().min(1),

  invoiceNo: z.string().optional(),

  purchaseDate: z.coerce.date(),

  items: z.array(purchaseItemSchema).min(1),

  subtotal: z.number().min(0),

  taxAmount: z.number().min(0),

  discount: z.number().min(0),

  grandTotal: z.number().min(0),

  paidAmount: z.number().min(0),

  dueAmount: z.number().min(0),

  paymentMethod: z.enum(["CASH", "BANK", "UPI", "CARD", "CHEQUE", "CREDIT"]),

  paymentStatus: z.enum(["PAID", "PARTIAL", "DUE"]),

  notes: z.string().optional(),

  isActive: z.boolean().optional(),
});

export const updatePurchaseSchema = createPurchaseSchema.partial();

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;

export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>;
