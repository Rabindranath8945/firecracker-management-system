import PDFDocument from "pdfkit";

/**
 * PDFKit document instance type.
 */
export type PdfDocument = InstanceType<typeof PDFDocument>;

export interface PdfHeaderOptions {
  businessName: string;

  reportTitle: string;

  generatedBy: string;

  dateRange?: string;
}

export interface PdfReportOptions {
  businessName: string;

  reportTitle: string;

  generatedBy: string;

  dateRange?: string;
}

export interface PdfCompany {
  name: string;

  logo?: string;

  address: string;

  phone: string;

  email?: string;

  website?: string;

  gstNo?: string;
}

export interface PdfCustomer {
  name: string;

  mobile?: string;

  email?: string;

  address?: string;

  gstNo?: string;
}

/**
 * Universal table column
 */
export interface PdfTableColumn {
  title: string;

  key: string;

  width: number;

  align?: "left" | "center" | "right";
}

/**
 * Universal summary item
 */
export interface PdfSummaryItem {
  label: string;

  value: string | number;
}

/**
 * Generic PDF options
 */
export interface PdfOptions {
  title: string;

  company: PdfCompany;

  customer?: PdfCustomer;

  columns: PdfTableColumn[];

  rows: Record<string, unknown>[];

  summary: PdfSummaryItem[];

  notes?: string;
}
