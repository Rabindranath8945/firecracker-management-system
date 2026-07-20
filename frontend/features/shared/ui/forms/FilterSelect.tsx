"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];

  className?: string;
  disabled?: boolean;
}

export default function FilterSelect({
  value,
  onChange,
  options,
  className,
  disabled = false,
}: FilterSelectProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200",
          "hover:border-blue-300 hover:shadow-md",
          "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}
