"use client";

import type { ChangeEvent, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SettingsInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: string;
  disabled?: boolean;

  error?: string | undefined;
  warning?: string | undefined;
  success?: boolean | undefined;

  required?: boolean | undefined;

  description?: string | undefined;
  leftIcon?: ReactNode;

  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SettingsInput({
  label,
  placeholder,
  value,
  defaultValue,
  type = "text",
  disabled = false,
  error,
  warning,
  success = false,
  required = false,
  description,
  leftIcon,
  onChange,
  onBlur,
}: SettingsInputProps) {
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  const hasSuccess = !hasError && !hasWarning && success;

  return (
    <div className="space-y-2">
      <Label
        className={cn(
          "text-sm font-medium",
          hasError && "text-red-600",
          hasWarning && "text-amber-600",
        )}
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={hasError}
          className={cn(
            "h-11 rounded-xl border bg-background shadow-none",
            "transition-all",
            "focus-visible:ring-2 focus-visible:ring-primary/15",

            leftIcon && "pl-10",

            hasError &&
              "border-red-400 bg-red-50/30 pr-10 focus-visible:border-red-500",

            hasWarning &&
              "border-amber-400 bg-amber-50/30 pr-10 focus-visible:border-amber-500",

            hasSuccess &&
              "border-emerald-400 bg-emerald-50/20 pr-10 focus-visible:border-emerald-500",

            disabled && "cursor-not-allowed opacity-60",
          )}
        />

        {(hasError || hasWarning || hasSuccess) && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}

            {hasWarning && <Info className="h-4 w-4 text-amber-500" />}

            {hasSuccess && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}

      {!error && warning && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
          <Info className="h-3.5 w-3.5" />
          {warning}
        </p>
      )}

      {!error && !warning && description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
