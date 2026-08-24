import { Document, Types } from "mongoose";

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

export interface IBusinessSettings {
  name: string;

  ownerName: string;

  logo?: string;

  businessType?: string;

  gstNo?: string;

  panNo?: string;

  phone: string;

  email?: string;

  website?: string;

  address?: string;

  city?: string;

  state?: string;

  pincode?: string;
}

export interface IUserSettings {
  businessId: string;

  businessQr?: string;

  allowJoinRequest: boolean;

  defaultRole: (typeof SETTINGS_DEFAULT_ROLE)[number];

  maxDevices: number;
}

export interface IPaymentSettings {
  mode: (typeof SETTINGS_PAYMENT_MODE)[number];

  merchantName: string;

  upiId: string;

  staticQr: string;

  dynamicQr: boolean;

  showQrOnInvoice: boolean;

  qrExpirySeconds: number;

  showMerchantName: boolean;

  showUpiId: boolean;

  voiceAnnouncement: boolean;

  announcementStyle: (typeof SETTINGS_ANNOUNCEMENT_STYLE)[number];

  volume: number;
}

export interface IInvoiceSettings {
  prefix: string;

  nextNumber: number;

  footer?: string;

  terms?: string;

  showLogo: boolean;

  showGST: boolean;

  showCustomerMobile: boolean;

  showCustomerAddress: boolean;
}

export interface ITaxSettings {
  enabled: boolean;

  defaultGST: number;

  taxType: (typeof SETTINGS_TAX_TYPE)[number];

  currency: (typeof SETTINGS_CURRENCY)[number];

  currencySymbol: string;
}

export interface INumberSeriesSettings {
  product: string;

  customer: string;

  supplier: string;

  purchase: string;

  sale: string;

  expense: string;
}

export interface IDataManagementSettings {
  allowImport: boolean;

  allowExport: boolean;

  backupEnabled: boolean;
}

export interface INotificationSettings {
  lowStock: boolean;

  outOfStock: boolean;

  saleSuccess: boolean;

  purchaseSuccess: boolean;

  expenseAdded: boolean;

  importCompleted: boolean;

  exportCompleted: boolean;

  sound: boolean;
}

export interface IAppearanceSettings {
  theme: (typeof SETTINGS_THEME)[number];

  fontSize: (typeof SETTINGS_FONT_SIZE)[number];

  compactMode: boolean;
}

export interface ISystemSettings {
  language: (typeof SETTINGS_LANGUAGE)[number];

  financialYear: string;

  dateFormat: (typeof SETTINGS_DATE_FORMAT)[number];

  decimalPlaces: number;
}

export interface ISecuritySettings {
  googleLogin: boolean;

  trustedDevices: boolean;

  allowMultipleDevices: boolean;
}

export interface IAboutSettings {
  version: string;

  developer: string;

  website?: string;

  privacyPolicy?: string;

  terms?: string;
}

export interface ISettings extends Document {
  business: IBusinessSettings;

  users: IUserSettings;

  payment: IPaymentSettings;

  invoice: IInvoiceSettings;

  tax: ITaxSettings;

  numbering: INumberSeriesSettings;

  dataManagement: IDataManagementSettings;

  notification: INotificationSettings;

  appearance: IAppearanceSettings;

  system: ISystemSettings;

  security: ISecuritySettings;

  about: IAboutSettings;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
