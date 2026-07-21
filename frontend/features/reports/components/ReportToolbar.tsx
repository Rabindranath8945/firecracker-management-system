"use client";

import { CalendarDays, Download, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";

import FilterSelect from "@/features/shared/ui/forms/FilterSelect";
import SearchInput from "@/features/shared/ui/forms/SearchInput";

interface ReportToolbarProps {
  search: string;
  status: string;
  dateRange: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;

  onExport: () => void;
}

import {
  REPORT_DATE_RANGES,
  REPORT_STATUS_OPTIONS,
} from "../constants/report.constants";

export default function ReportToolbar({
  search,
  status,
  dateRange,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onExport,
}: ReportToolbarProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {/* Filters */}

        <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search invoice, customer..."
            className="sm:col-span-2 xl:col-span-1"
          />

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Date Range
            </label>

            <FilterSelect
              value={dateRange}
              onChange={onDateRangeChange}
              options={[...REPORT_DATE_RANGES]}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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

        {/* Export */}

        <Button
          onClick={onExport}
          size="lg"
          className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 text-white hover:from-blue-700 hover:to-cyan-600"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
