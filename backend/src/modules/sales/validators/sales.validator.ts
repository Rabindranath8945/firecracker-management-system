import { z } from "zod";

const paymentSchema = z.object({
  method: z.enum(["CASH", "UPI", "CARD", "BANK", "CREDIT", "MIXED"]),

  cash: z.number().min(0),

  upi: z.number().min(0),

  card: z.number().min(0),

  bank: z.number().min(0),

  credit: z.number().min(0),
});

const saleItemSchema = z.object({
  product: z.string().trim().min(1),

  quantity: z.number().positive(),

  purchasePrice: z.number().min(0),

  sellingPrice: z.number().min(0),

  discount: z.number().min(0),

  tax: z.number().min(0),
});

/**
 * Base Schema
 */
const saleSchema = z.object({
  customer: z.string().optional(),

  saleDate: z.coerce.date(),

  items: z.array(saleItemSchema).min(1),

  paidAmount: z.number().min(0),

  dueAmount: z.number().min(0),

  payment: paymentSchema,

  paymentStatus: z.enum(["PAID", "PARTIAL", "UNPAID"]),

  notes: z.string().optional(),

  isActive: z.boolean().optional(),
});

/**
 * Create Validation
 */
export const createSaleSchema = saleSchema.superRefine((data, ctx) => {
  const calculatedGrandTotal = data.items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.sellingPrice;

    const taxable = itemSubtotal - item.discount;

    const itemTax = (taxable * item.tax) / 100;

    return sum + taxable + itemTax;
  }, 0);

  if (
    Math.abs(calculatedGrandTotal - (data.paidAmount + data.dueAmount)) > 0.01
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Paid Amount + Due Amount must equal Grand Total.",
      path: ["paidAmount"],
    });
  }

  const paymentTotal =
    data.payment.cash +
    data.payment.upi +
    data.payment.card +
    data.payment.bank +
    data.payment.credit;

  if (Math.abs(paymentTotal - data.paidAmount) > 0.01) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Payment breakdown must equal Paid Amount.",
      path: ["payment"],
    });
  }

  if (data.payment.method !== "MIXED") {
    const activePayments = [
      data.payment.cash,
      data.payment.upi,
      data.payment.card,
      data.payment.bank,
      data.payment.credit,
    ].filter((value) => value > 0);

    if (activePayments.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Only one payment method is allowed unless payment method is MIXED.",
        path: ["payment"],
      });
    }
  }
});

/**
 * Update Validation
 *
 * Version 1:
 * Sale items are not editable after creation.
 * Only header fields (customer, payment, notes, etc.) can be updated.
 */
export const updateSaleSchema = saleSchema.partial();

export type CreateSaleInput = z.infer<typeof createSaleSchema>;

export type UpdateSaleInput = z.infer<typeof updateSaleSchema>;
