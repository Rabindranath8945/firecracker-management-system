import PDFDocument from "pdfkit";

export type PdfOrientation = "portrait" | "landscape";
export type PdfDocument = InstanceType<typeof PDFDocument>;

/* -------------------------------------------------------------------------- */
/* BUSINESS CONTEXT                                                           */
/* -------------------------------------------------------------------------- */

export interface PdfBusinessContext {
  name: string;

  businessId: string;

  logo?: string;

  address: string;

  phone?: string;

  email?: string;

  website?: string;

  gstNo?: string;
}

/* -------------------------------------------------------------------------- */
/* HEADER                                                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* COMPANY                                                                    */
/* -------------------------------------------------------------------------- */

export interface PdfCompany extends PdfBusinessContext {}

/* -------------------------------------------------------------------------- */
/* CUSTOMER                                                                   */
/* -------------------------------------------------------------------------- */

export interface PdfCustomer {
  name: string;

  mobile?: string;

  email?: string;

  address?: string;

  gstNo?: string;
}

/* -------------------------------------------------------------------------- */
/* TABLE                                                                      */
/* -------------------------------------------------------------------------- */

export interface PdfTableColumn {
  title: string;

  key: string;

  width: number;

  align?: "left" | "center" | "right";
}

/* -------------------------------------------------------------------------- */
/* SUMMARY                                                                    */
/* -------------------------------------------------------------------------- */

export interface PdfSummaryItem {
  label: string;

  value: string | number;

  highlight?: boolean;
}

/* -------------------------------------------------------------------------- */
/* GENERIC PDF OPTIONS                                                        */
/* -------------------------------------------------------------------------- */

export interface PdfOptions {
  title: string;

  company: PdfBusinessContext;

  customer?: PdfCustomer;

  columns: PdfTableColumn[];

  rows: Record<string, unknown>[];

  summary: PdfSummaryItem[];

  orientation?: PdfOrientation;

  generatedBy?: string;

  dateRange?: string;

  notes?: string;
}
