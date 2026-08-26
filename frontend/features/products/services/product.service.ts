import api from "@/lib/api";

import type { Product } from "../types/product.types";
import type { ProductFormData } from "../schemas/product.schema";

import {
  deleteProduct as deleteOfflineProduct,
  getProductById as getOfflineProductById,
  getProducts as getOfflineProducts,
  saveProducts,
} from "@/libs/offline/store/offline.storage";

import { addToSyncQueue } from "@/libs/offline/sync/sync.queue";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface GetProductsParams {
  search?: string;
  category?: string;
  subCategory?: string;
  stockFilter?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

/* -------------------------------------------------------------------------- */
/* ONLINE STATUS                                                              */
/* -------------------------------------------------------------------------- */

function isOnline(): boolean {
  if (typeof navigator === "undefined") {
    return true;
  }

  return navigator.onLine;
}

/* -------------------------------------------------------------------------- */
/* OFFLINE FILTER                                                             */
/* -------------------------------------------------------------------------- */

function filterProducts(
  products: Product[],
  params: GetProductsParams,
): Product[] {
  let result = [...products];

  /* Search */

  if (params.search?.trim()) {
    const search = params.search.trim().toLowerCase();

    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.productCode.toLowerCase().includes(search) ||
        product.barcode?.toLowerCase().includes(search),
    );
  }

  /* Category */

  if (params.category && params.category !== "ALL") {
    result = result.filter(
      (product) => product.category?._id === params.category,
    );
  }

  /* Sub Category */

  if (params.subCategory && params.subCategory !== "ALL") {
    result = result.filter(
      (product) => product.subCategory?._id === params.subCategory,
    );
  }

  /* Stock */

  switch (params.stockFilter) {
    case "Low Stock":
      result = result.filter(
        (product) => product.stock <= product.minimumStock,
      );
      break;

    case "Out of Stock":
      result = result.filter((product) => product.stock <= 0);
      break;

    case "In Stock":
      result = result.filter((product) => product.stock > 0);
      break;
  }

  /* Sort */

  switch (params.sortBy) {
    case "Z-A":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "Newest":
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;

    case "Oldest":
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      break;

    default:
      result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

class ProductService {
  /* ------------------------------------------------------------------------ */
  /* GET PRODUCTS                                                             */
  /* ------------------------------------------------------------------------ */

  async getProducts(params: GetProductsParams = {}) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    if (!isOnline()) {
      const products = await getOfflineProducts();

      const filtered = filterProducts(products, params);

      const total = filtered.length;

      return {
        items: filtered.slice((page - 1) * limit, page * limit),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
      };
    }

    try {
      const response = await api.get("/products", {
        params: {
          page,
          limit,

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
            params.sortBy && params.sortBy !== "A-Z"
              ? params.sortBy
              : undefined,
        },
      });

      const result = response.data.data;

      if (result.items) {
        await saveProducts(result.items);
      }

      return result;
    } catch (error) {
      console.warn("Product API unavailable. Using offline data.", error);

      const products = await getOfflineProducts();

      const filtered = filterProducts(products, params);

      const total = filtered.length;

      return {
        items: filtered.slice((page - 1) * limit, page * limit),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
      };
    }
  }

  /* ------------------------------------------------------------------------ */
  /* GET PRODUCT                                                              */
  /* ------------------------------------------------------------------------ */

  async getProduct(id: string): Promise<Product> {
    if (!id) {
      throw new Error("Invalid product ID.");
    }

    if (!isOnline()) {
      const product = await getOfflineProductById(id);

      if (!product) {
        throw new Error("Product not found offline.");
      }

      return product;
    }

    try {
      const response = await api.get<ProductResponse>(
        `/products/view?id=${id}`,
      );

      const product = response.data.data;

      await saveProducts([product]);

      return product;
    } catch (error) {
      const product = await getOfflineProductById(id);

      if (!product) {
        throw error;
      }

      return product;
    }
  }

  /* ------------------------------------------------------------------------ */
  /* NEXT PRODUCT CODE                                                        */
  /* ------------------------------------------------------------------------ */

  async getNextProductCode() {
    if (!isOnline()) {
      return `OFFLINE-${Date.now()}`;
    }

    const response = await api.get("/products/next-code");

    return response.data.data.productCode;
  }

  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async createProduct(data: ProductFormData): Promise<Product> {
    if (!isOnline()) {
      const now = new Date().toISOString();

      const localId = crypto.randomUUID();

      const product: Product = {
        _id: localId,

        productCode: data.productCode || `OFFLINE-${Date.now()}`,

        name: data.name,

        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,

        stock: data.stock ?? 0,
        minimumStock: data.minimumStock ?? 0,

        unit: data.unit ?? "",
        brand: data.brand ?? "",
        hsnCode: data.hsnCode ?? "",
        tax: data.tax ?? 0,

        description: data.description ?? "",
        image: data.image ?? "",

        isActive: data.isActive ?? true,

        createdAt: now,
        updatedAt: now,

        ...(data.barcode
          ? {
              barcode: data.barcode,
            }
          : {}),

        ...(data.category
          ? {
              category: {
                _id: data.category,
                name: "",
              },
            }
          : {}),

        ...(data.subCategory
          ? {
              subCategory: {
                _id: data.subCategory,
                name: "",
              },
            }
          : {}),
      };

      await saveProducts([product]);

      await addToSyncQueue("PRODUCT", "CREATE", data, localId);

      return product;
    }

    const response = await api.post<ProductResponse>("/products", data);

    const product = response.data.data;

    await saveProducts([product]);

    return product;
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    if (!id) {
      throw new Error("Invalid product ID.");
    }

    if (!isOnline()) {
      const existing = await getOfflineProductById(id);

      if (!existing) {
        throw new Error("Product not found offline.");
      }

      const updated: Product = {
        ...existing,

        ...(data.productCode !== undefined
          ? { productCode: data.productCode }
          : {}),

        ...(data.name !== undefined ? { name: data.name } : {}),

        ...(data.barcode !== undefined ? { barcode: data.barcode } : {}),

        ...(data.purchasePrice !== undefined
          ? { purchasePrice: data.purchasePrice }
          : {}),

        ...(data.sellingPrice !== undefined
          ? { sellingPrice: data.sellingPrice }
          : {}),

        ...(data.stock !== undefined ? { stock: data.stock } : {}),

        ...(data.minimumStock !== undefined
          ? { minimumStock: data.minimumStock }
          : {}),

        ...(data.unit !== undefined ? { unit: data.unit } : {}),

        ...(data.brand !== undefined ? { brand: data.brand } : {}),

        ...(data.hsnCode !== undefined ? { hsnCode: data.hsnCode } : {}),

        ...(data.tax !== undefined ? { tax: data.tax } : {}),

        ...(data.description !== undefined
          ? { description: data.description }
          : {}),

        ...(data.image !== undefined ? { image: data.image } : {}),

        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),

        ...(data.category
          ? {
              category: {
                _id: data.category,
                name: existing.category?.name ?? "",
              },
            }
          : {}),

        ...(data.subCategory
          ? {
              subCategory: {
                _id: data.subCategory,
                name: existing.subCategory?.name ?? "",
              },
            }
          : {}),

        _id: existing._id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      };

      await saveProducts([updated]);

      await addToSyncQueue("PRODUCT", "UPDATE", data, id);

      return updated;
    }

    const response = await api.put<ProductResponse>(
      `/products/view?id=${id}`,
      data,
    );

    const product = response.data.data;

    await saveProducts([product]);

    return product;
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async deleteProduct(id: string) {
    if (!id) {
      throw new Error("Invalid product ID.");
    }

    if (!isOnline()) {
      const existing = await getOfflineProductById(id);

      if (!existing) {
        throw new Error("Product not found offline.");
      }

      await deleteOfflineProduct(id);

      await addToSyncQueue("PRODUCT", "DELETE", {}, id);

      return undefined;
    }

    const response = await api.delete(`/products/view?id=${id}`);

    await deleteOfflineProduct(id);

    return response.data.data;
  }

  /* ------------------------------------------------------------------------ */
  /* EXPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  async exportProducts() {
    if (!isOnline()) {
      throw new Error("Product export requires an internet connection.");
    }

    const response = await api.get("/products/export", {
      responseType: "blob",
    });

    return response.data;
  }
}

export default new ProductService();
