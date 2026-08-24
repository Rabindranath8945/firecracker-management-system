"use client";

import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  CreditCard,
  Package,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useNotifications } from "@/features/notification/context/NotificationContext";

const TYPE_CONFIG = {
  SALE: {
    icon: ShoppingCart,
    className: "bg-emerald-100 text-emerald-600",
  },

  PURCHASE: {
    icon: Package,
    className: "bg-sky-100 text-sky-600",
  },

  PAYMENT: {
    icon: CreditCard,
    className: "bg-violet-100 text-violet-600",
  },

  STOCK: {
    icon: AlertTriangle,
    className: "bg-amber-100 text-amber-600",
  },

  CUSTOMER: {
    icon: User,
    className: "bg-cyan-100 text-cyan-600",
  },

  SUPPLIER: {
    icon: Truck,
    className: "bg-orange-100 text-orange-600",
  },

  SYSTEM: {
    icon: Bell,
    className: "bg-slate-100 text-slate-600",
  },

  SYNC: {
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-600",
  },
} as const;

function formatNotificationTime(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HeaderNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const count =
    unreadCount ??
    notifications.filter((notification) => !notification.read).length;

  async function handleNotificationClick(
    notification: (typeof notifications)[number],
  ) {
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="
        relative
        shrink-0
      "
    >
      {/* ---------------------------------------------------------------- */}
      {/* Notification Button                                             */}
      {/* ---------------------------------------------------------------- */}

      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="
          group
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/[0.06]
          text-slate-300
          shadow-sm
          transition-all
          duration-300
          hover:border-white/15
          hover:bg-white/[0.1]
          hover:text-white
          active:scale-95
        "
      >
        <Bell
          className="
            h-[18px]
            w-[18px]
            transition-transform
            duration-300
            group-hover:-rotate-6
          "
        />

        {mounted && count > 0 && (
          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              flex
              min-h-4
              min-w-4
              items-center
              justify-center
              rounded-full
              border-2
              border-slate-950
              bg-red-500
              px-1
              text-[8px]
              font-bold
              text-white
            "
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* ---------------------------------------------------------------- */}
      {/* Notification Dropdown                                           */}
      {/* ---------------------------------------------------------------- */}

      {open && (
        <div
          className="
            absolute
            right-[-38px]
            top-[calc(100%+10px)]
            z-[200]
            w-[calc(100vw-24px)]
            max-w-[360px]
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            shadow-black/20
          "
        >
          {/* Dropdown Header */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-100
              px-4
              py-3.5
            "
          >
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900">
                Notifications
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-500">
                {count > 0
                  ? `${count} unread notification${count !== 1 ? "s" : ""}`
                  : "You're all caught up"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {count > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllAsRead()}
                  className="
                    rounded-lg
                    px-2
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-sky-600
                    transition
                    hover:bg-sky-50
                  "
                >
                  Mark all read
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Notifications                                                    */}
          {/* ---------------------------------------------------------------- */}

          {notifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                "
              >
                <Bell className="h-6 w-6 text-slate-400" />
              </div>

              <h4 className="mt-4 text-sm font-semibold text-slate-900">
                No notifications
              </h4>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Important ERP events will appear here.
              </p>
            </div>
          ) : (
            <div
              className="
                max-h-[min(55vh,420px)]
                overflow-y-auto
                overscroll-contain
              "
            >
              {notifications.map((notification) => {
                const config =
                  TYPE_CONFIG[notification.type as keyof typeof TYPE_CONFIG] ??
                  TYPE_CONFIG.SYSTEM;

                const Icon = config.icon;

                return (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => void handleNotificationClick(notification)}
                    className={`
                      flex
                      w-full
                      gap-3
                      border-b
                      border-slate-100
                      px-4
                      py-3.5
                      text-left
                      transition
                      hover:bg-slate-50
                      ${notification.read ? "bg-white" : "bg-sky-50/40"}
                    `}
                  >
                    {/* Icon */}

                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${config.className}
                      `}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="
                            min-w-0
                            truncate
                            text-xs
                            font-bold
                            text-slate-900
                          "
                        >
                          {notification.title}
                        </p>

                        {!notification.read && (
                          <span
                            className="
                              mt-1
                              h-1.5
                              w-1.5
                              shrink-0
                              rounded-full
                              bg-sky-500
                            "
                          />
                        )}
                      </div>

                      <p
                        className="
                          mt-1
                          line-clamp-2
                          text-[10px]
                          leading-5
                          text-slate-500
                        "
                      >
                        {notification.message}
                      </p>

                      <p
                        className="
                          mt-1.5
                          text-[9px]
                          text-slate-400
                        "
                      >
                        {formatNotificationTime(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* Footer                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="border-t border-slate-100 p-2.5">
            <button
              type="button"
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                py-2.5
                text-xs
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <Check className="h-3.5 w-3.5" />
              View notification history
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
