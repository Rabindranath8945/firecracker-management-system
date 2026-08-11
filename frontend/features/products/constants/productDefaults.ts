import type { ProductFormData } from "../schemas/product.schema";

export function getProductDefaultValues(): ProductFormData {
  return {
    productCode: "",

    name: "",

    barcode: "",

    category: "",

    subCategory: "",

    purchasePrice: 0,

    sellingPrice: 0,

    stock: 0,

    minimumStock: 0,

    unit: "PCS",

    hsnCode: "",

    tax: 18,

    brand: "",

    description: "",

    isActive: true,
  };
}
