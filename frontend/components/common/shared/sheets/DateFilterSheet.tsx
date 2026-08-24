"use client";

import { useState } from "react";
import { CalendarDays, CalendarRange } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DateFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  fromDate: string;
  toDate: string;

  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;

  onApply: () => void;
  onReset?: () => void;
}

const PRESETS = [
  "Today",
  "Yesterday",
  "This Week",
  "Last 7 Days",
  "This Month",
  "Last Month",
  "This Year",
] as const;

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function DateFilterSheet({
  open,
  onOpenChange,

  fromDate,
  toDate,

  onFromDateChange,
  onToDateChange,

  onApply,
  onReset,
}: DateFilterSheetProps) {
  const [selectedPreset, setSelectedPreset] = useState("");

  function applyPreset(preset: string) {
    setSelectedPreset(preset);

    const today = new Date();

    switch (preset) {
      case "Today": {
        const date = formatLocalDate(today);

        onFromDateChange(date);
        onToDateChange(date);

        break;
      }

      case "Yesterday": {
        const yesterday = new Date(today);

        yesterday.setDate(yesterday.getDate() - 1);

        const date = formatLocalDate(yesterday);

        onFromDateChange(date);
        onToDateChange(date);

        break;
      }

      case "This Week": {
        const start = new Date(today);

        const day = start.getDay();

        const difference = day === 0 ? 6 : day - 1;

        start.setDate(start.getDate() - difference);

        onFromDateChange(formatLocalDate(start));
        onToDateChange(formatLocalDate(today));

        break;
      }

      case "Last 7 Days": {
        const start = new Date(today);

        start.setDate(start.getDate() - 6);

        onFromDateChange(formatLocalDate(start));
        onToDateChange(formatLocalDate(today));

        break;
      }

      case "This Month": {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);

        onFromDateChange(formatLocalDate(start));
        onToDateChange(formatLocalDate(today));

        break;
      }

      case "Last Month": {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);

        const end = new Date(today.getFullYear(), today.getMonth(), 0);

        onFromDateChange(formatLocalDate(start));
        onToDateChange(formatLocalDate(end));

        break;
      }

      case "This Year": {
        const start = new Date(today.getFullYear(), 0, 1);

        onFromDateChange(formatLocalDate(start));
        onToDateChange(formatLocalDate(today));

        break;
      }
    }
  }

  function handleReset() {
    setSelectedPreset("");

    onFromDateChange("");
    onToDateChange("");

    onReset?.();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[30px] p-0">
        {/* Header */}

        <SheetHeader className="border-b bg-violet-50/70 px-6 py-5 dark:bg-violet-500/10">
          <SheetTitle className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/20">
              <CalendarRange className="h-5 w-5 text-violet-600 dark:text-violet-300" />
            </div>

            <div>
              <p className="text-lg font-semibold">Date Filter</p>

              <p className="text-sm font-normal text-muted-foreground">
                Select a date range for sales.
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Date Inputs */}

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                From Date
              </p>

              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-violet-500" />

                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setSelectedPreset("");
                    onFromDateChange(e.target.value);
                  }}
                  className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                To Date
              </p>

              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-violet-500" />

                <Input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => {
                    setSelectedPreset("");
                    onToDateChange(e.target.value);
                  }}
                  className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Quick Range */}

          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Range</h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="outline"
                  onClick={() => applyPreset(preset)}
                  className={cn(
                    "h-11 rounded-2xl transition-all",
                    selectedPreset === preset &&
                      "border-violet-600 bg-violet-600 text-white hover:bg-violet-700",
                  )}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="sticky bottom-0 flex gap-3 border-t bg-background p-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-12 flex-1 rounded-2xl"
          >
            Clear
          </Button>

          <Button
            type="button"
            className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-semibold hover:opacity-95"
            onClick={() => {
              onApply();
              onOpenChange(false);
            }}
          >
            Apply Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
