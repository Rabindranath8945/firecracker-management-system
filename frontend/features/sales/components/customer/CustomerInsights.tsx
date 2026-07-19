"use client";

import { CalendarDays, CreditCard, ShoppingBag, Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";

interface CustomerInsightsProps {
  customer?: {
    name: string;
    phone: string;
    totalPurchase: number;
    dueAmount: number;
    lastPurchase: string;
    isVip: boolean;
  };
}

export function CustomerInsights({ customer }: CustomerInsightsProps) {
  if (!customer) return null;

  return (
    <Card className="rounded-3xl p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Customer Insights</h2>

        <p className="text-sm text-muted-foreground">
          Sales history & account summary
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />
            Lifetime Purchase
          </span>

          <span className="font-semibold">
            ₹{customer.totalPurchase.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            Outstanding Due
          </span>

          <span className="font-semibold text-red-500">
            ₹{customer.dueAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Last Purchase
          </span>

          <span className="font-semibold">{customer.lastPurchase}</span>
        </div>

        {customer.isVip && (
          <div className="rounded-2xl bg-amber-100 p-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />

              <span className="font-semibold text-amber-700">VIP Customer</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
