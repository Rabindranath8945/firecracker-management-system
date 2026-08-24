import { notificationApi } from "../api/notification.api";

import type { Notification } from "../types/notification.types";

class NotificationService {
  async getLatest(limit = 20): Promise<Notification[]> {
    const response = await notificationApi.latest(limit);

    return response.data.data;
  }

  async getUnread(): Promise<Notification[]> {
    const response = await notificationApi.unread();

    return response.data.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await notificationApi.unreadCount();

    return response.data.data.unread;
  }

  async markRead(id: string): Promise<Notification> {
    const response = await notificationApi.markRead(id);

    return response.data.data;
  }

  async markAllRead(): Promise<void> {
    await notificationApi.markAllRead();
  }

  async clear(): Promise<void> {
    await notificationApi.clear();
  }
}

export default new NotificationService();
