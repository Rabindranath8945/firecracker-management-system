export interface SubCategory {
  id: string;

  subCategoryNo: string;

  categoryId: string;

  categoryName: string;

  name: string;

  description?: string;

  icon?: string;

  color?: string;

  productCount: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}
