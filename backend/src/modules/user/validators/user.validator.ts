import { z } from "zod";

import { USER_PERMISSIONS, USER_ROLES } from "../constants/user.constants.js";

export const createUserSchema = z.object({
  firstName: z.string().min(2),

  lastName: z.string().min(2),

  email: z.email(),

  mobile: z.string().min(10),

  password: z.string().min(6),

  avatar: z.string().optional(),

  businessId: z.string(),

  role: z.enum(USER_ROLES),

  permissions: z.array(z.enum(USER_PERMISSIONS)),

  isOwner: z.boolean().default(false),

  isActive: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
