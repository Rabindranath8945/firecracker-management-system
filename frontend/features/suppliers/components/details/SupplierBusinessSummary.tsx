"use client";

import {
  Calendar,
  CreditCard,
  FileText,
  IndianRupee,
  ShoppingBag,
  Wallet,
} from "lucide-react";

interface Props {
  openingBalance: number;
  outstanding: number;
}

export default function SupplierBusinessSummary({
  openingBalance,
  outstanding,
}: Props) {
  const cards = [
    {
      title: "Opening Balance",
      value: `₹${openingBalance.toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Outstanding Payable",
      value: `₹${outstanding.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Lifetime Purchases",
      value: "₹24,500",
      icon: ShoppingBag,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Bills",
      value: "18",
      icon: FileText,
      color: "bg-violet-100 text-violet-700",
    },
    {
      title: "Payments",
      value: "16",
      icon: CreditCard,
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Last Purchase",
      value: "12 Jul",
      icon: Calendar,
      color: "bg-cyan-100 text-cyan-700",
    },
  ];

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Business Summary</h2>

          <p className="mt-1 text-sm text-slate-500">
            Supplier financial overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <h3 className="break-all text-xl font-bold">{card.value}</h3>

              <p className="mt-2 text-sm text-slate-500">{card.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
