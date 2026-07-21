import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                 Base Types                                 */
/* -------------------------------------------------------------------------- */

export type SettingCategory =
  | "business"
  | "invoice"
  | "tax"
  | "numberSeries"
  | "security"
  | "backup"
  | "preferences"
  | "notifications"
  | "about";

export type SettingCardColor =
  | "blue"
  | "emerald"
  | "orange"
  | "purple"
  | "cyan"
  | "amber"
  | "rose"
  | "slate";

/* -------------------------------------------------------------------------- */
/*                              Settings Card                                 */
/* -------------------------------------------------------------------------- */

export interface SettingCard {
  id: SettingCategory;

  title: string;

  description: string;

  href: string;

  icon: LucideIcon;

  color: SettingCardColor;
}

/* -------------------------------------------------------------------------- */
/*                           Business Profile                                 */
/* -------------------------------------------------------------------------- */

export interface BusinessProfile {
  businessName: string;

  ownerName: string;

  mobile: string;

  email: string;

  gstNumber: string;

  address: string;

  logo?: string;
}

/* -------------------------------------------------------------------------- */
/*                           Invoice Settings                                 */
/* -------------------------------------------------------------------------- */

export interface InvoiceSettings {
  invoicePrefix: string;

  purchasePrefix: string;

  salesPrefix: string;

  invoiceStartNumber: number;

  showLogo: boolean;

  showSignature: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               Tax Settings                                 */
/* -------------------------------------------------------------------------- */

export interface TaxSettings {
  gstEnabled: boolean;

  defaultGstRate: number;

  currency: string;
}

/* -------------------------------------------------------------------------- */
/*                              Number Series                                 */
/* -------------------------------------------------------------------------- */

export interface NumberSeries {
  sales: string;

  purchase: string;

  customer: string;

  supplier: string;

  expense: string;

  product: string;
}

/* -------------------------------------------------------------------------- */
/*                             App Preferences                                */
/* -------------------------------------------------------------------------- */

export interface AppPreferences {
  language: string;

  theme: "light" | "dark" | "system";

  compactMode: boolean;

  enableAnimations: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              Notifications                                 */
/* -------------------------------------------------------------------------- */

export interface NotificationSettings {
  lowStock: boolean;

  paymentReminder: boolean;

  backupReminder: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 About                                      */
/* -------------------------------------------------------------------------- */

export interface AboutInfo {
  appName: string;

  version: string;

  company: string;

  website: string;
}
