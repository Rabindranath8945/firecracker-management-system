"use client";

import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ExpenseStatsProps {
  todayExpense: number;
  monthExpense: number;
  yearExpense: number;
  pendingExpense: number;

  todayCount?: number;
  monthCount?: number;
  yearCount?: number;
  pendingCount?: number;
}

const stats = [
  {
    key: "today",
    title: "Today",
    icon: CalendarDays,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    amountKey: "todayExpense",
    countKey: "todayCount",
  },
  {
    key: "month",
    title: "This Month",
    icon: CalendarRange,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    amountKey: "monthExpense",
    countKey: "monthCount",
  },
  {
    key: "year",
    title: "This Year",
    icon: CalendarClock,
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    amountKey: "yearExpense",
    countKey: "yearCount",
  },
  {
    key: "pending",
    title: "Pending",
    icon: Clock3,
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
    amountKey: "pendingExpense",
    countKey: "pendingCount",
  },
] as const;

export default function ExpenseStats(props: ExpenseStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;

        const amount = props[
          item.amountKey as keyof ExpenseStatsProps
        ] as number;

        const count =
          (props[item.countKey as keyof ExpenseStatsProps] as number) ?? 0;

        return (
          <Card
            key={item.key}
            className="overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="space-y-5 p-5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                >
                  <Icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>

                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  ₹{amount.toLocaleString("en-IN")}
                </h2>

                <p className="mt-2 text-sm text-slate-500">{count} Expenses</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
