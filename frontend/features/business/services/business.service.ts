import { businessApi } from "../api/business.api";

import type {
  Business,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "../types/business.types";

class BusinessService {
  /* -------------------------------------------------------------------------- */
  /*                                  Create                                    */
  /* -------------------------------------------------------------------------- */

  async create(payload: CreateBusinessRequest): Promise<Business> {
    const { data } = await businessApi.create(payload);

    return data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                            Current Business                                */
  /* -------------------------------------------------------------------------- */

  async getCurrent(): Promise<Business | null> {
    const { data } = await businessApi.getCurrent();

    return data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                            My Businesses                                   */
  /* -------------------------------------------------------------------------- */

  async getMine(): Promise<Business[]> {
    const { data } = await businessApi.getMine();

    return data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                            Switch Business                                 */
  /* -------------------------------------------------------------------------- */

  async switchBusiness(id: string): Promise<Business> {
    const { data } = await businessApi.switchBusiness(id);

    return data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                               Search                                       */
  /* -------------------------------------------------------------------------- */

  async search(query: string): Promise<Business[]> {
    const { data } = await businessApi.search(query);

    return data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                                Update                                      */
  /* -------------------------------------------------------------------------- */

  async update(id: string, payload: UpdateBusinessRequest): Promise<Business> {
    const { data } = await businessApi.update(id, payload);

    return data.data;
  }
}

const businessService = new BusinessService();

export default businessService;
