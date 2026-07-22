import { Types } from "mongoose";

import SubCategoryRepository from "../repositories/sub-category.repository.js";
import CategoryRepository from "../../category/repositories/category.repository.js";

import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from "../validators/sub-category.validator.js";

interface SubCategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";

  category?: string;

  isActive?: boolean;
}

class SubCategoryService {
  private mapDto(data: CreateSubCategoryDto | UpdateSubCategoryDto) {
    return {
      ...data,

      category: data.category ? new Types.ObjectId(data.category) : undefined,
    };
  }

  async create(data: CreateSubCategoryDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    if (!Types.ObjectId.isValid(data.category)) {
      throw new Error("Invalid category.");
    }

    const category = await CategoryRepository.findById(data.category);

    if (!category) {
      throw new Error("Category not found.");
    }

    const exists = await SubCategoryRepository.findByCode(data.subCategoryCode);

    if (exists) {
      throw new Error("Sub category code already exists.");
    }

    return SubCategoryRepository.create({
      ...this.mapDto(data),
      createdBy: new Types.ObjectId(userId),
    });
  }

  async getAll(query: SubCategoryQuery) {
    return SubCategoryRepository.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: query.search,
      sort: query.sort,
      order: query.order,
      category: query.category,
      isActive: query.isActive ?? true,
    });
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid sub category id.");
    }

    const subCategory = await SubCategoryRepository.findById(id);

    if (!subCategory) {
      throw new Error("Sub category not found.");
    }

    return subCategory;
  }

  async update(id: string, data: UpdateSubCategoryDto, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid sub category id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    if (data.category && !Types.ObjectId.isValid(data.category)) {
      throw new Error("Invalid category.");
    }

    if (data.category) {
      const category = await CategoryRepository.findById(data.category);

      if (!category) {
        throw new Error("Category not found.");
      }
    }

    const subCategory = await SubCategoryRepository.findById(id);

    if (!subCategory) {
      throw new Error("Sub category not found.");
    }

    return SubCategoryRepository.update(id, {
      ...this.mapDto(data),
      updatedBy: new Types.ObjectId(userId),
    });
  }

  async delete(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid sub category id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const subCategory = await SubCategoryRepository.findById(id);

    if (!subCategory) {
      throw new Error("Sub category not found.");
    }

    return SubCategoryRepository.update(id, {
      isActive: false,
      updatedBy: new Types.ObjectId(userId),
    });
  }
}

export default new SubCategoryService();
