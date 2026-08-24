import { Types } from "mongoose";

import CustomerRepository from "../repositories/customer.repository.js";
import Customer from "../models/customer.model.js";
import { ICustomer } from "../interfaces/customer.interface.js";
import { CustomerExcelRow } from "../../../common/excel/types/customer-excel-row.types.js";
import SettingsRepository from "../../settings/repositories/settings.repository.js";
import { generateSequenceCode } from "../../../common/utils/generate-code.js";

import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "../validators/customer.validator.js";

interface CustomerQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class CustomerService {
  async create(data: CreateCustomerDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const mobileExists = await CustomerRepository.findByMobile(data.mobile);

    if (mobileExists) {
      throw new Error("Mobile number already exists.");
    }

    const prefix = await SettingsRepository.getNumberingPrefix(
      userId,
      "customer",
    );

    const customers = await CustomerRepository.findCodes();

    const customerCode = generateSequenceCode(
      customers
        .map((customer) => customer.customerCode)
        .filter((code): code is string => Boolean(code)),
      prefix,
    );

    return CustomerRepository.create({
      ...data,
      customerCode,
      createdBy: new Types.ObjectId(userId),
    });
  }

  async bulkCreate(customers: Partial<ICustomer>[]) {
    return Customer.insertMany(customers, {
      ordered: false,
    });
  }

  async findByMobiles(mobiles: string[]) {
    return Customer.find({
      mobile: {
        $in: mobiles,
      },
    }).select("mobile");
  }

  async findDuplicateName(name: string) {
    return CustomerRepository.findByName(name);
  }

  async findAllForExport() {
    return Customer.find({
      isActive: true,
    }).sort({
      name: 1,
    });
  }

  async getAll(query: CustomerQuery) {
    return CustomerRepository.findAll({
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
      throw new Error("Invalid customer id.");
    }

    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return customer;
  }

  async update(id: string, data: UpdateCustomerDto, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid customer id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    if (data.customerCode && data.customerCode !== customer.customerCode) {
      const exists = await CustomerRepository.findByCode(data.customerCode);

      if (exists) {
        throw new Error("Customer code already exists.");
      }
    }

    if (data.mobile && data.mobile !== customer.mobile) {
      const exists = await CustomerRepository.findByMobile(data.mobile);

      if (exists) {
        throw new Error("Mobile number already exists.");
      }
    }

    return CustomerRepository.update(id, {
      ...data,
      updatedBy: new Types.ObjectId(userId),
    });
  }

  async delete(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid customer id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return CustomerRepository.update(id, {
      isActive: false,
      updatedBy: new Types.ObjectId(userId),
    });
  }
  async exportExcel() {
    return CustomerRepository.findAllForExport();
  }

  async bulkImport(rows: CustomerExcelRow[], userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const customerCodes = rows
      .map((row) => row.customerCode)
      .filter((code): code is string => Boolean(code));

    const mobiles = rows
      .map((row) => row.mobile)
      .filter((mobile): mobile is string => Boolean(mobile));

    const [existingCustomers, existingMobiles] = await Promise.all([
      CustomerRepository.findByCodes(customerCodes),
      CustomerRepository.findByMobiles(mobiles),
    ]);

    const existingCodes = new Set(
      existingCustomers.map((customer) => customer.customerCode),
    );

    const existingMobileNumbers = new Set(
      existingMobiles.map((customer) => customer.mobile),
    );

    const customers: Partial<ICustomer>[] = [];

    const errors: {
      row: number;
      field: string;
      message: string;
    }[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      // Duplicate customer code
      if (existingCodes.has(row.customerCode)) {
        errors.push({
          row: index + 2,
          field: "customerCode",
          message: `Customer code '${row.customerCode}' already exists.`,
        });

        continue;
      }

      // Duplicate mobile
      if (row.mobile && existingMobileNumbers.has(row.mobile)) {
        errors.push({
          row: index + 2,
          field: "mobile",
          message: `Mobile '${row.mobile}' already exists.`,
        });

        continue;
      }

      // Prevent duplicates inside the same Excel file
      existingCodes.add(row.customerCode);
      if (row.mobile) {
        existingMobileNumbers.add(row.mobile);
      }

      customers.push({
        customerCode: row.customerCode,
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
    if (customers.length > 0) {
      await CustomerRepository.bulkCreate(customers);
    }

    return {
      success: errors.length === 0,

      total: rows.length,

      imported: customers.length,

      skipped: rows.length - customers.length,

      errors,
    };
  }
}

export default new CustomerService();
