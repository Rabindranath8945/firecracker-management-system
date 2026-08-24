"use client";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface MasterPickerFieldProps {
  label?: string | undefined;
  value?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  error?: string | undefined;
  onClick: () => void;
}

export default function MasterPickerField({
  label,
  value,
  placeholder = "Select",
  disabled,
  error,
  onClick,
}: MasterPickerFieldProps) {
  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border bg-background px-4 transition-all",
          "hover:border-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          disabled && "cursor-not-allowed opacity-50",
          error && "border-destructive",
        )}
      >
        <span
          className={cn(value ? "text-foreground" : "text-muted-foreground")}
        >
          {value || placeholder}
        </span>

        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
