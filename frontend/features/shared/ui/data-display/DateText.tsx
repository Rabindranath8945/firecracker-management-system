"use client";

import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";

interface DateTextProps {
  value: string | Date;

  className?: string;

  showIcon?: boolean;

  format?: Intl.DateTimeFormatOptions;
}

export default function DateText({
  value,
  className,
  showIcon = false,
  format = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
}: DateTextProps) {
  const date = value instanceof Date ? value : new Date(value);

  const formatted = date.toLocaleDateString("en-IN", format);

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      {showIcon && <CalendarDays className="h-4 w-4 text-muted-foreground" />}

      {formatted}
    </span>
  );
}
