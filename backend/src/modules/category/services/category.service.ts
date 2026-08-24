import { Types } from "mongoose";

import CategoryRepository from "../repositories/category.repository.js";
import { generateSequenceCode } from "../../../common/utils/generate-code.js";

import type {
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
  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async create(data: CreateCategoryDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const categoryCode = await this.generateCategoryCode();

    return CategoryRepository.create({
      ...data,
      categoryCode,
      createdBy: new Types.ObjectId(userId),
    });
  }

  /* ------------------------------------------------------------------------ */
  /* GET ALL                                                                  */
  /* ------------------------------------------------------------------------ */

  async getAll(query: CategoryQuery) {
    return CategoryRepository.findAll({
      page: query.page ?? 1,

      limit: query.limit ?? 20,

      search: query.search?.trim() || undefined,

      sort: query.sort,

      order: query.order ?? "asc",

      isActive: query.isActive !== undefined ? query.isActive : undefined,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* GET BY ID                                                                */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* GENERATE CATEGORY CODE                                                   */
  /* ------------------------------------------------------------------------ */

  private async generateCategoryCode() {
    const categories = await CategoryRepository.findCodes();

    return generateSequenceCode(
      categories.map((item) => item.categoryCode),
      "CAT",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

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

    /*
     * Soft delete.
     *
     * We keep the category in the database but
     * mark it inactive so existing products and
     * historical records are not broken.
     */
    return CategoryRepository.update(id, {
      isActive: false,
      updatedBy: new Types.ObjectId(userId),
    });
  }
}

export default new CategoryService();
