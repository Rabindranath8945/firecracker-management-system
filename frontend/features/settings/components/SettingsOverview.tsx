"use client";

import { BadgeCheck, DatabaseBackup, Info } from "lucide-react";

export default function SettingsOverview() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border/60 py-4">
      {/* Business */}

      <div className="flex items-center gap-2">
        <BadgeCheck className="h-4 w-4 text-emerald-600" />

        <span className="text-sm font-medium">Business</span>

        <span className="text-sm text-muted-foreground">Configured</span>
      </div>

      {/* GST */}

      <div className="flex items-center gap-2">
        <BadgeCheck className="h-4 w-4 text-blue-600" />

        <span className="text-sm font-medium">GST</span>

        <span className="text-sm text-muted-foreground">Active</span>
      </div>

      {/* Backup */}

      <div className="flex items-center gap-2">
        <DatabaseBackup className="h-4 w-4 text-amber-600" />

        <span className="text-sm font-medium">Backup</span>

        <span className="text-sm text-muted-foreground">Recommended</span>
      </div>

      {/* Version */}

      <div className="ml-auto flex items-center gap-2">
        <Info className="h-4 w-4 text-muted-foreground" />

        <span className="text-sm text-muted-foreground">v1.0.0</span>
      </div>
    </div>
  );
}
