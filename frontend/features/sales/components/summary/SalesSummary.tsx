"use client";

import { motion } from "framer-motion";
import { IndianRupee, Receipt, ShoppingCart, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";

import { useSalesSummary } from "../../hooks/useSalesSummary";

const COLORS = [
  {
    bg: "bg-violet-100 dark:bg-violet-500/15",
    text: "text-violet-700 dark:text-violet-300",
  },
  {
    bg: "bg-indigo-100 dark:bg-indigo-500/15",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  {
    bg: "bg-sky-100 dark:bg-sky-500/15",
    text: "text-sky-700 dark:text-sky-300",
  },
  {
    bg: "bg-emerald-100 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-300",
  },
];

export function SalesSummary() {
  const { data, isLoading } = useSalesSummary();

  const summary = data;

  const cards = [
    {
      title: "Today's Sales",
      value: `₹${summary?.todaySales ?? 0}`,
      icon: IndianRupee,
      bg: "bg-violet-100 dark:bg-violet-500/15",
      text: "text-violet-700 dark:text-violet-300",
    },
    {
      title: "Orders",
      value: summary?.todayOrders ?? 0,
      icon: Receipt,
      bg: "bg-indigo-100 dark:bg-indigo-500/15",
      text: "text-indigo-700 dark:text-indigo-300",
    },
    {
      title: "Items Sold",
      value: summary?.itemsSold ?? 0,
      icon: ShoppingCart,
      bg: "bg-sky-100 dark:bg-sky-500/15",
      text: "text-sky-700 dark:text-sky-300",
    },
    {
      title: "Profit",
      value: `₹${summary?.todayProfit ?? 0}`,
      icon: TrendingUp,
      bg: "bg-emerald-100 dark:bg-emerald-500/15",
      text: "text-emerald-700 dark:text-emerald-300",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="rounded-3xl border p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold tracking-tight">
                    {isLoading ? "--" : card.value}
                  </h2>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
                >
                  <Icon className={`h-7 w-7 ${card.text}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
