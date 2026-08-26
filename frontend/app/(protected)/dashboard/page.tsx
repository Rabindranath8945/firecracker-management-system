"use client";

import ExecutiveHero from "@/features/dashboard/components/ExecutiveHero";
import KPIGrid from "@/features/dashboard/components/KPIGrid";
import QuickActions from "@/features/dashboard/components/QuickActions";
import SalesChart from "@/features/dashboard/components/SalesChart";
import LowStockWidget from "@/features/dashboard/components/LowStockWidget";
import RecentActivityWidget from "@/features/dashboard/components/RecentActivityWidget";
import BusinessInsightsWidget from "@/features/dashboard/components/BusinessInsightsWidget";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import Header from "@/components/layout/Header";

export default function DashboardPage() {
  const { dashboard, loading, error, isOffline } = useDashboard();

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="flex flex-col items-center text-center">
            <div
              className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-slate-200
                border-t-sky-500
                dark:border-border
                dark:border-t-sky-400
              "
            />

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-muted-foreground">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (error || !dashboard) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-red-200
              bg-white
              p-8
              text-center
              shadow-sm
              dark:border-red-500/20
              dark:bg-card
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-red-100
                text-red-600
                dark:bg-red-500/10
                dark:text-red-400
              "
            >
              !
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-foreground">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">
              {error ??
                "Something went wrong while loading your business data."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Dashboard                                                              */
  /* ---------------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <Header dashboard={dashboard} />

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          pb-10
          pt-10
          sm:px-6
          lg:px-8
        "
      >
        <div className="space-y-7">
          {/* ============================================================= */}
          {/* 01 — EXECUTIVE HERO                                           */}
          {/* ============================================================= */}

          <section>
            <ExecutiveHero dashboard={dashboard} />
          </section>

          {/* ============================================================= */}
          {/* 02 — KPI OVERVIEW                                             */}
          {/* ============================================================= */}

          <section>
            <KPIGrid dashboard={dashboard} />
          </section>

          {/* ============================================================= */}
          {/* 03 — QUICK ACTIONS                                            */}
          {/* ============================================================= */}

          <section>
            <QuickActions />
          </section>

          {/* ============================================================= */}
          {/* 04 — SALES + INSIGHTS                                         */}
          {/* ============================================================= */}

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
            {/* Sales Performance */}

            <SalesChart dashboard={dashboard} />

            {/* AI Insights */}

            <BusinessInsightsWidget dashboard={dashboard} />
          </section>

          {/* ============================================================= */}
          {/* 05 — INVENTORY + ACTIVITY                                     */}
          {/* ============================================================= */}

          <section className="grid gap-6 xl:grid-cols-2">
            {/* Low Stock */}

            <LowStockWidget dashboard={dashboard} />

            {/* Recent Activity */}

            <RecentActivityWidget dashboard={dashboard} />
          </section>
        </div>
      </div>
    </main>
  );
}
