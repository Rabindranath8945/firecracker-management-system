import type { Product } from "../types/product.types";
import type { ProductFormData } from "../schemas/product.schema";

export function toFormValues(product: Product): ProductFormData {
  return {
    name: product.name,

    productCode: product.productCode,

    barcode: product.barcode ?? "",

    category: product.category?._id ?? "",

    subCategory: product.subCategory?._id ?? "",

    purchasePrice: product.purchasePrice,

    sellingPrice: product.sellingPrice,

    stock: product.stock,

    minimumStock: product.minimumStock,

    unit: product.unit,

    hsnCode: product.hsnCode ?? "",

    tax: product.tax,

    brand: product.brand ?? "",

    image: product.image ?? "",

    description: product.description ?? "",

    isActive: product.isActive,
  };
}
