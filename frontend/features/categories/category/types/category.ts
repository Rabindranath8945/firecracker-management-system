export interface Category {
  id: string;
  categoryCode: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}
