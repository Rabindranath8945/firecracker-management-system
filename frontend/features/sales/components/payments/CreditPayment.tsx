"use client";

import { BadgeDollarSign, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CreditPaymentProps {
  amount: number;
  loading: boolean;
  onSuccess: (receivedAmount: number) => void | Promise<void>;
}

export default function CreditPayment({
  amount,
  loading,
  onSuccess,
}: CreditPaymentProps) {
  return (
    <Card className="rounded-3xl border p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-amber-100
          "
        >
          <BadgeDollarSign className="h-6 w-6 text-amber-600" />
        </div>

        <div>
          <h3 className="font-semibold">Credit Sale</h3>

          <p className="text-sm text-muted-foreground">
            Customer will pay later
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-5">
        <p className="text-sm text-muted-foreground">Amount Due</p>

        <p className="mt-1 text-3xl font-black text-amber-600">
          ₹{amount.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-800">
          No payment collected
        </p>

        <p className="mt-1 text-xs text-amber-700">
          This amount will be added to the customer's outstanding balance.
        </p>
      </div>

      <Button
        type="button"
        disabled={loading}
        onClick={() => onSuccess(0)}
        className="
          mt-6
          h-14
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-amber-500
          to-orange-500
          text-base
          font-bold
          text-white
        "
      >
        <CheckCircle2 className="mr-2 h-5 w-5" />

        {loading ? "Creating Credit Sale..." : "Complete Credit Sale"}
      </Button>
    </Card>
  );
}
