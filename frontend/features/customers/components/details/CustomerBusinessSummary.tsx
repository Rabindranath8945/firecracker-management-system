"use client";

import {
  BadgeIndianRupee,
  CreditCard,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface CustomerBusinessSummaryProps {
  openingBalance: number;
  creditLimit: number;
  notes?: string;
  isActive: boolean;
}

export default function CustomerBusinessSummary({
  openingBalance,
  creditLimit,
  notes,
  isActive,
}: CustomerBusinessSummaryProps) {
  const cards = [
    {
      title: "Opening Balance",
      value: `₹${openingBalance.toLocaleString("en-IN")}`,
      icon: BadgeIndianRupee,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Credit Limit",
      value: `₹${creditLimit.toLocaleString("en-IN")}`,
      icon: CreditCard,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Status",
      value: isActive ? "Active" : "Inactive",
      icon: ShieldCheck,
      color: isActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700",
    },
    {
      title: "Notes",
      value: notes?.trim() ? notes : "No notes available",
      icon: FileText,
      color: "bg-violet-100 text-violet-700",
      full: true,
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Business Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customer account information.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:bg-white hover:shadow-md ${
                card.full ? "col-span-2" : ""
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {card.title}
              </p>

              <p
                className={`mt-2 font-bold text-slate-900 ${
                  card.full ? "text-sm leading-6" : "text-2xl"
                }`}
              >
                {card.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
