import ProductRepository from "../../product/repositories/product.repository.js";
import InventoryService from "../../inventory/index.js";
import SettingsRepository from "../../settings/repositories/settings.repository.js";

import { calculateSaleItem } from "../helpers/sale-item-calculator.js";
import { calculateSaleTotals } from "../helpers/sales-calculator.js";

import { buildSaleItemSnapshot } from "../mappers/sale-item.mapper.js";

import type { CreateSaleInput } from "../validators/sales.validator.js";

export async function buildSale(
  items: CreateSaleInput["items"],
  invoiceDiscount: number = 0,
  userId: string,
) {
  /* ---------------------------------------------------------------------- */
  /* Load authenticated user's tax settings                                */
  /* ---------------------------------------------------------------------- */

  const settings = await SettingsRepository.findByUserId(userId);

  if (!settings) {
    throw new Error("Settings not found for the authenticated user.");
  }

  const gstEnabled = settings.tax?.enabled ?? false;

  const defaultGST = Number(settings.tax?.defaultGST ?? 0);

  const saleItems = [];

  /* ---------------------------------------------------------------------- */
  /* Build sale items                                                       */
  /* ---------------------------------------------------------------------- */

  for (const item of items) {
    await InventoryService.validateStock(item.product, item.quantity);

    const product = await ProductRepository.findById(item.product);

    if (!product) {
      throw new Error("Product not found.");
    }

    const sellingPrice = product.sellingPrice;

    const purchasePrice = product.purchasePrice;

    /* ------------------------------------------------------------------ */
    /* GST priority                                                        */
    /* ------------------------------------------------------------------ */
    /*
     * GST OFF
     *     → 0%
     *
     * GST ON + product GST configured
     *     → product.tax
     *
     * GST ON + product GST is 0
     *     → default GST from Settings
     */

    const tax = gstEnabled ? (product.tax > 0 ? product.tax : defaultGST) : 0;

    const discount = 0;

    /* ------------------------------------------------------------------ */
    /* Calculate item                                                      */
    /* ------------------------------------------------------------------ */

    const calculation = calculateSaleItem({
      quantity: item.quantity,

      purchasePrice,

      sellingPrice,

      discount,

      tax,
    });

    /* ------------------------------------------------------------------ */
    /* Create item snapshot                                                */
    /* ------------------------------------------------------------------ */

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

  /* ---------------------------------------------------------------------- */
  /* Calculate totals                                                       */
  /* ---------------------------------------------------------------------- */

  const totals = calculateSaleTotals({
    items: saleItems,

    discount: Math.max(0, invoiceDiscount),
  });

  return {
    saleItems,

    totals,
  };
}
