"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  loading: boolean;

  title?: string;

  description?: string;

  fullscreen?: boolean;

  className?: string;
}

export default function LoadingOverlay({
  loading,
  title = "Please wait...",
  description = "Processing your request.",
  fullscreen = false,
  className,
}: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        fullscreen && "fixed",
        className,
      )}
    >
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl border bg-background p-8 shadow-2xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>

        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
