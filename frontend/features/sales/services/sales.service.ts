import api from "@/lib/api";

import type {
  Sale,
  SaleFormData,
  SalesSummary,
  SalesListResponse,
  SalesQueryParams,
} from "../types/Sales.types";

class SalesService {
  /* ------------------------------------------------------------------------ */
  /* Summary                                                                  */
  /* ------------------------------------------------------------------------ */

  async getSummary(): Promise<SalesSummary> {
    const response = await api.get("/sales/summary");

    return response.data.data;
  }

  /* ------------------------------------------------------------------------ */
  /* Next Sale Code                                                           */
  /* ------------------------------------------------------------------------ */

  async getNextCode(): Promise<string> {
    const response = await api.get("/sales/next-code");

    return response.data.data.saleNo;
  }

  /* ------------------------------------------------------------------------ */
  /* List                                                                      */
  /* ------------------------------------------------------------------------ */

  async getSales(params: SalesQueryParams = {}): Promise<Sale[]> {
    const response = await api.get("/sales", {
      params,
    });

    return response.data.data.items;
  }

  /* ------------------------------------------------------------------------ */
  /* Details                                                                   */
  /* ------------------------------------------------------------------------ */

  async getSale(id: string): Promise<Sale> {
    const response = await api.get(`/sales/${id}`);

    return response.data.data;
  }

  /* ------------------------------------------------------------------------ */
  /* Next Invoice Number                                                       */
  /* ------------------------------------------------------------------------ */

  async getNextInvoiceNumber(): Promise<string> {
    const response = await api.get("/sales/next-code");

    return response.data.data.invoiceNumber;
  }

  /* ------------------------------------------------------------------------ */
  /* Create                                                                    */
  /* ------------------------------------------------------------------------ */

  async createSale(data: SaleFormData): Promise<Sale> {
    const response = await api.post("/sales", data);

    return response.data.data.sale;
  }

  /* ------------------------------------------------------------------------ */
  /* Update                                                                    */
  /* ------------------------------------------------------------------------ */

  async updateSale(id: string, data: SaleFormData): Promise<Sale> {
    const response = await api.put(`/sales/${id}`, data);

    return response.data.data;
  }

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                    */
  /* ------------------------------------------------------------------------ */

  async deleteSale(id: string): Promise<void> {
    await api.delete(`/sales/${id}`);
  }
}

export default new SalesService();
