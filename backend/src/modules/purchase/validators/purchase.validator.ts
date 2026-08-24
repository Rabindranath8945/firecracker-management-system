import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* COMMON ITEM FIELDS                                                         */
/* -------------------------------------------------------------------------- */

const PurchaseItemFields = {
  quantity: z.number().min(1, "Quantity must be at least 1"),

  purchasePrice: z.number().min(0, "Purchase price cannot be negative"),

  sellingPrice: z.number().min(0, "Selling price cannot be negative"),

  discount: z.number().min(0, "Discount cannot be negative"),
};

/* -------------------------------------------------------------------------- */
/* FRONTEND PURCHASE ITEM                                                     */
/* -------------------------------------------------------------------------- */

export const PurchaseItemSchema = z.object({
  productId: z.string().trim().min(1, "Product required"),

  ...PurchaseItemFields,
});

/* -------------------------------------------------------------------------- */
/* FRONTEND PURCHASE FORM                                                     */
/* -------------------------------------------------------------------------- */

export const PurchaseSchema = z.object({
  supplierId: z.string().trim().min(1, "Supplier required"),

  purchaseDate: z.string().min(1, "Purchase date required"),

  dueDate: z.string().optional(),

  paymentMethod: z.enum(["CASH", "BANK", "UPI", "CARD", "CHEQUE", "CREDIT"]),

  transportCharge: z.number().min(0, "Transport charge cannot be negative"),

  paidAmount: z.number().min(0, "Paid amount cannot be negative"),

  notes: z.string().optional(),

  items: z.array(PurchaseItemSchema).min(1, "Add at least one product"),
});

export type PurchaseForm = z.infer<typeof PurchaseSchema>;

/* -------------------------------------------------------------------------- */
/* BACKEND PURCHASE ITEM                                                      */
/* -------------------------------------------------------------------------- */

/*
 * GST is intentionally NOT accepted from the client.
 *
 * Backend gets GST from:
 *
 * Product.tax
 *        ↓
 * Tax Settings fallback
 */

const BackendPurchaseItemSchema = z.object({
  product: z.string().trim().min(1, "Product required"),

  ...PurchaseItemFields,
});

/* -------------------------------------------------------------------------- */
/* BACKEND CREATE PURCHASE                                                    */
/* -------------------------------------------------------------------------- */

export const createPurchaseSchema = z.object({
  supplier: z.string().trim().min(1, "Supplier required"),

  purchaseDate: z.coerce.date(),

  dueDate: z.coerce.date().optional(),

  items: z
    .array(BackendPurchaseItemSchema)
    .min(1, "At least one product is required"),

  transportCharge: z.number().min(0, "Transport charge cannot be negative"),

  paidAmount: z.number().min(0, "Paid amount cannot be negative"),

  paymentMethod: z.enum(["CASH", "BANK", "UPI", "CARD", "CHEQUE", "CREDIT"]),

  notes: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/* BACKEND UPDATE PURCHASE                                                    */
/* -------------------------------------------------------------------------- */

export const updatePurchaseSchema = z.object({
  supplier: z.string().trim().min(1, "Supplier required").optional(),

  purchaseDate: z.coerce.date().optional(),

  dueDate: z.coerce.date().optional(),

  items: z
    .array(BackendPurchaseItemSchema)
    .min(1, "At least one product is required")
    .optional(),

  transportCharge: z
    .number()
    .min(0, "Transport charge cannot be negative")
    .optional(),

  paidAmount: z.number().min(0, "Paid amount cannot be negative").optional(),

  paymentMethod: z
    .enum(["CASH", "BANK", "UPI", "CARD", "CHEQUE", "CREDIT"])
    .optional(),

  notes: z.string().optional(),

  isActive: z.boolean().optional(),
});

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;

export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>;
