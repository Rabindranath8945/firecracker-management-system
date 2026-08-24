import { z } from "zod";

export const createSupplierSchema = z.object({
  supplierCode: z.string().trim().max(30).optional(),

  name: z.string().trim().min(2, "Supplier name is required.").max(100),

  mobile: z
    .string()
    .trim()
    .min(10, "Mobile number must be at least 10 digits.")
    .max(15),

  alternateMobile: z.string().trim().max(15).optional().or(z.literal("")),

  email: z.string().trim().email("Invalid email.").optional().or(z.literal("")),

  gstNo: z.string().trim().max(20).optional().or(z.literal("")),

  address: z.string().trim().max(500).optional().or(z.literal("")),

  city: z.string().trim().max(100).optional().or(z.literal("")),

  state: z.string().trim().max(100).optional().or(z.literal("")),

  pinCode: z.string().trim().max(10).optional().or(z.literal("")),

  openingBalance: z.coerce.number().min(0).default(0),

  notes: z.string().trim().max(1000).optional().or(z.literal("")),

  isActive: z.boolean().default(true),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSupplierDto = z.infer<typeof createSupplierSchema>;

export type UpdateSupplierDto = z.infer<typeof updateSupplierSchema>;
