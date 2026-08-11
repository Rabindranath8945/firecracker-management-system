"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import AppCard from "@/components/layout/AppCard";

interface KPIStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "sky" | "emerald" | "violet" | "amber" | "blue" | "red";
  trend?: string;
}

const COLORS = {
  sky: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    badge: "bg-sky-50 text-sky-700",
  },

  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
  },

  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    badge: "bg-violet-50 text-violet-700",
  },

  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    badge: "bg-amber-50 text-amber-700",
  },

  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    badge: "bg-blue-50 text-blue-700",
  },

  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    badge: "bg-red-50 text-red-700",
  },
};

export default function KPIStatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: KPIStatCardProps) {
  const styles = COLORS[color];

  return (
    <AppCard className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className={`rounded-2xl ${styles.bg} p-3`}>
            <Icon className={`h-6 w-6 ${styles.text}`} />
          </div>

          {trend && (
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${styles.badge}`}
            >
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
      </div>
    </AppCard>
  );
}
