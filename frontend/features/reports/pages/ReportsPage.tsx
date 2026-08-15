"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Download,
  FileBarChart,
  LineChart,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import PageContainer from "@/features/shared/ui/layout/PageContainer";

const REPORTS = [
  {
    title: "Sales Report",
    description: "Revenue, invoices & customer sales",
    href: "/reports/sales",
    icon: TrendingUp,
    value: "₹2.45L",
    label: "Revenue",
    color: "blue",
  },
  {
    title: "Purchase Report",
    description: "Supplier purchases & expenses",
    href: "/reports/purchases",
    icon: BarChart3,
    value: "₹1.82L",
    label: "Purchases",
    color: "emerald",
  },
  {
    title: "Expense Report",
    description: "Business spending analysis",
    href: "/reports/expenses",
    icon: PieChart,
    value: "₹28.4K",
    label: "Expenses",
    color: "orange",
  },
  {
    title: "Stock Report",
    description: "Inventory & stock movement",
    href: "/reports/stock",
    icon: FileBarChart,
    value: "1,248",
    label: "Products",
    color: "violet",
  },
  {
    title: "Customer Report",
    description: "Customer balances & activity",
    href: "/reports/customers",
    icon: LineChart,
    value: "386",
    label: "Customers",
    color: "cyan",
  },
  {
    title: "Supplier Report",
    description: "Supplier payments & balances",
    href: "/reports/suppliers",
    icon: BarChart3,
    value: "42",
    label: "Suppliers",
    color: "amber",
  },
  {
    title: "Profit Summary",
    description: "Net business performance",
    href: "/reports/profit",
    icon: TrendingUp,
    value: "₹65K",
    label: "Net Profit",
    color: "green",
  },
] as const;

const COLORS = {
  blue: {
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    accent: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },

  emerald: {
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    accent: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },

  orange: {
    icon: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    accent: "bg-orange-500",
    badge:
      "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  },

  violet: {
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    accent: "bg-violet-500",
    badge:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },

  cyan: {
    icon: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
    accent: "bg-cyan-500",
    badge: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
  },

  amber: {
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    accent: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },

  green: {
    icon: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    accent: "bg-green-500",
    badge:
      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  },
};

export default function ReportsPage() {
  return (
    <PageContainer className="space-y-7 pb-28">
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                             */}
      {/* ---------------------------------------------------------------- */}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          relative
          overflow-hidden
          rounded-[30px]
          bg-gradient-to-br
          from-slate-950
          via-slate-900
          to-slate-800
          p-6
          text-white
          shadow-[0_15px_50px_rgba(15,23,42,0.18)]
        "
      >
        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <FileBarChart className="h-6 w-6 text-sky-400" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">
                  Business Analytics
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  Reports Center
                </h1>
              </div>
            </div>

            <Button
              variant="secondary"
              className="hidden rounded-xl bg-white/10 text-white hover:bg-white/20 sm:flex"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-400">
            Analyze sales, purchases, inventory, customers, suppliers and
            profitability from one powerful reporting center.
          </p>

          {/* Overview */}

          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Revenue
              </p>

              <p className="mt-1 text-sm font-bold text-white">₹2.45L</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Profit
              </p>

              <p className="mt-1 text-sm font-bold text-emerald-400">₹65K</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Reports
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {REPORTS.length}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            className="mt-4 w-full rounded-xl bg-white/10 text-white hover:bg-white/20 sm:hidden"
          >
            <Download className="mr-2 h-4 w-4" />
            Export All Reports
          </Button>
        </div>
      </motion.section>

      {/* ---------------------------------------------------------------- */}
      {/* SECTION HEADER                                                    */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
            Analytics
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            Business Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
            Select a report to explore detailed insights.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          {REPORTS.length} Reports
        </span>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* REPORT GRID                                                       */}
      {/* ---------------------------------------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report, index) => {
          const Icon = report.icon;
          const styles = COLORS[report.color];

          return (
            <motion.div
              key={report.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.04, 0.25),
              }}
            >
              <Link
                href={report.href}
                className="
                  group
                  relative
                  block
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-slate-200/80
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-slate-300
                  hover:shadow-xl
                  active:scale-[0.99]
                  dark:border-border
                  dark:bg-card
                "
              >
                {/* Accent */}

                <div className={`h-1 ${styles.accent}`} />

                <div className="p-5">
                  {/* Top */}

                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.icon} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        text-slate-300
                        transition-all
                        group-hover:bg-slate-100
                        group-hover:text-slate-600
                        dark:text-slate-600
                        dark:group-hover:bg-slate-800
                        dark:group-hover:text-slate-300
                      "
                    >
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  {/* Title */}

                  <div className="mt-5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-foreground">
                      {report.title}
                    </h3>

                    <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500 dark:text-muted-foreground">
                      {report.description}
                    </p>
                  </div>

                  {/* Bottom */}

                  <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-border">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {report.label}
                      </p>

                      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground">
                        {report.value}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${styles.badge}`}
                    >
                      Live
                    </span>
                  </div>
                </div>

                {/* Bottom hover line */}

                <div
                  className={`h-0.5 w-0 ${styles.accent} transition-all duration-300 group-hover:w-full`}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                           */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-center justify-center gap-3 pt-2">
        <div className="h-px w-10 bg-slate-200 dark:bg-border" />

        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Premium ERP Analytics
        </span>

        <div className="h-px w-10 bg-slate-200 dark:bg-border" />
      </div>
    </PageContainer>
  );
}
