import SubCategory from "../models/sub-category.model.js";

interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  category?: string;
  isActive?: boolean;
}

class SubCategoryRepository {
  /* ------------------------------------------------------------------------ */
  /* GET ALL                                                                  */
  /* ------------------------------------------------------------------------ */

  async findAll(options: FindAllOptions) {
    const { page, limit, search, sort, order, category, isActive } = options;

    const filter: Record<string, unknown> = {};

    /* ---------------------------------------------------------------------- */
    /* SEARCH                                                                 */
    /* ---------------------------------------------------------------------- */

    if (search?.trim()) {
      const keyword = search.trim();

      filter.$or = [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          subCategoryCode: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    /* ---------------------------------------------------------------------- */
    /* CATEGORY                                                               */
    /* ---------------------------------------------------------------------- */

    if (category) {
      filter.category = category;
    }

    /* ---------------------------------------------------------------------- */
    /* STATUS                                                                 */
    /* ---------------------------------------------------------------------- */

    if (typeof isActive === "boolean") {
      filter.isActive = isActive;
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

    const sortField = sort || "name";

    const sortOrder = order === "desc" ? -1 : 1;

    /* ---------------------------------------------------------------------- */
    /* QUERY                                                                  */
    /* ---------------------------------------------------------------------- */

    const [items, total] = await Promise.all([
      SubCategory.find(filter)
        .populate({
          path: "category",
          select: "name categoryNo",
        })

        // IMPORTANT:
        // This uses the productCount virtual defined
        // in sub-category.model.ts.
        .populate("productCount")

        .sort({
          [sortField]: sortOrder,
        })

        .skip(skip)
        .limit(safeLimit)

        .lean({
          virtuals: true,
        }),

      SubCategory.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    };
  }

  async findAllForImport() {
    return SubCategory.find({}).select("_id name category").lean();
  }

  /* ------------------------------------------------------------------------ */
  /* GET BY ID                                                                */
  /* ------------------------------------------------------------------------ */

  async findById(id: string) {
    return SubCategory.findById(id)
      .populate({
        path: "category",
        select: "name categoryNo",
      })
      .populate("productCount");
  }

  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async create(data: Record<string, unknown>) {
    return SubCategory.create(data);
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async update(id: string, data: Record<string, unknown>) {
    return SubCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: "category",
        select: "name categoryNo",
      })
      .populate("productCount");
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async delete(id: string) {
    return SubCategory.findByIdAndDelete(id);
  }

  /* ------------------------------------------------------------------------ */
  /* FIND CODES                                                               */
  /* ------------------------------------------------------------------------ */

  async findCodes() {
    return SubCategory.find(
      {},
      {
        subCategoryCode: 1,
      },
    ).lean();
  }
}

export default new SubCategoryRepository();
