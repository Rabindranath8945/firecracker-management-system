import { z } from "zod";

export const createExpenseSchema = z.object({
  expenseNo: z.string().trim().min(1),

  title: z.string().trim().min(2),

  category: z.string().trim().min(2),

  amount: z.number().positive(),

  paymentMethod: z.enum(["CASH", "BANK", "UPI", "CARD", "CHEQUE"]),

  expenseDate: z.coerce.date(),

  notes: z.string().optional(),

  isActive: z.boolean().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
