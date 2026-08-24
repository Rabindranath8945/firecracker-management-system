import { ClientSession } from "mongoose";
import Sale from "../models/sales.model.js";
import { ISale } from "../interfaces/sales.interface.js";
import { ISaleInvoice } from "../interfaces/sale-invoice.interface.js";

interface SaleQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  customer?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  fromDate?: Date;
  toDate?: Date;
  isActive?: boolean;
  sort?: string;
  order?: "asc" | "desc";
}

class SalesRepository {
  async create(data: Partial<ISale>, session?: ClientSession) {
    const [sale] = await Sale.create([data], {
      session,
    });

    return sale;
  }

  async find() {
    return Sale.find();
  }

  async clearBusinessData(businessId: string) {
    return Sale.deleteMany({
      businessId,
    });
  }

  async findById(id: string, session?: ClientSession) {
    return Sale.findById(id)
      .populate("customer", "customerCode name mobile address gstNo")
      .session(session ?? null);
  }

  async findBySaleNo(saleNo: string) {
    return Sale.findOne({
      saleNo,
    });
  }

  async findByInvoiceNo(invoiceNo: string) {
    return Sale.findOne({
      invoiceNo,
    });
  }

  async findAll(options: SaleQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      customer,
      paymentStatus,
      paymentMethod,
      fromDate,
      toDate,
      isActive = true,
      sort = "saleDate",
      order = "desc",
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    /* ---------------------------------------------------------------------- */
    /* Search                                                                 */
    /* ---------------------------------------------------------------------- */

    if (search) {
      query.$or = [
        {
          saleNo: new RegExp(search, "i"),
        },
        {
          invoiceNo: new RegExp(search, "i"),
        },
      ];
    }

    /* ---------------------------------------------------------------------- */
    /* Customer                                                               */
    /* ---------------------------------------------------------------------- */

    if (customer) {
      query.customer = customer;
    }

    /* ---------------------------------------------------------------------- */
    /* Payment Status                                                          */
    /* ---------------------------------------------------------------------- */

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    /* ---------------------------------------------------------------------- */
    /* Payment Method                                                          */
    /* ---------------------------------------------------------------------- */

    if (paymentMethod) {
      query["payment.method"] = paymentMethod;
    }

    /* ---------------------------------------------------------------------- */
    /* Date Filter                                                             */
    /* ---------------------------------------------------------------------- */

    if (fromDate || toDate) {
      const dateQuery: Record<string, Date> = {};

      if (fromDate) {
        dateQuery.$gte = fromDate;
      }

      if (toDate) {
        dateQuery.$lte = toDate;
      }

      query.saleDate = dateQuery;
    }

    /* ---------------------------------------------------------------------- */
    /* Pagination                                                              */
    /* ---------------------------------------------------------------------- */

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Sale.find(query)
        .populate("customer")
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Sale.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getTodaySummary() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const summary = await Sale.aggregate([
      {
        $match: {
          isActive: true,
          saleDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $project: {
          grandTotal: 1,
          items: 1,
        },
      },
      {
        $group: {
          _id: null,

          todaySales: {
            $sum: "$grandTotal",
          },

          todayOrders: {
            $sum: 1,
          },

          itemsSold: {
            $sum: {
              $sum: "$items.quantity",
            },
          },

          todayProfit: {
            $sum: {
              $sum: "$items.profit",
            },
          },
        },
      },
    ]);

    return (
      summary[0] ?? {
        todaySales: 0,
        todayOrders: 0,
        itemsSold: 0,
        todayProfit: 0,
      }
    );
  }

  async getSaleCodes(session?: ClientSession) {
    return Sale.find()
      .select("saleNo -_id")
      .session(session ?? null)
      .lean();
  }

  async update(id: string, data: Partial<ISale>, session?: ClientSession) {
    return Sale.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session,
    });
  }
  async delete(id: string, session?: ClientSession) {
    return Sale.findByIdAndDelete(id, {
      session,
    });
  }

  async findAllForExport() {
    return Sale.find({
      isActive: true,
    })
      .populate("customer")
      .populate("items.product")
      .sort({
        saleDate: -1,
      });
  }

  async findAllForBusinessExport(businessId: string) {
    return Sale.find({
      businessId,
      isActive: true,
    })
      .populate("customer", "customerCode name mobile email address gstNo")
      .sort({
        saleDate: -1,
      })
      .lean();
  }

  async findBySaleNoForBusiness(saleNo: string, businessId: string) {
    return Sale.findOne({
      saleNo,
      businessId,
    })
      .lean()
      .exec();
  }

  async findByInvoiceNoForBusiness(invoiceNo: string, businessId: string) {
    return Sale.findOne({
      invoiceNo,
      businessId,
    })
      .lean()
      .exec();
  }

  async bulkCreate(sales: Partial<ISale>[]) {
    return Sale.insertMany(sales, {
      ordered: false,
    });
  }

  async findBySaleNos(saleNos: string[]) {
    return Sale.find({
      saleNo: {
        $in: saleNos,
      },
    }).select("saleNo");
  }

  async findInvoiceById(id: string): Promise<ISaleInvoice | null> {
    return Sale.findById(id)
      .select(
        "businessId saleNo invoiceNo saleDate customer items subtotal discount taxAmount grandTotal paidAmount dueAmount payment paymentStatus notes",
      )
      .populate("customer", "customerCode name mobile email address gstNo")
      .lean<ISaleInvoice>();
  }
}

export default new SalesRepository();
