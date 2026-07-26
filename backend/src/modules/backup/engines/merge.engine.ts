export interface MergeResult<T> {
  inserted: T[];
  updated: T[];
  skipped: T[];
}

export interface MergeOptions<T> {
  backup: T[];
  database: T[];
  getKey: (item: T) => string;
  merge?: (existing: T, incoming: T) => T;
}

class MergeEngine {
  merge<T>({
    backup,
    database,
    getKey,
    merge,
  }: MergeOptions<T>): MergeResult<T> {
    const existingMap = new Map<string, T>();

    for (const item of database) {
      existingMap.set(getKey(item), item);
    }

    const result: MergeResult<T> = {
      inserted: [],
      updated: [],
      skipped: [],
    };

    for (const incoming of backup) {
      const key = getKey(incoming);

      const existing = existingMap.get(key);

      if (!existing) {
        result.inserted.push(incoming);
        existingMap.set(key, incoming);
        continue;
      }

      if (merge) {
        result.updated.push(merge(existing, incoming));
      } else {
        result.skipped.push(existing);
      }
    }

    return result;
  }
}

export default new MergeEngine();
