import ExcelJS from "exceljs";

export async function createWorkbook() {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "OneHub ERP";
  workbook.lastModifiedBy = "OneHub ERP";
  workbook.company = "OneHub ERP";
  workbook.subject = "Business Report";
  workbook.title = "ERP Export";
  workbook.created = new Date();
  workbook.modified = new Date();

  return workbook;
}
