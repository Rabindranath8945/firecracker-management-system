"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

import { cn } from "@/lib/utils";

import type { ReportColumn } from "../types/report";

interface ReportTableProps<T extends { id: string }> {
  columns: ReportColumn<T>[];
  data: T[];

  emptyTitle?: string;
  emptyDescription?: string;
}

export default function ReportTable<T extends { id: string }>({
  columns,
  data,
  emptyTitle = "No Records Found",
  emptyDescription = "No data matches your current filters.",
}: ReportTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* Table */}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    "h-14 whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wider text-slate-600",

                    column.align === "center" && "text-center",

                    column.align === "right" && "text-right",
                  )}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id}
                className={cn(
                  "transition-all duration-200",

                  index % 2 && "bg-slate-50/30",

                  "hover:bg-primary/5",
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={cn(
                      "px-6 py-4",

                      column.align === "center" && "text-center",

                      column.align === "right" && "text-right",
                    )}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Showing
          <span className="mx-1 font-semibold text-foreground">
            {data.length}
          </span>
          records
        </p>

        <div className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
          Total {data.length}
        </div>
      </div>
    </div>
  );
}
