"use client";

import { ArrowRight, BarChart3, Download, TrendingUp } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

const REPORTS = [
  {
    title: "Sales Report",
    description: "Revenue, invoices & customer sales",
    href: "/reports/sales",
    icon: TrendingUp,
    value: "₹2.45L",
    color: "from-blue-600 via-blue-500 to-cyan-400",
  },
  {
    title: "Purchase Report",
    description: "Supplier purchases & expenses",
    href: "/reports/purchases",
    icon: BarChart3,
    value: "₹1.82L",
    color: "from-emerald-600 via-green-500 to-lime-400",
  },
  {
    title: "Expense Report",
    description: "Business spending analysis",
    href: "/reports/expenses",
    icon: TrendingUp,
    value: "₹28.4K",
    color: "from-orange-600 via-orange-500 to-yellow-400",
  },
  {
    title: "Stock Report",
    description: "Inventory & stock movement",
    href: "/reports/stock",
    icon: BarChart3,
    value: "1248",
    color: "from-violet-600 via-purple-500 to-fuchsia-400",
  },
  {
    title: "Customer Report",
    description: "Customer balances & activity",
    href: "/reports/customers",
    icon: TrendingUp,
    value: "386",
    color: "from-cyan-600 via-sky-500 to-blue-400",
  },
  {
    title: "Supplier Report",
    description: "Supplier payments & balances",
    href: "/reports/suppliers",
    icon: BarChart3,
    value: "42",
    color: "from-amber-600 via-yellow-500 to-orange-400",
  },
  {
    title: "Profit Summary",
    description: "Net business performance",
    href: "/reports/profit",
    icon: TrendingUp,
    value: "₹65K",
    color: "from-emerald-700 via-emerald-500 to-teal-400",
  },
];

export default function ReportsPage() {
  return (
    <PageContainer className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Business Reports
          </h1>

          <p className="mt-2 text-muted-foreground">
            Analyze your business with powerful reports and real-time insights.
          </p>
        </div>

        <Button size="lg" className="rounded-2xl px-6">
          <Download className="mr-2 h-5 w-5" />
          Export All
        </Button>
      </div>

      {/* Grid */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report) => {
          const Icon = report.icon;

          return (
            <Link key={report.title} href={report.href}>
              <Card className="group overflow-hidden rounded-3xl border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className={`h-2 bg-gradient-to-r ${report.color}`} />

                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${report.color} text-white shadow-lg`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary" />
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground">
                      {report.description}
                    </p>

                    <h2 className="mt-2 text-xl font-bold">{report.title}</h2>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Overview
                      </p>

                      <h3 className="mt-1 text-3xl font-bold">
                        {report.value}
                      </h3>
                    </div>

                    <div
                      className={`rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${report.color}`}
                    >
                      Live
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
