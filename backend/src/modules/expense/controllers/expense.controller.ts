import { Request, Response } from "express";

import ExpenseService from "../services/expense.service.js";
import { excelService } from "../../../common/excel/index.js";

import { ExpenseExcelRow } from "../../../common/excel/types/expense-excel-row.types.js";
import { transformExpenseRows } from "../excel/expense-transformer.js";
import { validateExpenseRows } from "../excel/expense-validator.js";

class ExpenseController {
  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const expense = await ExpenseService.create(req.body, req.user.userId);

    return res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      data: expense,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const expenses = await ExpenseService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,

      search: req.query.search ? String(req.query.search) : undefined,

      category: req.query.category ? String(req.query.category) : undefined,

      paymentMethod: req.query.paymentMethod
        ? String(req.query.paymentMethod)
        : undefined,

      sort: req.query.sort ? String(req.query.sort) : undefined,

      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined,

      isActive:
        req.query.isActive !== undefined ? req.query.isActive === "true" : true,
    });

    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully.",
      data: expenses,
    });
  };

  getById = async (req: Request, res: Response) => {
    const expense = await ExpenseService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Expense fetched successfully.",
      data: expense,
    });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const expense = await ExpenseService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: expense,
    });
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await ExpenseService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully.",
    });
  };

  exportExcel = async (_req: Request, res: Response) => {
    const expenses = await ExpenseService.exportExcel();

    const buffer = await excelService.export({
      fileName: "Expenses",
      sheetName: "Expenses",

      columns: [
        { header: "Expense No", key: "expenseNo", width: 18, type: "string" },
        { header: "Title", key: "title", width: 30, type: "string" },
        { header: "Category", key: "category", width: 20, type: "string" },
        { header: "Amount", key: "amount", width: 18, type: "currency" },
        {
          header: "Payment Method",
          key: "paymentMethod",
          width: 18,
          type: "string",
        },
        { header: "Expense Date", key: "expenseDate", width: 18, type: "date" },
        { header: "Notes", key: "notes", width: 35, type: "string" },
        { header: "Created At", key: "createdAt", width: 20, type: "date" },
        { header: "Updated At", key: "updatedAt", width: 20, type: "date" },
      ],

      data: expenses,
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Expenses.xlsx"',
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    return res.end(buffer);
  };

  importExcel = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required.",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await excelService.import<ExpenseExcelRow>(
      req.file,
      {
        "Expense No": "expenseNo",
        Title: "title",
        Category: "category",
        Amount: "amount",
        "Payment Method": "paymentMethod",
        "Expense Date": "expenseDate",
        Notes: "notes",
        Status: "status",
      },
      transformExpenseRows,
      validateExpenseRows,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    const summary = await ExpenseService.bulkImport(
      result.rows,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Expenses imported successfully.",
      summary,
    });
  };
}

export default new ExpenseController();
