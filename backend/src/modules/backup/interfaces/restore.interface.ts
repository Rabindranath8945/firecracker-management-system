import { RestoreMode, RestoreStatus } from "../constants/restore.constants.js";

export interface RestoreRequest {
  mode: RestoreMode;

  backupId: string;
}

export interface RestoreResult {
  status: RestoreStatus;

  message: string;

  summary: {
    products: number;

    categories: number;

    subCategories: number;

    customers: number;

    suppliers: number;

    purchases: number;

    sales: number;

    expenses: number;
  };
}
