"use client";

import { Clock3, Package2, ShoppingBag, Users } from "lucide-react";

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
      value: `₹${today.toLocaleString("en-IN")}`,
      icon: ShoppingBag,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending Bills",
      value: `₹${pending.toLocaleString("en-IN")}`,
      icon: Clock3,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {
      title: "Suppliers",
      value: suppliers.toLocaleString("en-IN"),
      icon: Users,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Items Purchased",
      value: items.toLocaleString("en-IN"),
      icon: Package2,
      iconClass: "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">{card.title}</p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClass}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
