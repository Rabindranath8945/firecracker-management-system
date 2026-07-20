"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PurchaseSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PurchaseSearch({ value, onChange }: PurchaseSearchProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Search Purchases</h2>

        <p className="text-sm text-muted-foreground">
          Search by invoice number or supplier
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search invoice, supplier..."
          className="h-14 rounded-2xl pl-12 text-base shadow-sm"
        />
      </div>
    </section>
  );
}
