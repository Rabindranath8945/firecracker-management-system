import { Request, Response } from "express";

import SupplierRepository from "../repositories/supplier.repository.js";
import SupplierService from "../services/supplier.service.js";

import { generateSequenceCode } from "../../../common/utils/generate-code.js";

import { excelService } from "../../../common/excel/index.js";
import { SupplierExcelRow } from "../../../common/excel/types/supplier-excel-row.types.js";

import { transformSupplierRows } from "../excel/supplier-transformer.js";
import { validateSupplierRows } from "../excel/supplier-validator.js";

class SupplierController {
  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                 */
  /* ---------------------------------------------------------------------- */

  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const suppliers = await SupplierRepository.find();

    const supplierCode = generateSequenceCode(
      suppliers.map((supplier) => supplier.supplierCode),
      "SUP",
    );

    const supplier = await SupplierService.create(
      {
        ...req.body,
        supplierCode,
      },
      req.user.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Supplier created successfully.",
      data: supplier,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* GET ALL                                                                */
  /* ---------------------------------------------------------------------- */

  getAll = async (req: Request, res: Response) => {
    const suppliers = await SupplierService.getAll({
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
      message: "Suppliers fetched successfully.",
      data: suppliers,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* GET BY ID                                                              */
  /* ---------------------------------------------------------------------- */

  getById = async (req: Request, res: Response) => {
    const supplier = await SupplierService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Supplier fetched successfully.",
      data: supplier,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* GET BALANCE                                                             */
  /* ---------------------------------------------------------------------- */

  getBalance = async (req: Request, res: Response) => {
    const balance = await SupplierService.getBalance(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Supplier balance fetched successfully.",
      data: balance,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const supplier = await SupplierService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully.",
      data: supplier,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                 */
  /* ---------------------------------------------------------------------- */

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await SupplierService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully.",
    });
  };

  /* ---------------------------------------------------------------------- */
  /* EXPORT EXCEL                                                           */
  /* ---------------------------------------------------------------------- */

  exportExcel = async (_req: Request, res: Response) => {
    const suppliers = await SupplierService.exportExcel();

    const buffer = await excelService.export({
      fileName: "Suppliers",
      sheetName: "Suppliers",

      columns: [
        {
          header: "Supplier Code",
          key: "supplierCode",
          width: 18,
          type: "string",
        },
        {
          header: "Supplier Name",
          key: "name",
          width: 30,
          type: "string",
        },
        {
          header: "Mobile",
          key: "mobile",
          width: 18,
          type: "string",
        },
        {
          header: "Alternate Mobile",
          key: "alternateMobile",
          width: 18,
          type: "string",
        },
        {
          header: "Email",
          key: "email",
          width: 30,
          type: "string",
        },
        {
          header: "GST No",
          key: "gstNo",
          width: 20,
          type: "string",
        },
        {
          header: "Address",
          key: "address",
          width: 40,
          type: "string",
        },
        {
          header: "City",
          key: "city",
          width: 20,
          type: "string",
        },
        {
          header: "State",
          key: "state",
          width: 20,
          type: "string",
        },
        {
          header: "PIN Code",
          key: "pinCode",
          width: 12,
          type: "string",
        },
        {
          header: "Opening Balance",
          key: "openingBalance",
          width: 18,
          type: "currency",
        },
        {
          header: "Notes",
          key: "notes",
          width: 40,
          type: "string",
        },
        {
          header: "Created At",
          key: "createdAt",
          width: 22,
          type: "date",
        },
        {
          header: "Updated At",
          key: "updatedAt",
          width: 22,
          type: "date",
        },
      ],

      data: suppliers,
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Suppliers.xlsx"',
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    return res.end(buffer);
  };

  /* ---------------------------------------------------------------------- */
  /* IMPORT EXCEL                                                           */
  /* ---------------------------------------------------------------------- */

  importExcel = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required.",
      });
    }

    const result = await excelService.import<SupplierExcelRow>(
      req.file,
      {
        "Supplier Code": "supplierCode",
        "Supplier Name": "name",
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
      transformSupplierRows,
      validateSupplierRows,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const summary = await SupplierService.bulkImport(
      result.rows,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Suppliers imported successfully.",
      summary,
    });
  };
}

export default new SupplierController();
