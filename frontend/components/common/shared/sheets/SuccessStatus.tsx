"use client";

import { AlertCircle, Check, CheckCircle2, Info } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface SuccessStatusItem {
  label: string;
  value: string;
  color?: "success" | "warning" | "error" | "info";
}

interface SuccessStatusProps {
  title?: string;
  items: SuccessStatusItem[];
}

export default function SuccessStatus({
  title = "Status",
  items,
}: SuccessStatusProps) {
  if (items.length === 0) {
    return null;
  }

  function getStatusStyle(color?: SuccessStatusItem["color"]) {
    switch (color) {
      case "warning":
        return {
          container:
            "border-amber-200/70 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/[0.06]",
          icon: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
          value: "text-amber-600 dark:text-amber-400",
          line: "bg-amber-400",
          iconComponent: <AlertCircle className="h-4 w-4" strokeWidth={2.5} />,
        };

      case "error":
        return {
          container:
            "border-red-200/70 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/[0.06]",
          icon: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
          value: "text-red-600 dark:text-red-400",
          line: "bg-red-400",
          iconComponent: <AlertCircle className="h-4 w-4" strokeWidth={2.5} />,
        };

      case "info":
        return {
          container:
            "border-sky-200/70 bg-sky-50/60 dark:border-sky-500/20 dark:bg-sky-500/[0.06]",
          icon: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
          value: "text-sky-600 dark:text-sky-400",
          line: "bg-sky-400",
          iconComponent: <Info className="h-4 w-4" strokeWidth={2.5} />,
        };

      default:
        return {
          container:
            "border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06]",
          icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
          value: "text-emerald-600 dark:text-emerald-400",
          line: "bg-emerald-400",
          iconComponent: <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />,
        };
    }
  }

  return (
    <Card className="overflow-hidden rounded-[26px] border border-border/60 bg-card shadow-sm">
      {/* Header */}

      <div className="border-b border-border/50 bg-gradient-to-r from-muted/50 via-background to-emerald-50/40 px-5 py-4 dark:to-emerald-500/[0.04]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">{title}</h3>

              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Complete
              </span>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              All required operations have been processed.
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm transition-transform duration-300 hover:scale-110 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Check className="h-4 w-4" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Progress */}

      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-muted-foreground">
            Completion
          </span>

          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {items.length}/{items.length}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 transition-all duration-1000" />
        </div>
      </div>

      {/* Items */}

      <div className="space-y-2 p-5">
        {items.map((item, index) => {
          const style = getStatusStyle(item.color);

          return (
            <div key={`${item.label}-${item.value}-${index}`} className="group">
              <div
                className={`
                  flex
                  min-h-[52px]
                  items-center
                  justify-between
                  gap-3
                  rounded-[18px]
                  border
                  px-3
                  py-2.5
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-md
                  ${style.container}
                `}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      ${style.icon}
                    `}
                  >
                    {style.iconComponent}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">
                      {item.label}
                    </p>

                    <p className="mt-0.5 text-[9px] text-muted-foreground">
                      Processed successfully
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    shrink-0
                    rounded-full
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    ${style.value}
                  `}
                >
                  {item.value}
                </div>
              </div>

              {index < items.length - 1 && (
                <div className="ml-[18px] h-2 w-px bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
