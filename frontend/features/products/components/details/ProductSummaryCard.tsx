"use client";

import { DollarSign, ShoppingCart, TrendingUp, Boxes } from "lucide-react";

const cards = [
  {
    title: "Purchase",
    value: "₹220",
    icon: ShoppingCart,
    bg: "bg-orange-50",
    color: "text-orange-600",
  },
  {
    title: "Selling",
    value: "₹320",
    icon: DollarSign,
    bg: "bg-green-50",
    color: "text-green-600",
  },
  {
    title: "Profit",
    value: "₹100",
    icon: TrendingUp,
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    title: "Stock",
    value: "250",
    icon: Boxes,
    bg: "bg-violet-50",
    color: "text-violet-600",
  },
];

export default function ProductSummaryCard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`${card.bg} rounded-3xl p-5 shadow-sm transition hover:-translate-y-1`}
          >
            <Icon className={`mb-4 h-8 w-8 ${card.color}`} />

            <p className="text-sm text-slate-500">{card.title}</p>

            <h2 className={`mt-2 text-3xl font-bold ${card.color}`}>
              {card.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}
