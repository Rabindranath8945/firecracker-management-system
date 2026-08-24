import { getDatabase } from "../api/database";

import type {
  SyncAction,
  SyncEntity,
  SyncQueueItem,
} from "../types/database.types";

/* -------------------------------------------------------------------------- */
/* ADD TO QUEUE                                                               */
/* -------------------------------------------------------------------------- */

export async function addToSyncQueue(
  entity: SyncEntity,
  action: SyncAction,
  payload: unknown,
  entityId?: string,
): Promise<void> {
  const db = await getDatabase();

  const now = new Date().toISOString();

  await db.run(
    `
      INSERT INTO sync_queue (
        entity,
        entity_id,
        action,
        payload,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, 'PENDING', ?, ?)
    `,
    [entity, entityId ?? null, action, JSON.stringify(payload), now, now],
  );
}

/* -------------------------------------------------------------------------- */
/* GET PENDING ITEMS                                                          */
/* -------------------------------------------------------------------------- */

export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  const db = await getDatabase();

  const result = await db.query(`
    SELECT
      id,
      entity,
      entity_id,
      action,
      payload,
      status,
      created_at,
      updated_at
    FROM sync_queue
    WHERE status = 'PENDING'
    ORDER BY id ASC
  `);

  return (result.values ?? []).map((row) => {
    const item: SyncQueueItem = {
      id: Number(row.id),
      entity: row.entity as SyncEntity,
      action: row.action as SyncAction,
      payload: String(row.payload),
      status: row.status as SyncQueueItem["status"],
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };

    if (row.entity_id !== null && row.entity_id !== undefined) {
      item.entityId = String(row.entity_id);
    }

    return item;
  });
}

/* -------------------------------------------------------------------------- */
/* MARK SYNCING                                                               */
/* -------------------------------------------------------------------------- */

export async function markSyncing(id: number): Promise<void> {
  const db = await getDatabase();

  await db.run(
    `
      UPDATE sync_queue
      SET
        status = 'SYNCING',
        updated_at = ?
      WHERE id = ?
    `,
    [new Date().toISOString(), id],
  );
}

/* -------------------------------------------------------------------------- */
/* MARK FAILED                                                                */
/* -------------------------------------------------------------------------- */

export async function markSyncFailed(id: number): Promise<void> {
  const db = await getDatabase();

  await db.run(
    `
      UPDATE sync_queue
      SET
        status = 'FAILED',
        updated_at = ?
      WHERE id = ?
    `,
    [new Date().toISOString(), id],
  );
}

/* -------------------------------------------------------------------------- */
/* REMOVE SYNCED ITEM                                                         */
/* -------------------------------------------------------------------------- */

export async function removeFromSyncQueue(id: number): Promise<void> {
  const db = await getDatabase();

  await db.run(
    `
      DELETE FROM sync_queue
      WHERE id = ?
    `,
    [id],
  );
}

/* -------------------------------------------------------------------------- */
/* RETRY FAILED ITEMS                                                         */
/* -------------------------------------------------------------------------- */

export async function retryFailedSyncItems(): Promise<void> {
  const db = await getDatabase();

  await db.run(`
    UPDATE sync_queue
    SET
      status = 'PENDING',
      updated_at = '${new Date().toISOString()}'
    WHERE status = 'FAILED'
  `);
}

/* -------------------------------------------------------------------------- */
/* COUNT PENDING                                                              */
/* -------------------------------------------------------------------------- */

export async function getPendingSyncCount(): Promise<number> {
  const db = await getDatabase();

  const result = await db.query(`
    SELECT COUNT(*) AS count
    FROM sync_queue
    WHERE status IN ('PENDING', 'FAILED')
  `);

  return Number(result.values?.[0]?.count ?? 0);
}

/* -------------------------------------------------------------------------- */
/* FIND PENDING ITEM                                                          */
/* -------------------------------------------------------------------------- */

export async function getPendingSyncItem(
  entity: string,
  entityId: string,
): Promise<SyncQueueItem | null> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT *
      FROM sync_queue
      WHERE entity = ?
        AND entity_id = ?
        AND status IN ('PENDING', 'FAILED')
      ORDER BY created_at ASC
      LIMIT 1
    `,
    [entity, entityId],
  );

  const row = result.values?.[0];

  if (!row) {
    return null;
  }

  const storedEntityId = row.entity_id ? String(row.entity_id) : null;

  return {
    id: Number(row.id),

    entity: String(row.entity) as SyncEntity,

    ...(storedEntityId !== null
      ? {
          entityId: storedEntityId,
        }
      : {}),

    action: String(row.action) as SyncQueueItem["action"],

    payload: String(row.payload),

    status: String(row.status) as SyncQueueItem["status"],

    createdAt: String(row.created_at),

    updatedAt: String(row.updated_at),
  };
}

/* -------------------------------------------------------------------------- */
/* UPDATE PENDING CREATE                                                      */
/* -------------------------------------------------------------------------- */

export async function updatePendingCreatePayload(
  entity: string,
  entityId: string,
  payload: unknown,
): Promise<boolean> {
  const db = await getDatabase();

  const existing = await getPendingSyncItem(entity, entityId);

  if (!existing || existing.action !== "CREATE") {
    return false;
  }

  await db.run(
    `
      UPDATE sync_queue
      SET
        payload = ?,
        status = 'PENDING',
        updated_at = ?
      WHERE id = ?
    `,
    [JSON.stringify(payload), new Date().toISOString(), existing.id],
  );

  return true;
}

/* -------------------------------------------------------------------------- */
/* CANCEL PENDING CREATE                                                      */
/* -------------------------------------------------------------------------- */

export async function cancelPendingCreate(
  entity: string,
  entityId: string,
): Promise<boolean> {
  const db = await getDatabase();

  const existing = await getPendingSyncItem(entity, entityId);

  if (!existing || existing.action !== "CREATE") {
    return false;
  }

  await db.run(
    `
      DELETE FROM sync_queue
      WHERE id = ?
    `,
    [existing.id],
  );

  return true;
}
