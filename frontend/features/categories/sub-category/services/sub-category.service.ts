import api from "@/lib/api";

import type { SubCategory } from "../types/sub-category";

import {
  deleteSubCategory as deleteOfflineSubCategory,
  getSubCategories as getOfflineSubCategories,
  getSubCategoryById as getOfflineSubCategoryById,
  saveSubCategories,
} from "@/libs/offline/store/offline.storage";

import { addToSyncQueue } from "@/libs/offline/sync/sync.queue";

/* -------------------------------------------------------------------------- */
/* DTOs                                                                       */
/* -------------------------------------------------------------------------- */

export interface CreateSubCategoryDto {
  name: string;
  category: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateSubCategoryDto {
  name?: string;
  category?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/* API RESPONSE TYPES                                                         */
/* -------------------------------------------------------------------------- */

interface SubCategoryListResponse {
  success: boolean;
  message: string;
  data: {
    items: SubCategory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SubCategoryResponse {
  success: boolean;
  message: string;
  data: SubCategory;
}

interface DeleteSubCategoryResponse {
  success: boolean;
  message: string;
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

class SubCategoryService {
  /* ------------------------------------------------------------------------ */
  /* GET ALL                                                                  */
  /* ------------------------------------------------------------------------ */

  async getSubCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    category?: string;
    isActive?: boolean;
  }): Promise<SubCategoryListResponse["data"]> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;

    /* ---------------------------------------------------------------------- */
    /* OFFLINE                                                                */
    /* ---------------------------------------------------------------------- */

    if (!isOnline()) {
      let items = await getOfflineSubCategories(params?.category);

      if (params?.search?.trim()) {
        const search = params.search.trim().toLowerCase();

        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(search) ||
            item.subCategoryCode.toLowerCase().includes(search),
        );
      }

      if (params?.isActive !== undefined) {
        items = items.filter((item) => item.isActive === params.isActive);
      }

      const total = items.length;

      const start = (page - 1) * limit;

      const paginatedItems = items.slice(start, start + limit);

      return {
        items: paginatedItems,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    }

    /* ---------------------------------------------------------------------- */
    /* ONLINE                                                                 */
    /* ---------------------------------------------------------------------- */

    try {
      const response = await api.get<SubCategoryListResponse>(
        "/sub-categories",
        {
          params: {
            page,
            limit,
            search: params?.search?.trim() || undefined,
            sort: params?.sort || undefined,
            order: params?.order || undefined,
            category: params?.category || undefined,
            isActive:
              params?.isActive !== undefined ? params.isActive : undefined,
          },
        },
      );

      const result = response.data.data;

      await saveSubCategories(result.items);

      return result;
    } catch (error) {
      console.warn("Sub-category API unavailable. Using offline data.", error);

      let items = await getOfflineSubCategories(params?.category);

      if (params?.search?.trim()) {
        const search = params.search.trim().toLowerCase();

        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(search) ||
            item.subCategoryCode.toLowerCase().includes(search),
        );
      }

      if (params?.isActive !== undefined) {
        items = items.filter((item) => item.isActive === params.isActive);
      }

      const total = items.length;

      return {
        items: items.slice((page - 1) * limit, page * limit),
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    }
  }

  /* ------------------------------------------------------------------------ */
  /* GET BY CATEGORY                                                          */
  /* ------------------------------------------------------------------------ */

  async getByCategory(categoryId: string): Promise<SubCategory[]> {
    if (!categoryId || categoryId === "undefined" || categoryId === "null") {
      throw new Error("Invalid category id.");
    }

    if (!isOnline()) {
      return getOfflineSubCategories(categoryId);
    }

    try {
      const response = await api.get<SubCategoryListResponse>(
        "/sub-categories",
        {
          params: {
            category: categoryId,
          },
        },
      );

      const items = response.data.data.items;

      await saveSubCategories(items);

      return items;
    } catch (error) {
      console.warn("Sub-category API unavailable. Using offline data.", error);

      return getOfflineSubCategories(categoryId);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* GET BY ID                                                                */
  /* ------------------------------------------------------------------------ */

  async getSubCategory(id: string): Promise<SubCategory> {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid sub category id.");
    }

    if (!isOnline()) {
      const subCategory = await getOfflineSubCategoryById(id);

      if (!subCategory) {
        throw new Error("Sub category not found offline.");
      }

      return subCategory;
    }

    try {
      const response = await api.get<SubCategoryResponse>(
        `/sub-categories/${id}`,
      );

      const subCategory = response.data.data;

      await saveSubCategories([subCategory]);

      return subCategory;
    } catch (error) {
      console.warn("Sub-category API unavailable. Using offline data.", error);

      const subCategory = await getOfflineSubCategoryById(id);

      if (!subCategory) {
        throw error;
      }

      return subCategory;
    }
  }

  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async create(data: CreateSubCategoryDto): Promise<SubCategory> {
    if (!isOnline()) {
      const now = new Date().toISOString();

      const localId = crypto.randomUUID();

      const subCategory: SubCategory = {
        _id: localId,
        subCategoryCode: `OFFLINE-${Date.now()}`,
        name: data.name,
        category: data.category,
        isActive: data.isActive ?? true,
        createdAt: now,
        updatedAt: now,
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
      };

      await saveSubCategories([subCategory]);

      await addToSyncQueue("SUB_CATEGORY", "CREATE", data, localId);

      return subCategory;
    }

    const response = await api.post<SubCategoryResponse>(
      "/sub-categories",
      data,
    );

    const subCategory = response.data.data;

    await saveSubCategories([subCategory]);

    return subCategory;
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async update(id: string, data: UpdateSubCategoryDto): Promise<SubCategory> {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid sub category id.");
    }

    if (!isOnline()) {
      const existing = await getOfflineSubCategoryById(id);

      if (!existing) {
        throw new Error("Sub category not found offline.");
      }

      const updated: SubCategory = {
        ...existing,
        ...data,
        _id: existing._id,
        updatedAt: new Date().toISOString(),
      };

      await saveSubCategories([updated]);

      await addToSyncQueue("SUB_CATEGORY", "UPDATE", data, id);

      return updated;
    }

    const response = await api.put<SubCategoryResponse>(
      `/sub-categories/${id}`,
      data,
    );

    const subCategory = response.data.data;

    await saveSubCategories([subCategory]);

    return subCategory;
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async delete(id: string): Promise<void> {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid sub category id.");
    }

    if (!isOnline()) {
      const existing = await getOfflineSubCategoryById(id);

      if (!existing) {
        throw new Error("Sub category not found offline.");
      }

      await deleteOfflineSubCategory(id);

      await addToSyncQueue("SUB_CATEGORY", "DELETE", {}, id);

      return;
    }

    await api.delete<DeleteSubCategoryResponse>(`/sub-categories/${id}`);

    await deleteOfflineSubCategory(id);
  }
}

export default new SubCategoryService();
