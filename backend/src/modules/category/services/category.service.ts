import { Types } from "mongoose";

import CategoryRepository from "../repositories/category.repository.js";

import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../validators/category.validator.js";

interface CategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class CategoryService {
  async create(data: CreateCategoryDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const exists = await CategoryRepository.findByCode(data.categoryCode);

    if (exists) {
      throw new Error("Category code already exists.");
    }

    return CategoryRepository.create({
      ...data,
      createdBy: new Types.ObjectId(userId),
    });
  }

  async getAll(query: CategoryQuery) {
    return CategoryRepository.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: query.search,
      sort: query.sort,
      order: query.order,
      isActive: query.isActive ?? true,
    });
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category id.");
    }

    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found.");
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found.");
    }

    return CategoryRepository.update(id, {
      ...data,
      updatedBy: new Types.ObjectId(userId),
    });
  }

  async delete(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found.");
    }

    return CategoryRepository.update(id, {
      isActive: false,
      updatedBy: new Types.ObjectId(userId),
    });
  }
}

export default new CategoryService();
