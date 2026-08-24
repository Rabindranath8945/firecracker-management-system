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

/* ==========================================================================
 * TYPES
 * ========================================================================== */

interface ReportTableProps<
  T extends {
    id?: string;
    _id?: string;
  },
> {
  columns: ReportColumn<T>[];

  data: T[];

  emptyTitle?: string;

  emptyDescription?: string;
}

/* ==========================================================================
 * COMPONENT
 * ========================================================================== */

export default function ReportTable<
  T extends {
    id?: string;
    _id?: string;
  },
>({
  columns,
  data,
  emptyTitle = "No Records Found",
  emptyDescription = "No data matches your current filters.",
}: ReportTableProps<T>) {
  /* ------------------------------------------------------------------------
   * EMPTY STATE
   * ---------------------------------------------------------------------- */

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  /* ------------------------------------------------------------------------
   * TABLE
   * ---------------------------------------------------------------------- */

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          {/* -------------------------------------------------------------- */}
          {/* HEADER                                                         */}
          {/* -------------------------------------------------------------- */}

          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-b hover:bg-slate-50/80">
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

          {/* -------------------------------------------------------------- */}
          {/* BODY                                                           */}
          {/* -------------------------------------------------------------- */}

          <TableBody>
            {data.map((row, index) => {
              const rowId = row.id ?? row._id ?? `report-row-${index}`;

              return (
                <TableRow
                  key={rowId}
                  className={cn(
                    "border-b transition-colors duration-200",
                    index % 2 === 1 && "bg-slate-50/30",
                    "hover:bg-primary/5",
                  )}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={cn(
                        "px-6 py-4 align-middle",
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between border-t bg-slate-50/70 px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">{data.length}</span>{" "}
          {data.length === 1 ? "record" : "records"}
        </p>

        <div className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          Total {data.length}
        </div>
      </div>
    </div>
  );
}
