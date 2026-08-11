import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Payment                                                                    */
/* -------------------------------------------------------------------------- */

const paymentSchema = z.object({
  method: z.enum(["CASH", "UPI", "CARD", "BANK", "CREDIT", "MIXED"]),

  cash: z.number().min(0),

  upi: z.number().min(0),

  card: z.number().min(0),

  bank: z.number().min(0),

  credit: z.number().min(0),
});

/* -------------------------------------------------------------------------- */
/* Create Sale Item                                                           */
/* -------------------------------------------------------------------------- */

const createSaleItemSchema = z.object({
  product: z.string().trim().min(1),

  quantity: z.number().positive(),

  /*
   * Frontend selling price.
   *
   * The backend will NOT trust this value for the final sale.
   * Product sellingPrice will be read from the database.
   */
  price: z.number().min(0),
});

/* -------------------------------------------------------------------------- */
/* Create Sale Schema                                                         */
/* -------------------------------------------------------------------------- */

export const createSaleSchema = z.object({
  customer: z.string().optional(),

  items: z.array(createSaleItemSchema).min(1),

  paymentMethod: z.enum(["CASH", "UPI", "CARD", "BANK", "CREDIT", "MIXED"]),

  discount: z.number().min(0),

  paidAmount: z.number().min(0),

  notes: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/* Final Sale Item Schema                                                     */
/* -------------------------------------------------------------------------- */

const saleItemSchema = z.object({
  product: z.string().trim().min(1),

  quantity: z.number().positive(),

  purchasePrice: z.number().min(0),

  sellingPrice: z.number().min(0),

  discount: z.number().min(0),

  tax: z.number().min(0),
});

/* -------------------------------------------------------------------------- */
/* Final Payment Schema                                                       */
/* -------------------------------------------------------------------------- */

const finalPaymentSchema = paymentSchema;

/* -------------------------------------------------------------------------- */
/* Final Sale Schema                                                          */
/* -------------------------------------------------------------------------- */

export const finalSaleSchema = z.object({
  customer: z.string().optional(),

  saleDate: z.coerce.date(),

  items: z.array(saleItemSchema).min(1),

  paidAmount: z.number().min(0),

  dueAmount: z.number().min(0),

  payment: finalPaymentSchema,

  paymentStatus: z.enum(["PAID", "PARTIAL", "DUE"]),

  notes: z.string().optional(),

  isActive: z.boolean().optional(),
});

/* -------------------------------------------------------------------------- */
/* Update Validation                                                          */
/* -------------------------------------------------------------------------- */

export const updateSaleSchema = finalSaleSchema.partial();

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type CreateSaleInput = z.infer<typeof createSaleSchema>;

export type UpdateSaleInput = z.infer<typeof updateSaleSchema>;
