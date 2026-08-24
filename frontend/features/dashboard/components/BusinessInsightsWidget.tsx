"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";

import DashboardWidget from "./DashboardWidget";
import { Button } from "@/components/ui/button";

import type { DashboardSummary } from "../types/dashboard.type";

interface BusinessInsightsWidgetProps {
  dashboard: DashboardSummary;
}

const COLORS = {
  SUCCESS: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },

  WARNING: {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },

  BEST_SELLER: {
    bg: "bg-violet-100 dark:bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
  },

  SUGGESTION: {
    bg: "bg-sky-100 dark:bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
  },
} as const;

const ICONS = {
  SUCCESS: TrendingUp,
  WARNING: AlertTriangle,
  BEST_SELLER: Trophy,
  SUGGESTION: Lightbulb,
} as const;

export default function BusinessInsightsWidget({
  dashboard,
}: BusinessInsightsWidgetProps) {
  const insights = dashboard.insights ?? [];

  const hasWarning = insights.some((item) => item.type === "WARNING");

  return (
    <DashboardWidget
      title="OneHub AI Insights"
      subtitle="Smart recommendations for your business"
    >
      {/* ------------------------------------------------------------------ */}
      {/* EMPTY STATE                                                        */}
      {/* ------------------------------------------------------------------ */}

      {insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-sky-100
              dark:bg-sky-500/10
            "
          >
            <BrainCircuit className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-foreground">
            No insights available
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-muted-foreground">
            Business recommendations will appear as more sales, inventory, and
            payment data becomes available.
          </p>
        </div>
      ) : (
        <>
          {/* -------------------------------------------------------------- */}
          {/* AI HERO                                                        */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              relative
              mb-6
              overflow-hidden
              rounded-3xl
              bg-gradient-to-br
              from-sky-600
              via-cyan-600
              to-blue-700
              p-5
              text-white
              shadow-lg
            "
          >
            {/* Decorative glow */}

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex items-start gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/15
                  shadow-inner
                  backdrop-blur
                "
              >
                <BrainCircuit className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />

                  <span className="text-xs font-semibold uppercase tracking-wide text-sky-100">
                    AI Business Assistant
                  </span>
                </div>

                <h3 className="mt-2 text-xl font-bold">
                  {hasWarning
                    ? "Your business needs attention."
                    : "Your business is looking healthy."}
                </h3>

                <p className="mt-2 text-sm leading-6 text-sky-100">
                  {hasWarning
                    ? "A few areas require your attention. Review the recommendations below."
                    : "Here are the latest recommendations based on your business activity."}
                </p>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* INSIGHTS                                                        */}
          {/* -------------------------------------------------------------- */}

          <div className="space-y-3">
            {insights.map((item) => {
              const Icon = ICONS[item.type];
              const styles = COLORS[item.type];

              return (
                <div
                  key={item.id}
                  className="
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
                  <div className="flex items-start gap-3">
                    <div
                      className={`
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

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-foreground">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* FOOTER                                                         */}
          {/* -------------------------------------------------------------- */}

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
              View Detailed Insights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </>
      )}
    </DashboardWidget>
  );
}
