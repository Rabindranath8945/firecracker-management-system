"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import AppCard from "@/components/layout/AppCard";

interface KPIStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "sky" | "emerald" | "violet" | "amber" | "blue" | "red";
  trend?: string;
  trendDirection?: "up" | "down";
}

const COLORS = {
  sky: {
    bg: "bg-sky-100 dark:bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  },

  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },

  violet: {
    bg: "bg-violet-100 dark:bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    badge:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },

  amber: {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },

  blue: {
    bg: "bg-blue-100 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },

  red: {
    bg: "bg-red-100 dark:bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    badge: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
};

export default function KPIStatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendDirection = "up",
}: KPIStatCardProps) {
  const styles = COLORS[color];

  const TrendIcon = trendDirection === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <AppCard
      className="
        group
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        dark:border-border
        dark:bg-card
      "
    >
      <div className="space-y-5">
        {/* Header */}

        <div className="flex items-center justify-between gap-3">
          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              transition-transform
              duration-300
              group-hover:scale-105
              ${styles.bg}
            `}
          >
            <Icon className={`h-6 w-6 ${styles.text}`} />
          </div>

          {trend && (
            <div
              className={`
                flex
                items-center
                gap-1
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${styles.badge}
              `}
            >
              <TrendIcon className="h-3 w-3" />

              {trend}
            </div>
          )}
        </div>

        {/* Value */}

        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            {title}
          </p>

          <h3
            className="
              mt-2
              truncate
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              dark:text-foreground
              sm:text-3xl
            "
          >
            {value}
          </h3>
        </div>
      </div>
    </AppCard>
  );
}
