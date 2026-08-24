"use client";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  Wallet,
} from "lucide-react";

interface Props {
  outstanding?: number;
  totalPurchases?: number;
  totalPayments?: number;
  advancePaid?: number;
}

export default function SupplierFinancialOverview({
  outstanding = 0,
  totalPurchases = 0,
  totalPayments = 0,
  advancePaid = 0,
}: Props) {
  const cards = [
    {
      title: "Outstanding Payable",
      value: outstanding,
      icon: Wallet,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Total Purchases",
      value: totalPurchases,
      icon: ArrowUpCircle,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total Payments",
      value: totalPayments,
      icon: CreditCard,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Advance Paid",
      value: advancePaid,
      icon: ArrowDownCircle,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Financial Overview</h2>

        <p className="mt-1 text-sm text-slate-500">
          Business relationship summary
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <h3 className="mt-5 break-all text-2xl font-bold text-slate-900">
                ₹{Number(card.value ?? 0).toLocaleString("en-IN")}
              </h3>

              <p className="mt-2 text-sm text-slate-500">{card.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
