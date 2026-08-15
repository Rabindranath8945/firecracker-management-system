"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { DashboardSummary } from "@/features/dashboard/types/dashboard.type";

interface HeaderProps {
  dashboard: DashboardSummary;
}

export default function Header({ dashboard }: HeaderProps) {
  const router = useRouter();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------------- */
  /* Dashboard Data                                                         */
  /* ---------------------------------------------------------------------- */

  const ownerName = dashboard.owner.name || "Owner";

  const businessName = dashboard.business.name || "My Business";

  const businessId = dashboard.business.businessId || "-";

  const lowStockCount = dashboard.lowStock;

  const outstandingPayments = dashboard.outstandingPayments;

  const hasNotifications = lowStockCount > 0 || outstandingPayments > 0;

  /* ---------------------------------------------------------------------- */
  /* Close Dropdowns                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                             */
  /* ---------------------------------------------------------------------- */

  function openSettings() {
    setProfileOpen(false);
    router.push("/settings");
  }

  function openProfile() {
    setProfileOpen(false);

    // Profile page can be added later.
    router.push("/settings");
  }

  function openNotifications() {
    setNotificationOpen((previous) => !previous);
    setProfileOpen(false);
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <div
        className="
          w-full
          max-w-md
          border-b
          border-slate-800
          bg-slate-950/95
          backdrop-blur-xl
        "
      >
        <div className="flex h-20 items-center justify-between px-5">
          {/* ---------------------------------------------------------------- */}
          {/* Business                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
              OneHub ERP
            </p>

            <h1 className="truncate text-lg font-semibold text-white">
              {businessName}
            </h1>

            <div className="mt-1 flex items-center gap-1">
              <Building2 className="h-3 w-3 shrink-0 text-slate-500" />

              <span className="truncate text-xs text-slate-400">
                {businessId}
              </span>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Actions                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex shrink-0 items-center gap-2">
            {/* -------------------------------------------------------------- */}
            {/* Notifications                                                  */}
            {/* -------------------------------------------------------------- */}

            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={openNotifications}
                aria-label="Notifications"
                className="
                  relative
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-800
                  transition-all
                  hover:bg-slate-700
                  active:scale-95
                "
              >
                <Bell className="h-5 w-5 text-slate-300" />

                {hasNotifications && (
                  <span
                    className="
                      absolute
                      right-2
                      top-2
                      h-2
                      w-2
                      rounded-full
                      bg-red-500
                      ring-2
                      ring-slate-800
                    "
                  />
                )}
              </button>

              {notificationOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-72
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                  "
                >
                  <div className="border-b px-4 py-3">
                    <h3 className="font-semibold text-slate-900">
                      Notifications
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Dashboard alerts
                    </p>
                  </div>

                  <div className="p-3">
                    {lowStockCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationOpen(false);
                          router.push("/products");
                        }}
                        className="
                          w-full
                          rounded-xl
                          bg-red-50
                          p-3
                          text-left
                          transition
                          hover:bg-red-100
                        "
                      >
                        <p className="text-sm font-semibold text-red-700">
                          Low Stock Alert
                        </p>

                        <p className="mt-1 text-xs text-red-600">
                          {lowStockCount} product
                          {lowStockCount !== 1 ? "s" : ""} need
                          {lowStockCount === 1 ? "s" : ""} restocking.
                        </p>
                      </button>
                    )}

                    {outstandingPayments > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationOpen(false);
                          router.push("/sales");
                        }}
                        className="
                          mt-2
                          w-full
                          rounded-xl
                          bg-amber-50
                          p-3
                          text-left
                          transition
                          hover:bg-amber-100
                        "
                      >
                        <p className="text-sm font-semibold text-amber-700">
                          Outstanding Payment
                        </p>

                        <p className="mt-1 text-xs text-amber-600">
                          ₹
                          {outstandingPayments.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          pending collection.
                        </p>
                      </button>
                    )}

                    {!hasNotifications && (
                      <div className="py-6 text-center">
                        <Bell className="mx-auto h-6 w-6 text-slate-300" />

                        <p className="mt-2 text-sm font-medium text-slate-700">
                          All clear
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          No new notifications.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* -------------------------------------------------------------- */}
            {/* Profile                                                         */}
            {/* -------------------------------------------------------------- */}

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((previous) => !previous);
                  setNotificationOpen(false);
                }}
                aria-label="Open profile"
                className="
                  group
                  flex
                  items-center
                  gap-1
                  transition-transform
                  duration-200
                  hover:scale-105
                  active:scale-95
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-sky-500
                    to-blue-600
                    text-sm
                    font-bold
                    text-white
                    ring-2
                    ring-slate-700
                  "
                >
                  {ownerName.charAt(0).toUpperCase()}
                </div>

                <ChevronDown
                  className={`
                    hidden
                    h-3.5
                    w-3.5
                    text-slate-500
                    transition-transform
                    sm:block
                    ${profileOpen ? "rotate-180" : ""}
                  `}
                />
              </button>

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-72
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                  "
                >
                  {/* Profile Header */}

                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-sky-500
                          text-xl
                          font-bold
                        "
                      >
                        {ownerName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{ownerName}</h3>

                        <p className="truncate text-sm text-slate-300">
                          {businessName}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {businessId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}

                  <div className="py-2">
                    <button
                      type="button"
                      onClick={openProfile}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-5
                        py-3
                        text-left
                        text-slate-700
                        transition
                        hover:bg-slate-50
                      "
                    >
                      <User className="h-5 w-5" />

                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={openSettings}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-5
                        py-3
                        text-left
                        text-slate-700
                        transition
                        hover:bg-slate-50
                      "
                    >
                      <Settings className="h-5 w-5" />

                      <span>Settings</span>
                    </button>

                    <div className="my-2 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);

                        // Connect your existing auth logout here.
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-5
                        py-3
                        text-left
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      <LogOut className="h-5 w-5" />

                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
