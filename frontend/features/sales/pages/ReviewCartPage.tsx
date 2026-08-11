"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import WalkInCustomerCard from "@/components/common/shared/sheets/customer/WalkInCustomerCard";
import CustomerSelectionSheet from "@/components/common/shared/sheets/customer/CustomerSelectionSheet";

import {
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  User,
  Package2,
  Wallet,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

import { useSaleStore } from "../store/useSaleStore";

import DiscountDialog from "@/components/common/shared/dialogs/DiscountDialog";

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

  /*
   * ------------------------------------------------------------------------
   * Amount to Collect
   * ------------------------------------------------------------------------
   *
   * Current bill = grandTotal
   *
   * Previous due is added ONLY when the user explicitly
   * enables the "Collect with this bill" switch.
   */
  const payableAmount = grandTotal + (collectPreviousDue ? previousDue : 0);

  return (
    <PageContainer className="space-y-4">
      {/* ------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------ */}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="text-center">
          <h1 className="text-xl font-bold">Review Cart</h1>

          <p className="text-xs text-muted-foreground">
            {items.length} Item
            {items.length !== 1 && "s"}
          </p>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-violet-100
          "
        >
          <ShoppingCart className="h-5 w-5 text-violet-700" />
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* Customer */}
      {/* ------------------------------------------------ */}

      {selectedCustomer ? (
        <Card
          onClick={() => setCustomerSheetOpen(true)}
          className="
            cursor-pointer
            rounded-3xl
            border
            p-4
            transition-all
            hover:border-violet-300
            hover:shadow-md
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-violet-100
                "
              >
                <User className="h-6 w-6 text-violet-700" />
              </div>

              <div>
                <p className="font-semibold">{selectedCustomer.name}</p>

                <p className="text-xs text-muted-foreground">
                  {selectedCustomer.mobile || "No Mobile"}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="
                      rounded-full
                      bg-emerald-100
                      px-2
                      py-0.5
                      text-[11px]
                      font-semibold
                      text-emerald-700
                    "
                  >
                    Due ₹
                    {selectedCustomer.dueAmount?.toLocaleString("en-IN") ?? "0"}
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      ) : (
        <WalkInCustomerCard onClick={() => setCustomerSheetOpen(true)} />
      )}

      {/* ------------------------------------------------ */}
      {/* Quick Action */}
      {/* ------------------------------------------------ */}

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/sales/new")}
          className="
            h-11
            rounded-2xl
            border-violet-200
            text-violet-700
            hover:bg-violet-50
          "
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>

        <Button
          variant="outline"
          onClick={clearCart}
          className="
            h-11
            rounded-2xl
            border-red-200
            text-red-600
            hover:bg-red-50
          "
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      {/* ------------------------------------------------ */}
      {/* Empty */}
      {/* ------------------------------------------------ */}

      {items.length === 0 && (
        <Card className="rounded-3xl p-10 text-center">
          <ShoppingCart className="mx-auto mb-4 h-14 w-14 text-slate-300" />

          <h2 className="text-lg font-bold">Cart is Empty</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add some products to continue billing.
          </p>

          <Button className="mt-6 rounded-2xl" onClick={() => router.back()}>
            Browse Products
          </Button>
        </Card>
      )}

      {/* ------------------------------------------------ */}
      {/* Cart List */}
      {/* ------------------------------------------------ */}

      <div className="space-y-3">
        {items.map((item) => (
          <Card
            key={item.productId}
            className="
              rounded-3xl
              border
              p-4
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div className="flex items-start gap-3">
              {/* Product Icon */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-violet-100
                "
              >
                <Package2 className="h-5 w-5 text-violet-700" />
              </div>

              {/* Details */}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="truncate text-[15px] font-semibold">
                    {item.productName}
                  </h3>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {item.productCode}
                  </span>

                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {item.stock} PCS
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{item.categoryName ?? "Category"}</span>

                    <span>•</span>

                    <span>{item.subCategoryName ?? "Sub Category"}</span>
                  </div>

                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                    GST {item.tax}%
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    ₹{item.price} × {item.quantity}
                  </p>

                  <p className="text-lg font-bold text-violet-700">
                    ₹{item.total.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="mt-3 flex justify-end">
                  <div className="flex items-center rounded-2xl border bg-slate-50 p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-xl"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>

                    <span className="w-8 text-center text-sm font-bold">
                      {item.quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-xl"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ------------------------------------------------ */}
      {/* Floating Summary */}
      {/* ------------------------------------------------ */}

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
            backdrop-blur-2xl
            shadow-[0_-10px_40px_rgba(0,0,0,0.08)]
            transition-all
            duration-300
          "
        >
          {/* Drag Handle */}

          <button
            onClick={() => setExpanded(!expanded)}
            className="
              flex
              w-full
              items-center
              justify-between
              px-5
              py-4
            "
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-violet-600">
                Order Summary
              </p>

              <h3 className="mt-1 text-xl font-black text-violet-700">
                ₹{grandTotal.toLocaleString("en-IN")}
              </h3>

              <p className="text-xs text-muted-foreground">
                {items.length} Product
                {items.length !== 1 && "s"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-100 p-3">
                <ShoppingCart className="h-6 w-6 text-violet-700" />
              </div>

              {expanded ? (
                <ChevronDown className="h-6 w-6 text-slate-500" />
              ) : (
                <ChevronUp className="h-6 w-6 text-slate-500" />
              )}
            </div>
          </button>

          {/* Expanded Content */}

          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ${expanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <Card className="mx-4 mb-4 rounded-3xl border shadow-xl">
              <div className="space-y-5 p-5">
                {/* Subtotal */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Subtotal</span>

                  <span className="font-semibold">
                    ₹{subTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Discount */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Discount</span>

                  <div className="flex items-center gap-2">
                    {discount > 0 && (
                      <span className="font-semibold text-emerald-600">
                        -₹
                        {discount.toLocaleString("en-IN")}
                      </span>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDiscountOpen(true)}
                    >
                      {discount > 0 ? "Edit Discount" : "Add Discount"}
                    </Button>

                    <DiscountDialog
                      open={discountOpen}
                      onOpenChange={setDiscountOpen}
                      subtotal={subTotal}
                      taxAmount={taxAmount}
                      value={discount}
                      onApply={setDiscount}
                    />
                  </div>
                </div>

                {/* GST */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">GST</span>

                  <span className="font-semibold">
                    ₹{taxAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Previous Due */}

                {selectedCustomer && previousDue > 0 && (
                  <Card className="rounded-2xl border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="rounded-2xl bg-amber-100 p-3">
                          <Wallet className="h-5 w-5 text-amber-700" />
                        </div>

                        <div>
                          <h4 className="font-semibold">Previous Due</h4>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Customer owes
                          </p>

                          <p className="mt-1 text-xl font-bold text-red-600">
                            ₹{previousDue.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <Switch
                        checked={collectPreviousDue}
                        onCheckedChange={setCollectPreviousDue}
                      />
                    </div>

                    <div className="mt-3 rounded-xl bg-white/70 p-3">
                      <div className="flex justify-between text-sm">
                        <span>Collect with this bill</span>

                        <span
                          className={
                            collectPreviousDue
                              ? "font-semibold text-emerald-600"
                              : "font-semibold text-slate-500"
                          }
                        >
                          {collectPreviousDue ? "Included" : "Skipped"}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="border-t" />

                {/* Bill Summary */}

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Current Bill</span>

                    <span className="font-semibold">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {selectedCustomer &&
                    previousDue > 0 &&
                    collectPreviousDue && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">
                          Previous Due
                        </span>

                        <span className="font-semibold text-red-600">
                          ₹{previousDue.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Amount to Collect
                        </p>

                        <h2 className="text-3xl font-black text-violet-700">
                          ₹{payableAmount.toLocaleString("en-IN")}
                        </h2>
                      </div>

                      <div className="rounded-2xl bg-violet-100 px-4 py-3 text-center">
                        <p className="text-xs text-violet-700">Collect</p>

                        <p className="text-lg font-bold text-violet-700">
                          ₹{payableAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/sales/payment")}
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    via-violet-500
                    to-fuchsia-600
                    text-base
                    font-bold
                    shadow-xl
                    transition-all
                    hover:scale-[1.01]
                    active:scale-95
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
