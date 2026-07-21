"use client";

import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

import type { ReportSummary } from "../types/report";

interface ReportStatsProps {
  items: ReportSummary[];
}

const COLOR_VARIANTS = {
  blue: {
    icon: "bg-blue-100 text-blue-700",
    trend: "text-blue-600",
  },
  green: {
    icon: "bg-green-100 text-green-700",
    trend: "text-green-600",
  },
  orange: {
    icon: "bg-orange-100 text-orange-700",
    trend: "text-orange-600",
  },
  purple: {
    icon: "bg-purple-100 text-purple-700",
    trend: "text-purple-600",
  },
  cyan: {
    icon: "bg-cyan-100 text-cyan-700",
    trend: "text-cyan-600",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    trend: "text-amber-600",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-700",
    trend: "text-emerald-600",
  },
} as const;

export default function ReportStats({ items }: ReportStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const color = COLOR_VARIANTS[item.color ?? "blue"];

        return (
          <Card
            key={item.label}
            className="group overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>

                  <h3 className="text-2xl font-bold tracking-tight">
                    {item.formattedValue}
                  </h3>

                  {item.trend && (
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        color.trend,
                      )}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {item.trend}
                    </div>
                  )}
                </div>

                {Icon && (
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                      color.icon,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
