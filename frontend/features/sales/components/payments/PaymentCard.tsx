"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BadgeCheck,
  Banknote,
  CreditCard,
  Landmark,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getQuickAmounts } from "@/features/sales/utils/payment";
import { useSaleStore } from "@/features/sales/store/useSaleStore";
import { useSaleCalculation } from "../../hooks/useSaleCalculation";

const METHODS = [
  {
    value: "CASH",
    label: "Cash",
    icon: Banknote,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    value: "UPI",
    label: "UPI",
    icon: Landmark,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    value: "MIXED",
    label: "Mixed",
    icon: WalletCards,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    value: "CREDIT",
    label: "Credit",
    icon: CreditCard,
    gradient: "from-orange-500 to-red-500",
  },
] as const;

export function PaymentCard() {
  /* -------------------------------------------------------------------------- */
  /* Store */
  /* -------------------------------------------------------------------------- */

  const paymentMethod = useSaleStore((s) => s.paymentMethod);

  const setPaymentMethod = useSaleStore((s) => s.setPaymentMethod);

  const paidAmount = useSaleStore((s) => s.paidAmount);

  const setPaidAmount = useSaleStore((s) => s.setPaidAmount);

  /* -------------------------------------------------------------------------- */
  /* Calculation */
  /* -------------------------------------------------------------------------- */

  const { grandTotal, totalItems, dueAmount, changeAmount } =
    useSaleCalculation();

  /* -------------------------------------------------------------------------- */
  /* Smart Quick Buttons */
  /* -------------------------------------------------------------------------- */

  const quickAmounts = getQuickAmounts(grandTotal);

  /* -------------------------------------------------------------------------- */
  /* Payment Status */
  /* -------------------------------------------------------------------------- */

  const paymentStatus =
    paidAmount <= 0
      ? {
          title: "Waiting for Payment",
          subtitle: "Enter received amount",
          icon: CreditCard,
          bg: "bg-slate-100",
          text: "text-slate-700",
        }
      : paidAmount < grandTotal
        ? {
            title: `Collect ₹${dueAmount.toFixed(2)}`,
            subtitle: "Pending payment",
            icon: ArrowDownCircle,
            bg: "bg-red-100",
            text: "text-red-700",
          }
        : paidAmount === grandTotal
          ? {
              title: "Exact Payment",
              subtitle: "No balance remaining",
              icon: BadgeCheck,
              bg: "bg-emerald-100",
              text: "text-emerald-700",
            }
          : {
              title: `Return ₹${changeAmount.toFixed(2)}`,
              subtitle: "Return change",
              icon: ArrowUpCircle,
              bg: "bg-blue-100",
              text: "text-blue-700",
            };

  const StatusIcon = paymentStatus.icon;

  /* -------------------------------------------------------------------------- */
  /* JSX */
  /* -------------------------------------------------------------------------- */

  return (
    <Card className="rounded-3xl border-0 p-5 shadow-sm">
      {/* ---------------------------------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------------------------------- */}

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-100 p-3">
          <CreditCard className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold">Payment</h2>

          <p className="text-sm text-muted-foreground">Complete checkout</p>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* Total Amount */}
      {/* ---------------------------------------------------------------------- */}

      <Card
        className="
      mb-6
      overflow-hidden
      rounded-3xl
      border-0
      bg-gradient-to-r
      from-blue-600
      via-indigo-600
      to-violet-600
      text-white
      shadow-xl
    "
      >
        <div className="p-6">
          <p className="text-sm text-blue-100">Total Amount</p>

          <motion.h2
            key={grandTotal}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-5xl font-black tracking-tight"
          >
            ₹{grandTotal.toFixed(2)}
          </motion.h2>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-blue-100">{totalItems} Items</span>

            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
              Ready to Bill
            </span>
          </div>
        </div>
      </Card>

      {/* ---------------------------------------------------------------------- */}
      {/* Payment Method */}
      {/* ---------------------------------------------------------------------- */}

      <div className="mb-6">
        <Label className="mb-3 block">Payment Method</Label>

        <div className="grid grid-cols-4 gap-3">
          {METHODS.map((method) => {
            const Icon = method.icon;

            const active = paymentMethod === method.value;

            return (
              <motion.button
                key={method.value}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod(method.value)}
                className={`
              rounded-3xl
              border
              p-3
              transition-all
              duration-200

              ${
                active
                  ? `bg-gradient-to-br ${method.gradient} text-white shadow-xl`
                  : "bg-background hover:bg-muted"
              }
            `}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="h-5 w-5" />

                  <span className="text-[11px] font-semibold">
                    {method.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* Received Amount */}
      {/* ---------------------------------------------------------------------- */}

      <div className="mb-6 space-y-2">
        <Label>Received Amount</Label>

        <Input
          type="number"
          inputMode="decimal"
          value={paidAmount || ""}
          placeholder="0.00"
          onChange={(e) => setPaidAmount(Number(e.target.value))}
          className="
        h-16
        rounded-2xl
        text-3xl
        font-bold
        tracking-wide
      "
        />
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* Smart Amount Buttons */}
      {/* ---------------------------------------------------------------------- */}

      <div className="mt-5 grid grid-cols-4 gap-2">
        <Button
          onClick={() => setPaidAmount(grandTotal)}
          className={
            paidAmount === grandTotal
              ? "rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
              : "rounded-2xl border-2 bg-background text-foreground hover:border-emerald-600 hover:bg-emerald-50"
          }
        >
          Exact
        </Button>

        {quickAmounts.map((amount) => {
          const active = paidAmount === amount;

          return (
            <Button
              key={amount}
              variant="outline"
              onClick={() => setPaidAmount(amount)}
              className={
                active
                  ? "rounded-2xl border-0 bg-blue-600 text-white hover:bg-blue-700"
                  : "rounded-2xl border-2 hover:border-blue-500 hover:bg-blue-50"
              }
            >
              ₹{amount}
            </Button>
          );
        })}
      </div>
      {/* ---------------------------------------------------------------------- */}
      {/* Payment Status */}
      {/* ---------------------------------------------------------------------- */}

      <AnimatePresence mode="wait">
        <motion.div
          key={paymentStatus.title}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -20,
          }}
          transition={{
            duration: 0.2,
          }}
          className={`mb-5 rounded-3xl p-4 ${paymentStatus.bg}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                rounded-2xl
                p-3
                ${paymentStatus.bg}
              `}
            >
              <StatusIcon className={`h-6 w-6 ${paymentStatus.text}`} />
            </div>

            <div className="flex-1">
              <h3 className={`font-semibold ${paymentStatus.text}`}>
                {paymentStatus.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {paymentStatus.subtitle}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ---------------------------------------------------------------------- */}
      {/* Payment Summary */}
      {/* ---------------------------------------------------------------------- */}

      <Card className="rounded-3xl border bg-muted/30 p-5">
        <div className="space-y-5">
          {/* Paid */}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Paid</span>

            <motion.span
              key={paidAmount}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-bold text-emerald-600"
            >
              ₹{paidAmount.toFixed(2)}
            </motion.span>
          </div>

          <div className="border-t" />

          {/* Due */}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Due</span>

            <motion.span
              key={dueAmount}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-bold text-red-500"
            >
              ₹{dueAmount.toFixed(2)}
            </motion.span>
          </div>

          <div className="border-t" />

          {/* Change */}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Change</span>

            <motion.span
              key={changeAmount}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-bold text-blue-600"
            >
              ₹{changeAmount.toFixed(2)}
            </motion.span>
          </div>
        </div>
      </Card>
    </Card>
  );
}
