import { securityApi } from "../api/security.api";

import type {
  SecurityProfile,
  UpdateAppLockInput,
} from "../types/security.types";

class SecurityService {
  async getSecurityProfile(): Promise<SecurityProfile> {
    const response = await securityApi.getSecurityProfile();

    return response.data.data;
  }

  async updateAppLock(data: UpdateAppLockInput): Promise<SecurityProfile> {
    const response = await securityApi.updateAppLock(data);

    return response.data.data;
  }
}

export default new SecurityService();
