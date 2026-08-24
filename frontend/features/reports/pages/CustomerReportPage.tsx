"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";

import type { CustomerReportItem, ReportColumn } from "../types/report";

export default function CustomerReportPage() {
  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [data, setData] = useState<CustomerReportItem[]>([]);

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

      const result = await reportService.getCustomerReport(from, to);

      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load customer report:", err);

      setData([]);
      setError("Unable to load customer report. Please try again.");
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

    return data.filter((customer) => {
      const customerCode = String(customer.customerNo ?? "").toLowerCase();

      const name = String(customer.name ?? "").toLowerCase();

      const mobile = String(customer.mobile ?? "").toLowerCase();

      return (
        customerCode.includes(keyword) ||
        name.includes(keyword) ||
        mobile.includes(keyword)
      );
    });
  }, [data, search]);

  /* ------------------------------------------------------------------------ */
  /* SUMMARY                                                                  */
  /* ------------------------------------------------------------------------ */

  const summary = useMemo(() => {
    const totalCustomers = filteredData.length;

    const totalInvoices = filteredData.reduce(
      (sum: number, customer) => sum + Number(customer.totalInvoices ?? 0),
      0,
    );

    const totalSales = filteredData.reduce(
      (sum: number, customer) => sum + Number(customer.totalSales ?? 0),
      0,
    );

    const outstanding = filteredData.reduce(
      (sum: number, customer) => sum + Number(customer.balance ?? 0),
      0,
    );

    return [
      {
        label: "Customers",
        value: totalCustomers,
        formattedValue: totalCustomers.toLocaleString("en-IN"),
      },
      {
        label: "Total Invoices",
        value: totalInvoices,
        formattedValue: totalInvoices.toLocaleString("en-IN"),
      },
      {
        label: "Total Sales",
        value: totalSales,
        formattedValue: `₹${totalSales.toLocaleString("en-IN", {
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

      const blob = await reportService.exportCustomerPdf(from, to);

      if (!(blob instanceof Blob)) {
        throw new Error("Invalid PDF response.");
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "customer-report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export customer report:", err);

      setError("Unable to export customer report. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [getDateRange]);

  /* ------------------------------------------------------------------------ */
  /* TABLE COLUMNS                                                            */
  /* ------------------------------------------------------------------------ */

  const columns: ReportColumn<CustomerReportItem>[] = [
    {
      key: "customerNo",
      title: "Customer No",
    },

    {
      key: "name",
      title: "Customer Name",
    },

    {
      key: "mobile",
      title: "Mobile",
    },

    {
      key: "totalInvoices",
      title: "Invoices",
      align: "right",
      render: (row) => (
        <span className="font-medium">
          {Number(row.totalInvoices ?? 0).toLocaleString("en-IN")}
        </span>
      ),
    },

    {
      key: "totalSales",
      title: "Sales",
      align: "right",
      render: (row) => <AmountText value={Number(row.totalSales ?? 0)} />,
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
      title="Customer Report"
      description="Customers • Invoices • Sales • Outstanding"
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
            Loading customer report...
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border bg-card shadow-sm">
          <div className="text-center">
            <p className="text-base font-semibold">No customer records found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              No customers match your current search or filters.
            </p>
          </div>
        </div>
      ) : (
        <ReportTable columns={columns} data={filteredData} />
      )}
    </ReportLayout>
  );
}
