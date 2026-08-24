"use client";

import { CalendarDays, Download, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";

import FilterSelect from "@/features/shared/ui/forms/FilterSelect";
import SearchInput from "@/features/shared/ui/forms/SearchInput";

import {
  REPORT_DATE_RANGES,
  REPORT_STATUS_OPTIONS,
} from "../constants/report.constants";

interface ReportToolbarProps {
  search: string;
  status: string;
  dateRange: string;

  fromDate?: Date;
  toDate?: Date;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;

  onFromDateChange?: (date: Date | undefined) => void;
  onToDateChange?: (date: Date | undefined) => void;

  onExport: () => void;

  loading?: boolean;
}

function dateToInputValue(date?: Date): string {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function inputValueToDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

export default function ReportToolbar({
  search,
  status,
  dateRange,

  fromDate,
  toDate,

  onSearchChange,
  onStatusChange,
  onDateRangeChange,

  onFromDateChange,
  onToDateChange,

  onExport,

  loading = false,
}: ReportToolbarProps) {
  const isCustomRange = dateRange === "custom";

  return (
    <div className="rounded-3xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        {/* ================================================================ */}
        {/* SEARCH                                                           */}
        {/* ================================================================ */}

        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search report..."
          className="w-full"
        />

        {/* ================================================================ */}
        {/* FILTERS                                                          */}
        {/* ================================================================ */}

        <div className="grid gap-4 sm:grid-cols-2">
          {/* DATE RANGE */}

          <div className="space-y-2">
            <label className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Date Range
            </label>

            <FilterSelect
              value={dateRange}
              onChange={onDateRangeChange}
              options={[...REPORT_DATE_RANGES]}
            />
          </div>

          {/* STATUS */}

          <div className="space-y-2">
            <label className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Filter className="h-4 w-4" />
              Status
            </label>

            <FilterSelect
              value={status}
              onChange={onStatusChange}
              options={[...REPORT_STATUS_OPTIONS]}
            />
          </div>
        </div>

        {/* ================================================================ */}
        {/* CUSTOM DATE RANGE                                                */}
        {/* ================================================================ */}

        {isCustomRange && (
          <div className="grid gap-4 sm:grid-cols-2">
            {/* FROM DATE */}

            <div className="space-y-2">
              <label
                htmlFor="report-from-date"
                className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                From Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="report-from-date"
                  type="date"
                  value={dateToInputValue(fromDate)}
                  max={dateToInputValue(toDate)}
                  onChange={(event) => {
                    onFromDateChange?.(inputValueToDate(event.target.value));
                  }}
                  className="h-12 w-full rounded-2xl border bg-background pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* TO DATE */}

            <div className="space-y-2">
              <label
                htmlFor="report-to-date"
                className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                To Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="report-to-date"
                  type="date"
                  value={dateToInputValue(toDate)}
                  min={dateToInputValue(fromDate)}
                  onChange={(event) => {
                    onToDateChange?.(inputValueToDate(event.target.value));
                  }}
                  className="h-12 w-full rounded-2xl border bg-background pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* EXPORT                                                           */}
        {/* ================================================================ */}

        <Button
          type="button"
          onClick={onExport}
          disabled={loading || (isCustomRange && (!fromDate || !toDate))}
          size="lg"
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 text-white shadow-sm hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="mr-2 h-4 w-4" />

          {loading ? "Generating..." : "Export PDF"}
        </Button>
      </div>
    </div>
  );
}
