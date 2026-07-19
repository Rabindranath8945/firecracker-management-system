import axios from "axios";

export interface PurchaseItemRequest {
  productId: string;

  quantity: number;

  purchasePrice: number;
  sellingPrice: number;

  discount: number;
  gstRate: number;
}

export interface CreatePurchaseRequest {
  supplierId: string;

  invoiceNo?: string;

  purchaseDate: string;
  dueDate?: string;

  paymentStatus: "PAID" | "PARTIAL" | "UNPAID";

  transportCharge: number;

  paidAmount: number;

  notes?: string;

  items: PurchaseItemRequest[];
}

export const purchaseApi = {
  async create(data: CreatePurchaseRequest) {
    return axios.post("/purchases", data);
  },

  async update(id: string, data: CreatePurchaseRequest) {
    return axios.put(`/purchases/${id}`, data);
  },

  async getAll() {
    return axios.get("/purchases");
  },

  async getById(id: string) {
    return axios.get(`/purchases/${id}`);
  },

  async remove(id: string) {
    return axios.delete(`/purchases/${id}`);
  },
};
