"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;

  title: string;

  description?: string;

  actionLabel?: string | undefined;
  onAction?: (() => void) | undefined;

  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "rounded-3xl border border-dashed",
        "bg-background px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      )}

      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-8 rounded-xl px-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
