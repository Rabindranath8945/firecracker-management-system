import { exportExcel } from "../exporters/excel-exporter.js";
import { importExcel } from "../importers/excel-importer.js";
import { mapExcelRows } from "../importers/excel-mapper.js";
import { transformExcelRows } from "../importers/excel-transformer.js";
import { validateProductRows } from "../importers/excel-validator.js";
import { ProductExcelRow } from "../types/excel-row.types.js";
import { ExcelExportOptions } from "../types/excel.types.js";

class ExcelService {
  export<T>(options: ExcelExportOptions<T>) {
    return exportExcel(options);
  }

  async import(file: Express.Multer.File, mapping: Record<string, string>) {
    // Read Excel
    const rows = await importExcel(file.buffer);

    // Map Excel columns -> DTO fields
    const mappedRows = mapExcelRows(rows, mapping);

    // Convert string values to proper types
    const transformedRows = transformExcelRows(mappedRows) as ProductExcelRow[];

    // Validate rows
    const errors = validateProductRows(transformedRows);

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
