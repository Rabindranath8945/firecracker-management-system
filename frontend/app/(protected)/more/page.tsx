"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  ChartColumn,
  CircleDollarSign,
  CreditCard,
  FileSpreadsheet,
  FileText,
  PackageSearch,
  Receipt,
  Settings,
  Tags,
  Truck,
  UserRound,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

interface StoreModule {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: keyof typeof colorStyles;
}

const modules: StoreModule[] = [
  {
    title: "Customers",
    description: "Manage customers and outstanding dues",
    href: "/customers",
    icon: Users,
    color: "emerald",
  },
  {
    title: "Suppliers",
    description: "Suppliers, purchases and payments",
    href: "/suppliers",
    icon: Truck,
    color: "sky",
  },
  {
    title: "Expenses",
    description: "Track and manage business expenses",
    href: "/expenses",
    icon: Receipt,
    color: "orange",
  },
  {
    title: "Accounts",
    description: "Cash, bank and business balances",
    href: "/accounts",
    icon: CircleDollarSign,
    color: "blue",
  },
  {
    title: "Stock",
    description: "Inventory and stock adjustments",
    href: "/stock",
    icon: Boxes,
    color: "amber",
  },
  {
    title: "Categories",
    description: "Organize your product categories",
    href: "/categories",
    icon: Tags,
    color: "pink",
  },
  {
    title: "Reports",
    description: "Business performance and analytics",
    href: "/reports",
    icon: ChartColumn,
    color: "indigo",
  },
  {
    title: "Invoices",
    description: "Invoices and business documents",
    href: "/invoices",
    icon: FileText,
    color: "cyan",
  },
  {
    title: "Payments",
    description: "Payment transactions and history",
    href: "/payments",
    icon: CreditCard,
    color: "green",
  },
  {
    title: "Users",
    description: "Users, roles and permissions",
    href: "/users",
    icon: UserRound,
    color: "purple",
  },
  {
    title: "Settings",
    description: "Business and application settings",
    href: "/settings",
    icon: Settings,
    color: "slate",
  },

  {
    title: "Import & Export",
    description: "Import and export your business data",
    href: "/import-export",
    icon: FileSpreadsheet,
    color: "teal",
  },
];

const colorStyles = {
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    icon: "text-emerald-600 dark:text-emerald-400",
    glow: "group-hover:bg-emerald-500/5",
  },

  sky: {
    bg: "bg-sky-100 dark:bg-sky-500/10",
    icon: "text-sky-600 dark:text-sky-400",
    glow: "group-hover:bg-sky-500/5",
  },

  violet: {
    bg: "bg-violet-100 dark:bg-violet-500/10",
    icon: "text-violet-600 dark:text-violet-400",
    glow: "group-hover:bg-violet-500/5",
  },

  orange: {
    bg: "bg-orange-100 dark:bg-orange-500/10",
    icon: "text-orange-600 dark:text-orange-400",
    glow: "group-hover:bg-orange-500/5",
  },

  blue: {
    bg: "bg-blue-100 dark:bg-blue-500/10",
    icon: "text-blue-600 dark:text-blue-400",
    glow: "group-hover:bg-blue-500/5",
  },

  amber: {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    icon: "text-amber-600 dark:text-amber-400",
    glow: "group-hover:bg-amber-500/5",
  },

  pink: {
    bg: "bg-pink-100 dark:bg-pink-500/10",
    icon: "text-pink-600 dark:text-pink-400",
    glow: "group-hover:bg-pink-500/5",
  },

  teal: {
    bg: "bg-teal-100 dark:bg-teal-500/10",
    icon: "text-teal-600 dark:text-teal-400",
    glow: "group-hover:bg-teal-500/5",
  },

  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-500/10",
    icon: "text-indigo-600 dark:text-indigo-400",
    glow: "group-hover:bg-indigo-500/5",
  },

  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-500/10",
    icon: "text-cyan-600 dark:text-cyan-400",
    glow: "group-hover:bg-cyan-500/5",
  },

  green: {
    bg: "bg-green-100 dark:bg-green-500/10",
    icon: "text-green-600 dark:text-green-400",
    glow: "group-hover:bg-green-500/5",
  },

  purple: {
    bg: "bg-purple-100 dark:bg-purple-500/10",
    icon: "text-purple-600 dark:text-purple-400",
    glow: "group-hover:bg-purple-500/5",
  },

  slate: {
    bg: "bg-slate-100 dark:bg-slate-500/10",
    icon: "text-slate-600 dark:text-slate-400",
    glow: "group-hover:bg-slate-500/5",
  },
};

