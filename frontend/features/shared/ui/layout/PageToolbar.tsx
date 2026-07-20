"use client";

import { cn } from "@/lib/utils";

interface PageToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export default function PageToolbar({
  left,
  right,
  className,
}: PageToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        "rounded-2xl border bg-background p-4 shadow-sm",
        "md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-3">{left}</div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {right}
      </div>
    </div>
  );
}
