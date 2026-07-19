"use client";

import { cn } from "@/lib/utils";

interface DataTableRowProps {
  children: React.ReactNode;

  className?: string;

  onClick?: () => void;
}

export default function DataTableRow({
  children,
  className,
  onClick,
}: DataTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b transition-colors",
        "hover:bg-slate-50",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </tr>
  );
}
