"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Minus,
  Package2,
  ShoppingCart,
  Trash2,
  User,
  Wallet,
  Plus,
} from "lucide-react";

import WalkInCustomerCard from "@/components/common/shared/sheets/customer/WalkInCustomerCard";
import CustomerSelectionSheet from "@/components/common/shared/sheets/customer/CustomerSelectionSheet";
import DiscountDialog from "@/components/common/shared/dialogs/DiscountDialog";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

import { useSaleStore } from "../store/useSaleStore";

export default function ReviewCartPage() {
  const router = useRouter();

  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);

  const {
    selectedCustomer,
    items,
    subTotal,
    discount,
    taxAmount,
    grandTotal,
    previousDue,
    collectPreviousDue,
    setDiscount,
    setCollectPreviousDue,
    updateQuantity,
    removeItem,
    clearCart,
  } = useSaleStore();

  const payableAmount = grandTotal + (collectPreviousDue ? previousDue : 0);

  return (
    <PageContainer className="space-y-4 pb-32">
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10 rounded-2xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-900">Review Cart</h1>

          <p className="text-[11px] text-muted-foreground">
            {items.length} product{items.length !== 1 && "s"} in cart
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100">
          <ShoppingCart className="h-5 w-5 text-violet-700" />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Customer */}
      {/* ------------------------------------------------------------------ */}

      {selectedCustomer ? (
        <Card
          onClick={() => setCustomerSheetOpen(true)}
          className="
            cursor-pointer
            rounded-2xl
            border
            p-3
            shadow-sm
            transition-all
            hover:border-violet-300
            hover:shadow-md
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
              <User className="h-5 w-5 text-violet-700" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-bold text-slate-900">
                  {selectedCustomer.name}
                </h3>

                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </div>

              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[10px] text-slate-500">
                  {selectedCustomer.mobile || "No Mobile"}
                </span>

                <span className="text-slate-300">•</span>

                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  Due ₹
                  {selectedCustomer.dueAmount?.toLocaleString("en-IN") ?? "0"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <WalkInCustomerCard onClick={() => setCustomerSheetOpen(true)} />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Quick Actions */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-2 gap-2.5">
        <Button
          variant="outline"
          onClick={() => router.push("/sales/new")}
          className="
            h-10
            rounded-xl
            border-violet-200
            text-xs
            font-semibold
            text-violet-700
            hover:bg-violet-50
          "
        >
          <ShoppingCart className="mr-1.5 h-4 w-4" />
          Continue Shopping
        </Button>

        <Button
          variant="outline"
          onClick={clearCart}
          className="
            h-10
            rounded-xl
            border-red-200
            text-xs
            font-semibold
            text-red-600
            hover:bg-red-50
          "
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Empty Cart */}
      {/* ------------------------------------------------------------------ */}

      {items.length === 0 && (
        <Card className="rounded-2xl p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <ShoppingCart className="h-7 w-7 text-slate-400" />
          </div>

          <h2 className="mt-4 text-base font-bold text-slate-900">
            Cart is Empty
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Add some products to continue billing.
          </p>

          <Button
            className="mt-5 rounded-xl bg-violet-600"
            onClick={() => router.back()}
          >
            Browse Products
          </Button>
        </Card>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Cart Items */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2.5">
        {items.map((item) => {
          const maxStock = Math.max(0, item.stock);
          const canIncrease = item.quantity < maxStock;

          return (
            <Card
              key={item.productId}
              className="
                rounded-2xl
                border
                p-3
                shadow-sm
                transition-all
                hover:shadow-md
              "
            >
              <div className="flex items-start gap-3">
                {/* Icon */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  <Package2 className="h-5 w-5 text-violet-700" />
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  {/* Name + Delete */}

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {item.productName}
                    </h3>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId)}
                      className="h-7 w-7 shrink-0 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>

                  {/* Code + Stock */}

                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      {item.productCode}
                    </span>

                    <span className="text-slate-300">•</span>

                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
                      {item.stock} PCS
                    </span>
                  </div>

                  {/* Category + GST */}

                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5 truncate text-[10px] text-slate-500">
                      <span className="truncate">
                        {item.categoryName ?? "Category"}
                      </span>

                      <span>•</span>

                      <span className="truncate">
                        {item.subCategoryName ?? "Sub Category"}
                      </span>
                    </div>

                    <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-semibold text-violet-700">
                      GST {item.tax}%
                    </span>
                  </div>

                  {/* Price + Total + Quantity */}

                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        ₹{item.price} × {item.quantity}
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        Item total
                      </p>
                    </div>

                    <p className="text-lg font-black text-violet-700">
                      ₹{item.total.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Quantity */}

                  <div className="mt-2 flex justify-end">
                    <div className="flex h-8 items-center rounded-xl border bg-slate-50 p-0.5">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={item.quantity <= 1}
                        className="h-7 w-7 rounded-lg"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={!canIncrease}
                        className="h-7 w-7 rounded-lg"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            Math.min(maxStock, item.quantity + 1),
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Floating Summary */}
      {/* ------------------------------------------------------------------ */}

      {items.length > 0 && (
        <div
          className="
            fixed
            bottom-0
            left-0
            right-0
            z-50
            border-t
            border-slate-200
            bg-background/95
            shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
            backdrop-blur-2xl
          "
        >
          {/* Collapsed Summary */}

          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="flex w-full items-center justify-between px-5 py-3"
          >
            <div className="text-left">
              <p className="text-[9px] font-bold uppercase tracking-wider text-violet-600">
                Amount to Collect
              </p>

              <p className="text-xl font-black text-violet-700">
                ₹{payableAmount.toLocaleString("en-IN")}
              </p>

              <p className="text-[10px] text-muted-foreground">
                {items.length} product
                {items.length !== 1 && "s"} • Tap for summary
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                <ShoppingCart className="h-5 w-5 text-violet-700" />
              </div>

              {expanded ? (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              )}
            </div>
          </button>

          {/* Expanded Summary */}

          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ${expanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <Card className="mx-3 mb-3 rounded-2xl border shadow-xl">
              <div className="space-y-4 p-4">
                {/* Subtotal */}

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>

                  <span className="font-semibold">
                    ₹{subTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Discount */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Discount</span>

                  <div className="flex items-center gap-2">
                    {discount > 0 && (
                      <span className="text-sm font-semibold text-emerald-600">
                        -₹{discount.toLocaleString("en-IN")}
                      </span>
                    )}

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg text-[11px]"
                      onClick={() => setDiscountOpen(true)}
                    >
                      {discount > 0 ? "Edit" : "Add Discount"}
                    </Button>
                  </div>

                  <DiscountDialog
                    open={discountOpen}
                    onOpenChange={setDiscountOpen}
                    subtotal={subTotal}
                    taxAmount={taxAmount}
                    value={discount}
                    onApply={setDiscount}
                  />
                </div>

                {/* GST */}

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">GST</span>

                  <span className="font-semibold">
                    ₹{taxAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Previous Due */}

                {selectedCustomer && previousDue > 0 && (
                  <Card className="rounded-xl border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                          <Wallet className="h-4 w-4 text-amber-700" />
                        </div>

                        <div>
                          <p className="text-xs font-bold">Previous Due</p>

                          <p className="text-base font-black text-red-600">
                            ₹{previousDue.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <Switch
                        checked={collectPreviousDue}
                        onCheckedChange={setCollectPreviousDue}
                      />
                    </div>

                    <div className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-[10px]">
                      Collect with this bill:{" "}
                      <span
                        className={
                          collectPreviousDue
                            ? "font-bold text-emerald-600"
                            : "font-bold text-slate-500"
                        }
                      >
                        {collectPreviousDue ? "Included" : "Skipped"}
                      </span>
                    </div>
                  </Card>
                )}

                <div className="border-t" />

                {/* Total */}

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Current Bill
                    </p>

                    <p className="text-lg font-bold">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </p>

                    {selectedCustomer &&
                      previousDue > 0 &&
                      collectPreviousDue && (
                        <p className="mt-0.5 text-[10px] text-red-600">
                          + Previous Due ₹{previousDue.toLocaleString("en-IN")}
                        </p>
                      )}
                  </div>

                  <div className="rounded-xl bg-violet-100 px-4 py-2 text-right">
                    <p className="text-[9px] font-semibold text-violet-600">
                      AMOUNT TO COLLECT
                    </p>

                    <p className="text-xl font-black text-violet-700">
                      ₹{payableAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Payment */}

                <Button
                  type="button"
                  onClick={() => router.push("/sales/payment")}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    via-violet-500
                    to-fuchsia-600
                    text-sm
                    font-bold
                    shadow-lg
                    transition-all
                    hover:scale-[1.01]
                    active:scale-[0.98]
                  "
                >
                  Continue to Payment
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      <CustomerSelectionSheet
        open={customerSheetOpen}
        onOpenChange={setCustomerSheetOpen}
      />
    </PageContainer>
  );
}
