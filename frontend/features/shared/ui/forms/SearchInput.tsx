"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;

  className?: string;

  disabled?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  disabled = false,
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Search Icon */}

      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

      {/* Input */}

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12",
          "text-sm font-medium text-slate-700 placeholder:text-slate-400",
          "shadow-sm transition-all duration-200",
          "hover:border-blue-300 hover:shadow-md",
          "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100",
        )}
      />

      {/* Clear Button */}

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
