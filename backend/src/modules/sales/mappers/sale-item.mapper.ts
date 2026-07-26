import { Types } from "mongoose";

import { IProduct } from "../../product/interfaces/product.interface.js";
import { SaleItemCalculationResult } from "../helpers/sale-item-calculator.js";

interface SaleItemInput {
  quantity: number;

  sellingPrice: number;

  discount: number;

  tax: number;
}

export function buildSaleItemSnapshot(
  product: IProduct & {
    _id: Types.ObjectId;
  },
  item: SaleItemInput,
  calculation: SaleItemCalculationResult,
) {
  return {
    product: product._id,

    productCode: product.productCode,

    productName: product.name,

    barcode: product.barcode ?? "",

    hsnCode: product.hsnCode ?? "",

    brand: product.brand ?? "",

    category: product.category,

    subCategory: product.subCategory,

    unit: product.unit,

    purchasePrice: product.purchasePrice,

    sellingPrice: item.sellingPrice,

    quantity: item.quantity,

    discount: item.discount,

    productTax: product.tax,

    tax: item.tax,

    total: calculation.total,
  };
}
