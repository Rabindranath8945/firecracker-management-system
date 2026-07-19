"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;

  showBackButton?: boolean;
  backLabel?: string;
  onBack?: () => void;

  action?: React.ReactNode;

  className?: string;
}

export default function PageHeader({
  title,
  description,
  showBackButton = false,
  backLabel = "Back",
  onBack,
  action,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className={cn("mb-6", className)}>
      {showBackButton && (
        <Button
          variant="ghost"
          onClick={onBack ?? (() => router.back())}
          className="-ml-2 mb-3 h-9 rounded-xl px-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          {description && (
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
