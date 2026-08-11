"use client";

import { useMemo, useState } from "react";
import { Banknote, CheckCircle2, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CashPaymentProps {
  amount: number;
  loading: boolean;
  onSuccess: (receivedAmount: number) => void | Promise<void>;
}

export default function CashPayment({
  amount,
  loading,
  onSuccess,
}: CashPaymentProps) {
  const [cashReceived, setCashReceived] = useState<number>(amount);

  /* ---------------------------------------------------------------------- */
  /* Payment Calculation                                                    */
  /* ---------------------------------------------------------------------- */

  const change = useMemo(() => {
    return Math.max(0, cashReceived - amount);
  }, [cashReceived, amount]);

  const remaining = useMemo(() => {
    return Math.max(0, amount - cashReceived);
  }, [cashReceived, amount]);

  /*
   * Partial payment is allowed.
   *
   * Example:
   * Bill       ₹206.50
   * Received   ₹106
   * Remaining  ₹100.50
   *
   * Payment button should still be enabled.
   */
  const canComplete = cashReceived > 0 && cashReceived <= amount && !loading;

  return (
    <Card className="rounded-3xl border p-5 shadow-sm">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}

      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-100 p-3">
          <Banknote className="h-6 w-6 text-emerald-700" />
        </div>

        <div>
          <h3 className="font-bold">Cash Payment</h3>

          <p className="text-sm text-muted-foreground">
            Collect cash from customer
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Bill Amount                                                      */}
      {/* ---------------------------------------------------------------- */}

      <div className="mb-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm text-muted-foreground">Bill Amount</p>

        <h2 className="mt-1 text-3xl font-black text-violet-700">
          ₹{amount.toLocaleString("en-IN")}
        </h2>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Cash Received                                                    */}
      {/* ---------------------------------------------------------------- */}

      <div>
        <label
          htmlFor="cash-received"
          className="mb-2 block text-sm font-semibold"
        >
          Cash Received
        </label>

        <Input
          id="cash-received"
          type="number"
          min={0}
          value={cashReceived}
          onChange={(event) => {
            const value = Number(event.target.value);

            setCashReceived(Number.isFinite(value) && value >= 0 ? value : 0);
          }}
          disabled={loading}
          className="h-14 rounded-2xl text-center text-2xl font-bold"
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Exact Amount                                                     */}
      {/* ---------------------------------------------------------------- */}

      <div className="mt-5">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => setCashReceived(amount)}
          className="h-12 w-full rounded-2xl"
        >
          Exact
        </Button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Payment Summary                                                  */}
      {/* ---------------------------------------------------------------- */}

      <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4">
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Received</span>

          <span className="font-semibold">
            ₹{cashReceived.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Change Return</span>

          <span className="font-semibold text-emerald-600">
            ₹{change.toLocaleString("en-IN")}
          </span>
        </div>

        {remaining > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-red-600">Remaining</span>

            <span className="font-bold text-red-600">
              ₹{remaining.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Complete Payment                                                 */}
      {/* ---------------------------------------------------------------- */}

      <Button
        type="button"
        disabled={!canComplete}
        onClick={() => onSuccess(cashReceived)}
        className="
          mt-6
          h-14
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-emerald-600
          to-green-600
          text-base
          font-bold
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Complete Cash Payment
          </>
        )}
      </Button>
    </Card>
  );
}
