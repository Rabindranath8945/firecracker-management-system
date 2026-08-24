import { createWorkbook } from "../utils/workbook.js";
import { createWorksheet } from "../utils/worksheet.js";

import { ExcelExportOptions } from "../types/excel.types.js";

export async function exportExcel<T>(
  options: ExcelExportOptions<T>,
): Promise<Buffer> {
  const workbook = await createWorkbook();

  const worksheet = createWorksheet(
    workbook,
    options.sheetName,
    options.columns,
    options.data,
  );

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.eachCell((cell, columnNumber) => {
      const column = options.columns[columnNumber - 1];

      switch (column.type) {
        case "currency":
          cell.numFmt = "₹#,##0.00";
          break;

        case "number":
          cell.numFmt = "#,##0";
          break;

        case "date":
          cell.numFmt = "dd-mmm-yyyy hh:mm";
          break;
      }

      if (rowNumber % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFF8F9FA",
          },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return Buffer.from(buffer);
}
