"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface PurchaseSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PurchaseSearch({ value, onChange }: PurchaseSearchProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by purchase no., invoice or supplier..."
          className="
            h-14
            rounded-2xl
            border-0
            bg-slate-50
            pl-12
            pr-4
            text-base
            shadow-none
            placeholder:text-slate-400
            focus-visible:ring-2
            focus-visible:ring-emerald-500
          "
        />
      </div>
    </section>
  );
}
