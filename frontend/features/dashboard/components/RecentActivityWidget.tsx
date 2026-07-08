"use client";

import { ShoppingCart, PackagePlus, Package, User } from "lucide-react";
import DashboardWidget from "./DashboardWidget";

const activities = [
  {
    id: 1,
    title: "Sale Completed",
    subtitle: "Invoice #INV-10025",
    amount: "₹12,450",
    time: "10:35 AM",
    icon: ShoppingCart,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 2,
    title: "Purchase Added",
    subtitle: "Supplier: ABC Fireworks",
    amount: "₹28,500",
    time: "09:20 AM",
    icon: PackagePlus,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    title: "Stock Updated",
    subtitle: "Rocket Bomb",
    amount: "+150 Qty",
    time: "Yesterday",
    icon: Package,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 4,
    title: "User Login",
    subtitle: "Admin",
    amount: "",
    time: "Yesterday",
    icon: User,
    color: "bg-violet-100 text-violet-600",
  },
];

export default function RecentActivityWidget() {
  return (
    <DashboardWidget title="Recent Activity" subtitle="Latest business events">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${activity.color}`}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1 border-b border-slate-100 pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  <span className="text-xs text-slate-500">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {activity.subtitle}
                </p>

                {activity.amount && (
                  <p className="mt-2 font-semibold text-slate-900">
                    {activity.amount}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
