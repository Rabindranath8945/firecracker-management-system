import { Types } from "mongoose";

import SupplierRepository from "../repositories/supplier.repository.js";

import { SupplierExcelRow } from "../../../common/excel/types/supplier-excel-row.types.js";
import { ISupplier } from "../interfaces/supplier.interface.js";

import SettingsRepository from "../../settings/repositories/settings.repository.js";
import { generateSequenceCode } from "../../../common/utils/generate-code.js";

import {
  CreateSupplierDto,
  UpdateSupplierDto,
} from "../validators/supplier.validator.js";

/* -------------------------------------------------------------------------- */
/*                              Query Options                                 */
/* -------------------------------------------------------------------------- */

interface SupplierQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class SupplierService {
  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async create(data: CreateSupplierDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const prefix = await SettingsRepository.getNumberingPrefix(
      userId,
      "supplier",
    );

    const suppliers = await SupplierRepository.findCodes();

    const supplierCode = generateSequenceCode(
      suppliers
        .map((supplier) => supplier.supplierCode)
        .filter((code): code is string => Boolean(code)),
      prefix,
    );

    const mobileExists = await SupplierRepository.findByMobile(data.mobile);

    if (mobileExists) {
      throw new Error("Mobile number already exists.");
    }

    return SupplierRepository.create({
      ...data,

      supplierCode,

      createdBy: new Types.ObjectId(userId),
    });
  }

  /* ---------------------------------------------------------------------- */
  /* GET ALL                                                                */
  /* ---------------------------------------------------------------------- */

  async getAll(query: SupplierQuery = {}) {
    return SupplierRepository.findAll({
      page: query.page ?? 1,

      limit: query.limit ?? 20,

      search: query.search,

      sort: query.sort,

      order: query.order,

      isActive: query.isActive ?? true,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* GET BY ID                                                              */
  /* ---------------------------------------------------------------------- */

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid supplier id.");
    }

    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    return supplier;
  }

  /* ---------------------------------------------------------------------- */
  /* GET BALANCE                                                            */
  /* ---------------------------------------------------------------------- */

  async getBalance(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid supplier id.");
    }

    return SupplierRepository.getBalance(id);
  }

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async update(id: string, data: UpdateSupplierDto, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid supplier id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    /* -------------------------------------------------------------------- */
    /* Existing Supplier                                                    */
    /* -------------------------------------------------------------------- */

    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    /* -------------------------------------------------------------------- */
    /* Supplier Code                                                        */
    /* -------------------------------------------------------------------- */

    if (data.supplierCode && data.supplierCode !== supplier.supplierCode) {
      const exists = await SupplierRepository.findByCode(data.supplierCode);

      if (exists) {
        throw new Error("Supplier code already exists.");
      }
    }

    /* -------------------------------------------------------------------- */
    /* Mobile                                                               */
    /* -------------------------------------------------------------------- */

    if (data.mobile && data.mobile !== supplier.mobile) {
      const exists = await SupplierRepository.findByMobile(data.mobile);

      if (exists) {
        throw new Error("Mobile number already exists.");
      }
    }

    /* -------------------------------------------------------------------- */
    /* Update                                                               */
    /* -------------------------------------------------------------------- */

    return SupplierRepository.update(id, {
      ...data,

      updatedBy: new Types.ObjectId(userId),
    });
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE / DEACTIVATE                                                    */
  /* ---------------------------------------------------------------------- */

  async delete(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid supplier id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    /*
     * Soft delete.
     *
     * We do not physically delete the supplier because existing purchases
     * must continue to retain their supplier relationship and ledger history.
     */

    return SupplierRepository.update(id, {
      isActive: false,

      updatedBy: new Types.ObjectId(userId),
    });
  }

  /* ---------------------------------------------------------------------- */
  /* EXPORT                                                                 */
  /* ---------------------------------------------------------------------- */

  async exportExcel() {
    return SupplierRepository.findAllForExport();
  }

  /* ---------------------------------------------------------------------- */
  /* BULK IMPORT                                                            */
  /* ---------------------------------------------------------------------- */

  async bulkImport(rows: SupplierExcelRow[], userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    /* -------------------------------------------------------------------- */
    /* Collect Existing Codes / Mobiles                                     */
    /* -------------------------------------------------------------------- */

    const supplierCodes = rows
      .map((row) => row.supplierCode)
      .filter((code): code is string => Boolean(code));

    const mobiles = rows
      .map((row) => row.mobile)
      .filter((mobile): mobile is string => Boolean(mobile));

    const [existingSuppliers, existingMobiles] = await Promise.all([
      SupplierRepository.findByCodes(supplierCodes),

      SupplierRepository.findByMobiles(mobiles),
    ]);

    /* -------------------------------------------------------------------- */
    /* Existing Sets                                                        */
    /* -------------------------------------------------------------------- */

    const existingCodes = new Set(
      existingSuppliers.map((supplier) => supplier.supplierCode),
    );

    const existingMobileNumbers = new Set(
      existingMobiles.map((supplier) => supplier.mobile),
    );

    /* -------------------------------------------------------------------- */
    /* Prepare Import                                                       */
    /* -------------------------------------------------------------------- */

    const suppliers: Partial<ISupplier>[] = [];

    const errors: {
      row: number;
      field: string;
      message: string;
    }[] = [];

    /* -------------------------------------------------------------------- */
    /* Validate Rows                                                        */
    /* -------------------------------------------------------------------- */

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      /* ------------------------------------------------------------------ */
      /* Supplier Code                                                      */
      /* ------------------------------------------------------------------ */

      if (existingCodes.has(row.supplierCode)) {
        errors.push({
          row: index + 2,

          field: "supplierCode",

          message: `Supplier code '${row.supplierCode}' already exists.`,
        });

        continue;
      }

      /* ------------------------------------------------------------------ */
      /* Mobile                                                              */
      /* ------------------------------------------------------------------ */

      if (row.mobile && existingMobileNumbers.has(row.mobile)) {
        errors.push({
          row: index + 2,

          field: "mobile",

          message: `Mobile '${row.mobile}' already exists.`,
        });

        continue;
      }

      /* ------------------------------------------------------------------ */
      /* Prevent Duplicate Rows Inside Same Excel File                     */
      /* ------------------------------------------------------------------ */

      existingCodes.add(row.supplierCode);

      if (row.mobile) {
        existingMobileNumbers.add(row.mobile);
      }

      /* ------------------------------------------------------------------ */
      /* Prepare Supplier                                                   */
      /* ------------------------------------------------------------------ */

      suppliers.push({
        supplierCode: row.supplierCode,

        name: row.name,

        mobile: row.mobile,

        alternateMobile: row.alternateMobile,

        email: row.email,

        gstNo: row.gstNo,

        address: row.address,

        city: row.city,

        state: row.state,

        pinCode: row.pinCode,

        openingBalance: row.openingBalance,

        notes: row.notes,

        isActive: row.isActive,

        createdBy: new Types.ObjectId(userId),
      });
    }

    /* -------------------------------------------------------------------- */
    /* Insert                                                               */
    /* -------------------------------------------------------------------- */

    if (suppliers.length > 0) {
      await SupplierRepository.bulkCreate(suppliers);
    }

    /* -------------------------------------------------------------------- */
    /* Result                                                               */
    /* -------------------------------------------------------------------- */

    return {
      success: errors.length === 0,

      total: rows.length,

      imported: suppliers.length,

      skipped: rows.length - suppliers.length,

      errors,
    };
  }
}

export default new SupplierService();
