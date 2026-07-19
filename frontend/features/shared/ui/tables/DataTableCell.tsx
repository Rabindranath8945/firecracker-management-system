"use client";

import { cn } from "@/lib/utils";

interface DataTableCellProps {
  children: React.ReactNode;

  className?: string;
}

export default function DataTableCell({
  children,
  className,
}: DataTableCellProps) {
  return (
    <td className={cn("px-6 py-5 align-middle", className)}>{children}</td>
  );
}
