"use client";

import { cn } from "@/lib/utils";

interface AmountTextProps {
  value: number;

  className?: string;

  showSign?: boolean;

  currency?: string;
}

export default function AmountText({
  value,
  className,
  showSign = false,
  currency = "₹",
}: AmountTextProps) {
  const formatted = `${currency}${value.toLocaleString("en-IN")}`;

  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        value > 0 && showSign && "text-emerald-600",
        value < 0 && showSign && "text-red-600",
        className,
      )}
    >
      {showSign && value > 0 && "+"}

      {formatted}
    </span>
  );
}
