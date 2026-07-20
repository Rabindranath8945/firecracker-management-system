export interface Category {
  id: string;

  categoryNo: string;

  name: string;

  description?: string;

  icon?: string;

  color?: string;

  productCount: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}
