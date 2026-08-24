import type { ReactNode } from "react";

import type { DashboardSummary } from "@/features/dashboard/types/dashboard.type";

export interface HeaderProps {
  dashboard: DashboardSummary | null;
}

export interface HeaderBusinessProps {
  businessName: string;
  businessId: string;
}

export type HeaderNetworkState =
  | "checking"
  | "online"
  | "offline"
  | "server-offline";

export interface HeaderNetworkStatusProps {
  className?: string;
}

export interface HeaderUser {
  id: string;
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
}

export interface HeaderProfileProps {
  dashboard: DashboardSummary | null;
  user?: HeaderUser | null | undefined;
  onClose?: (() => void) | undefined;
}

export type NotificationType =
  | "SALE"
  | "PURCHASE"
  | "PAYMENT"
  | "STOCK"
  | "CUSTOMER"
  | "SUPPLIER"
  | "SYSTEM"
  | "SYNC";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  href?: string;
  icon?: ReactNode;
}

export interface HeaderNotificationsProps {
  notifications?: HeaderNotification[];
  unreadCount?: number | undefined;
  onMarkAsRead?: ((id: string) => void) | undefined;
  onMarkAllAsRead?: (() => void) | undefined;
}
