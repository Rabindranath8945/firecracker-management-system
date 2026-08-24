import { joinRequestApi } from "../api/join-request.api";

import type {
  CreateJoinRequest,
  JoinRequest,
} from "../types/join-request.types";

class JoinRequestService {
  async create(payload: CreateJoinRequest): Promise<JoinRequest> {
    const response = await joinRequestApi.create(payload);

    return response.data.data;
  }

  async pending(): Promise<JoinRequest[]> {
    const response = await joinRequestApi.pending();

    return response.data.data;
  }

  async approve(id: string): Promise<JoinRequest> {
    const response = await joinRequestApi.approve(id);

    return response.data.data;
  }

  async reject(id: string): Promise<JoinRequest> {
    const response = await joinRequestApi.reject(id);

    return response.data.data;
  }
}

export default new JoinRequestService();
