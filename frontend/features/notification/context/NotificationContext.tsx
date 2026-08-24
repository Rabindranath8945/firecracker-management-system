"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import notificationService from "../services/notification.service";

import type { Notification } from "../types/notification.types";

interface NotificationContextValue {
  notifications: Notification[];

  unreadCount: number;

  loading: boolean;

  error: string | null;

  refresh: () => Promise<void>;

  markAsRead: (id: string) => Promise<void>;

  markAllAsRead: () => Promise<void>;

  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

const CACHE_KEY = "erp_notifications_cache";

const MAX_NOTIFICATIONS = 20;

function getCachedNotifications(): Notification[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const cached = localStorage.getItem(CACHE_KEY);

    if (!cached) {
      return [];
    }

    const parsed: unknown = JSON.parse(cached);

    return Array.isArray(parsed) ? (parsed as Notification[]) : [];
  } catch (error) {
    console.error("Failed to read notification cache:", error);

    return [];
  }
}

function saveNotifications(notifications: Notification[]) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)),
    );
  } catch (error) {
    console.error("Failed to save notification cache:", error);
  }
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>(
    getCachedNotifications,
  );

  const [unreadCount, setUnreadCount] = useState(
    () =>
      getCachedNotifications().filter((notification) => !notification.read)
        .length,
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Refresh                                                                */
  /* ---------------------------------------------------------------------- */

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const latest = await notificationService.getLatest(20);

      setNotifications(latest);

      saveNotifications(latest);

      setUnreadCount(
        latest.filter((notification) => !notification.read).length,
      );
    } catch (error) {
      console.error("Failed to load notifications:", error);

      setError("Failed to load notifications.");

      /*
       * Keep cached notifications when offline/API fails.
       */
      const cached = getCachedNotifications();

      setNotifications(cached);

      setUnreadCount(
        cached.filter((notification) => !notification.read).length,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Mark read                                                              */
  /* ---------------------------------------------------------------------- */

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((current) => {
      const next = current.map((notification) =>
        notification._id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      );

      saveNotifications(next);

      return next;
    });

    setUnreadCount((current) => Math.max(current - 1, 0));

    if (!navigator.onLine) {
      return;
    }

    try {
      await notificationService.markRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Mark all read                                                          */
  /* ---------------------------------------------------------------------- */

  const markAllAsRead = useCallback(async () => {
    setNotifications((current) => {
      const next = current.map((notification) => ({
        ...notification,
        read: true,
      }));

      saveNotifications(next);

      return next;
    });

    setUnreadCount(0);

    if (!navigator.onLine) {
      return;
    }

    try {
      await notificationService.markAllRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Delete                                                                 */
  /* ---------------------------------------------------------------------- */

  const deleteNotification = useCallback(async (id: string) => {
    setNotifications((current) => {
      const notification = current.find((item) => item._id === id);

      const next = current.filter((item) => item._id !== id);

      saveNotifications(next);

      if (notification && !notification.read) {
        setUnreadCount((count) => Math.max(count - 1, 0));
      }

      return next;
    });

    /*
     * Individual notification deletion is currently local-only.
     *
     * The backend does not currently provide:
     *
     * DELETE /notifications/:id
     *
     * Therefore we intentionally do not call an API here.
     */
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Initial load                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /* ---------------------------------------------------------------------- */
  /* Online / Offline                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    function handleOnline() {
      void refresh();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [refresh]);

  /* ---------------------------------------------------------------------- */
  /* Automatic refresh                                                      */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (navigator.onLine) {
        void refresh();
      }
    }, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [refresh]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        refresh,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider.",
    );
  }

  return context;
}
