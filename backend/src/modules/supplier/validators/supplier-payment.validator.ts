import { z } from "zod";

import {
  SUPPLIER_PAYMENT_METHODS,
  SUPPLIER_PAYMENT_TYPES,
} from "../constants/supplier-payment.constants.js";

/* -------------------------------------------------------------------------- */
/* CREATE SUPPLIER PAYMENT                                                   */
/* -------------------------------------------------------------------------- */

export const createSupplierPaymentSchema = z.object({
  supplier: z.string().min(1, "Supplier required"),

  amount: z.number().positive("Payment amount must be greater than 0"),

  paymentMethod: z.enum(SUPPLIER_PAYMENT_METHODS),

  paymentType: z.enum(SUPPLIER_PAYMENT_TYPES),

  paymentDate: z.coerce.date(),

  referencePurchase: z.string().optional(),

  notes: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/* UPDATE SUPPLIER PAYMENT                                                   */
/* -------------------------------------------------------------------------- */

export const updateSupplierPaymentSchema =
  createSupplierPaymentSchema.partial();

export type CreateSupplierPaymentDto = z.infer<
  typeof createSupplierPaymentSchema
>;

export type UpdateSupplierPaymentDto = z.infer<
  typeof updateSupplierPaymentSchema
>;
