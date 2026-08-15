"use client";

import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import DateFilterSheet from "@/components/common/shared/sheets/DateFilterSheet";

interface PurchaseSearchProps {
  value: string;
  onChange: (value: string) => void;

  fromDate: string;
  toDate: string;

  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;

  onFilterClick?: () => void;
}

export function PurchaseSearch({
  value,
  onChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onFilterClick,
}: PurchaseSearchProps) {
  const [dateSheetOpen, setDateSheetOpen] = useState(false);

  const hasDateFilter = Boolean(fromDate || toDate);

  function handleFilterClick() {
    if (onFilterClick) {
      onFilterClick();
      return;
    }

    setDateSheetOpen(true);
  }

  function handleApply() {
    setDateSheetOpen(false);
  }

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-border dark:bg-card">
        <div className="flex items-center gap-3">
          {/* Search */}

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-muted-foreground" />

            <Input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Search purchase no., invoice or supplier..."
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
                dark:bg-muted/50
              "
            />
          </div>

          {/* Date Filter */}

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFilterClick}
            className={`
              relative
              h-14
              w-14
              shrink-0
              rounded-2xl
              transition-all
              ${
                hasDateFilter
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                  : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50 dark:border-border dark:bg-muted/50"
              }
            `}
          >
            <CalendarDays
              className={`
                h-5 w-5
                ${
                  hasDateFilter
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-500 dark:text-muted-foreground"
                }
              `}
            />

            {/* Active indicator */}

            {hasDateFilter && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-card" />
            )}
          </Button>
        </div>

        {/* Active Date */}

        {hasDateFilter && (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-2.5 dark:bg-emerald-500/10">
            <div className="flex min-w-0 items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

              <p className="truncate text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {fromDate && toDate
                  ? fromDate === toDate
                    ? fromDate
                    : `${fromDate} → ${toDate}`
                  : fromDate
                    ? `From ${fromDate}`
                    : `Until ${toDate}`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onFromDateChange("");
                onToDateChange("");
              }}
              className="ml-3 shrink-0 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
            >
              Clear
            </button>
          </div>
        )}
      </section>

      {/* Date Sheet */}

      {!onFilterClick && (
        <DateFilterSheet
          open={dateSheetOpen}
          onOpenChange={setDateSheetOpen}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={onFromDateChange}
          onToDateChange={onToDateChange}
          onApply={handleApply}
        />
      )}
    </>
  );
}
