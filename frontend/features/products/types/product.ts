export interface Product {
  _id: string;

  sku: string;
  barcode?: string;

  name: string;
  category: string;
  subCategory: string;

  purchasePrice: number;
  sellingPrice: number;
  mrp: number;

  stock: number;
  minimumStock: number;

  unit: string;

  brand?: string;
  hsn?: string;

  gst: number;

  image?: string;

  active: boolean;
}
