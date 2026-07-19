import { generateSku } from "../utils/generateSku";
import type { ProductFormData } from "../schemas/product.schema";

export function getProductDefaultValues(): ProductFormData {
  return {
    name: "",
    sku: generateSku(),
    barcode: "",
    category: "",

    purchasePrice: 0,
    sellingPrice: 0,
    // mrp: undefined,

    openingStock: 0,
    minimumStock: 0,
    unit: "piece",

    brand: "",
    hsn: "",
    gst: 18,

    description: "",

    active: true,
  };
}
