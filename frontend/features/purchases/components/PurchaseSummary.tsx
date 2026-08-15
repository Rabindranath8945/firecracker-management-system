"use client";

import { Clock3, Package2, ShoppingBag, Users } from "lucide-react";

import { motion } from "framer-motion";

interface PurchaseSummaryProps {
  today: number;
  pending: number;
  suppliers: number;
  items: number;
  isLoading?: boolean;
}

export function PurchaseSummary({
  today,
  pending,
  suppliers,
  items,
  isLoading = false,
}: PurchaseSummaryProps) {
  const cards = [
    {
      title: "Today's Purchase",
      value: `₹${today.toLocaleString("en-IN")}`,
      icon: ShoppingBag,
      iconClass:
        "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    },
    {
      title: "Pending Bills",
      value: `₹${pending.toLocaleString("en-IN")}`,
      icon: Clock3,
      iconClass:
        "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    },
    {
      title: "Suppliers",
      value: suppliers.toLocaleString("en-IN"),
      icon: Users,
      iconClass:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    {
      title: "Items Purchased",
      value: items.toLocaleString("en-IN"),
      icon: Package2,
      iconClass:
        "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.06,
              duration: 0.25,
            }}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:shadow-md
              dark:border-border
              dark:bg-card
            "
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-500 dark:text-muted-foreground">
                  {card.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground">
                  {isLoading ? "--" : card.value}
                </h3>
              </div>

              <div
                className={`
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  ${card.iconClass}
                `}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}
