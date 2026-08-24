import { profileApi } from "../api/profile.api";

import type { Profile, UpdateProfileInput } from "../types/profile.types";

class ProfileService {
  async getProfile(): Promise<Profile> {
    const response = await profileApi.getMe();

    return response.data.data;
  }

  async updateProfile(data: UpdateProfileInput): Promise<Profile> {
    const response = await profileApi.updateMe(data);

    return response.data.data;
  }
}

export default new ProfileService();
