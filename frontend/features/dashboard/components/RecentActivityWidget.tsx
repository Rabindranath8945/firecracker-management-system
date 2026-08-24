"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  PackagePlus,
  ShoppingCart,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import DashboardWidget from "./DashboardWidget";

import type { DashboardSummary } from "../types/dashboard.type";

interface RecentActivityWidgetProps {
  dashboard: DashboardSummary;
}

const COLORS = {
  SALE: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },

  PURCHASE: {
    bg: "bg-sky-100 dark:bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
  },

  STOCK: {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },

  LOGIN: {
    bg: "bg-violet-100 dark:bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
  },
} as const;

const ICONS = {
  SALE: ShoppingCart,
  PURCHASE: PackagePlus,
  STOCK: Package,
  LOGIN: User,
} as const;

export default function RecentActivityWidget({
  dashboard,
}: RecentActivityWidgetProps) {
  const recentActivities = dashboard.recentActivities ?? [];

  return (
    <DashboardWidget title="Recent Activity" subtitle="Latest business events">
      {recentActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-3xl
              bg-slate-100
              dark:bg-muted
            "
          >
            <Package className="h-7 w-7 text-slate-400 dark:text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-foreground">
            No recent activity
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-muted-foreground">
            Sales, purchases and inventory updates will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const Icon = ICONS[activity.type];
              const styles = COLORS[activity.type];

              const isLast = index === recentActivities.length - 1;

              return (
                <div
                  key={activity.id}
                  className="
                    relative
                    flex
                    gap-3
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-sky-200
                    hover:shadow-md
                    dark:border-border
                    dark:bg-card
                    dark:hover:border-sky-500/30
                  "
                >
                  {/* Timeline */}

                  {!isLast && (
                    <div
                      className="
                        absolute
                        bottom-[-12px]
                        left-[27px]
                        top-[60px]
                        w-px
                        bg-slate-200
                        dark:bg-border
                      "
                    />
                  )}

                  {/* Activity Icon */}

                  <div
                    className={`
                      relative
                      z-10
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      ${styles.bg}
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 ${styles.text}`}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Content */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-foreground">
                          {activity.title}
                        </h3>

                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-muted-foreground">
                          {activity.subtitle}
                        </p>
                      </div>

                      <span className="shrink-0 whitespace-nowrap text-[10px] font-medium text-slate-400 dark:text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>

                    {activity.value && (
                      <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-muted dark:text-foreground">
                        {activity.value}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All */}

          <Link href="/reports" className="mt-5 block">
            <Button
              type="button"
              variant="outline"
              className="
                h-11
                w-full
                rounded-2xl
                font-semibold
                transition-all
                hover:border-sky-300
                hover:bg-sky-50
                hover:text-sky-700
                dark:hover:border-sky-500/30
                dark:hover:bg-sky-500/10
                dark:hover:text-sky-400
              "
            >
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </>
      )}
    </DashboardWidget>
  );
}
