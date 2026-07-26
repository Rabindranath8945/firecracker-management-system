import { Document, Types } from "mongoose";

import {
  APP_BUSINESS_TYPE,
  APP_LANGUAGE,
  APP_SETUP_STEP,
} from "../constants/app-setup.constants.js";

export interface IAppSetup extends Document {
  user: Types.ObjectId;

  businessId: string;

  language: (typeof APP_LANGUAGE)[number];

  businessType: (typeof APP_BUSINESS_TYPE)[number];

  currentStep: (typeof APP_SETUP_STEP)[number];

  completed: boolean;

  skipped: boolean;

  completedAt?: Date | null;

  appVersion: string;

  setupVersion: number;

  settingsConfigured: boolean;

  securityConfigured: boolean;

  deviceRegistered: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}
