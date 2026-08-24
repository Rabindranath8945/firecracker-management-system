import { z } from "zod";

import {
  APP_BUSINESS_TYPE,
  APP_LANGUAGE,
  APP_SETUP_STEP,
} from "../constants/app-setup.constants.js";

/* -------------------------------------------------------------------------- */
/*                              Setup Status                                  */
/* -------------------------------------------------------------------------- */

export const setupStatusSchema = z.object({
  completed: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                              Language                                      */
/* -------------------------------------------------------------------------- */

export const languageSchema = z.object({
  language: z.enum(APP_LANGUAGE),
});

/* -------------------------------------------------------------------------- */
/*                           Business Information                             */
/* -------------------------------------------------------------------------- */

export const businessInfoSchema = z.object({
  businessName: z.string().trim().min(2).max(100),

  ownerName: z.string().trim().min(2).max(100),

  phone: z.string().trim().min(10).max(15),

  businessType: z.enum(APP_BUSINESS_TYPE),
});

/* -------------------------------------------------------------------------- */
/*                              Complete Setup                               */
/* -------------------------------------------------------------------------- */

export const appSetupSchema = z.object({
  language: z.enum(APP_LANGUAGE),

  businessName: z.string().trim().min(2).max(100),

  ownerName: z.string().trim().min(2).max(100),

  phone: z.string().trim().min(10).max(15),

  businessType: z.enum(APP_BUSINESS_TYPE),

  currentStep: z.enum(APP_SETUP_STEP).default("START"),
});

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type SetupStatusInput = z.infer<typeof setupStatusSchema>;

export type LanguageInput = z.infer<typeof languageSchema>;

export type BusinessInfoInput = z.infer<typeof businessInfoSchema>;

export type AppSetupInput = z.infer<typeof appSetupSchema>;
