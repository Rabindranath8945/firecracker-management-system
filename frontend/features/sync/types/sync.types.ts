export type SyncStatus = "IDLE" | "SYNCING" | "SYNCED" | "OFFLINE" | "ERROR";

export interface SyncState {
  status: SyncStatus;
  pendingChanges: number;
  lastSyncedAt: string | null;
  lastError: string | null;
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  syncedAt: string;
}
