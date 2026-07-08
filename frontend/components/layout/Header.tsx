"use client";

import { Bell, Wifi, UserCircle2 } from "lucide-react";

export default function Header() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-[72px] w-full max-w-md items-center justify-between px-4">
        <div>
          <p className="text-sm text-slate-500">{greeting} 👋</p>

          <h1 className="text-lg font-bold text-slate-900">
            Firecracker Management
          </h1>

          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
            <Wifi className="h-3 w-3" />
            <span>Online</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
            <Bell className="h-5 w-5" />
          </button>

          <button className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
            <UserCircle2 className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
