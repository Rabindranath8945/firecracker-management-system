"use client";

import { Search, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onScan?: () => void;
}

export default function ProductSearch({
  value,
  onChange,
  onScan,
}: ProductSearchProps) {
  return (
    <section className="rounded-3xl border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="
              absolute
              left-4
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search product by name / code / barcode..."
            className="
              h-14
              rounded-2xl
              border-0
              bg-muted/40
              pl-12
              pr-4
              text-base
              shadow-none
              focus-visible:ring-2
            "
          />
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onScan}
          className="
            h-14
            w-14
            rounded-2xl
            border-emerald-200
            bg-emerald-50
            hover:bg-emerald-100
            dark:border-emerald-900
            dark:bg-emerald-500/10
          "
        >
          <ScanLine className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
        </Button>
      </div>
    </section>
  );
}
