import { Types } from "mongoose";

import SubCategoryRepository from "../repositories/sub-category.repository.js";
import CategoryRepository from "../../category/repositories/category.repository.js";
import { generateSequenceCode } from "../../../common/utils/generate-code.js";

import type {
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
  /* ------------------------------------------------------------------------ */
  /* DTO MAPPER                                                               */
  /* ------------------------------------------------------------------------ */

  private mapDto(data: CreateSubCategoryDto | UpdateSubCategoryDto) {
    return {
      ...data,
      ...(data.category !== undefined
        ? {
            category: new Types.ObjectId(data.category),
          }
        : {}),
    };
  }

  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                    */
  /* ------------------------------------------------------------------------ */

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

    const subCategoryCode = await this.generateSubCategoryCode();

    return SubCategoryRepository.create({
      ...this.mapDto(data),
      subCategoryCode,
      createdBy: new Types.ObjectId(userId),
    });
  }

  /* ------------------------------------------------------------------------ */
  /* GENERATE CODE                                                             */
  /* ------------------------------------------------------------------------ */

  private async generateSubCategoryCode() {
    const subCategories = await SubCategoryRepository.findCodes();

    return generateSequenceCode(
      subCategories.map((item) => item.subCategoryCode),
      "SUB",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* GET ALL                                                                   */
  /* ------------------------------------------------------------------------ */

  async getAll(query: SubCategoryQuery) {
    return SubCategoryRepository.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: query.search?.trim() || undefined,
      sort: query.sort,
      order: query.order ?? "asc",
      category: query.category,
      isActive: query.isActive !== undefined ? query.isActive : undefined,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* GET BY ID                                                                 */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                    */
  /* ------------------------------------------------------------------------ */

  async update(id: string, data: UpdateSubCategoryDto, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid sub category id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    if (data.category !== undefined && !Types.ObjectId.isValid(data.category)) {
      throw new Error("Invalid category.");
    }

    if (data.category !== undefined) {
      const category = await CategoryRepository.findById(data.category);

      if (!category) {
        throw new Error("Category not found.");
      }
    }

    const existing = await SubCategoryRepository.findById(id);

    if (!existing) {
      throw new Error("Sub category not found.");
    }

    return SubCategoryRepository.update(id, {
      ...this.mapDto(data),
      updatedBy: new Types.ObjectId(userId),
    });
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                    */
  /* ------------------------------------------------------------------------ */

  async delete(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid sub category id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const existing = await SubCategoryRepository.findById(id);

    if (!existing) {
      throw new Error("Sub category not found.");
    }

    return SubCategoryRepository.delete(id);
  }
}

export default new SubCategoryService();
