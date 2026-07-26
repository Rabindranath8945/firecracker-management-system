import SettingsRepository from "../../settings/repositories/settings.repository.js";
import SecurityRepository from "../../security/repositories/security.repository.js";

import CategoryRepository from "../../category/repositories/category.repository.js";
import SubCategoryRepository from "../../sub-category/repositories/sub-category.repository.js";

import ProductRepository from "../../product/repositories/product.repository.js";

import CustomerRepository from "../../customer/repositories/customer.repository.js";
import SupplierRepository from "../../supplier/repositories/supplier.repository.js";

import ExpenseRepository from "../../expense/repositories/expense.repository.js";

import PurchaseRepository from "../../purchase/repositories/purchase.repository.js";

import SalesRepository from "../../sales/repositories/sales.repository.js";

export async function exportDatabase() {
  const [
    settings,
    security,
    categories,
    subCategories,
    products,
    customers,
    suppliers,
    expenses,
    purchases,
    sales,
  ] = await Promise.all([
    SettingsRepository.find(),

    SecurityRepository.find(),

    CategoryRepository.find(),

    SubCategoryRepository.find(),

    ProductRepository.find(),

    CustomerRepository.find(),

    SupplierRepository.find(),

    ExpenseRepository.find(),

    PurchaseRepository.find(),

    SalesRepository.find(),
  ]);

  return {
    metadata: {
      version: "1.0.0",

      exportedAt: new Date(),
    },

    data: {
      settings,
      security,
      categories,
      subCategories,
      products,
      customers,
      suppliers,
      expenses,
      purchases,
      sales,
    },
  };
}
