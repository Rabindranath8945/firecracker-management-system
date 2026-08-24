import Expense from "../models/expense.model.js";
import { IExpense } from "../interfaces/expense.interface.js";

interface ExpenseQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  paymentMethod?: string;
  isActive?: boolean;
  sort?: string;
  order?: "asc" | "desc";
}

class ExpenseRepository {
  async create(data: Partial<IExpense>) {
    return Expense.create(data);
  }

  async find() {
    return Expense.find();
  }

  async clearBusinessData(businessId: string) {
    return Expense.deleteMany({
      businessId,
    });
  }

  async findById(id: string) {
    return Expense.findById(id);
  }

  async findByExpenseNo(expenseNo: string) {
    return Expense.findOne({
      expenseNo,
    });
  }

  async findAll(options: ExpenseQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      paymentMethod,
      isActive = true,
      sort = "expenseDate",
      order = "desc",
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    if (search) {
      query.$or = [
        {
          expenseNo: new RegExp(search, "i"),
        },
        {
          title: new RegExp(search, "i"),
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Expense.find(query)
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Expense.countDocuments(query),
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

  async update(id: string, data: Partial<IExpense>) {
    return Expense.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  async delete(id: string) {
    return Expense.findByIdAndDelete(id);
  }

  async findAllForExport() {
    return Expense.find({
      isActive: true,
    }).sort({
      expenseDate: -1,
    });
  }

  async bulkCreate(expenses: Partial<IExpense>[]) {
    return Expense.insertMany(expenses, {
      ordered: false,
    });
  }

  async findByExpenseNos(expenseNos: string[]) {
    return Expense.find({
      expenseNo: {
        $in: expenseNos,
      },
    }).select("expenseNo");
  }
}

export default new ExpenseRepository();
