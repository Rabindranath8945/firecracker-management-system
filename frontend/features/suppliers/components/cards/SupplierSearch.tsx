"use client";

import { ListFilter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SupplierSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

export default function SupplierSearch({
  value,
  onChange,
  onFilterClick,
}: SupplierSearchProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search supplier name, code or mobile..."
            className="
              h-14
              rounded-2xl
              border-0
              bg-slate-50
              pl-12
              pr-4
              text-[15px]
              shadow-none
              placeholder:text-slate-400
              focus-visible:ring-2
              focus-visible:ring-indigo-500
            "
          />
        </div>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onFilterClick}
          className="
            h-14
            w-14
            rounded-2xl
            bg-slate-900
            text-white
            shadow-lg
            transition-all
            duration-200
            hover:bg-slate-800
            active:scale-95
          "
        >
          <ListFilter className="h-5 w-5" strokeWidth={2.2} />
        </Button>
      </div>
    </section>
  );
}
