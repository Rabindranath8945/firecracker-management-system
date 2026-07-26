"use client";

import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import DashboardWidget from "./DashboardWidget";
import { Button } from "@/components/ui/button";
import type { BusinessInsight } from "../types/dashboard.type";

interface BusinessInsightsWidgetProps {
  insights: BusinessInsight[];
}

const COLORS = {
  SUCCESS: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
  },

  WARNING: {
    bg: "bg-amber-100",
    text: "text-amber-600",
  },

  BEST_SELLER: {
    bg: "bg-violet-100",
    text: "text-violet-600",
  },

  SUGGESTION: {
    bg: "bg-sky-100",
    text: "text-sky-600",
  },
} as const;

const ICONS = {
  SUCCESS: TrendingUp,
  WARNING: AlertTriangle,
  BEST_SELLER: Trophy,
  SUGGESTION: Lightbulb,
} as const;

export default function BusinessInsightsWidget({
  insights,
}: BusinessInsightsWidgetProps) {
  if (insights.length === 0) {
    return (
      <DashboardWidget
        title="OneHub AI Insights"
        subtitle="Smart recommendations"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <BrainCircuit className="h-12 w-12 text-slate-300" />

          <h3 className="mt-4 text-lg font-semibold">No insights available</h3>

          <p className="mt-2 text-center text-sm text-slate-500">
            AI recommendations will appear once enough business data is
            available.
          </p>
        </div>
      </DashboardWidget>
    );
  }
  return (
    <DashboardWidget
      title="OneHub AI Insights"
      subtitle="Smart recommendations for your business"
    >
      {/* Hero */}

      <div className="mb-6 rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
            <BrainCircuit className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />

              <span className="text-sm font-medium">AI Business Assistant</span>
            </div>

            <h3 className="mt-3 text-2xl font-bold">
              Your business looks healthy today.
            </h3>

            <p className="mt-2 text-sm leading-6 text-sky-100">
              Sales are improving and only a few products require attention.
              Review the recommendations below to maximise your revenue.
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}

      <div className="space-y-4">
        {insights.map((item) => {
          const Icon = ICONS[item.type];

          const styles = COLORS[item.type];

          return (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl ${styles.bg} p-3`}>
                  <Icon className={`h-6 w-6 ${styles.text}`} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}

      <Button variant="outline" className="mt-6 w-full rounded-2xl">
        <Link href="/reports">
          View Detailed Insights
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </DashboardWidget>
  );
}
