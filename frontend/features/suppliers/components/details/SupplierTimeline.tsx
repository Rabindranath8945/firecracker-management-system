"use client";

import { CreditCard, FileText, ShoppingBag, UserPlus } from "lucide-react";

export default function SupplierTimeline() {
  const timeline = [
    {
      title: "Supplier Created",
      description: "Supplier profile was added.",
      time: "15 Jul 2026 • 09:20 AM",
      icon: UserPlus,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Purchase Bill Created",
      description: "Purchase Bill PUR-1001 generated.",
      time: "16 Jul 2026 • 11:15 AM",
      icon: FileText,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Payment Made",
      description: "₹2,500 payment paid to supplier.",
      time: "17 Jul 2026 • 04:45 PM",
      icon: CreditCard,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "New Purchase",
      description: "Products purchased from supplier.",
      time: "18 Jul 2026 • 06:20 PM",
      icon: ShoppingBag,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Activity Timeline</h2>

        <p className="mt-1 text-sm text-slate-500">
          Recent supplier activities
        </p>
      </div>

      <div className="space-y-6">
        {timeline.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {index !== timeline.length - 1 && (
                  <div className="mt-2 h-12 w-px bg-slate-200" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>

                <p className="mt-2 text-xs text-slate-400">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
