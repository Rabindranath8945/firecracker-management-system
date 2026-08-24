import { Schema, model } from "mongoose";

import { ISettings } from "../interfaces/settings.interface.js";

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

const businessSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    logo: String,

    businessType: String,

    gstNo: String,

    panNo: String,

    phone: {
      type: String,
      required: true,
    },

    email: String,

    website: String,

    address: String,

    city: String,

    state: String,

    pincode: String,
  },
  {
    _id: false,
  },
);

const usersSchema = new Schema(
  {
    businessId: {
      type: String,
      required: true,
      unique: true,
    },

    businessQr: String,

    allowJoinRequest: {
      type: Boolean,
      default: true,
    },

    defaultRole: {
      type: String,
      enum: SETTINGS_DEFAULT_ROLE,
      default: "STAFF",
    },

    maxDevices: {
      type: Number,
      default: 5,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

const paymentSchema = new Schema(
  {
    mode: {
      type: String,
      enum: SETTINGS_PAYMENT_MODE,
      default: "DYNAMIC_QR",
    },

    merchantName: {
      type: String,
      default: "",
      trim: true,
    },

    upiId: {
      type: String,
      default: "",
      trim: true,
    },

    staticQr: {
      type: String,
      default: "",
    },

    dynamicQr: {
      type: Boolean,
      default: true,
    },

    showQrOnInvoice: {
      type: Boolean,
      default: true,
    },

    showMerchantName: {
      type: Boolean,
      default: true,
    },

    showUpiId: {
      type: Boolean,
      default: true,
    },

    voiceAnnouncement: {
      type: Boolean,
      default: true,
    },

    announcementStyle: {
      type: String,
      enum: SETTINGS_ANNOUNCEMENT_STYLE,
      default: "AMOUNT_RECEIVED",
    },

    volume: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    qrExpirySeconds: {
      type: Number,
      default: 300,
      min: 60,
      max: 1800,
    },
  },
  {
    _id: false,
  },
);

const invoiceSchema = new Schema(
  {
    prefix: {
      type: String,
      default: "INV",
    },

    nextNumber: {
      type: Number,
      default: 1,
    },

    footer: {
      type: String,
      default: "",
    },

    terms: {
      type: String,
      default: "",
    },

    showLogo: {
      type: Boolean,
      default: true,
    },

    showGST: {
      type: Boolean,
      default: true,
    },

    showCustomerMobile: {
      type: Boolean,
      default: true,
    },

    showCustomerAddress: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const taxSchema = new Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },

    defaultGST: {
      type: Number,
      default: 18,
    },

    taxType: {
      type: String,
      enum: SETTINGS_TAX_TYPE,
      default: "EXCLUSIVE",
    },

    currency: {
      type: String,
      enum: SETTINGS_CURRENCY,
      default: "INR",
    },

    currencySymbol: {
      type: String,
      default: "₹",
    },
  },
  {
    _id: false,
  },
);

const numberingSchema = new Schema(
  {
    product: { type: String, default: "PRD" },

    customer: { type: String, default: "CUS" },

    supplier: { type: String, default: "SUP" },

    purchase: { type: String, default: "PUR" },

    sale: { type: String, default: "SAL" },

    expense: { type: String, default: "EXP" },
  },
  {
    _id: false,
  },
);

const dataManagementSchema = new Schema(
  {
    allowImport: {
      type: Boolean,
      default: true,
    },

    allowExport: {
      type: Boolean,
      default: true,
    },

    backupEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const notificationSchema = new Schema(
  {
    lowStock: { type: Boolean, default: true },

    outOfStock: { type: Boolean, default: true },

    saleSuccess: { type: Boolean, default: true },

    purchaseSuccess: { type: Boolean, default: true },

    expenseAdded: { type: Boolean, default: true },

    importCompleted: { type: Boolean, default: true },

    exportCompleted: { type: Boolean, default: true },

    sound: { type: Boolean, default: true },
  },
  {
    _id: false,
  },
);

const appearanceSchema = new Schema(
  {
    theme: {
      type: String,
      enum: SETTINGS_THEME,
      default: "LIGHT",
    },

    fontSize: {
      type: String,
      enum: SETTINGS_FONT_SIZE,
      default: "MEDIUM",
    },

    compactMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const systemSchema = new Schema(
  {
    language: {
      type: String,
      enum: SETTINGS_LANGUAGE,
      default: "ENGLISH",
    },

    financialYear: {
      type: String,
      default: "",
    },

    dateFormat: {
      type: String,
      enum: SETTINGS_DATE_FORMAT,
      default: "DD/MM/YYYY",
    },

    decimalPlaces: {
      type: Number,
      default: 2,
      min: 0,
      max: 4,
    },
  },
  {
    _id: false,
  },
);

const securitySchema = new Schema(
  {
    googleLogin: {
      type: Boolean,
      default: true,
    },

    trustedDevices: {
      type: Boolean,
      default: true,
    },

    allowMultipleDevices: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const aboutSchema = new Schema(
  {
    version: {
      type: String,
      default: "1.0.0",
    },

    developer: {
      type: String,
      default: "Mahendra Tech Solutions",
    },

    website: {
      type: String,
      default: "",
    },

    privacyPolicy: {
      type: String,
      default: "",
    },

    terms: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const settingsSchema = new Schema<ISettings>(
  {
    business: {
      type: businessSchema,
      required: true,
    },

    users: {
      type: usersSchema,
      required: true,
    },

    payment: {
      type: paymentSchema,
      required: true,
    },

    invoice: {
      type: invoiceSchema,
      required: true,
    },

    tax: {
      type: taxSchema,
      required: true,
    },

    numbering: {
      type: numberingSchema,
      required: true,
    },

    dataManagement: {
      type: dataManagementSchema,
      required: true,
    },

    notification: {
      type: notificationSchema,
      required: true,
    },

    appearance: {
      type: appearanceSchema,
      required: true,
    },

    system: {
      type: systemSchema,
      required: true,
    },

    security: {
      type: securitySchema,
      required: true,
    },

    about: {
      type: aboutSchema,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model<ISettings>("Settings", settingsSchema);
