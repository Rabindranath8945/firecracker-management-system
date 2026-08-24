import Category from "../models/category.model.js";
import { ICategory } from "../interfaces/category.interface.js";

interface CategoryQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class CategoryRepository {
  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async create(data: Partial<ICategory>) {
    return Category.create(data);
  }

  /* ------------------------------------------------------------------------ */
  /* FIND CODES                                                               */
  /* ------------------------------------------------------------------------ */

  async findCodes() {
    return Category.find(
      {},
      {
        categoryCode: 1,
      },
    ).lean();
  }

  /* ------------------------------------------------------------------------ */
  /* BULK CREATE                                                              */
  /* ------------------------------------------------------------------------ */

  async bulkCreate(data: Partial<ICategory>[]) {
    return Category.insertMany(data, {
      ordered: false,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* CLEAR BUSINESS DATA                                                      */
  /* ------------------------------------------------------------------------ */

  async clearBusinessData(businessId: string) {
    return Category.deleteMany({
      businessId,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* FIND BY ID                                                               */
  /* ------------------------------------------------------------------------ */

  async findById(id: string) {
    return Category.findById(id).populate("productCount");
  }

  /* ------------------------------------------------------------------------ */
  /* FIND BY CODE                                                             */
  /* ------------------------------------------------------------------------ */

  async findByCode(categoryCode: string) {
    return Category.findOne({
      categoryCode,
    }).populate("productCount");
  }

  /* ------------------------------------------------------------------------ */
  /* FIND ALL FOR IMPORT                                                      */
  /* ------------------------------------------------------------------------ */

  async findAllForImport() {
    return Category.find({
      isActive: true,
    })
      .select("_id name")
      .lean();
  }

  /* ------------------------------------------------------------------------ */
  /* FIND ALL                                                                 */
  /* ------------------------------------------------------------------------ */

  async findAll(options: CategoryQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      sort = "name",
      order = "asc",
      isActive,
    } = options;

    /* ---------------------------------------------------------------------- */
    /* QUERY                                                                  */
    /* ---------------------------------------------------------------------- */

    const query: Record<string, unknown> = {};

    /* ---------------------------------------------------------------------- */
    /* STATUS                                                                 */
    /* ---------------------------------------------------------------------- */

    if (typeof isActive === "boolean") {
      query.isActive = isActive;
    }

    /* ---------------------------------------------------------------------- */
    /* SEARCH                                                                 */
    /* ---------------------------------------------------------------------- */

    if (search?.trim()) {
      const keyword = search.trim();

      query.$or = [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          categoryCode: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    /* ---------------------------------------------------------------------- */
    /* PAGINATION                                                             */
    /* ---------------------------------------------------------------------- */

    const safePage = Math.max(1, page);

    const safeLimit = Math.min(Math.max(1, limit), 100);

    const skip = (safePage - 1) * safeLimit;

    /* ---------------------------------------------------------------------- */
    /* SORT                                                                   */
    /* ---------------------------------------------------------------------- */

    const sortOrder = order === "desc" ? -1 : 1;

    /* ---------------------------------------------------------------------- */
    /* QUERY                                                                  */
    /* ---------------------------------------------------------------------- */

    const [items, total] = await Promise.all([
      Category.find(query)
        .populate("productCount")
        .sort({
          [sort]: sortOrder,
        })
        .skip(skip)
        .limit(safeLimit)
        .lean({
          virtuals: true,
        }),

      Category.countDocuments(query),
    ]);

    /* ---------------------------------------------------------------------- */
    /* RESPONSE                                                               */
    /* ---------------------------------------------------------------------- */

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    };
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async update(id: string, data: Partial<ICategory>) {
    return Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("productCount");
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async delete(id: string) {
    return Category.findByIdAndDelete(id);
  }
}

export default new CategoryRepository();
