import { Types } from "mongoose";

import SupplierRepository from "../repositories/supplier.repository.js";
import { SupplierExcelRow } from "../../../common/excel/types/supplier-excel-row.types.js";
import { ISupplier } from "../interfaces/supplier.interface.js";

import {
  CreateSupplierDto,
  UpdateSupplierDto,
} from "../validators/supplier.validator.js";

interface SupplierQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class SupplierService {
  async create(data: CreateSupplierDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const supplierCodeExists = await SupplierRepository.findByCode(
      data.supplierCode,
    );

    if (supplierCodeExists) {
      throw new Error("Supplier code already exists.");
    }

    const mobileExists = await SupplierRepository.findByMobile(data.mobile);

    if (mobileExists) {
      throw new Error("Mobile number already exists.");
    }

    return SupplierRepository.create({
      ...data,
      createdBy: new Types.ObjectId(userId),
    });
  }

  async getAll(query: SupplierQuery) {
    return SupplierRepository.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 20,

      search: query.search,

      sort: query.sort,
      order: query.order,

      isActive: query.isActive ?? true,
    });
  }

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

  async update(id: string, data: UpdateSupplierDto, userId: string) {
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

    if (data.supplierCode && data.supplierCode !== supplier.supplierCode) {
      const exists = await SupplierRepository.findByCode(data.supplierCode);

      if (exists) {
        throw new Error("Supplier code already exists.");
      }
    }

    if (data.mobile && data.mobile !== supplier.mobile) {
      const exists = await SupplierRepository.findByMobile(data.mobile);

      if (exists) {
        throw new Error("Mobile number already exists.");
      }
    }

    return SupplierRepository.update(id, {
      ...data,
      updatedBy: new Types.ObjectId(userId),
    });
  }

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

    return SupplierRepository.update(id, {
      isActive: false,
      updatedBy: new Types.ObjectId(userId),
    });
  }

  // Future Ready
  async exportExcel() {
    return SupplierRepository.findAllForExport();
  }

  async bulkImport(rows: SupplierExcelRow[], userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

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

    const existingCodes = new Set(
      existingSuppliers.map((supplier) => supplier.supplierCode),
    );

    const existingMobileNumbers = new Set(
      existingMobiles.map((supplier) => supplier.mobile),
    );

    const suppliers: Partial<ISupplier>[] = [];

    const errors: {
      row: number;
      field: string;
      message: string;
    }[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      if (existingCodes.has(row.supplierCode)) {
        errors.push({
          row: index + 2,
          field: "supplierCode",
          message: `Supplier code '${row.supplierCode}' already exists.`,
        });
        continue;
      }

      if (row.mobile && existingMobileNumbers.has(row.mobile)) {
        errors.push({
          row: index + 2,
          field: "mobile",
          message: `Mobile '${row.mobile}' already exists.`,
        });
        continue;
      }

      existingCodes.add(row.supplierCode);

      if (row.mobile) {
        existingMobileNumbers.add(row.mobile);
      }

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

    if (suppliers.length > 0) {
      await SupplierRepository.bulkCreate(suppliers);
    }

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
