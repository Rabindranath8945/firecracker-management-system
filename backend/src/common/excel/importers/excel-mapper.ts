export function mapExcelRows(
  rows: Record<string, unknown>[],
  mapping: Record<string, string>,
) {
  return rows.map((row) => {
    const item: Record<string, unknown> = {};

    Object.entries(mapping).forEach(([excelColumn, field]) => {
      item[field] = row[excelColumn];
    });

    return item;
  });
}
