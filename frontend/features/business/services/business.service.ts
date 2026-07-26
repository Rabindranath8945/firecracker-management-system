import { businessApi } from "../api/business.api";

import type {
  Business,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "../types/business.types";

class BusinessService {
  async create(payload: CreateBusinessRequest): Promise<Business> {
    const response = await businessApi.create(payload);

    return response.data.data;
  }

  async getMine(): Promise<Business> {
    const response = await businessApi.getMine();

    return response.data.data;
  }

  async search(query: string): Promise<Business> {
    const response = await businessApi.search(query);

    return response.data.data;
  }

  async update(id: string, payload: UpdateBusinessRequest): Promise<Business> {
    const response = await businessApi.update(id, payload);

    return response.data.data;
  }
}

export default new BusinessService();
