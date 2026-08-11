import api from "@/lib/api";

import type {
  Customer,
  CustomerFormData,
  CustomerListResponse,
} from "../types/customer";

interface GetCustomersParams {
  search?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

class CustomerService {
  async getCustomers(
    params: GetCustomersParams = {},
  ): Promise<CustomerListResponse> {
    const response = await api.get("/customers", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,

        search:
          params.search && params.search.trim() !== ""
            ? params.search
            : undefined,

        isActive:
          params.status === "ALL" ? undefined : params.status === "ACTIVE",

        sort:
          params.sort && params.sort !== "NAME_ASC" ? params.sort : undefined,
      },
    });

    return response.data.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);

    return response.data.data;
  }

  async createCustomer(payload: CustomerFormData): Promise<Customer> {
    const response = await api.post("/customers", payload);

    return response.data.data;
  }

  async updateCustomer(
    id: string,
    payload: CustomerFormData,
  ): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, payload);

    return response.data.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  }
}

export default new CustomerService();
