export type NotificationType =
  | "LOW_STOCK"
  | "BACKUP"
  | "SECURITY"
  | "PURCHASE"
  | "SALES"
  | "SYSTEM";

export interface NotificationData {
  [key: string]: unknown;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  data?: NotificationData;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface NotificationApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
