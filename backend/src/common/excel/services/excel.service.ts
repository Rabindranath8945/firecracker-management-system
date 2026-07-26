import { exportExcel } from "../exporters/excel-exporter.js";
import { importExcel } from "../importers/excel-importer.js";
import { mapExcelRows } from "../importers/excel-mapper.js";
import { ExcelExportOptions } from "../types/excel.types.js";

export interface ExcelValidationError {
  row: number;
  field: string;
  message: string;
}

class ExcelService {
  export<T>(options: ExcelExportOptions<T>) {
    return exportExcel(options);
  }

  async import<T>(
    file: Express.Multer.File,
    mapping: Record<string, string>,
    transformer?: (rows: Record<string, unknown>[]) => T[],
    validator?: (rows: T[]) => ExcelValidationError[],
  ) {
    const rows = await importExcel(file.buffer);

    const mappedRows = mapExcelRows(rows, mapping);

    const transformedRows = transformer
      ? transformer(mappedRows)
      : (mappedRows as T[]);

    const errors = validator ? validator(transformedRows) : [];

    return {
      success: errors.length === 0,

      rows: transformedRows,

      errors,

      summary: {
        total: transformedRows.length,
        valid: transformedRows.length - errors.length,
        invalid: errors.length,
      },
    };
  }
}

export default new ExcelService();
