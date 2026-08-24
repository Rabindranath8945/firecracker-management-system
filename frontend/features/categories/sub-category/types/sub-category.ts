export interface SubCategory {
  _id: string;

  subCategoryCode: string;

  name: string;

  description?: string;

  category:
    | {
        _id: string;
        name: string;
        categoryNo?: string;
      }
    | string
    | null;

  productCount?: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}
