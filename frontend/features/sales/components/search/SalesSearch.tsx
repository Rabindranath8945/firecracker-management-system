"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SalesSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  onFilterClick?: () => void;
}

export function SalesSearch({
  value = "",
  onChange,
  onFilterClick,
}: SalesSearchProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search
          className="
            absolute
            left-4
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Search invoice, customer or phone..."
          className="h-12 rounded-2xl pl-11"
        />
      </div>

      <Button
        size="icon"
        variant="outline"
        className="h-12 w-12 rounded-2xl"
        onClick={onFilterClick}
      >
        <SlidersHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
}
