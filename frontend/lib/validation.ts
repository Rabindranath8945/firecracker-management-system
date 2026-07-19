import { z } from "zod";

export const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const optionalString = () => z.string().trim().optional();
