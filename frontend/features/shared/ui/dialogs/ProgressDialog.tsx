"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProgressDialogProps {
  open: boolean;

  title: string;

  description?: string;

  progress?: number;

  completed?: boolean;

  showPercentage?: boolean;
}

export default function ProgressDialog({
  open,
  title,
  description,
  progress,
  completed = false,
  showPercentage = true,
}: ProgressDialogProps) {
  const hasProgress = typeof progress === "number";

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md rounded-3xl border-0 p-8"
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}

          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {completed ? (
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            ) : (
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            )}
          </div>

          {/* Title */}

          <h2 className="text-xl font-semibold">{title}</h2>

          {/* Description */}

          {description && (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}

          {/* Progress */}

          {hasProgress && (
            <div className="mt-8 w-full">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>

                {showPercentage && <span>{progress}%</span>}
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Footer */}

          {!completed && (
            <p className="mt-6 text-xs text-muted-foreground">
              Please don't close this window.
            </p>
          )}

          {completed && (
            <p className="mt-6 text-sm font-medium text-emerald-600">
              Operation completed successfully.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
