"use client";

import { LucideIcon, TrendingUp } from "lucide-react";
import AppCard from "@/components/layout/AppCard";
import { cn } from "@/lib/utils";

interface KPIStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  positive?: boolean;
  iconBgClass?: string;
  iconTextClass?: string;
}

export default function KPIStatCard({
  title,
  value,
  icon: Icon,
  change,
  positive = true,
  iconBgClass = "bg-red-100",
  iconTextClass = "text-red-600",
}: KPIStatCardProps) {
  return (
    <AppCard className="p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 truncate text-2xl font-bold text-slate-900">
            {value}
          </h3>

          {change && (
            <div
              className={cn(
                "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                positive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600",
              )}
            >
              <TrendingUp className="h-3 w-3" />
              {change}
            </div>
          )}
        </div>

        <div className={cn("rounded-2xl p-3", iconBgClass, iconTextClass)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </AppCard>
  );
}
