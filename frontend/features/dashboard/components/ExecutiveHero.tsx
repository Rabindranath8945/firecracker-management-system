"use client";

import { ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";

import type { DashboardSummary } from "../types/dashboard.type";

interface ExecutiveHeroProps {
  dashboard: DashboardSummary;
}

export default function ExecutiveHero({ dashboard }: ExecutiveHeroProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const ownerName = dashboard.owner.name || "Owner";

  const todaySales = Number(dashboard.todaySales ?? 0);

  const salesGrowth = Number(dashboard.salesGrowth ?? 0);

  const formattedSales = todaySales.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/70
        bg-gradient-to-br
        from-white
        via-white
        to-sky-50
        p-5
        shadow-sm
        dark:border-border
        dark:from-card
        dark:via-card
        dark:to-sky-950/20
      "
    >
      {/* Decorative background */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-sky-400/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-10
          h-32
          w-32
          rounded-full
          bg-violet-400/10
          blur-3xl
        "
      />

      <div className="relative">
        {/* Greeting */}

        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
              bg-sky-100
              text-sky-600
              dark:bg-sky-500/10
              dark:text-sky-400
            "
          >
            <Sparkles className="h-4 w-4" />
          </div>

          <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
            {greeting}
          </span>
        </div>

        {/* Welcome */}

        <h2
          className="
            mt-4
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-foreground
            sm:text-3xl
          "
        >
          Welcome back, {ownerName}.
        </h2>

        <p
          className="
            mt-2
            max-w-md
            text-sm
            leading-6
            text-slate-500
            dark:text-muted-foreground
          "
        >
          Here's what's happening in your business today.
        </p>

        {/* Today's Performance */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            gap-4
            rounded-2xl
            border
            border-slate-200/70
            bg-white/70
            p-4
            backdrop-blur-sm
            dark:border-border
            dark:bg-background/30
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-slate-400
                dark:text-muted-foreground
              "
            >
              Today's Sales
            </p>

            <p
              className="
                mt-1
                truncate
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-foreground
              "
            >
              ₹{formattedSales}
            </p>
          </div>

          {salesGrowth !== 0 && (
            <div
              className={`
                flex
                shrink-0
                items-center
                gap-1.5
                rounded-xl
                px-3
                py-2
                text-xs
                font-bold
                ${
                  salesGrowth > 0
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                }
              `}
            >
              <TrendingUp
                className={`h-3.5 w-3.5 ${salesGrowth < 0 ? "rotate-90" : ""}`}
              />
              {salesGrowth > 0 ? "+" : ""}
              {salesGrowth.toFixed(1)}%
            </div>
          )}
        </div>

        {/* Business status */}

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <ArrowUpRight className="h-3 w-3" />
          </span>

          <span>
            {dashboard.lowStock > 0
              ? `${dashboard.lowStock} product${
                  dashboard.lowStock !== 1 ? "s" : ""
                } need restocking`
              : "Inventory is in good condition"}
          </span>
        </div>
      </div>
    </section>
  );
}
