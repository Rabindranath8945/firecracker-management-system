"use client";

import { ReceiptText, ShoppingCart } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useSaleCalculation } from "../../hooks/useSaleCalculation";

export function SalesTotals() {
  const { totalItems, subtotal, discount, grandTotal } = useSaleCalculation();

  return (
    <Card className="rounded-3xl p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-3">
          <ReceiptText className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="font-semibold">Order Summary</h2>

          <p className="text-sm text-muted-foreground">Live calculation</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items</span>

          <span className="flex items-center gap-1 font-medium">
            <ShoppingCart className="h-4 w-4" />
            {totalItems}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>

          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Discount</span>

          <span className="font-medium text-red-500">
            - ₹{discount.toFixed(2)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>

          <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}
