import { z } from "zod";

export const googleLoginSchema = z.object({
  credential: z.string().min(1),
  deviceId: z.string().min(1),
});

export type GoogleLoginDto = z.infer<typeof googleLoginSchema>;
