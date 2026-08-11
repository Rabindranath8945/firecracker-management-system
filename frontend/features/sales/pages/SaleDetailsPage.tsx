"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  FileText,
  Loader2,
  Package,
  Phone,
  Printer,
  UserRound,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import SalesService from "../services/sales.service";
import type { Sale } from "../types/Sales.types";

interface SaleDetailsPageProps {
  saleId: string;
}

export default function SaleDetailsPage({ saleId }: SaleDetailsPageProps) {
  const router = useRouter();

  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSale() {
      try {
        setLoading(true);
        setError(null);

        const data = await SalesService.getSale(saleId);

        if (mounted) {
          setSale(data);
        }
      } catch (err) {
        console.error("Failed to load sale:", err);

        if (mounted) {
          setError("Unable to load sale details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadSale();

    return () => {
      mounted = false;
    };
  }, [saleId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading sale...
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="rounded-2xl bg-red-100 p-4">
          <FileText className="h-7 w-7 text-red-600" />
        </div>

        <div>
          <h2 className="text-lg font-bold">Sale Not Found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {error ?? "The requested sale could not be found."}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/sales")}
          className="rounded-2xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const customerName =
    typeof sale.customer === "object" && sale.customer
      ? sale.customer.name
      : "Walk-in Customer";

  const customerMobile =
    typeof sale.customer === "object" && sale.customer
      ? sale.customer.mobile
      : "";

  const items = sale.items ?? [];

  const paymentMethod = sale.payment?.method ?? "CASH";

  const paymentStatus = sale.paymentStatus ?? "PAID";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-8 pt-4 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/sales")}
            className="h-10 w-10 shrink-0 rounded-2xl"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-black tracking-tight">
              Sale Details
            </h1>

            <p className="truncate text-sm text-muted-foreground">
              {sale.invoiceNo}
            </p>
          </div>
        </div>

        <Button type="button" variant="outline" className="rounded-2xl">
          <Printer className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Print</span>
        </Button>
      </div>

      {/* Invoice Summary */}
      <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-600 p-5 text-white shadow-xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/70">Invoice</p>

            <h2 className="mt-1 text-2xl font-black">{sale.invoiceNo}</h2>

            <p className="mt-1 text-sm text-white/75">Sale No: {sale.saleNo}</p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm text-white/70">Grand Total</p>

            <p className="mt-1 text-3xl font-black">
              ₹{formatMoney(sale.grandTotal)}
            </p>

            <StatusBadge status={paymentStatus} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/20 pt-4 sm:grid-cols-4">
          <InfoItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Date"
            value={formatDate(sale.saleDate)}
          />

          <InfoItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Payment"
            value={paymentMethod}
          />

          <InfoItem
            icon={<Package className="h-4 w-4" />}
            label="Items"
            value={String(items.length)}
          />

          <InfoItem
            icon={<Wallet className="h-4 w-4" />}
            label="Paid"
            value={`₹${formatMoney(sale.paidAmount)}`}
          />
        </div>
      </Card>

      {/* Customer */}
      <Card className="rounded-3xl p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-violet-100 p-3">
            <UserRound className="h-5 w-5 text-violet-700" />
          </div>

          <div>
            <h3 className="font-bold">Customer</h3>
            <p className="text-sm text-muted-foreground">
              Customer information
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>

            <p className="mt-1 font-semibold">{customerName}</p>
          </div>

          {customerMobile && (
            <div>
              <p className="text-xs text-muted-foreground">Mobile</p>

              <p className="mt-1 flex items-center gap-2 font-semibold">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {customerMobile}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Items */}
      <Card className="overflow-hidden rounded-3xl shadow-sm">
        <div className="border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3">
              <Package className="h-5 w-5 text-emerald-700" />
            </div>

            <div>
              <h3 className="font-bold">Products</h3>

              <p className="text-sm text-muted-foreground">
                {items.length} product{items.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {items.map((item, index) => (
            <div key={`${item.product}-${index}`} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold">{item.productName}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.productCode}
                    {item.unit ? ` • ${item.unit}` : ""}
                  </p>
                </div>

                <p className="shrink-0 font-bold">₹{formatMoney(item.total)}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
                <DetailCell label="Qty" value={String(item.quantity)} />

                <DetailCell
                  label="Price"
                  value={`₹${formatMoney(item.sellingPrice)}`}
                />

                <DetailCell
                  label="Discount"
                  value={`₹${formatMoney(item.discount)}`}
                />

                <DetailCell label="Tax" value={`${formatMoney(item.tax)}%`} />

                <DetailCell
                  label="Profit"
                  value={`₹${formatMoney(item.profit)}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bill Summary */}
      <Card className="rounded-3xl p-5 shadow-sm">
        <h3 className="mb-4 font-bold">Bill Summary</h3>

        <div className="space-y-3">
          <SummaryRow label="Subtotal" value={sale.subtotal} />

          <SummaryRow label="Discount" value={sale.discount} negative />

          <SummaryRow label="Tax" value={sale.taxAmount} />

          <div className="border-t pt-4">
            <SummaryRow label="Grand Total" value={sale.grandTotal} strong />
          </div>

          <SummaryRow label="Paid Amount" value={sale.paidAmount} />

          <SummaryRow
            label="Due Amount"
            value={sale.dueAmount}
            due={sale.dueAmount > 0}
          />
        </div>
      </Card>

      {/* Payment Details */}
      <Card className="rounded-3xl p-5 shadow-sm">
        <h3 className="mb-4 font-bold">Payment Details</h3>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <PaymentAmount label="Cash" value={sale.payment?.cash ?? 0} />

          <PaymentAmount label="UPI" value={sale.payment?.upi ?? 0} />

          <PaymentAmount label="Card" value={sale.payment?.card ?? 0} />

          <PaymentAmount label="Bank" value={sale.payment?.bank ?? 0} />

          <PaymentAmount label="Credit" value={sale.payment?.credit ?? 0} />
        </div>
      </Card>

      {/* Notes */}
      {sale.notes && (
        <Card className="rounded-3xl p-5 shadow-sm">
          <h3 className="mb-2 font-bold">Notes</h3>

          <p className="text-sm text-muted-foreground">{sale.notes}</p>
        </Card>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatMoney(value: number | undefined) {
  return (value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-white/60">
        {icon}
        {label}
      </div>

      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
}

interface DetailCellProps {
  label: string;
  value: string;
}

function DetailCell({ label, value }: DetailCellProps) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: number;
  strong?: boolean;
  negative?: boolean;
  due?: boolean;
}

function SummaryRow({
  label,
  value,
  strong = false,
  negative = false,
  due = false,
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "font-bold" : "text-sm text-muted-foreground"}>
        {label}
      </span>

      <span
        className={[
          strong ? "text-lg font-black" : "font-semibold",
          negative ? "text-red-600" : "",
          due ? "text-red-600" : "",
        ].join(" ")}
      >
        {negative ? "- " : ""}₹{formatMoney(value)}
      </span>
    </div>
  );
}

interface PaymentAmountProps {
  label: string;
  value: number;
}

function PaymentAmount({ label, value }: PaymentAmountProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 font-bold">₹{formatMoney(value)}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "PAID";
  const isPartial = status === "PARTIAL";

  return (
    <span className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
      {isPaid ? "PAID" : isPartial ? "PARTIAL" : "DUE"}
    </span>
  );
}
