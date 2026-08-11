import ProductRepository from "../../product/repositories/product.repository.js";
import InventoryService from "../../inventory/index.js";

import { calculateSaleItem } from "../helpers/sale-item-calculator.js";
import { calculateSaleTotals } from "../helpers/sales-calculator.js";

import { buildSaleItemSnapshot } from "../mappers/sale-item.mapper.js";

import type { CreateSaleInput } from "../validators/sales.validator.js";

export async function buildSale(
  items: CreateSaleInput["items"],
  invoiceDiscount: number = 0,
) {
  const saleItems = [];

  for (const item of items) {
    await InventoryService.validateStock(item.product, item.quantity);

    const product = await ProductRepository.findById(item.product);

    if (!product) {
      throw new Error("Product not found.");
    }

    const sellingPrice = product.sellingPrice;

    const purchasePrice = product.purchasePrice;

    const tax = product.tax ?? 0;

    const discount = 0;

    const calculation = calculateSaleItem({
      quantity: item.quantity,
      purchasePrice,
      sellingPrice,
      discount,
      tax,
    });

    saleItems.push(
      buildSaleItemSnapshot(
        product,
        {
          ...item,
          sellingPrice,
          discount,
          tax,
        },
        calculation,
      ),
    );
  }

  const totals = calculateSaleTotals({
    items: saleItems,
    discount: Math.max(0, invoiceDiscount),
  });

  return {
    saleItems,
    totals,
  };
}
