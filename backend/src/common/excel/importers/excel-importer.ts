import ExcelJS from "exceljs";

export async function importExcel(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook();

  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;

  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error("Worksheet not found.");
  }

  const headers: string[] = [];

  worksheet.getRow(1).eachCell((cell) => {
    headers.push(String(cell.text).trim());
  });

  const rows: Record<string, unknown>[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const item: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      item[header] = row.getCell(index + 1).text.trim();
    });

    const hasData = Object.values(item).some(
      (value) => String(value).trim() !== "",
    );

    if (hasData) {
      rows.push(item);
    }
  });

  return rows;
}
