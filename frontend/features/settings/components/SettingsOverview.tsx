"use client";

import { BadgeCheck, Bell, DatabaseBackup, Info } from "lucide-react";

export default function SettingsOverview() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-2xl border bg-emerald-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-emerald-700">
          <BadgeCheck className="h-5 w-5" />
          <span className="text-sm font-semibold">Business</span>
        </div>

        <p className="text-xs text-emerald-600">Profile Configured</p>
      </div>

      <div className="rounded-2xl border bg-blue-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-blue-700">
          <BadgeCheck className="h-5 w-5" />
          <span className="text-sm font-semibold">GST</span>
        </div>

        <p className="text-xs text-blue-600">Active</p>
      </div>

      <div className="rounded-2xl border bg-amber-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-amber-700">
          <DatabaseBackup className="h-5 w-5" />
          <span className="text-sm font-semibold">Backup</span>
        </div>

        <p className="text-xs text-amber-600">Recommended</p>
      </div>

      <div className="rounded-2xl border bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-slate-700">
          <Info className="h-5 w-5" />
          <span className="text-sm font-semibold">Version</span>
        </div>

        <p className="text-xs text-slate-600">v1.0.0</p>
      </div>
    </div>
  );
}
