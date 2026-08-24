import { userApi } from "../api/user.api";

import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  User,
} from "../types/user.types";

class UserService {
  /* ------------------------------------------------------------------------ */
  /* Current User                                                             */
  /* ------------------------------------------------------------------------ */

  async getMe(): Promise<User> {
    const response = await userApi.getMe();

    return response.data.data;
  }

  /* ------------------------------------------------------------------------ */
  /* Employees                                                                */
  /* ------------------------------------------------------------------------ */

  async getEmployees(): Promise<User[]> {
    const response = await userApi.getEmployees();

    return response.data.data;
  }

  async getEmployee(id: string): Promise<User> {
    const response = await userApi.getEmployee(id);

    return response.data.data;
  }

  async createEmployee(data: CreateEmployeeInput): Promise<User> {
    const response = await userApi.createEmployee(data);

    return response.data.data;
  }

  async updateEmployee(id: string, data: UpdateEmployeeInput): Promise<User> {
    const response = await userApi.updateEmployee(id, data);

    return response.data.data;
  }

  async toggleEmployeeStatus(id: string): Promise<User> {
    const response = await userApi.toggleEmployeeStatus(id);

    return response.data.data;
  }

  async deleteEmployee(id: string): Promise<User> {
    const response = await userApi.deleteEmployee(id);

    return response.data.data;
  }

  /* ------------------------------------------------------------------------ */
  /* Account                                                                  */
  /* ------------------------------------------------------------------------ */

  async updateAppLock(enabled: boolean): Promise<User> {
    const response = await userApi.updateAppLock(enabled);

    return response.data.data;
  }

  async setCurrentBusiness(businessId: string): Promise<User> {
    const response = await userApi.setCurrentBusiness(businessId);

    return response.data.data;
  }

  async completeOnboarding(): Promise<User> {
    const response = await userApi.completeOnboarding();

    return response.data.data;
  }
}

export default new UserService();
