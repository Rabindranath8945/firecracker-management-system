"use client";

import { ScanLine, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductSearch() {
  return (
    <div className="relative">
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
        placeholder="Search product, SKU or Barcode..."
        className="h-12 rounded-2xl pl-11 pr-14"
      />

      <Button
        size="icon"
        variant="ghost"
        className="
          absolute
          right-2
          top-1/2
          -translate-y-1/2
        "
      >
        <ScanLine className="h-5 w-5" />
      </Button>
    </div>
  );
}
