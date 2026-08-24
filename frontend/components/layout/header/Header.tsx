"use client";

import HeaderNetworkStatus from "./HeaderNetworkStatus";
import HeaderNotifications from "./HeaderNotifications";
import HeaderProfile from "./HeaderProfile";
import Image from "next/image";

import type { HeaderNotification, HeaderProps } from "./header.types";

interface HeaderComponentProps extends HeaderProps {
  notifications?: HeaderNotification[];
  unreadNotificationCount?: number;
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
}

export default function Header({
  dashboard: _dashboard,
  notifications: _notifications = [],
  unreadNotificationCount: _unreadNotificationCount,
  onMarkNotificationRead: _onMarkNotificationRead,
  onMarkAllNotificationsRead: _onMarkAllNotificationsRead,
}: HeaderComponentProps) {
  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        flex
        justify-center
        px-0
      "
    >
      <div
        className="
          relative
          w-full
          max-w-md
          overflow-visible
          border-b
          border-white/[0.08]
          bg-slate-950/95
          shadow-lg
          shadow-black/10
          backdrop-blur-2xl
          supports-[backdrop-filter]:bg-slate-950/85
        "
      >
        {/* Ambient glow */}

        <div
          className="
            pointer-events-none
            absolute
            -left-10
            -top-12
            h-28
            w-28
            rounded-full
            bg-sky-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-12
            h-28
            w-28
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        {/* Header Content */}

        <div
          className="
            relative
            flex
            min-h-[76px]
            items-center
            justify-between
            gap-3
            px-4
            py-3
          "
        >
          {/* ---------------------------------------------------------------- */}
          {/* OneHub ERP Branding                                              */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex min-w-0 items-center gap-2.5">
            {/* Logo */}

            <div
              className="
    relative
    h-10
    w-10
    shrink-0
    overflow-hidden
    rounded-xl
    bg-white
    shadow-lg
    shadow-sky-500/20
  "
            >
              <Image
                src="/onehub-logo.png"
                alt="ONEHUB ERP"
                fill
                priority
                sizes="50px"
                className="object-contain"
              />
            </div>

            {/* Brand */}

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-white
                "
              >
                ONEHUB ERP
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-slate-500
                "
              >
                Business . Simplified
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Actions                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
            "
          >
            <HeaderNetworkStatus />

            <HeaderNotifications />

            <HeaderProfile />
          </div>
        </div>

        {/* Bottom accent */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-sky-500/30
            to-transparent
          "
        />
      </div>
    </header>
  );
}
