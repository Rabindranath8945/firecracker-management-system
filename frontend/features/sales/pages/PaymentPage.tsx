"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  User,
  Wallet,
  Smartphone,
  ChevronRight,
  ShoppingBag,
  Receipt,
  Printer,
  Share2,
  Plus,
  BadgeIndianRupee,
} from "lucide-react";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useSaleStore } from "../store/useSaleStore";

import CashPayment from "../components/payments/CashPayment";
import UpiPayment from "../components/payments/UpiPayment";
import PaymentSuccessSheet from "../components/payments/PaymentSuccessSheet";

import SalesService from "../services/sales.service";

import CustomerPaymentService from "@/features/customers/services/customer-payment.service";
import CreditPayment from "../components/payments/CreditPayment";

import type { Sale, PaymentMethod } from "../types/Sales.types";

export default function PaymentPage() {
  const router = useRouter();

  /* ---------------------------------------------------------------------- */
  /* Sale Store                                                             */
  /* ---------------------------------------------------------------------- */

  const {
    selectedCustomer,
    grandTotal,
    items,
    discount,
    taxAmount,
    previousDue,
    collectPreviousDue,
    clearCart,
  } = useSaleStore();

  /* ---------------------------------------------------------------------- */
  /* Payment State                                                          */
  /* ---------------------------------------------------------------------- */

  const [paymentMode, setPaymentMode] = useState<PaymentMethod>("CASH");

  const [successOpen, setSuccessOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [createdSale, setCreatedSale] = useState<Sale | null>(null);

  const [dueCollected, setDueCollected] = useState(0);

  /* ---------------------------------------------------------------------- */
  /* Amount Calculation                                                     */
  /* ---------------------------------------------------------------------- */

  const saleAmount = grandTotal;

  const isCredit = paymentMode === "CREDIT";

  const previousDueToCollect =
    !isCredit && collectPreviousDue ? previousDue : 0;

  const totalAmountToCollect = saleAmount + previousDueToCollect;
  /* ---------------------------------------------------------------------- */
  /* Create Sale                                                            */
  /* ---------------------------------------------------------------------- */
  async function handlePaymentSuccess(receivedAmount: number) {
    if (loading) return;

    try {
      setLoading(true);

      if (items.length === 0) {
        throw new Error("Sale cart is empty.");
      }

      // ---------------------------------------------------------------
      // IMPORTANT:
      // Get the latest values directly from Zustand.
      // This prevents stale discount / total values.
      // ---------------------------------------------------------------

      const latestState = useSaleStore.getState();

      const latestDiscount = Math.max(0, Number(latestState.discount) || 0);

      const latestGrandTotal = Math.max(0, Number(latestState.grandTotal) || 0);

      const latestPreviousDue = Math.max(
        0,
        Number(latestState.previousDue) || 0,
      );

      const latestCollectPreviousDue = latestState.collectPreviousDue;

      const isCredit = paymentMode === "CREDIT";

      // ---------------------------------------------------------------
      // Actual amount received
      // ---------------------------------------------------------------

      const actualReceivedAmount = isCredit
        ? 0
        : Math.max(0, Number(receivedAmount) || 0);

      // ---------------------------------------------------------------
      // New sale payment
      //
      // Always pay the NEW SALE first.
      // ---------------------------------------------------------------

      const salePaidAmount = Math.min(actualReceivedAmount, latestGrandTotal);

      // ---------------------------------------------------------------
      // Remaining money after paying current sale
      // ---------------------------------------------------------------

      const remainingPayment = Math.max(
        0,
        actualReceivedAmount - salePaidAmount,
      );

      // ---------------------------------------------------------------
      // Previous due collection
      //
      // Only collect previous due when switch is ON.
      // ---------------------------------------------------------------

      const previousDueCollected =
        !isCredit && latestCollectPreviousDue
          ? Math.min(remainingPayment, latestPreviousDue)
          : 0;

      // ---------------------------------------------------------------
      // DEBUG
      // ---------------------------------------------------------------

      console.log("FINAL SALE VALUES", {
        discount: latestDiscount,
        grandTotal: latestGrandTotal,
        previousDue: latestPreviousDue,
        collectPreviousDue: latestCollectPreviousDue,
        paymentMode,
        receivedAmount: actualReceivedAmount,
        salePaidAmount,
        previousDueCollected,
      });

      // ---------------------------------------------------------------
      // Create sale
      // ---------------------------------------------------------------

      const salePayload = {
        ...(selectedCustomer?._id
          ? {
              customer: selectedCustomer._id,
            }
          : {}),

        items: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),

        paymentMethod: paymentMode,

        // IMPORTANT
        discount,

        // Only the amount paid toward THIS sale.
        paidAmount: salePaidAmount,
      };

      console.log("SALE PAYLOAD", salePayload);

      const sale = await SalesService.createSale(salePayload);

      // ---------------------------------------------------------------
      // Collect previous customer due separately
      // ---------------------------------------------------------------

      if (previousDueCollected > 0 && selectedCustomer?._id && !isCredit) {
        if (
          paymentMode === "CASH" ||
          paymentMode === "UPI" ||
          paymentMode === "CARD" ||
          paymentMode === "BANK"
        ) {
          await CustomerPaymentService.createDuePayment(selectedCustomer._id, {
            amount: previousDueCollected,

            paymentMethod: paymentMode,

            referenceSale: sale._id,

            referenceInvoice: sale.invoiceNo,
          });
        }
      }

      // ---------------------------------------------------------------
      // Success
      // ---------------------------------------------------------------

      setCreatedSale(sale);

      setDueCollected(previousDueCollected);

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to complete payment:", error);
    } finally {
      setLoading(false);
    }
  }
  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <PageContainer>
        <div className="space-y-4 pb-6">
          {/* ============================================================ */}
          {/* Header                                                       */}
          {/* ============================================================ */}

          <div className="flex items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => router.back()}
              disabled={loading}
              className="h-10 w-10 rounded-2xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="text-center">
              <h1 className="text-lg font-bold tracking-tight">Payment</h1>

              <p className="text-xs text-muted-foreground">
                Complete your sale
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100">
              <CreditCard className="h-5 w-5 text-violet-700" />
            </div>
          </div>

          {/* ============================================================ */}
          {/* Customer Card                                                */}
          {/* ============================================================ */}

          <Card className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <div className="flex items-center gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100">
                <User className="h-5 w-5 text-violet-700" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold">
                    {selectedCustomer?.name ?? "Walk-in Customer"}
                  </p>

                  {!selectedCustomer && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                      WALK-IN
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {selectedCustomer?.mobile ?? "No mobile number"}
                </p>

                {selectedCustomer?.dueAmount ? (
                  <p className="mt-1 text-[11px] font-semibold text-red-600">
                    Previous due ₹
                    {selectedCustomer.dueAmount.toLocaleString("en-IN")}
                  </p>
                ) : null}
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </div>
          </Card>

          {/* ============================================================ */}
          {/* Amount Summary                                               */}
          {/* ============================================================ */}

          <Card
            className="
              overflow-hidden
              rounded-3xl
              border-0
              bg-gradient-to-br
              from-violet-600
              to-fuchsia-600
              text-white
              shadow-lg
            "
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                    Amount to Collect
                  </p>

                  <h2 className="mt-1 text-4xl font-black tracking-tight">
                    ₹{totalAmountToCollect.toLocaleString("en-IN")}
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div className="mt-4 border-t border-white/15 pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Current Bill</span>

                    <span className="font-semibold">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {collectPreviousDue && previousDue > 0 && (
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-white/70">Previous Due</span>

                      <span className="font-semibold">
                        ₹{previousDue.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">
                    {items.length} product
                    {items.length !== 1 ? "s" : ""}
                  </span>

                  {discount > 0 && (
                    <>
                      <span className="text-white/30">•</span>

                      <span className="text-xs font-medium text-white/80">
                        Discount ₹{discount.toLocaleString("en-IN")}
                      </span>
                    </>
                  )}
                </div>

                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold">
                  {paymentMode}
                </span>
              </div>
            </div>
          </Card>

          {/* ============================================================ */}
          {/* Payment Method                                               */}
          {/* ============================================================ */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Payment Method
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Select how the customer will pay
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Cash */}

              <button
                type="button"
                disabled={loading}
                onClick={() => setPaymentMode("CASH")}
                className={`
                  relative
                  flex
                  h-[82px]
                  items-center
                  gap-3
                  rounded-3xl
                  border
                  px-4
                  text-left
                  transition-all
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  ${
                    paymentMode === "CASH"
                      ? "border-violet-500 bg-violet-50 shadow-sm ring-1 ring-violet-200"
                      : "border-slate-200 bg-white hover:border-violet-200"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl

                    ${
                      paymentMode === "CASH"
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  <Wallet className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold">Cash</p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Pay in cash
                  </p>
                </div>

                {paymentMode === "CASH" && (
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-600" />
                )}
              </button>

              {/* UPI */}

              <button
                type="button"
                disabled={loading}
                onClick={() => setPaymentMode("UPI")}
                className={`
                  relative
                  flex
                  h-[82px]
                  items-center
                  gap-3
                  rounded-3xl
                  border
                  px-4
                  text-left
                  transition-all
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  ${
                    paymentMode === "UPI"
                      ? "border-violet-500 bg-violet-50 shadow-sm ring-1 ring-violet-200"
                      : "border-slate-200 bg-white hover:border-violet-200"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl

                    ${
                      paymentMode === "UPI"
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  <Smartphone className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold">UPI</p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Scan & pay
                  </p>
                </div>

                {paymentMode === "UPI" && (
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-600" />
                )}
              </button>

              {/* CREDIT */}
              <button
                type="button"
                onClick={() => setPaymentMode("CREDIT")}
                className={`
    rounded-3xl
    border
    p-4
    transition-all
    ${
      paymentMode === "CREDIT"
        ? "border-amber-500 bg-amber-50 shadow-md"
        : "bg-white"
    }
  `}
              >
                <BadgeIndianRupee
                  className={`mx-auto h-7 w-7 ${
                    paymentMode === "CREDIT"
                      ? "text-amber-600"
                      : "text-slate-500"
                  }`}
                />

                <p className="mt-2 text-sm font-semibold">Credit</p>

                <p className="mt-1 text-[10px] text-muted-foreground">
                  Pay later
                </p>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Dynamic Payment Panel                                        */}
          {/* ============================================================ */}

          <div className="pt-1">
            {paymentMode === "CASH" ? (
              <CashPayment
                amount={totalAmountToCollect}
                loading={loading}
                onSuccess={handlePaymentSuccess}
              />
            ) : paymentMode === "UPI" ? (
              <UpiPayment
                amount={totalAmountToCollect}
                loading={loading}
                onSuccess={handlePaymentSuccess}
              />
            ) : (
              <CreditPayment
                amount={grandTotal}
                loading={loading}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        </div>
      </PageContainer>

      {/* ================================================================ */}
      {/* Payment Success                                                 */}
      {/* ================================================================ */}

      <PaymentSuccessSheet
        open={successOpen}
        onOpenChange={setSuccessOpen}
        sale={createdSale}
        onNewSale={() => {
          clearCart();

          setSuccessOpen(false);

          router.replace("/sales");
        }}
        onPrint={() => {
          if (!createdSale?._id) {
            return;
          }

          router.push(`/sales/${createdSale._id}/print`);
        }}
        onShare={() => {
          if (!createdSale?._id) {
            return;
          }

          router.push(`/sales/${createdSale._id}/share`);
        }}
      />
    </>
  );
}
