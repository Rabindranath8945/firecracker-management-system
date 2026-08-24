"use client";

import { Building2 } from "lucide-react";

interface ProfileBusinessCardProps {
  businessName: string;
  businessCode?: string | null;
}

export default function ProfileBusinessCard({
  businessName,
  businessCode,
}: ProfileBusinessCardProps) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10">
        <Building2 className="h-4 w-4 text-sky-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Business
        </p>

        <p
          className="mt-0.5 truncate text-xs font-bold text-white"
          title={businessName}
        >
          {businessName || "No Business Selected"}
        </p>

        {businessCode && (
          <p
            className="mt-0.5 truncate text-[9px] text-slate-400"
            title={businessCode}
          >
            {businessCode}
          </p>
        )}
      </div>
    </div>
  );
}
