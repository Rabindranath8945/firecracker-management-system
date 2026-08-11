import { ClientSession } from "mongoose";
import Customer from "../models/customer.model.js";
import { ICustomer } from "../interfaces/customer.interface.js";

interface CustomerQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class CustomerRepository {
  async create(data: Partial<ICustomer>) {
    return Customer.create(data);
  }

  async find() {
    return Customer.find();
  }

  async clearBusinessData(businessId: string) {
    return Customer.deleteMany({
      businessId,
    });
  }

  async findById(id: string) {
    return Customer.findById(id);
  }

  async findByCode(customerCode: string) {
    return Customer.findOne({
      customerCode,
    });
  }

  async findByMobile(mobile: string) {
    return Customer.findOne({
      mobile,
    });
  }

  async findByCodes(customerCodes: string[]) {
    return Customer.find({
      customerCode: {
        $in: customerCodes,
      },
    }).select("customerCode");
  }

  async findByMobiles(mobiles: string[]) {
    return Customer.find({
      mobile: {
        $in: mobiles,
      },
    }).select("mobile");
  }

  async bulkCreate(customers: Partial<ICustomer>[]) {
    return Customer.insertMany(customers, {
      ordered: false,
    });
  }

  async findLastCustomer() {
    return Customer.findOne()
      .sort({
        createdAt: -1,
      })
      .select("customerCode");
  }

  async findAll(options: CustomerQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      sort = "createdAt",
      order = "desc",
      isActive = true,
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    if (search) {
      query.$or = [
        {
          customerCode: new RegExp(search, "i"),
        },
        {
          name: new RegExp(search, "i"),
        },
        {
          mobile: new RegExp(search, "i"),
        },
        {
          email: new RegExp(search, "i"),
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Customer.find(query)
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Customer.countDocuments(query),
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

  async update(id: string, data: Partial<ICustomer>) {
    return Customer.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async increaseBalance(id: string, amount: number, session?: ClientSession) {
    return Customer.findByIdAndUpdate(
      id,
      {
        $inc: {
          openingBalance: amount,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    );
  }

  async delete(id: string) {
    return Customer.findByIdAndDelete(id);
  }
  async findAllForExport() {
    return Customer.find({
      isActive: true,
    }).sort({
      name: 1,
    });
  }
}

export default new CustomerRepository();
