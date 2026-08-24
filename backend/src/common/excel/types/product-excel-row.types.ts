export interface ProductExcelRow {
  productCode: string;

  name: string;

  category: string;

  subCategory: string;

  barcode?: string;

  hsnCode?: string;

  brand?: string;

  unit: string;

  purchasePrice: number;

  sellingPrice: number;

  stock: number;

  minimumStock: number;

  tax: number;

  description?: string;

  image?: string;

  isActive: boolean;
}
