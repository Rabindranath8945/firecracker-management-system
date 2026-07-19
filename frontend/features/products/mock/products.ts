import type { Product } from "../types/product.types";

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: "1",
    sku: "FP001",
    barcode: "890000001",

    name: "Flower Pot Big",
    category: "Flower Pot",

    purchasePrice: 120,
    sellingPrice: 150,
    mrp: 160,

    stock: 100,
    minimumStock: 10,

    unit: "Box",

    gst: 18,

    status: "ACTIVE",
  },

  {
    _id: "2",
    sku: "RK001",
    barcode: "890000002",

    name: "Rocket Deluxe",
    category: "Rocket",

    purchasePrice: 220,
    sellingPrice: 260,
    mrp: 280,

    stock: 50,
    minimumStock: 5,

    unit: "Box",

    gst: 18,

    status: "ACTIVE",
  },
];
