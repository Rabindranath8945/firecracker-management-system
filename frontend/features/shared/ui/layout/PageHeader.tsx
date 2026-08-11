"use client";

import type { ReactNode } from "react";

import { ArrowLeft, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;

  description?: string;

  badge?: string;

  badgeIcon?: ReactNode;

  badgeClassName?: string;

  dateText?: string;

  showDate?: boolean;

  showBackButton?: boolean;

  backLabel?: string;

  onBack?: () => void;

  action?: ReactNode;

  className?: string;
}

export default function PageHeader({
  title,
  description,

  badge,
  badgeIcon,
  badgeClassName,

  dateText,
  showDate = false,

  showBackButton = false,
  backLabel = "Back",
  onBack,

  action,

  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className={cn("space-y-4", className)}>
      {showBackButton && (
        <Button
          variant="ghost"
          onClick={onBack ?? (() => router.back())}
          className="-ml-2 h-9 rounded-xl px-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      )}

      {badge && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            badgeClassName,
          )}
        >
          {badgeIcon}

          <span>{badge}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-[44px] font-bold leading-none tracking-tight text-slate-900">
            {title}
          </h1>

          {description && (
            <p className="mt-3 text-[15px] leading-7 text-slate-500">
              {description}
            </p>
          )}

          {showDate && (
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />

              <span>{dateText}</span>
            </div>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
