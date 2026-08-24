"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  ChevronRight,
  FileBarChart,
  LineChart,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import PageContainer from "@/features/shared/ui/layout/PageContainer";

import { reportService } from "../services/report.service";

interface ReportOverview {
  sales: number;
  purchases: number;
  expenses: number;
  customers: number;
  suppliers: number;
  products: number;
}

const REPORTS = [
  {
    title: "Sales Report",
    description: "Revenue, invoices and customer sales",
    href: "/reports/sales",
    icon: TrendingUp,
    key: "sales",
    label: "Sales",
    iconClass: "bg-blue-50 text-blue-600",
    accent: "bg-blue-500",
  },
  {
    title: "Purchase Report",
    description: "Supplier purchases and procurement",
    href: "/reports/purchases",
    icon: ShoppingCart,
    key: "purchases",
    label: "Purchases",
    iconClass: "bg-emerald-50 text-emerald-600",
    accent: "bg-emerald-500",
  },
  {
    title: "Expense Report",
    description: "Business spending and expenses",
    href: "/reports/expenses",
    icon: Wallet,
    key: "expenses",
    label: "Expenses",
    iconClass: "bg-orange-50 text-orange-600",
    accent: "bg-orange-500",
  },
  {
    title: "Stock Report",
    description: "Inventory and current stock levels",
    href: "/reports/stock",
    icon: Boxes,
    key: "products",
    label: "Products",
    iconClass: "bg-violet-50 text-violet-600",
    accent: "bg-violet-500",
  },
  {
    title: "Customer Report",
    description: "Customer balances and business activity",
    href: "/reports/customers",
    icon: Users,
    key: "customers",
    label: "Customers",
    iconClass: "bg-cyan-50 text-cyan-600",
    accent: "bg-cyan-500",
  },
  {
    title: "Supplier Report",
    description: "Supplier purchases and payment activity",
    href: "/reports/suppliers",
    icon: BarChart3,
    key: "suppliers",
    label: "Suppliers",
    iconClass: "bg-amber-50 text-amber-600",
    accent: "bg-amber-500",
  },
  {
    title: "Profit & Loss",
    description: "Revenue, costs, expenses and profitability",
    href: "/reports/profit",
    icon: LineChart,
    key: "profit",
    label: "Profit & Loss",
    iconClass: "bg-indigo-50 text-indigo-600",
    accent: "bg-indigo-500",
  },
] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export default function ReportsPage() {
  const [overview, setOverview] = useState<ReportOverview | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function loadReports() {
    try {
      setLoading(true);
      setError(null);

      const data = await reportService.getOverview();

      setOverview(data);
    } catch (error) {
      console.error("Failed to load reports overview:", error);

      setError("Unable to load report information.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReports();
  }, []);

  /*
   * Backend overview currently provides:
   *
   * sales
   * purchases
   * expenses
   * customers
   * suppliers
   * products
   *
   * Profit is intentionally not calculated here because the overview
   * endpoint does not currently return profit.
   */

  const counts = overview;

  const reportCount = REPORTS.length;

  const totalRecords = useMemo(() => {
    if (!overview) {
      return 0;
    }

    return (
      overview.sales +
      overview.purchases +
      overview.expenses +
      overview.customers +
      overview.suppliers +
      overview.products
    );
  }, [overview]);

  return (
    <PageContainer className="space-y-7 pb-28">
      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="
          relative
          overflow-hidden
          rounded-[30px]
          border
          border-slate-200
          bg-gradient-to-br
          from-white
          via-sky-50
          to-indigo-50
          p-6
          shadow-[0_12px_40px_rgba(15,23,42,0.06)]
        "
      >
        {/* Decorative background */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-52
            w-52
            rounded-full
            bg-sky-200/40
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            left-1/3
            h-52
            w-52
            rounded-full
            bg-indigo-200/30
            blur-3xl
          "
        />

        <div className="relative">
          {/* Header */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-sky-100
                  bg-white
                  shadow-sm
                "
              >
                <FileBarChart className="h-6 w-6 text-sky-600" />
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-sky-600
                  "
                >
                  Business Analytics
                </p>

                <h1
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                  "
                >
                  Reports Center
                </h1>
              </div>
            </div>

            {/* Total reports */}

            <div
              className="
                hidden
                rounded-xl
                border
                border-white/80
                bg-white/80
                px-3
                py-2
                text-right
                shadow-sm
                backdrop-blur
                sm:block
              "
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Reports
              </p>

              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {reportCount}
              </p>
            </div>
          </div>

          <p
            className="
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            Analyze sales, purchases, inventory, customers, suppliers and
            profitability from one place.
          </p>

          {/* Overview cards */}

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <OverviewCard
              label="Sales"
              value={loading ? "—" : formatNumber(counts?.sales ?? 0)}
              description="Records"
            />

            <OverviewCard
              label="Purchases"
              value={loading ? "—" : formatNumber(counts?.purchases ?? 0)}
              description="Records"
            />

            <OverviewCard
              label="Customers"
              value={loading ? "—" : formatNumber(counts?.customers ?? 0)}
              description="Active"
            />

            <OverviewCard
              label="Products"
              value={loading ? "—" : formatNumber(counts?.products ?? 0)}
              description="Active"
            />
          </div>
        </div>
      </motion.section>

      {/* ================================================================== */}
      {/* ERROR                                                              */}
      {/* ================================================================== */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            flex
            items-center
            justify-between
            gap-4
            rounded-2xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
          "
        >
          <p className="text-sm text-red-600">{error}</p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadReports()}
            className="
              rounded-xl
              border-red-200
              bg-white
              text-slate-700
            "
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </motion.div>
      )}

      {/* ================================================================== */}
      {/* SECTION HEADER                                                      */}
      {/* ================================================================== */}

      <div className="flex items-end justify-between gap-4">
        <div>
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-sky-600
            "
          >
            Analytics
          </p>

          <h2
            className="
              mt-1
              text-xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            Business Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a report to explore detailed business insights.
          </p>
        </div>

        <span
          className="
            rounded-full
            bg-slate-100
            px-3
            py-1.5
            text-xs
            font-semibold
            text-slate-500
          "
        >
          {reportCount} Reports
        </span>
      </div>

      {/* ================================================================== */}
      {/* REPORT GRID                                                         */}
      {/* ================================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report, index) => {
          const Icon = report.icon;

          const rawValue = overview ? getReportValue(report.key, overview) : 0;

          const isCount = [
            "sales",
            "purchases",
            "expenses",
            "products",
            "customers",
            "suppliers",
          ].includes(report.key);

          const value = loading
            ? "—"
            : isCount
              ? formatNumber(rawValue)
              : "View Report";

          return (
            <motion.div
              key={report.href}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
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
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-slate-300
                    hover:shadow-xl
                    active:scale-[0.99]
                  "
              >
                {/* Accent */}

                <div className={`h-1 ${report.accent}`} />

                <div className="p-5">
                  {/* Top */}

                  <div className="flex items-start justify-between">
                    <div
                      className={`
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          ${report.iconClass}
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        `}
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
                          transition
                          group-hover:bg-slate-100
                          group-hover:text-slate-600
                        "
                    >
                      <ChevronRight
                        className="
                            h-4
                            w-4
                            transition-transform
                            group-hover:translate-x-0.5
                          "
                      />
                    </div>
                  </div>

                  {/* Content */}

                  <div className="mt-5">
                    <h3
                      className="
                          text-base
                          font-bold
                          text-slate-900
                        "
                    >
                      {report.title}
                    </h3>

                    <p
                      className="
                          mt-1
                          min-h-10
                          text-xs
                          leading-5
                          text-slate-500
                        "
                    >
                      {report.description}
                    </p>
                  </div>

                  {/* Bottom */}

                  <div
                    className="
                        mt-5
                        flex
                        items-end
                        justify-between
                        border-t
                        border-slate-100
                        pt-4
                      "
                  >
                    <div>
                      <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                      >
                        {report.label}
                      </p>

                      <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                          "
                      >
                        {value}
                      </p>
                    </div>

                    <ArrowUpRight
                      className="
                          h-4
                          w-4
                          text-slate-300
                          transition
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                          group-hover:text-slate-600
                        "
                    />
                  </div>
                </div>

                {/* Bottom hover line */}

                <div
                  className={`
                      h-0.5
                      w-0
                      ${report.accent}
                      transition-all
                      duration-300
                      group-hover:w-full
                    `}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/* FOOTER                                                              */}
      {/* ================================================================== */}

      <div className="flex items-center justify-center gap-3 pt-2">
        <div className="h-px w-10 bg-slate-200" />

        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-slate-400
          "
        >
          OneHub ERP Analytics
        </span>

        <div className="h-px w-10 bg-slate-200" />
      </div>
    </PageContainer>
  );
}

/* ========================================================================== */
/* OVERVIEW CARD                                                              */
/* ========================================================================== */

function OverviewCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white/80
        p-3
        shadow-sm
        backdrop-blur
        transition
        hover:border-slate-300
        hover:shadow-md
      "
    >
      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
          tracking-tight
          text-slate-900
        "
      >
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-400">{description}</p>
    </div>
  );
}

/* ========================================================================== */
/* REPORT VALUE                                                               */
/* ========================================================================== */

function getReportValue(key: string, overview: ReportOverview): number {
  switch (key) {
    case "sales":
      return overview.sales;

    case "purchases":
      return overview.purchases;

    case "expenses":
      return overview.expenses;

    case "products":
      return overview.products;

    case "customers":
      return overview.customers;

    case "suppliers":
      return overview.suppliers;

    /*
     * Profit is not returned by the current overview endpoint.
     * The detailed Profit & Loss page calculates it separately.
     */
    case "profit":
      return 0;

    default:
      return 0;
  }
}
