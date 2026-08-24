export type SyncEntity =
  | "PRODUCT"
  | "CATEGORY"
  | "SUB_CATEGORY"
  | "CUSTOMER"
  | "SUPPLIER"
  | "SALE"
  | "PURCHASE"
  | "EXPENSE"
  | "PAYMENT"
  | "SETTING";

export type SyncAction = "CREATE" | "UPDATE" | "DELETE";

export type SyncStatus = "PENDING" | "SYNCING" | "FAILED";

export interface SyncQueueItem {
  id?: number;
  entity: SyncEntity;
  entityId?: string;
  action: SyncAction;
  payload: string;
  status: SyncStatus;
  createdAt: string;
  updatedAt: string;
}
