"use client";

import { TrendingUp, Wallet, ShoppingBag } from "lucide-react";
import AppCard from "@/components/layout/AppCard";

interface ExecutiveHeroProps {
  userName: string;
  todaySales: number;
  todayProfit: number;
  monthlyRevenue: number;
}

export default function ExecutiveHero({
  userName,
  todaySales,
  todayProfit,
  monthlyRevenue,
}: ExecutiveHeroProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <AppCard className="bg-gradient-to-r from-red-600 to-orange-500 text-white border-0 shadow-lg">
      <div className="space-y-5">
        <div>
          <p className="text-sm text-red-100">{greeting} 👋</p>

          <h2 className="text-2xl font-bold">{userName}</h2>

          <p className="text-sm text-red-100 mt-1">
            Welcome back to Firecracker Management
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <ShoppingBag className="mb-1 h-5 w-5" />
            <p className="text-xs text-red-100">Today's Sales</p>
            <p className="font-bold">₹{todaySales.toLocaleString()}</p>
          </div>

          <div>
            <Wallet className="mb-1 h-5 w-5" />
            <p className="text-xs text-red-100">Profit</p>
            <p className="font-bold">₹{todayProfit.toLocaleString()}</p>
          </div>

          <div>
            <TrendingUp className="mb-1 h-5 w-5" />
            <p className="text-xs text-red-100">This Month</p>
            <p className="font-bold">₹{monthlyRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </AppCard>
  );
}
