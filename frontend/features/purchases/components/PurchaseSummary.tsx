"use client";

import { ShoppingBag, Clock3, Users, Package2 } from "lucide-react";

interface PurchaseSummaryProps {
  today: number;
  pending: number;
  suppliers: number;
  items: number;
}

export function PurchaseSummary({
  today,
  pending,
  suppliers,
  items,
}: PurchaseSummaryProps) {
  const cards = [
    {
      title: "Today's Purchase",
      value: `₹${today.toLocaleString()}`,
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-600",
      badge: "Today",
    },
    {
      title: "Pending Bills",
      value: `₹${pending.toLocaleString()}`,
      icon: Clock3,
      color: "bg-orange-500/10 text-orange-600",
      badge: "Pending",
    },
    {
      title: "Suppliers",
      value: suppliers.toLocaleString(),
      icon: Users,
      color: "bg-green-500/10 text-green-600",
      badge: "Active",
    },
    {
      title: "Items Purchased",
      value: items.toLocaleString(),
      icon: Package2,
      color: "bg-violet-500/10 text-violet-600",
      badge: "Live",
    },
  ];

  return (
    <div
      className="
      flex
      gap-4
      overflow-x-auto
      pb-2
      snap-x
      snap-mandatory
      scrollbar-hide
    "
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
            min-w-[180px]
            snap-start
            rounded-3xl
            border
            bg-card
            p-5
            shadow-sm
            transition-all
            hover:-translate-y-1
            hover:shadow-lg
          "
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}
              >
                <Icon className="size-6" />
              </div>

              <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">
                {card.badge}
              </span>
            </div>

            <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {card.title}
            </p>

            <h3 className="mt-2 text-3xl font-bold tracking-tight">
              {card.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
