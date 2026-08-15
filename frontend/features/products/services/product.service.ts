import api from "@/lib/api";

import type { Product } from "../types/product.types";
import type { ProductFormData } from "../schemas/product.schema";

interface GetProductsParams {
  search?: string;

  category?: string;

  subCategory?: string;

  stockFilter?: string;

  sortBy?: string;

  page?: number;

  limit?: number;
}

class ProductService {
  async getProducts(params: GetProductsParams = {}) {
    const response = await api.get("/products", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,

        search:
          params.search && params.search !== "" ? params.search : undefined,

        category:
          params.category && params.category !== "ALL"
            ? params.category
            : undefined,

        subCategory:
          params.subCategory && params.subCategory !== "ALL"
            ? params.subCategory
            : undefined,

        stock:
          params.stockFilter && params.stockFilter !== "All"
            ? params.stockFilter
            : undefined,

        sort:
          params.sortBy && params.sortBy !== "A-Z" ? params.sortBy : undefined,
      },
    });

    return response.data.data;
  }

  async getProduct(id: string) {
    const response = await api.get(`/products/${id}`);

    return response.data.data;
  }

  async getNextProductCode() {
    const response = await api.get("/products/next-code");

    return response.data.data.productCode;
  }

  async createProduct(data: ProductFormData): Promise<Product> {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: Product;
    }>("/products", data);

    return response.data.data;
  }

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    const response = await api.put<{
      success: boolean;
      message: string;
      data: Product;
    }>(`/products/${id}`, data);

    return response.data.data;
  }

  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);

    return response.data.data;
  }

  async exportProducts() {
    const response = await api.get("/products/export", {
      responseType: "blob",
    });

    return response.data;
  }
}

export default new ProductService();
