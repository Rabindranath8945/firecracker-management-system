import api from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { Notification } from "../types/notification.types";

interface NotificationResponse {
  success: boolean;
  data: Notification[];
}

interface UnreadCountResponse {
  success: boolean;
  data: {
    unread: number;
  };
}

export const notificationApi = {
  latest(limit = 20) {
    return api.get<ApiResponse<Notification[]>>("/notifications/latest", {
      params: {
        limit,
      },
      timeout: 5000,
    });
  },

  unread() {
    return api.get<ApiResponse<Notification[]>>("/notifications/unread");
  },

  unreadCount() {
    return api.get<ApiResponse<{ unread: number }>>(
      "/notifications/unread-count",
    );
  },

  markRead(id: string) {
    return api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
  },

  markAllRead() {
    return api.patch<ApiResponse<null>>("/notifications/read-all");
  },

  clear() {
    return api.delete<ApiResponse<null>>("/notifications");
  },
};
