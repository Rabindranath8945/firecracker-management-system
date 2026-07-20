import { z } from "zod";

export const partySchema = z.object({
  name: z.string().trim().min(2),

  mobile: z.string(),

  email: z.string().email().optional().or(z.literal("")),

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  pinCode: z.string().optional(),

  gstNo: z.string().optional(),

  openingBalance: z.coerce.number(),

  type: z.enum(["CUSTOMER", "SUPPLIER", "BOTH"]),

  isActive: z.boolean(),
});

export type PartyFormInput = z.input<typeof partySchema>;

export type PartyFormValues = z.output<typeof partySchema>;
