import { Types } from "mongoose";

import ExpenseRepository from "../repositories/expense.repository.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "../validators/expense.validator.js";

import { IExpense } from "../interfaces/expense.interface.js";
import { ExpenseExcelRow } from "../../../common/excel/types/expense-excel-row.types.js";

class ExpenseService {
  async create(data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validatedData = createExpenseSchema.parse(data);

    const existingExpense = await ExpenseRepository.findByExpenseNo(
      validatedData.expenseNo,
    );

    if (existingExpense) {
      throw new Error("Expense number already exists.");
    }

    return ExpenseRepository.create({
      ...validatedData,
      createdBy: new Types.ObjectId(userId),
    });
  }

  async getAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    paymentMethod?: string;
    isActive?: boolean;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    return ExpenseRepository.findAll(options);
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid expense id.");
    }

    const expense = await ExpenseRepository.findById(id);

    if (!expense) {
      throw new Error("Expense not found.");
    }

    return expense;
  }

  async update(id: string, data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid expense id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validatedData = updateExpenseSchema.parse(data);

    const expense = await ExpenseRepository.update(id, {
      ...validatedData,
      updatedBy: new Types.ObjectId(userId),
    });

    if (!expense) {
      throw new Error("Expense not found.");
    }

    return expense;
  }

  async delete(id: string, _userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid expense id.");
    }

    const expense = await ExpenseRepository.delete(id);

    if (!expense) {
      throw new Error("Expense not found.");
    }

    return expense;
  }

  async exportExcel() {
    return ExpenseRepository.findAllForExport();
  }

  async bulkImport(rows: ExpenseExcelRow[], userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const expenseNos = rows
      .map((row) => row.expenseNo)
      .filter((code): code is string => Boolean(code));

    const existingExpenses =
      await ExpenseRepository.findByExpenseNos(expenseNos);

    const existingCodes = new Set(
      existingExpenses.map((expense) => expense.expenseNo),
    );

    const expenses: Partial<IExpense>[] = [];

    const errors: {
      row: number;
      field: string;
      message: string;
    }[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      if (existingCodes.has(row.expenseNo)) {
        errors.push({
          row: index + 2,
          field: "expenseNo",
          message: `Expense No '${row.expenseNo}' already exists.`,
        });

        continue;
      }

      existingCodes.add(row.expenseNo);

      expenses.push({
        expenseNo: row.expenseNo,
        title: row.title,
        category: row.category,
        amount: row.amount,
        paymentMethod: row.paymentMethod,
        expenseDate: row.expenseDate,
        notes: row.notes,
        isActive: row.isActive,
        createdBy: new Types.ObjectId(userId),
      });
    }

    if (expenses.length > 0) {
      await ExpenseRepository.bulkCreate(expenses);
    }

    return {
      success: errors.length === 0,
      total: rows.length,
      imported: expenses.length,
      skipped: rows.length - expenses.length,
      errors,
    };
  }
}

export default new ExpenseService();
