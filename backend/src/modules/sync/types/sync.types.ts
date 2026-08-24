export interface SyncRequest {
  changes?: SyncChange[];
}

export interface SyncChange {
  id: string;
  entity: SyncEntity;
  operation: SyncOperation;
  data: Record<string, unknown>;
  createdAt: string;
}

export type SyncEntity =
  | "PRODUCT"
  | "CATEGORY"
  | "CUSTOMER"
  | "SUPPLIER"
  | "PURCHASE"
  | "SALE"
  | "EXPENSE"
  | "STOCK"
  | "PAYMENT";

export type SyncOperation = "CREATE" | "UPDATE" | "DELETE";

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  syncedAt: string;
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  id: string;
  entity: SyncEntity;
  reason: string;
}
