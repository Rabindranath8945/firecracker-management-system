"use client";

import { CreditCard, IndianRupee, ShieldCheck, Wallet } from "lucide-react";

interface CustomerFinancialOverviewProps {
  openingBalance: number;
  creditLimit: number;
}

export default function CustomerFinancialOverview({
  openingBalance,
  creditLimit,
}: CustomerFinancialOverviewProps) {
  const cards = [
    {
      title: "Opening Balance",
      value: `₹${openingBalance.toLocaleString("en-IN")}`,
      subtitle: "Current Balance",
      icon: Wallet,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Credit Limit",
      value: `₹${creditLimit.toLocaleString("en-IN")}`,
      subtitle: "Allowed Credit",
      icon: CreditCard,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Outstanding",
      value: `₹${openingBalance.toLocaleString("en-IN")}`,
      subtitle: "Receivable",
      icon: IndianRupee,
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Status",
      value: "Active",
      subtitle: "Customer Account",
      icon: ShieldCheck,
      color: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Financial Overview</h2>

        <p className="mt-1 text-sm text-slate-500">Customer account summary</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold text-slate-900">
                    {card.value}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
