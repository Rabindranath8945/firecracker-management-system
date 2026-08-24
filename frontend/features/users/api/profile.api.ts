import api from "@/lib/api";

import type {
  ProfileResponse,
  UpdateProfileInput,
} from "../types/profile.types";

export const profileApi = {
  async getMe() {
    return api.get<ProfileResponse>("/users/me");
  },

  async updateMe(data: UpdateProfileInput) {
    return api.put<ProfileResponse>("/users/me", data);
  },
};
