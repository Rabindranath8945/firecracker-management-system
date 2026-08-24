import api from "@/lib/api";

export interface ProductPayload {
  productCode: string;

  name: string;

  category?: string;

  subCategory?: string;

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

export const productApi = {
  create(data: ProductPayload) {
    return api.post("/products", data);
  },

  update(id: string, data: ProductPayload) {
    return api.put(`/products/${id}`, data);
  },

  getAll() {
    return api.get("/products");
  },

  getById(id: string) {
    return api.get(`/products/${id}`);
  },

  remove(id: string) {
    return api.delete(`/products/${id}`);
  },
};