export default function MorePage() {
  const { dashboard, loading } = useDashboard();

  const businessName = dashboard?.business.name ?? "My Business";

  const businessId = dashboard?.business.businessId ?? "-";

  const ownerName = dashboard?.owner.name ?? "Owner";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pb-32 pt-6">
        {/* ---------------------------------------------------------------- */}
        {/* PAGE HEADER                                                       */}
        {/* ---------------------------------------------------------------- */}

        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7"
        >
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-500/10">
              <PackageSearch className="h-4 w-4" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
              Business Management
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            More
          </h1>

          <p className="mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-muted-foreground">
            Everything you need to manage your business from one place.
          </p>
        </motion.header>

        {/* ---------------------------------------------------------------- */}
        {/* ERP CONTROL CENTER                                                */}
        {/* ---------------------------------------------------------------- */}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="
            relative
            mb-7
            overflow-hidden
            rounded-[28px]
            bg-gradient-to-br
            from-slate-950
            via-slate-900
            to-slate-800
            p-5
            text-white
            shadow-[0_12px_40px_rgba(15,23,42,0.18)]
          "
        >
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-12 left-1/2 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />

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
                border
                border-white/10
                bg-white/10
                shadow-inner
              "
            >
              <BookOpen className="h-6 w-6 text-sky-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-400">
                  OneHub ERP Control Center
                </p>
              </div>

              {/* Business Name */}

              <h2 className="mt-1 truncate text-xl font-bold tracking-tight">
                {loading ? "Loading..." : businessName}
              </h2>

              {/* Business ID */}

              <p className="mt-1 text-xs text-slate-400">
                Business ID:{" "}
                <span className="font-semibold text-slate-300">
                  {businessId}
                </span>
              </p>

              {/* Owner */}

              <p className="mt-1 text-xs text-slate-400">
                Owner:{" "}
                <span className="font-semibold text-slate-300">
                  {ownerName}
                </span>
              </p>

              <p className="mt-3 max-w-sm text-xs leading-5 text-slate-400">
                Customers, suppliers, inventory, accounts, reports and more —
                all organized in one powerful workspace.
              </p>
            </div>
          </div>

          {/* Bottom indicator */}

          <div className="relative mt-5 flex items-center gap-2 border-t border-white/10 pt-3">
            <span className="text-[10px] font-medium text-slate-500">
              {modules.length} business modules
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-600" />

            <span className="text-[10px] font-medium text-emerald-400">
              All in one place
            </span>
          </div>
        </motion.section>

        {/* ---------------------------------------------------------------- */}
        {/* MODULES                                                          */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-foreground">
                Business Modules
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-muted-foreground">
                Choose a module to continue
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              {modules.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const styles = colorStyles[module.color];

              return (
                <motion.div
                  key={module.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.035, 0.3),
                  }}
                >
                  <Link
                    href={module.href}
                    className={`
                      group
                      relative
                      block
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-slate-200/80
                      bg-white
                      p-4
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-slate-300
                      hover:shadow-[0_10px_30px_rgba(15,23,42,0.09)]
                      active:scale-[0.98]
                      dark:border-border
                      dark:bg-card
                      ${styles.glow}
                    `}
                  >
                    {/* Hover background */}

                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-current opacity-[0.025] blur-2xl" />
                    </div>

                    <div className="relative">
                      {/* Icon + Arrow */}

                      <div className="flex items-start justify-between">
                        <div
                          className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-2xl
                            transition-transform
                            duration-300
                            group-hover:scale-105
                            ${styles.bg}
                          `}
                        >
                          <Icon className={`h-5 w-5 ${styles.icon}`} />
                        </div>

                        <div
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            text-slate-300
                            transition-all
                            duration-300
                            group-hover:bg-slate-100
                            group-hover:text-slate-600
                            dark:text-slate-600
                            dark:group-hover:bg-slate-800
                            dark:group-hover:text-slate-300
                          "
                        >
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>

                      {/* Text */}

                      <h3 className="mt-4 truncate text-sm font-bold text-slate-900 dark:text-foreground">
                        {module.title}
                      </h3>

                      <p className="mt-1 min-h-8 text-[11px] leading-4 text-slate-500 dark:text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                           */}
        {/* ---------------------------------------------------------------- */}

        <footer className="mt-10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-slate-200 dark:bg-border" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              OneHub ERP
            </span>

            <div className="h-px w-10 bg-slate-200 dark:bg-border" />
          </div>

          <p className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
            Version 1.0.0
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Built with <span className="text-red-500">♥</span> by{" "}
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              Mahendra Tech Solutions
            </span>
          </p>
        </footer>
      </div>
    </main>
  );
}
