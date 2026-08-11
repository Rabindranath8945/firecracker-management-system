"use client";

import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SuccessHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export default function SuccessHeader({
  title,
  description,
  icon,
  onClose,
}: SuccessHeaderProps) {
  return (
    <>
      {/* Drag Handle */}
      <div className="mx-auto mb-6 h-1.5 w-14 rounded-full bg-slate-300 dark:bg-slate-700" />

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Hero */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-green-500/25 blur-2xl" />

          {/* Circle */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 shadow-2xl ring-8 ring-green-100 dark:ring-green-900/30">
            {icon ?? (
              <CheckCircle2
                className="h-12 w-12 text-white"
                strokeWidth={2.5}
              />
            )}
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-bold tracking-tight">{title}</h2>

        {description && (
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </>
  );
}
