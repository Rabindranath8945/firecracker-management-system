"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  Home,
  Package,
  Plus,
  Printer,
  Receipt,
  Share2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface Props {
  open: boolean;

  invoiceNo: string;

  supplier: string;

  products: number;

  grandTotal: number;

  paidAmount: number;

  balanceAmount: number;

  paymentStatus: "PAID" | "PARTIAL" | "DUE";

  onOpenChange: (open: boolean) => void;

  onView: () => void;

  onPrint: () => void;

  onShare: () => void;

  onNew: () => void;

  onPayment: () => void;
}

export default function PurchaseSuccessSheet({
  open,
  invoiceNo,
  supplier,
  products,
  grandTotal,
  paidAmount,
  balanceAmount,
  paymentStatus,
  onOpenChange,
  onView,
  onPrint,
  onShare,
  onNew,
  onPayment,
}: Props) {
  const router = useRouter();

  function closeSheet() {
    toast.success("Purchase saved successfully");
    onOpenChange(false);
  }

  const recommendation = useMemo(() => {
    switch (paymentStatus) {
      case "PAID":
        return {
          title: "Continue Purchasing",
          subtitle: "Create another purchase invoice.",
          color: "border-blue-100 bg-blue-50 text-blue-700",
        };

      case "PARTIAL":
        return {
          title: "Record Remaining Payment",
          subtitle: `Outstanding ₹${balanceAmount.toFixed(2)}`,
          color: "border-amber-100 bg-amber-50 text-amber-700",
        };

      case "DUE":
        return {
          title: "Pay Supplier",
          subtitle: `Outstanding ₹${balanceAmount.toFixed(2)}`,
          color: "border-red-100 bg-red-50 text-red-700",
        };
    }
  }, [paymentStatus, balanceAmount]);

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!value) closeSheet();
      }}
    >
      <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-8 pt-5">
        {/* Handle */}

        <div className="mx-auto mb-6 h-1.5 w-14 rounded-full bg-slate-300" />

        {/* Close */}

        <button
          type="button"
          onClick={closeSheet}
          className="absolute right-5 top-5 rounded-full p-2 transition hover:bg-slate-100"
        >
          <X className="size-5" />
        </button>

        {/* Hero */}

        <div className="flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-xl">
            <CheckCircle2 className="size-12 text-white" />
          </div>

          <h2 className="mt-6 text-3xl font-bold">Purchase Saved</h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Purchase has been saved successfully.
          </p>
        </div>

        {/* Summary */}

        <div className="mt-8 rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              <Receipt className="size-7" />
            </div>

            <div>
              <h3 className="font-semibold">{invoiceNo}</h3>

              <p className="text-sm text-muted-foreground">{supplier}</p>
            </div>
          </div>

          <div className="mt-5 border-t pt-5 space-y-3">
            <Row
              label="Products"
              value={`${products} Item${products > 1 ? "s" : ""}`}
            />

            <Row
              label="Grand Total"
              value={`₹${grandTotal.toFixed(2)}`}
              valueClassName="text-xl font-bold text-primary"
            />

            {paymentStatus !== "DUE" && (
              <Row label="Paid" value={`₹${paidAmount.toFixed(2)}`} />
            )}

            {paymentStatus !== "PAID" && (
              <Row
                label="Balance"
                value={`₹${balanceAmount.toFixed(2)}`}
                valueClassName="font-semibold text-red-600"
              />
            )}
          </div>
        </div>

        {/* Status */}

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 space-y-3">
          <Status color="green" text="Purchase Created" />

          <Status color="green" text="Inventory Updated" />

          {paymentStatus === "PAID" && (
            <Status color="green" text="Supplier Account Settled" />
          )}

          {paymentStatus === "PARTIAL" && (
            <Status
              color="yellow"
              text={`Balance Due ₹${balanceAmount.toFixed(2)}`}
            />
          )}

          {paymentStatus === "DUE" && (
            <Status
              color="red"
              text={`Outstanding ₹${balanceAmount.toFixed(2)}`}
            />
          )}
        </div>

        {/* Recommendation */}

        <div className={`mt-6 rounded-2xl border p-4 ${recommendation.color}`}>
          <p className="text-xs font-semibold uppercase tracking-wide">
            Recommended Next Step
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{recommendation.title}</h4>

              <p className="text-sm opacity-80">{recommendation.subtitle}</p>
            </div>

            <ArrowRight className="size-5" />
          </div>
        </div>
        {/* Quick Actions */}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <QuickAction
            icon={<Printer className="size-5" />}
            title="Print"
            onClick={onPrint}
          />

          <QuickAction
            icon={<Share2 className="size-5" />}
            title="Share"
            onClick={onShare}
          />

          <QuickAction
            icon={<Eye className="size-5" />}
            title="View"
            onClick={onView}
          />
        </div>

        {/* Primary Action */}

        <div className="mt-6 space-y-3">
          {paymentStatus === "PAID" ? (
            <Button className="h-12 w-full rounded-2xl" onClick={onNew}>
              <Plus className="mr-2 size-5" />
              New Purchase
            </Button>
          ) : (
            <Button className="h-12 w-full rounded-2xl" onClick={onPayment}>
              <CircleDollarSign className="mr-2 size-5" />
              Record Payment
            </Button>
          )}

          <Button
            variant="outline"
            className="h-12 w-full rounded-2xl"
            onClick={() => router.push("/purchases")}
          >
            <Package className="mr-2 size-5" />
            View Purchases
          </Button>

          <Button
            variant="ghost"
            className="h-12 w-full rounded-2xl"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="mr-2 size-5" />
            Dashboard
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type StatusColor = "green" | "yellow" | "red";

function Status({
  text,
  color = "green",
}: {
  text: string;
  color?: StatusColor;
}) {
  const styles = {
    green: "text-green-600",
    yellow: "text-amber-600",
    red: "text-red-600",
  };

  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className={`size-5 ${styles[color]}`} />
      <span className="text-sm">{text}</span>
    </div>
  );
}

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>

      <span className={valueClassName ?? "font-semibold"}>{value}</span>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-20 flex-col gap-2 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95"
    >
      {icon}

      <span className="text-xs font-medium">{title}</span>
    </Button>
  );
}
