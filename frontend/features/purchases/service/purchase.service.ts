import api from "@/lib/api";

class PurchaseService {
  async getPurchase(id: string) {
    const response = await api.get(`/purchases/${id}`);

    return response.data.data;
  }
}

export default new PurchaseService();
