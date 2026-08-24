"use client";

import { Search, ScanLine } from "lucide-react";

import { Input } from "@/components/ui/input";

interface ProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onScan: () => void;
  scanning?: boolean;
}

export default function ProductSearchBar({
  value,
  onChange,
  onScan,
  scanning = false,
}: ProductSearchBarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Search */}

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search by name, code or barcode..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="
              h-12
              rounded-2xl
              border-0
              bg-slate-50
              pl-12
              pr-4
              text-sm
              shadow-none
              placeholder:text-slate-400
              focus-visible:ring-2
              focus-visible:ring-sky-500
            "
          />
        </div>

        {/* Barcode Scanner */}

        <button
          type="button"
          aria-label="Scan barcode"
          disabled={scanning}
          onClick={onScan}
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-slate-900
            text-white
            transition-all
            duration-200
            hover:bg-slate-800
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <ScanLine className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
