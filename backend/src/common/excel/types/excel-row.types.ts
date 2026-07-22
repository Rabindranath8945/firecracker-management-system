export interface ExcelRow {
  [key: string]: unknown;
}

export interface ProductExcelRow extends ExcelRow {
  productCode: string;
  name: string;

  category?: string;
  subCategory?: string;

  barcode?: string;
  unit: string;

  purchasePrice: number;
  sellingPrice: number;

  stock: number;
  minimumStock: number;

  tax: number;

  description?: string;

  isActive?: boolean;
}
