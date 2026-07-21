"use client";

import { CalendarClock, Database, Download, FileBarChart } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ReportHeaderProps {
  title: string;
  description: string;
  totalRecords: number;

  onExport?: () => void;
}

export default function ReportHeader({
  title,
  description,
  totalRecords,
  onExport,
}: ReportHeaderProps) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* Accent */}

      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500" />

      <div className="p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}

          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
              <FileBarChart className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  <CalendarClock className="h-4 w-4" />
                  Updated Today
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                  <Database className="h-4 w-4" />
                  {totalRecords} Records
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
        </div>
      </div>
    </div>
  );
}
