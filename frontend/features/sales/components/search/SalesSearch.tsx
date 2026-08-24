"use client";

import { useState } from "react";
import { Search, CalendarDays } from "lucide-react";

import DateFilterSheet from "@/components/common/shared/sheets/DateFilterSheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SalesSearchProps {
  value?: string;
  onChange?: (value: string) => void;

  fromDate: string;
  toDate: string;

  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;

  onResetDate?: () => void;
}

export function SalesSearch({
  value = "",
  onChange,

  fromDate,
  toDate,

  onFromDateChange,
  onToDateChange,

  onResetDate,
}: SalesSearchProps) {
  const [dateSheetOpen, setDateSheetOpen] = useState(false);

  return (
    <section className="rounded-3xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Search */}

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-500" />

          <Input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Search invoice, customer or mobile..."
            className="
              h-12
              rounded-2xl
              border-0
              bg-violet-50/60
              pl-12
              shadow-none
              transition-all
              focus-visible:bg-background
              focus-visible:ring-2
              focus-visible:ring-violet-500
              dark:bg-violet-500/10
            "
          />
        </div>

        {/* Date Filter */}

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setDateSheetOpen(true)}
          className="
            relative
            h-12
            w-12
            rounded-2xl
            border-violet-200
            bg-violet-50
            transition-all
            hover:border-violet-300
            hover:bg-violet-100
            dark:border-violet-800
            dark:bg-violet-500/10
            dark:hover:bg-violet-500/20
          "
        >
          <CalendarDays className="h-5 w-5 text-violet-600 dark:text-violet-300" />

          {(fromDate || toDate) && (
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-violet-600 ring-2 ring-background" />
          )}
        </Button>
      </div>

      <DateFilterSheet
        open={dateSheetOpen}
        onOpenChange={setDateSheetOpen}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
        onApply={() => {
          setDateSheetOpen(false);
        }}
        {...(onResetDate ? { onReset: onResetDate } : {})}
      />
    </section>
  );
}
