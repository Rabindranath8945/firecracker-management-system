"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";
import DateText from "@/features/shared/ui/data-display/DateText";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";

import {
  reportService,
  type PurchaseReportResponse,
} from "../services/report.service";

import type { ReportColumn } from "../types/report";

/* -------------------------------------------------------------------------- */
/* DATE RANGE                                                                 */
/* -------------------------------------------------------------------------- */

function getDateRange(range: string) {
  const now = new Date();

  switch (range) {
    case "today": {
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      return {
        from: from.toISOString(),
        to: now.toISOString(),
      };
    }

    case "week": {
      const from = new Date(now);

      from.setDate(from.getDate() - 7);

      return {
        from: from.toISOString(),
        to: now.toISOString(),
      };
    }

    case "year": {
      const from = new Date(now.getFullYear(), 0, 1);

      return {
        from: from.toISOString(),
        to: now.toISOString(),
      };
    }

    case "month":
    default: {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        from: from.toISOString(),
        to: now.toISOString(),
      };
    }
  }
}

/* -------------------------------------------------------------------------- */
/* STATUS                                                                     */
/* -------------------------------------------------------------------------- */

function PurchaseStatusBadge({
  status,
}: {
  status: PurchaseReportResponse["paymentStatus"];
}) {
  const normalized = String(status ?? "").toLowerCase();

  const styles =
    normalized === "paid"
      ? "bg-emerald-100 text-emerald-700"
      : normalized === "due"
        ? "bg-amber-100 text-amber-700"
        : normalized === "pending"
          ? "bg-blue-100 text-blue-700"
          : normalized === "cancelled" || normalized === "canceled"
            ? "bg-red-100 text-red-700"
            : "bg-slate-100 text-slate-700";

  const label =
    normalized === "paid"
      ? "Paid"
      : normalized === "due"
        ? "Due"
        : normalized === "pending"
          ? "Pending"
          : normalized === "cancelled" || normalized === "canceled"
            ? "Cancelled"
            : String(status ?? "Unknown");

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function PurchaseReportPage() {
  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [data, setData] = useState<PurchaseReportResponse[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* LOAD REPORT                                                              */
  /* ------------------------------------------------------------------------ */

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { from, to } = getDateRange(dateRange);

      const result = await reportService.getPurchaseReport(from, to);

      setData(result);
    } catch (error) {
      console.error("Failed to load purchase report:", error);

      setData([]);
      setError("Unable to load purchase report.");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  /* ------------------------------------------------------------------------ */
  /* LOAD WHEN DATE RANGE CHANGES                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  /* ------------------------------------------------------------------------ */
  /* FILTER                                                                   */
  /* ------------------------------------------------------------------------ */

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return data.filter((purchase) => {
      const purchaseNo = String(purchase.purchaseNo ?? "").toLowerCase();

      const supplier = String(purchase.supplier ?? "").toLowerCase();

      const paymentStatus = String(purchase.paymentStatus ?? "").toLowerCase();

      const matchesSearch =
        !keyword || purchaseNo.includes(keyword) || supplier.includes(keyword);

      const matchesStatus =
        status === "all" || paymentStatus === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  /* ------------------------------------------------------------------------ */
  /* SUMMARY                                                                  */
  /* ------------------------------------------------------------------------ */

  const summary = useMemo(() => {
    return filteredData.reduce(
      (result, purchase) => {
        const amount = Number(purchase.total ?? 0);

        const paymentStatus = String(
          purchase.paymentStatus ?? "",
        ).toLowerCase();

        result.totalPurchase += amount;

        if (paymentStatus === "paid") {
          result.paidPurchase += amount;
        }

        if (paymentStatus === "due") {
          result.duePurchase += amount;
        }

        result.totalInvoices += 1;

        return result;
      },
      {
        totalPurchase: 0,
        paidPurchase: 0,
        duePurchase: 0,
        totalInvoices: 0,
      },
    );
  }, [filteredData]);

  /* ------------------------------------------------------------------------ */
  /* EXPORT PDF                                                               */
  /* ------------------------------------------------------------------------ */

  const handleExport = useCallback(async () => {
    try {
      setExporting(true);

      const { from, to } = getDateRange(dateRange);

      const blob = await reportService.exportPurchasePdf(from, to);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "purchase-report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export purchase report:", error);
    } finally {
      setExporting(false);
    }
  }, [dateRange]);

  /* ------------------------------------------------------------------------ */
  /* TABLE COLUMNS                                                            */
  /* ------------------------------------------------------------------------ */

  const columns = useMemo<ReportColumn<PurchaseReportResponse>[]>(
    () => [
      {
        key: "purchaseNo",
        title: "Purchase No",
      },

      {
        key: "supplier",
        title: "Supplier",
      },

      {
        key: "date",
        title: "Date",
        render: (row) => <DateText value={row.date} />,
      },

      {
        key: "paymentStatus",
        title: "Status",
        render: (row) => <PurchaseStatusBadge status={row.paymentStatus} />,
      },

      {
        key: "total",
        title: "Amount",
        align: "right",
        render: (row) => <AmountText value={Number(row.total ?? 0)} />,
      },
    ],
    [],
  );

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <ReportLayout
      title="Purchase Report"
      description="Suppliers • Purchases • Payments"
      totalRecords={filteredData.length}
      loading={loading}
      showBackButton
      onExport={handleExport}
      summary={[
        {
          label: "Total Purchases",
          value: summary.totalPurchase,
          formattedValue: `₹${summary.totalPurchase.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        },

        {
          label: "Paid",
          value: summary.paidPurchase,
          formattedValue: `₹${summary.paidPurchase.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        },

        {
          label: "Due",
          value: summary.duePurchase,
          formattedValue: `₹${summary.duePurchase.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        },

        {
          label: "Total Invoices",
          value: summary.totalInvoices,
          formattedValue: summary.totalInvoices.toLocaleString("en-IN"),
        },
      ]}
      toolbar={
        <ReportToolbar
          search={search}
          status={status}
          dateRange={dateRange}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onDateRangeChange={setDateRange}
          onExport={handleExport}
          loading={loading || exporting}
        />
      }
    >
      {/* Loading */}

      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border bg-card shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />

            <p className="text-sm text-muted-foreground">
              Loading purchase report...
            </p>
          </div>
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 px-6 text-center">
          <p className="text-sm font-semibold text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void loadReport()}
            className="mt-4 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}

      {!loading && !error && filteredData.length === 0 && (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border bg-card shadow-sm">
          <div className="text-center">
            <p className="text-base font-semibold text-slate-800">
              No purchases found
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              No purchases match the selected filters.
            </p>
          </div>
        </div>
      )}

      {/* Table */}

      {!loading && !error && filteredData.length > 0 && (
        <ReportTable columns={columns} data={filteredData} />
      )}
    </ReportLayout>
  );
}
