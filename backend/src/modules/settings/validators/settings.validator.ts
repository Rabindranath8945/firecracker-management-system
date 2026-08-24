import { z } from "zod";

import {
  SETTINGS_ANNOUNCEMENT_STYLE,
  SETTINGS_CURRENCY,
  SETTINGS_DATE_FORMAT,
  SETTINGS_DEFAULT_ROLE,
  SETTINGS_FONT_SIZE,
  SETTINGS_LANGUAGE,
  SETTINGS_PAYMENT_MODE,
  SETTINGS_TAX_TYPE,
  SETTINGS_THEME,
} from "../constants/settings.constants.js";

/* -------------------------------------------------------------------------- */
/*                                  Business                                  */
/* -------------------------------------------------------------------------- */

export const businessSchema = z.object({
  name: z.string().trim().min(2).max(100),

  ownerName: z.string().trim().min(2).max(100),

  phone: z.string().trim().min(10).max(15),

  logo: z.string(),

  businessType: z.string(),

  gstNo: z.string(),

  panNo: z.string(),

  website: z.string(),

  email: z.string().email().or(z.literal("")),

  address: z.string(),

  city: z.string(),

  state: z.string(),

  pincode: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                                    Users                                   */
/* -------------------------------------------------------------------------- */

export const usersSchema = z.object({
  businessId: z.string(),

  businessQr: z.string(),

  allowJoinRequest: z.boolean(),

  defaultRole: z.enum(SETTINGS_DEFAULT_ROLE),

  maxDevices: z.number().min(1).max(20),
});

/* -------------------------------------------------------------------------- */
/*                                  Payment                                   */
/* -------------------------------------------------------------------------- */

export const paymentSchema = z.object({
  mode: z.enum(SETTINGS_PAYMENT_MODE),

  merchantName: z.string(),

  upiId: z.string(),

  staticQr: z.string(),

  dynamicQr: z.boolean(),

  showQrOnInvoice: z.boolean(),

  qrExpirySeconds: z.number().min(60).max(1800).default(300),

  showMerchantName: z.boolean(),

  showUpiId: z.boolean(),

  voiceAnnouncement: z.boolean(),

  announcementStyle: z.enum(SETTINGS_ANNOUNCEMENT_STYLE),

  volume: z.number().min(0).max(100),
});

/* -------------------------------------------------------------------------- */
/*                                  Invoice                                   */
/* -------------------------------------------------------------------------- */

export const invoiceSchema = z.object({
  prefix: z.string(),

  nextNumber: z.number().min(1),

  footer: z.string(),

  terms: z.string(),

  showLogo: z.boolean(),

  showGST: z.boolean(),

  showCustomerMobile: z.boolean(),

  showCustomerAddress: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                                    Tax                                     */
/* -------------------------------------------------------------------------- */

export const taxSchema = z.object({
  enabled: z.boolean(),

  defaultGST: z.number().min(0).max(100),

  taxType: z.enum(SETTINGS_TAX_TYPE),

  currency: z.enum(SETTINGS_CURRENCY),

  currencySymbol: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                               Number Series                                */
/* -------------------------------------------------------------------------- */

export const numberingSchema = z.object({
  product: z.string(),

  customer: z.string(),

  supplier: z.string(),

  purchase: z.string(),

  sale: z.string(),

  expense: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                             Data Management                                */
/* -------------------------------------------------------------------------- */

export const dataManagementSchema = z.object({
  allowImport: z.boolean(),

  allowExport: z.boolean(),

  backupEnabled: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                               Notification                                 */
/* -------------------------------------------------------------------------- */

export const notificationSchema = z.object({
  lowStock: z.boolean(),

  outOfStock: z.boolean(),

  saleSuccess: z.boolean(),

  purchaseSuccess: z.boolean(),

  expenseAdded: z.boolean(),

  importCompleted: z.boolean(),

  exportCompleted: z.boolean(),

  sound: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                                Appearance                                  */
/* -------------------------------------------------------------------------- */

export const appearanceSchema = z.object({
  theme: z.enum(SETTINGS_THEME),

  fontSize: z.enum(SETTINGS_FONT_SIZE),

  compactMode: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                                   System                                   */
/* -------------------------------------------------------------------------- */

export const systemSchema = z.object({
  language: z.enum(SETTINGS_LANGUAGE),

  financialYear: z.string(),

  dateFormat: z.enum(SETTINGS_DATE_FORMAT),

  decimalPlaces: z.number().min(0).max(4),
});

/* -------------------------------------------------------------------------- */
/*                                  Security                                  */
/* -------------------------------------------------------------------------- */

export const securitySchema = z.object({
  googleLogin: z.boolean(),

  trustedDevices: z.boolean(),

  allowMultipleDevices: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                                    About                                   */
/* -------------------------------------------------------------------------- */

export const aboutSchema = z.object({
  version: z.string(),

  developer: z.string(),

  website: z.string(),

  privacyPolicy: z.string(),

  terms: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                                  Settings                                  */
/* -------------------------------------------------------------------------- */

export const settingsSchema = z.object({
  business: businessSchema,

  users: usersSchema,

  payment: paymentSchema,

  invoice: invoiceSchema,

  tax: taxSchema,

  numbering: numberingSchema,

  dataManagement: dataManagementSchema,

  notification: notificationSchema,

  appearance: appearanceSchema,

  system: systemSchema,

  security: securitySchema,

  about: aboutSchema,
});

export type BusinessInput = z.infer<typeof businessSchema>;

export type UsersInput = z.infer<typeof usersSchema>;

export type PaymentInput = z.infer<typeof paymentSchema>;

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export type TaxInput = z.infer<typeof taxSchema>;

export type NumberingInput = z.infer<typeof numberingSchema>;

export type DataManagementInput = z.infer<typeof dataManagementSchema>;

export type NotificationInput = z.infer<typeof notificationSchema>;

export type AppearanceInput = z.infer<typeof appearanceSchema>;

export type SystemInput = z.infer<typeof systemSchema>;

export type SecurityInput = z.infer<typeof securitySchema>;

export type AboutInput = z.infer<typeof aboutSchema>;

export type SettingsInput = z.infer<typeof settingsSchema>;
