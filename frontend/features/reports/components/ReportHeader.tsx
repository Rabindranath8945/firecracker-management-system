"use client";

import {
  CalendarClock,
  Database,
  Download,
  FileBarChart,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ReportHeaderProps {
  title: string;
  description: string;
  totalRecords: number;
  loading?: boolean;
  onExport?: (() => void) | undefined;
}

export default function ReportHeader({
  title,
  description,
  totalRecords,
  loading = false,
  onExport,
}: ReportHeaderProps) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* Premium accent */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500" />

      <div className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <FileBarChart className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground">
                {description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {/* Records */}
                <div className="flex items-center gap-2 rounded-xl border bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                  <Database className="h-3.5 w-3.5" />

                  {loading ? "Loading..." : `${totalRecords} Records`}
                </div>

                {/* Status */}
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    loading
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CalendarClock className="h-3.5 w-3.5" />
                  )}

                  {loading ? "Fetching report..." : "Live Data"}
                </div>
              </div>
            </div>
          </div>

          {/* Export */}
          {onExport && (
            <Button
              type="button"
              size="lg"
              onClick={onExport}
              disabled={loading}
              className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-white shadow-sm transition-all hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
