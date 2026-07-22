export interface ExcelColumn {
  /**
   * Excel column header
   * Example: Product Code
   */
  header: string;

  /**
   * Object property
   * Example: productCode
   */
  key: string;

  /**
   * Column width
   */
  width?: number;

  type?: "string" | "number" | "currency" | "date";
}

export interface ExcelExportOptions<T> {
  fileName: string;

  sheetName: string;

  columns: ExcelColumn[];

  data: T[];

  author?: string;

  company?: string;
}

export interface ExcelImportResult<T> {
  success: boolean;

  rows: T[];

  totalRows: number;
}

export interface ExcelValidationError {
  row: number;

  field: string;

  message: string;
}

export interface ExcelImportSummary {
  total: number;

  imported: number;

  skipped: number;

  errors: ExcelValidationError[];
}
