"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CustomerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomerSearch({
  value,
  onChange,
}: CustomerSearchProps) {
  return (
    <div className="relative">
      {/* Search Icon */}

      <Search
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-muted-foreground
        "
      />

      {/* Input */}

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by customer name or mobile..."
        className="
          h-12
          rounded-2xl
          border-slate-200
          bg-slate-50
          pl-11
          pr-10
          text-sm
          shadow-none
          transition-all
          focus:border-violet-500
          focus:bg-white
          focus:ring-2
          focus:ring-violet-100
        "
      />

      {/* Clear */}

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange("")}
          className="
            absolute
            right-2
            top-1/2
            h-8
            w-8
            -translate-y-1/2
            rounded-full
          "
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
