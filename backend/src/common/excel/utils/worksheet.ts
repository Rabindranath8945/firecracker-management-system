import ExcelJS from "exceljs";

import { ExcelColumn } from "../types/excel.types.js";

export function createWorksheet<T>(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  columns: ExcelColumn[],
  data: T[],
) {
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [
      {
        state: "frozen",
        ySplit: 1,
      },
    ],
  });

  worksheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width ?? 20,
  }));

  // Header Style
  const header = worksheet.getRow(1);

  header.height = 24;

  header.font = {
    bold: true,
    color: {
      argb: "FFFFFFFF",
    },
  };

  header.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  header.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FF1F4E78",
      },
    };

    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
  });

  worksheet.autoFilter = {
    from: "A1",
    to: `${String.fromCharCode(64 + columns.length)}1`,
  };

  data.forEach((item) => {
    worksheet.addRow(item as ExcelJS.RowValues);
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };

      cell.alignment = {
        vertical: "middle",
      };
    });
  });

  return worksheet;
}
