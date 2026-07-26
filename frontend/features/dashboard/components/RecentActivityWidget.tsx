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

import type { RecentActivity } from "../types/dashboard.type";

interface RecentActivityWidgetProps {
  activities: RecentActivity[];
}

const COLORS = {
  SALE: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
  },

  PURCHASE: {
    bg: "bg-sky-100",
    text: "text-sky-600",
  },

  STOCK: {
    bg: "bg-amber-100",
    text: "text-amber-600",
  },

  LOGIN: {
    bg: "bg-violet-100",
    text: "text-violet-600",
  },
} as const;

const ICONS = {
  SALE: ShoppingCart,
  PURCHASE: PackagePlus,
  STOCK: Package,
  LOGIN: User,
} as const;

export default function RecentActivityWidget({
  activities,
}: RecentActivityWidgetProps) {
  return (
    <DashboardWidget title="Recent Activity" subtitle="Latest business events">
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-slate-300" />

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No recent activity
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
            Sales, purchases and inventory updates will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {activities.map((activity, index) => {
              const Icon = ICONS[activity.type];

              const styles = COLORS[activity.type];

              return (
                <div
                  key={activity.id}
                  className="relative flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-sky-200 hover:shadow-md"
                >
                  {index !== activities.length - 1 && (
                    <div className="absolute left-[34px] top-14 h-10 w-px bg-slate-200" />
                  )}

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${styles.text}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {activity.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {activity.subtitle}
                        </p>
                      </div>

                      <span className="whitespace-nowrap text-xs text-slate-400">
                        {activity.time}
                      </span>
                    </div>

                    {activity.value && (
                      <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
                        {activity.value}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Button variant="outline" className="mt-6 w-full rounded-2xl">
            <Link href="/reports">
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </>
      )}
    </DashboardWidget>
  );
}
