"use client";

import { cn } from "@/lib/utils";

interface DataTableHeadProps {
  children: React.ReactNode;

  className?: string;
}

export default function DataTableHead({
  children,
  className,
}: DataTableHeadProps) {
  return (
    <th
      className={cn(
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}
