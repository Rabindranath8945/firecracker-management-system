"use client";

import { TrendingUp, AlertTriangle, Trophy, Lightbulb } from "lucide-react";

import DashboardWidget from "./DashboardWidget";

const insights = [
  {
    id: 1,
    title: "Sales Growth",
    description: "Today's sales increased by 18% compared to yesterday.",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: 2,
    title: "Low Stock Alert",
    description: "12 products have reached the minimum stock level.",
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 3,
    title: "Best Seller",
    description: "Rocket Bomb is the highest-selling product today.",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 4,
    title: "Suggestion",
    description: "Restock sparklers before the weekend demand increases.",
    icon: Lightbulb,
    color: "bg-blue-100 text-blue-600",
  },
];

export default function BusinessInsightsWidget() {
  return (
    <DashboardWidget
      title="Business Insights"
      subtitle="AI-powered business summary"
    >
      <div className="space-y-4">
        {insights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
