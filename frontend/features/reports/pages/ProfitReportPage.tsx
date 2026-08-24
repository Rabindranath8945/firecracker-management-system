"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";

import { reportService } from "../services/report.service";

import type { ProfitReportItem, ReportColumn } from "../types/report";

export default function ProfitReportPage() {
  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [data, setData] = useState<ProfitReportItem[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* DATE RANGE                                                               */
  /* ------------------------------------------------------------------------ */

  const getDateRange = useCallback(() => {
    const now = new Date();

    let from: Date;

    switch (dateRange) {
      case "today":
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;

      case "week":
        from = new Date(now);
        from.setDate(now.getDate() - 7);
        break;

      case "year":
        from = new Date(now.getFullYear(), 0, 1);
        break;

      case "all":
        from = new Date("2000-01-01");
        break;

      case "month":
      default:
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    return {
      from: from.toISOString(),
      to: now.toISOString(),
    };
  }, [dateRange]);

  /* ------------------------------------------------------------------------ */
  /* LOAD REPORT                                                              */
  /* ------------------------------------------------------------------------ */

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { from, to } = getDateRange();

      const result = await reportService.getProfitReport(from, to);

      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load profit report:", err);

      setData([]);
      setError("Unable to load profit report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  /* ------------------------------------------------------------------------ */
  /* RELOAD WHEN DATE RANGE CHANGES                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  /* ------------------------------------------------------------------------ */
  /* FILTER                                                                   */
  /* ------------------------------------------------------------------------ */

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return data;
    }

    return data.filter((item) =>
      String(item.month ?? "")
        .toLowerCase()
        .includes(keyword),
    );
  }, [data, search]);

  /* ------------------------------------------------------------------------ */
  /* SUMMARY                                                                  */
  /* ------------------------------------------------------------------------ */

  const summary = useMemo(() => {
    const totalSales = filteredData.reduce(
      (sum: number, item) => sum + Number(item.sales ?? 0),
      0,
    );

    const totalPurchases = filteredData.reduce(
      (sum: number, item) => sum + Number(item.purchases ?? 0),
      0,
    );

    const totalExpenses = filteredData.reduce(
      (sum: number, item) => sum + Number(item.expenses ?? 0),
      0,
    );

    const totalProfit = filteredData.reduce(
      (sum: number, item) => sum + Number(item.profit ?? 0),
      0,
    );

    return [
      {
        label: "Sales",
        value: totalSales,
        formattedValue: `₹${totalSales.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
      {
        label: "Purchases",
        value: totalPurchases,
        formattedValue: `₹${totalPurchases.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
      {
        label: "Expenses",
        value: totalExpenses,
        formattedValue: `₹${totalExpenses.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
      {
        label: "Net Profit",
        value: totalProfit,
        formattedValue: `₹${totalProfit.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
    ];
  }, [filteredData]);

  /* ------------------------------------------------------------------------ */
  /* EXPORT PDF                                                               */
  /* ------------------------------------------------------------------------ */

  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      setError(null);

      const { from, to } = getDateRange();

      const blob = await reportService.exportProfitLossPdf(from, to);

      if (!(blob instanceof Blob)) {
        throw new Error("Invalid PDF response.");
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "profit-loss-report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export profit report:", err);

      setError("Unable to export profit report. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [getDateRange]);

  /* ------------------------------------------------------------------------ */
  /* TABLE COLUMNS                                                            */
  /* ------------------------------------------------------------------------ */

  const columns: ReportColumn<ProfitReportItem>[] = [
    {
      key: "month",
      title: "Month",
    },

    {
      key: "sales",
      title: "Sales",
      align: "right",
      render: (row) => <AmountText value={Number(row.sales ?? 0)} />,
    },

    {
      key: "purchases",
      title: "Purchases",
      align: "right",
      render: (row) => <AmountText value={Number(row.purchases ?? 0)} />,
    },

    {
      key: "expenses",
      title: "Expenses",
      align: "right",
      render: (row) => <AmountText value={Number(row.expenses ?? 0)} />,
    },

    {
      key: "profit",
      title: "Net Profit",
      align: "right",
      render: (row) => (
        <AmountText
          value={Number(row.profit ?? 0)}
          className="font-semibold text-emerald-600"
        />
      ),
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <ReportLayout
      title="Profit & Loss Report"
      description="Revenue • Purchases • Expenses • Net Profit"
      totalRecords={filteredData.length}
      summary={summary}
      showBackButton
      loading={loading}
      error={error}
      toolbar={
        <ReportToolbar
          search={search}
          status={status}
          dateRange={dateRange}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onDateRangeChange={setDateRange}
          onExport={() => {
            void handleExport();
          }}
          loading={exporting}
        />
      }
      onExport={() => {
        void handleExport();
      }}
    >
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">
            Loading profit report...
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border bg-card shadow-sm">
          <div className="text-center">
            <p className="text-base font-semibold">No profit records found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              No profit data matches your current search or filters.
            </p>
          </div>
        </div>
      ) : (
        <ReportTable columns={columns} data={filteredData} />
      )}
    </ReportLayout>
  );
}
