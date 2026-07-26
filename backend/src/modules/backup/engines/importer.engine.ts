import MergeEngine from "./merge.engine.js";

import ProductRepository from "../../product/repositories/product.repository.js";
import CategoryRepository from "../../category/repositories/category.repository.js";
import SubCategoryRepository from "../../sub-category/repositories/sub-category.repository.js";
import CustomerRepository from "../../customer/repositories/customer.repository.js";
import SupplierRepository from "../../supplier/repositories/supplier.repository.js";
import PurchaseRepository from "../../purchase/repositories/purchase.repository.js";
import SalesRepository from "../../sales/repositories/sales.repository.js";
import ExpenseRepository from "../../expense/repositories/expense.repository.js";

interface BackupPayload {
  metadata: {
    version: string;
    businessId: string;
  };

  data: {
    categories: any[];
    subCategories: any[];
    products: any[];
    customers: any[];
    suppliers: any[];
    expenses: any[];
    purchases: any[];
    sales: any[];
  };
}

class ImporterEngine {
  async merge(backup: BackupPayload) {
    await this.mergeCategories(backup.data.categories);
    await this.mergeSubCategories(backup.data.subCategories);
    await this.mergeProducts(backup.data.products);
    await this.mergeCustomers(backup.data.customers);
    await this.mergeSuppliers(backup.data.suppliers);
    await this.mergeExpenses(backup.data.expenses);
    await this.mergePurchases(backup.data.purchases);
    await this.mergeSales(backup.data.sales);

    return {
      success: true,
    };
  }

  private async mergeCategories(data: any[]) {
    const database = await CategoryRepository.find();

    const result = MergeEngine.merge({
      backup: data,
      database,
      getKey: (item) => item.name,
    });

    if (result.inserted.length) {
      await CategoryRepository.bulkCreate(result.inserted);
    }

    return result;
  }

  async replace(backup: BackupPayload) {
    const businessId = backup.metadata.businessId;

    await Promise.all([
      SalesRepository.clearBusinessData(businessId),
      PurchaseRepository.clearBusinessData(businessId),
      ExpenseRepository.clearBusinessData(businessId),
      ProductRepository.clearBusinessData(businessId),
      CustomerRepository.clearBusinessData(businessId),
      SupplierRepository.clearBusinessData(businessId),
      CategoryRepository.clearBusinessData(businessId),
      SubCategoryRepository.clearBusinessData(businessId),
    ]);

    return this.merge(backup);
  }

  private async mergeSubCategories(data: any[]) {
    const database = await SubCategoryRepository.find();

    const result = MergeEngine.merge({
      backup: data,
      database,
      getKey: (item) => item.name,
    });

    if (result.inserted.length) {
      await SubCategoryRepository.bulkCreate(result.inserted);
    }

    return result;
  }

  private async mergeProducts(data: any[]) {
    const database = await ProductRepository.find();

    const result = MergeEngine.merge({
      backup: data,
      database,
      getKey: (item) => item.productCode,
    });

    if (result.inserted.length > 0) {
      await ProductRepository.bulkCreate(result.inserted);
    }

    return result;
  }

  private async mergeCustomers(data: any[]) {
    const database = await CustomerRepository.find();

    const result = MergeEngine.merge({
      backup: data,
      database,
      getKey: (item) => item.mobile,
    });

    if (result.inserted.length) {
      await CustomerRepository.bulkCreate(result.inserted);
    }

    return result;
  }

  private async mergeSuppliers(data: any[]) {
    const database = await SupplierRepository.find();

    const result = MergeEngine.merge({
      backup: data,
      database,
      getKey: (item) => item.mobile,
    });

    if (result.inserted.length) {
      await SupplierRepository.bulkCreate(result.inserted);
    }

    return result;
  }

  private async mergeExpenses(data: any[]) {
    const database = await ExpenseRepository.find();

    const result = MergeEngine.merge({
      backup: data,
      database,
      getKey: (item) => item.expenseCode,
    });

    if (result.inserted.length) {
      await ExpenseRepository.bulkCreate(result.inserted);
    }

    return result;
  }

  private async mergePurchases(data: any[]) {
    const database = await PurchaseRepository.find();

    const result = MergeEngine.merge({
      backup: data,
      database,
      getKey: (item) => item.purchaseCode,
    });

    if (result.inserted.length) {
      await PurchaseRepository.bulkCreate(result.inserted);
    }

    return result;
  }

  private async mergeSales(data: any[]) {
    const database = await SalesRepository.find();

    const result = MergeEngine.merge({
      backup: data,
      database,
      getKey: (item) => item.invoiceNo,
    });

    if (result.inserted.length) {
      await SalesRepository.bulkCreate(result.inserted);
    }

    return result;
  }
}

export default new ImporterEngine();
