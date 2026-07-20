import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Supplier name must be at least 2 characters."),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),

  address: z.string().trim().optional().or(z.literal("")),

  gstNo: z.string().trim().optional().or(z.literal("")),

  openingBalance: z.number().min(0, "Opening balance cannot be negative."),

  type: z.enum(["SUPPLIER", "BOTH"]),

  isActive: z.boolean(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
