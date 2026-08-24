import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                               Create Notification                          */
/* -------------------------------------------------------------------------- */

export const createNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(100, "Title is too long."),

  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(500, "Message is too long."),

  type: z.enum([
    "LOW_STOCK",
    "BACKUP",
    "SECURITY",
    "PURCHASE",
    "SALES",
    "SYSTEM",
  ]),

  data: z.record(z.string(), z.unknown()).optional(),
});

/* -------------------------------------------------------------------------- */
/*                              Update Notification                           */
/* -------------------------------------------------------------------------- */

export const updateNotificationSchema = createNotificationSchema.partial();

/* -------------------------------------------------------------------------- */
/*                                  Mark Read                                 */
/* -------------------------------------------------------------------------- */

export const markReadSchema = z.object({
  read: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                                Query Filter                                */
/* -------------------------------------------------------------------------- */

export const notificationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(20),

  read: z.enum(["true", "false"]).optional(),

  type: z
    .enum(["LOW_STOCK", "BACKUP", "SECURITY", "PURCHASE", "SALES", "SYSTEM"])
    .optional(),
});

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;

export type MarkReadInput = z.infer<typeof markReadSchema>;

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
