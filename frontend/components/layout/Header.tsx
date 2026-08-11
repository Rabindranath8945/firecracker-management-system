"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Building2,
} from "lucide-react";

import type { DashboardSummary } from "@/features/dashboard/types/dashboard.type";

interface HeaderProps {
  dashboard: DashboardSummary;
}

export default function Header({ dashboard }: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const ownerName = dashboard.owner.name;
  const businessName = dashboard.business.name;
  const businessId = dashboard.business.businessId;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <div className="w-full max-w-md rounded border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="flex h-20 items-center justify-between px-5">
          {/* Left */}

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
              OneHub ERP
            </p>

            <h1 className="truncate text-lg font-semibold text-white">
              {businessName}
            </h1>

            <div className="mt-1 flex items-center gap-1">
              <Building2 className="h-3 w-3 text-slate-500" />

              <span className="truncate text-xs text-slate-400">
                {businessId}
              </span>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-2">
            {/* Notifications */}

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen((prev) => !prev)}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 transition hover:bg-slate-700"
              >
                <Bell className="h-5 w-5 text-slate-300" />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <h3 className="font-semibold">Notifications</h3>

                  <p className="mt-3 text-sm text-slate-500">
                    No new notifications.
                  </p>
                </div>
              )}
            </div>

            {/* Profile */}

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-bold text-white ring-2 ring-slate-700">
                  {ownerName.charAt(0).toUpperCase()}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  {/* Profile Header */}

                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-xl font-bold">
                        {ownerName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{ownerName}</h3>

                        <p className="truncate text-sm text-slate-300">
                          {businessName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {dashboard.business.businessId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}

                  <div className="py-2">
                    <button className="flex w-full items-center gap-3 px-5 py-3 text-left text-slate-700 transition hover:bg-slate-50">
                      <User className="h-5 w-5" />
                      <span>My Profile</span>
                    </button>

                    <button className="flex w-full items-center gap-3 px-5 py-3 text-left text-slate-700 transition hover:bg-slate-50">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </button>

                    <div className="my-2 border-t border-slate-100" />

                    <button className="flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 transition hover:bg-red-50">
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
