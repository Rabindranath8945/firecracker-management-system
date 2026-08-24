import type { SyncChange, SyncResult } from "../types/sync.types.js";

class SyncService {
  async sync(ownerId: string, changes: SyncChange[] = []): Promise<SyncResult> {
    /*
     * ----------------------------------------------------------------------
     * V1 SYNC PIPELINE
     * ----------------------------------------------------------------------
     *
     * The endpoint is now authenticated and ready to receive offline
     * changes.
     *
     * We are NOT directly modifying MongoDB here yet.
     *
     * Product/Sale/Purchase/etc. synchronization must use the existing
     * module services so that:
     *
     * - stock validation remains intact
     * - customer balances remain correct
     * - supplier balances remain correct
     * - duplicate invoices are prevented
     * - audit information is preserved
     *
     * That implementation will be connected after the local offline queue
     * is connected to this API.
     */

    void ownerId;

    const conflicts: SyncResult["conflicts"] = [];

    /*
     * No changes means the device is already synchronized.
     */
    if (changes.length === 0) {
      return {
        success: true,
        syncedCount: 0,
        failedCount: 0,
        syncedAt: new Date().toISOString(),
        conflicts,
      };
    }

    /*
     * Do not silently pretend that changes were written to MongoDB.
     *
     * Until entity-specific synchronization is implemented, report them
     * as pending/conflicted rather than falsely marking them as synced.
     */

    for (const change of changes) {
      conflicts.push({
        id: change.id,
        entity: change.entity,
        reason: "Entity synchronization is not implemented yet.",
      });
    }

    return {
      success: false,
      syncedCount: 0,
      failedCount: changes.length,
      syncedAt: new Date().toISOString(),
      conflicts,
    };
  }
}

export default new SyncService();
