import { z } from "zod";

export const quickSupplierSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required"),

  contactPerson: z.string().optional(),

  mobile: z.string().trim().min(10, "Mobile number is required"),
});

export type QuickSupplierForm = z.infer<typeof quickSupplierSchema>;
