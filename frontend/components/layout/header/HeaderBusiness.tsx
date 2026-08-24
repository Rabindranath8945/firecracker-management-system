"use client";

import { Building2, ChevronDown, Sparkles } from "lucide-react";

import type { HeaderBusinessProps } from "./header.types";

export default function HeaderBusiness({
  businessName,
  businessId,
}: HeaderBusinessProps) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-gradient-to-br
            from-sky-400
            to-blue-600
            shadow-lg
            shadow-sky-500/20
          "
        >
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>

        <span
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.28em]
            text-slate-500
          "
        >
          OneHub ERP
        </span>
      </div>

      <div className="mt-1 flex min-w-0 items-center gap-2">
        <h1
          className="
            truncate
            text-[16px]
            font-bold
            tracking-tight
            text-white
          "
        >
          {businessName}
        </h1>

        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-600" />
      </div>

      <div className="mt-1 flex min-w-0 items-center gap-1.5">
        <Building2 className="h-3 w-3 shrink-0 text-slate-500" />

        <span className="truncate text-[10px] font-medium text-slate-500">
          {businessId}
        </span>
      </div>
    </div>
  );
}
