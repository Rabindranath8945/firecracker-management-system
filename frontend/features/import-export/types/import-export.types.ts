/* -------------------------------------------------------------------------- */
/* IMPORT / EXPORT TYPES                                                      */
/* -------------------------------------------------------------------------- */

export type ImportEntity = "PRODUCT" | "SALE" | "PURCHASE";

export type ExportEntity = "PRODUCT" | "SALE" | "PURCHASE";

export type ImportFileType = "XLSX" | "CSV";

export interface ImportFile {
  file: File;
  name: string;
  size: number;
  type: ImportFileType;
}

export interface ImportRowError {
  row: number;
  field?: string;
  message: string;
}

export interface ImportPreview {
  entity: ImportEntity;
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: ImportRowError[];
}

export interface ImportResult {
  success: boolean;
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  errors: ImportRowError[];
}

export interface ExportOptions {
  entity: ExportEntity;
  format: "XLSX" | "CSV";
}
