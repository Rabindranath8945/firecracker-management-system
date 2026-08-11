export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface ProductCategory {
  _id: string;
  categoryCode: string;
  name: string;
}

export interface ProductSubCategory {
  _id: string;
  subCategoryCode: string;
  name: string;
}

export interface Product {
  _id: string;

  productCode: string;

  name: string;

  barcode?: string;

  category?: ProductCategory;

  subCategory?: ProductSubCategory;

  purchasePrice: number;

  sellingPrice: number;

  stock: number;

  minimumStock: number;

  unit: string;

  brand: string;

  hsnCode: string;

  tax: number;

  description: string;

  image: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductListResponse {
  items: Product[];
  pagination: Pagination;
}
