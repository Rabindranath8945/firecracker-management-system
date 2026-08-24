import api from "@/lib/api";

import type { Category } from "../types/category";

import {
  deleteCategory as deleteOfflineCategory,
  getCategories as getOfflineCategories,
  getCategoryById as getOfflineCategoryById,
  saveCategories,
} from "@/libs/offline/store/offline.storage";

import { addToSyncQueue } from "@/libs/offline/sync/sync.queue";

/* -------------------------------------------------------------------------- */
/* DTO                                                                        */
/* -------------------------------------------------------------------------- */

export interface CreateCategoryDto {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/* BACKEND TYPES                                                              */
/* -------------------------------------------------------------------------- */

interface BackendCategory extends Omit<Category, "id"> {
  _id?: string;
  id?: string;
}

interface CategoryListResponse {
  success: boolean;
  message: string;
  data: {
    items: BackendCategory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: BackendCategory;
}

/* -------------------------------------------------------------------------- */
/* NORMALIZER                                                                 */
/* -------------------------------------------------------------------------- */

function normalizeCategory(category: BackendCategory): Category {
  return {
    ...category,
    id: category.id ?? category._id ?? "",
    productCount: Number(category.productCount ?? 0),
  };
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
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

class CategoryService {
  /* ------------------------------------------------------------------------ */
  /* GET ALL                                                                  */
  /* ------------------------------------------------------------------------ */

  async getCategories(): Promise<Category[]> {
    if (!isOnline()) {
      return getOfflineCategories();
    }

    try {
      const response = await api.get<CategoryListResponse>("/categories");

      const categories = response.data.data.items.map(normalizeCategory);

      await saveCategories(categories);

      return categories;
    } catch (error) {
      console.warn("Category API unavailable. Using offline data.", error);

      return getOfflineCategories();
    }
  }

  /* ------------------------------------------------------------------------ */
  /* GET BY ID                                                                */
  /* ------------------------------------------------------------------------ */

  async getCategory(id: string): Promise<Category> {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid category id.");
    }

    if (!isOnline()) {
      const category = await getOfflineCategoryById(id);

      if (!category) {
        throw new Error("Category not found offline.");
      }

      return category;
    }

    try {
      const response = await api.get<CategoryResponse>(`/categories/${id}`);

      const category = normalizeCategory(response.data.data);

      await saveCategories([category]);

      return category;
    } catch (error) {
      console.warn("Category API unavailable. Using offline data.", error);

      const category = await getOfflineCategoryById(id);

      if (!category) {
        throw error;
      }

      return category;
    }
  }

  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async create(data: CreateCategoryDto): Promise<Category> {
    if (!isOnline()) {
      const now = new Date().toISOString();

      const localId = crypto.randomUUID();

      const category: Category = {
        id: localId,
        categoryCode: `OFFLINE-${Date.now()}`,
        name: data.name,
        isActive: data.isActive ?? true,
        productCount: 0,
        createdAt: now,
        updatedAt: now,
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.icon !== undefined ? { icon: data.icon } : {}),
        ...(data.color !== undefined ? { color: data.color } : {}),
      };

      await saveCategories([category]);

      await addToSyncQueue("CATEGORY", "CREATE", data, localId);

      return category;
    }

    const response = await api.post<CategoryResponse>("/categories", data);

    const category = normalizeCategory(response.data.data);

    await saveCategories([category]);

    return category;
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid category id.");
    }

    if (!isOnline()) {
      const existing = await getOfflineCategoryById(id);

      if (!existing) {
        throw new Error("Category not found offline.");
      }

      const updated: Category = {
        ...existing,
        ...data,
        id: existing.id,
        updatedAt: new Date().toISOString(),
      };

      await saveCategories([updated]);

      await addToSyncQueue("CATEGORY", "UPDATE", data, id);

      return updated;
    }

    const response = await api.put<CategoryResponse>(`/categories/${id}`, data);

    const category = normalizeCategory(response.data.data);

    await saveCategories([category]);

    return category;
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async delete(id: string): Promise<void> {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid category id.");
    }

    if (!isOnline()) {
      const existing = await getOfflineCategoryById(id);

      if (!existing) {
        throw new Error("Category not found offline.");
      }

      await deleteOfflineCategory(id);

      await addToSyncQueue("CATEGORY", "DELETE", {}, id);

      return;
    }

    await api.delete(`/categories/${id}`);

    await deleteOfflineCategory(id);
  }
}

export default new CategoryService();
