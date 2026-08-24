export type ImportExportEntity = "PRODUCT" | "SALE" | "PURCHASE";

export interface ImportRowError {
  row: number;
  field?: string;
  message: string;
}

export interface ImportResult {
  entity: ImportExportEntity;

  total: number;

  imported: number;

  skipped: number;

  failed: number;

  errors: ImportRowError[];
}
