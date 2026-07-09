"use client";

import { Search, ScanLine } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  onScan?: () => void;
}

export default function ProductSearchBar({ value, onChange, onScan }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search product, SKU or Barcode..."
        className="h-12 rounded-2xl pl-10 pr-12"
      />

      <button
        onClick={onScan}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <ScanLine className="h-5 w-5 text-muted-foreground" />
      </button>
    </div>
  );
}
