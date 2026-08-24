import api from "@/lib/api";

import type {
  SecurityProfile,
  UpdateAppLockInput,
} from "../types/security.types";

export const securityApi = {
  getSecurityProfile() {
    return api.get<{
      success: boolean;
      data: SecurityProfile;
    }>("/users/me");
  },

  updateAppLock(data: UpdateAppLockInput) {
    return api.patch<{
      success: boolean;
      message: string;
      data: SecurityProfile;
    }>("/users/me/app-lock", data);
  },
};
