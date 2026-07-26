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

  async findById(id: string) {
    return Sale.findById(id).populate(
      "customer",
      "customerCode name mobile address gstNo",
    );
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

    if (customer) {
      query.customer = customer;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      query["payment.method"] = paymentMethod;
    }

    if (fromDate || toDate) {
      query.saleDate = {};

      if (fromDate) {
        (query.saleDate as Record<string, unknown>).$gte = fromDate;
      }

      if (toDate) {
        (query.saleDate as Record<string, unknown>).$lte = toDate;
      }
    }

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

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
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

  async countSales() {
    return Sale.countDocuments();
  }

  async getNextSequence() {
    return (await this.countSales()) + 1;
  }

  async findInvoiceById(id: string): Promise<ISaleInvoice | null> {
    return Sale.findById(id)
      .populate("customer", "customerCode name mobile email address gstNo")
      .lean<ISaleInvoice>();
  }
}

export default new SalesRepository();
