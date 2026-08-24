import { Request, Response } from "express";

import CustomerService from "../services/customer.service.js";
import { excelService } from "../../../common/excel/index.js";
import { CustomerExcelRow } from "../../../common/excel/types/customer-excel-row.types.js";
import { transformCustomerRows } from "../excel/customer-transformer.js";
import { validateCustomerRows } from "../excel/customer-validator.js";

class CustomerController {
  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const customer = await CustomerService.create(req.body, req.user.userId);

    return res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      data: customer,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const customers = await CustomerService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,

      search: req.query.search ? String(req.query.search) : undefined,

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
      message: "Customers fetched successfully.",
      data: customers,
    });
  };

  getById = async (req: Request, res: Response) => {
    const customer = await CustomerService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Customer fetched successfully.",
      data: customer,
    });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const customer = await CustomerService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      data: customer,
    });
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await CustomerService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully.",
    });
  };

  exportExcel = async (_req: Request, res: Response) => {
    const customers = await CustomerService.exportExcel();

    const buffer = await excelService.export({
      fileName: "Customers",
      sheetName: "Customers",

      columns: [
        {
          header: "Customer Code",
          key: "customerCode",
          width: 18,
          type: "string",
        },
        { header: "Customer Name", key: "name", width: 30, type: "string" },
        { header: "Mobile", key: "mobile", width: 18, type: "string" },
        {
          header: "Alternate Mobile",
          key: "alternateMobile",
          width: 18,
          type: "string",
        },
        { header: "Email", key: "email", width: 30, type: "string" },
        { header: "GST No", key: "gstNo", width: 20, type: "string" },
        { header: "Address", key: "address", width: 40, type: "string" },
        { header: "City", key: "city", width: 20, type: "string" },
        { header: "State", key: "state", width: 20, type: "string" },
        { header: "PIN Code", key: "pinCode", width: 12, type: "string" },
        {
          header: "Opening Balance",
          key: "openingBalance",
          width: 18,
          type: "currency",
        },
        { header: "Notes", key: "notes", width: 40, type: "string" },
        { header: "Created At", key: "createdAt", width: 22, type: "date" },
        { header: "Updated At", key: "updatedAt", width: 22, type: "date" },
      ],

      data: customers,
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Customers.xlsx"',
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

    const result = await excelService.import<CustomerExcelRow>(
      req.file,
      {
        "Customer Code": "customerCode",
        "Customer Name": "name",
        Mobile: "mobile",
        "Alternate Mobile": "alternateMobile",
        Email: "email",
        "GST No": "gstNo",
        Address: "address",
        City: "city",
        State: "state",
        "PIN Code": "pinCode",
        "Opening Balance": "openingBalance",
        Notes: "notes",
        Status: "status",
      },
      transformCustomerRows,
      validateCustomerRows,
    );

    // Validation failed
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Authentication check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Import into database
    const summary = await CustomerService.bulkImport(
      result.rows,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Customers imported successfully.",
      summary,
    });
  };
}

export default new CustomerController();
