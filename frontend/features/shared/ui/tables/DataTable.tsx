"use client";

import { cn } from "@/lib/utils";

interface DataTableProps {
  children: React.ReactNode;

  className?: string;
}

export default function DataTable({ children, className }: DataTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border bg-background shadow-sm",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">{children}</table>
      </div>
    </div>
  );
}
