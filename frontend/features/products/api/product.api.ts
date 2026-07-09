import axios from "axios";

export interface CreateProductRequest {
  name: string;
  sku: string;
  barcode?: string;
  category: string;

  purchasePrice: number;
  sellingPrice: number;
  mrp: number;

  openingStock: number;
  minimumStock: number;

  unit: string;

  brand?: string;
  hsn?: string;
  gst: number;

  description?: string;

  active: boolean;
}

export const productApi = {
  async create(data: CreateProductRequest) {
    return axios.post("/products", data);
  },

  async update(id: string, data: CreateProductRequest) {
    return axios.put(`/products/${id}`, data);
  },

  async getAll() {
    return axios.get("/products");
  },

  async getById(id: string) {
    return axios.get(`/products/${id}`);
  },

  async remove(id: string) {
    return axios.delete(`/products/${id}`);
  },
};
