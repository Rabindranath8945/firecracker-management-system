import Purchase from "../models/purchase.model.js";
import { IPurchase } from "../interfaces/purchase.interface.js";

interface PurchaseQueryOptions {
  page?: number;
  limit?: number;

  search?: string;
  supplier?: string;
  paymentStatus?: string;

  fromDate?: Date;
  toDate?: Date;

  isActive?: boolean;

  sort?: string;
  order?: "asc" | "desc";
}

const SUPPLIER_FIELDS =
  "name mobile supplierCode email gstNo address city state pinCode";

const PRODUCT_FIELDS = "name sku image unit purchasePrice salePrice gst";

class PurchaseRepository {
  /* -------------------------------------------------------------------------- */
  /*                                  Create                                    */
  /* -------------------------------------------------------------------------- */

  async create(data: Partial<IPurchase>) {
    return Purchase.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async find() {
    return Purchase.find()
      .populate("supplier", SUPPLIER_FIELDS)
      .populate("items.product", PRODUCT_FIELDS);
  }

  /* -------------------------------------------------------------------------- */
  /*                              Clear Business Data                           */
  /* -------------------------------------------------------------------------- */

  async clearBusinessData(businessId: string) {
    return Purchase.deleteMany({
      businessId,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Find By ID                                */
  /* -------------------------------------------------------------------------- */

  async findById(id: string) {
    return Purchase.findById(id)
      .populate("supplier", SUPPLIER_FIELDS)
      .populate("items.product", PRODUCT_FIELDS);
  }

  /* -------------------------------------------------------------------------- */
  /*                             Find By Purchase No                            */
  /* -------------------------------------------------------------------------- */

  async findByPurchaseNo(purchaseNo: string) {
    return Purchase.findOne({
      purchaseNo,
    })
      .populate("supplier", SUPPLIER_FIELDS)
      .populate("items.product", PRODUCT_FIELDS);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Find All                                  */
  /* -------------------------------------------------------------------------- */

  async findAll(options: PurchaseQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      supplier,
      paymentStatus,
      fromDate,
      toDate,
      isActive = true,
      sort = "purchaseDate",
      order = "desc",
    } = options;

    /* ------------------------------------------------------------------------ */
    /* Query                                                                    */
    /* ------------------------------------------------------------------------ */

    const query: Record<string, unknown> = {
      isActive,
    };

    /* ------------------------------------------------------------------------ */
    /* Search                                                                   */
    /* ------------------------------------------------------------------------ */

    if (search?.trim()) {
      const keyword = search.trim();

      query.$or = [
        {
          purchaseNo: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          invoiceNo: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    /* ------------------------------------------------------------------------ */
    /* Supplier                                                                 */
    /* ------------------------------------------------------------------------ */

    if (supplier?.trim()) {
      query.supplier = supplier.trim();
    }

    /* ------------------------------------------------------------------------ */
    /* Payment Status                                                           */
    /* ------------------------------------------------------------------------ */

    if (paymentStatus?.trim()) {
      query.paymentStatus = paymentStatus.trim();
    }

    /* ------------------------------------------------------------------------ */
    /* Date Filter                                                              */
    /* ------------------------------------------------------------------------ */

    if (fromDate || toDate) {
      const purchaseDate: Record<string, Date> = {};

      if (fromDate) {
        const start = new Date(fromDate);

        start.setHours(0, 0, 0, 0);

        purchaseDate.$gte = start;
      }

      if (toDate) {
        const end = new Date(toDate);

        end.setHours(23, 59, 59, 999);

        purchaseDate.$lte = end;
      }

      query.purchaseDate = purchaseDate;
    }

    /* ------------------------------------------------------------------------ */
    /* Pagination                                                               */
    /* ------------------------------------------------------------------------ */

    const safePage = Math.max(1, Math.floor(page));

    const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 100);

    const skip = (safePage - 1) * safeLimit;

    /* ------------------------------------------------------------------------ */
    /* Sorting                                                                  */
    /* ------------------------------------------------------------------------ */

    const allowedSortFields = new Set([
      "purchaseDate",
      "createdAt",
      "updatedAt",
      "purchaseNo",
      "invoiceNo",
      "grandTotal",
      "subtotal",
      "paidAmount",
      "dueAmount",
      "paymentStatus",
    ]);

    const safeSort = allowedSortFields.has(sort) ? sort : "purchaseDate";

    const sortDirection = order === "asc" ? 1 : -1;

    const sortQuery: Record<string, 1 | -1> = {
      [safeSort]: sortDirection,
    };

    /* ------------------------------------------------------------------------ */
    /* Database Query                                                           */
    /* ------------------------------------------------------------------------ */

    const [items, total] = await Promise.all([
      Purchase.find(query)
        .populate("supplier", SUPPLIER_FIELDS)
        .populate("items.product", PRODUCT_FIELDS)
        .sort(sortQuery)
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),

      Purchase.countDocuments(query),
    ]);

    /* ------------------------------------------------------------------------ */
    /* Pagination                                                               */
    /* ------------------------------------------------------------------------ */

    const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);

    return {
      items,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,

        hasNextPage: safePage < totalPages,

        hasPreviousPage: safePage > 1 && totalPages > 0,
      },
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Update                                    */
  /* -------------------------------------------------------------------------- */

  async update(id: string, data: Partial<IPurchase>) {
    return Purchase.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("supplier", SUPPLIER_FIELDS)
      .populate("items.product", PRODUCT_FIELDS);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Delete                                    */
  /* -------------------------------------------------------------------------- */

  async delete(id: string) {
    return Purchase.findByIdAndDelete(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Export                                    */
  /* -------------------------------------------------------------------------- */

  async findAllForExport() {
    return Purchase.find({
      isActive: true,
    })
      .populate("supplier", SUPPLIER_FIELDS)
      .populate("items.product", PRODUCT_FIELDS)
      .sort({
        purchaseDate: -1,
      })
      .lean()
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                               Bulk Create                                  */
  /* -------------------------------------------------------------------------- */

  async bulkCreate(purchases: Partial<IPurchase>[]) {
    return Purchase.insertMany(purchases, {
      ordered: false,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Purchase Numbers                              */
  /* -------------------------------------------------------------------------- */

  async getPurchaseCodes() {
    return Purchase.find().select("purchaseNo -_id").lean();
  }

  /* -------------------------------------------------------------------------- */
  /*                               Invoice Numbers                              */
  /* -------------------------------------------------------------------------- */

  async getInvoiceCodes() {
    return Purchase.find().select("invoiceNo -_id").lean();
  }

  /* -------------------------------------------------------------------------- */
  /*                            Find Purchase Nos                               */
  /* -------------------------------------------------------------------------- */

  async findByPurchaseNos(purchaseNos: string[]) {
    return Purchase.find({
      purchaseNo: {
        $in: purchaseNos,
      },
    }).select("purchaseNo invoiceNo");
  }
}

export default new PurchaseRepository();
