"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";

import type { ReportColumn, SupplierReportItem } from "../types/report";

export default function SupplierReportPage() {
  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [data, setData] = useState<SupplierReportItem[]>([]);

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

      const result = await reportService.getSupplierReport(from, to);

      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load supplier report:", err);

      setData([]);
      setError("Unable to load supplier report. Please try again.");
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

    return data.filter((supplier) => {
      const supplierNo = String(supplier.supplierNo ?? "").toLowerCase();

      const name = String(supplier.name ?? "").toLowerCase();

      const mobile = String(supplier.mobile ?? "").toLowerCase();

      return (
        supplierNo.includes(keyword) ||
        name.includes(keyword) ||
        mobile.includes(keyword)
      );
    });
  }, [data, search]);

  /* ------------------------------------------------------------------------ */
  /* SUMMARY                                                                  */
  /* ------------------------------------------------------------------------ */

  const summary = useMemo(() => {
    const totalSuppliers = filteredData.length;

    const totalPurchases = filteredData.reduce(
      (sum: number, supplier) => sum + Number(supplier.totalPurchases ?? 0),
      0,
    );

    const purchaseAmount = filteredData.reduce(
      (sum: number, supplier) => sum + Number(supplier.purchaseAmount ?? 0),
      0,
    );

    const outstanding = filteredData.reduce(
      (sum: number, supplier) => sum + Number(supplier.balance ?? 0),
      0,
    );

    return [
      {
        label: "Suppliers",
        value: totalSuppliers,
        formattedValue: totalSuppliers.toLocaleString("en-IN"),
      },
      {
        label: "Total Purchases",
        value: totalPurchases,
        formattedValue: totalPurchases.toLocaleString("en-IN"),
      },
      {
        label: "Purchase Amount",
        value: purchaseAmount,
        formattedValue: `₹${purchaseAmount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
      {
        label: "Outstanding",
        value: outstanding,
        formattedValue: `₹${outstanding.toLocaleString("en-IN", {
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

      const blob = await reportService.exportSupplierPdf(from, to);

      if (!(blob instanceof Blob)) {
        throw new Error("Invalid PDF response.");
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "supplier-report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export supplier report:", err);

      setError("Unable to export supplier report. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [getDateRange]);

  /* ------------------------------------------------------------------------ */
  /* TABLE COLUMNS                                                            */
  /* ------------------------------------------------------------------------ */

  const columns: ReportColumn<SupplierReportItem>[] = [
    {
      key: "supplierNo",
      title: "Supplier No",
    },

    {
      key: "name",
      title: "Supplier Name",
    },

    {
      key: "mobile",
      title: "Mobile",
    },

    {
      key: "totalPurchases",
      title: "Purchases",
      align: "right",
      render: (row) => (
        <span className="font-medium">
          {Number(row.totalPurchases ?? 0).toLocaleString("en-IN")}
        </span>
      ),
    },

    {
      key: "purchaseAmount",
      title: "Purchase Amount",
      align: "right",
      render: (row) => <AmountText value={Number(row.purchaseAmount ?? 0)} />,
    },

    {
      key: "balance",
      title: "Outstanding",
      align: "right",
      render: (row) => <AmountText value={Number(row.balance ?? 0)} />,
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <ReportLayout
      title="Supplier Report"
      description="Suppliers • Purchases • Payments • Outstanding"
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
            Loading supplier report...
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border bg-card shadow-sm">
          <div className="text-center">
            <p className="text-base font-semibold">No supplier records found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              No suppliers match your current search or filters.
            </p>
          </div>
        </div>
      ) : (
        <ReportTable columns={columns} data={filteredData} />
      )}
    </ReportLayout>
  );
}
