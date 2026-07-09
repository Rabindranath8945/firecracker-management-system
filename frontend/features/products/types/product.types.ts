export interface Product {
  id: string;

  sku: string;

  barcode: string;

  name: string;

  category: string;

  purchasePrice: number;

  sellingPrice: number;

  stock: number;

  minimumStock: number;

  status: "ACTIVE" | "INACTIVE";

  image?: string;
}
