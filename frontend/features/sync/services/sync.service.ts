import api from "@/lib/api";

import type { SyncResult } from "../types/sync.types";

class SyncService {
  async sync(): Promise<SyncResult> {
    const response = await api.post<{
      success: boolean;
      data: SyncResult;
    }>("/sync");

    return response.data.data;
  }
}

export default new SyncService();
