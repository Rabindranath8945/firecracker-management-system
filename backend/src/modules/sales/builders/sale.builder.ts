import ProductRepository from "../../product/repositories/product.repository.js";
import InventoryService from "../../inventory/index.js";

import { calculateSaleItem } from "../helpers/sale-item-calculator.js";
import { calculateSaleTotals } from "../helpers/sales-calculator.js";

import { buildSaleItemSnapshot } from "../mappers/sale-item.mapper.js";

export async function buildSale(
  items: {
    product: string;
    quantity: number;
    sellingPrice: number;
    discount: number;
    tax: number;
  }[],
) {
  const saleItems = [];

  for (const item of items) {
    await InventoryService.validateStock(item.product, item.quantity);

    const product = await ProductRepository.findById(item.product);

    if (!product) {
      throw new Error("Product not found.");
    }

    const calculation = calculateSaleItem({
      quantity: item.quantity,

      purchasePrice: product.purchasePrice,

      sellingPrice: item.sellingPrice,

      discount: item.discount,

      tax: item.tax,
    });

    saleItems.push(buildSaleItemSnapshot(product, item, calculation));
  }

  const totals = calculateSaleTotals({
    items: saleItems,

    discount: 0,
  });

  return {
    saleItems,

    totals,
  };
}
