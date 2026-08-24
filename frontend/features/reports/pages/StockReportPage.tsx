"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";

import type { ReportColumn, StockReportItem } from "../types/report";

export default function StockReportPage() {
  /* -------------------------------------------------------------------------- */
  /* STATE                                                                      */
  /* -------------------------------------------------------------------------- */

  const [data, setData] = useState<StockReportItem[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* LOAD REPORT                                                                */
  /* -------------------------------------------------------------------------- */

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await reportService.getStockReport();

      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load stock report:", err);

      setData([]);
      setError("Unable to load stock report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  /* -------------------------------------------------------------------------- */
  /* FILTER                                                                     */
  /* -------------------------------------------------------------------------- */

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return data;
    }

    return data.filter((item) => {
      const productCode = item.productCode.toLowerCase();
      const productName = item.productName.toLowerCase();
      const category = item.category.toLowerCase();
      const subCategory = item.subCategory.toLowerCase();

      return (
        productCode.includes(keyword) ||
        productName.includes(keyword) ||
        category.includes(keyword) ||
        subCategory.includes(keyword)
      );
    });
  }, [data, search]);

  /* -------------------------------------------------------------------------- */
  /* SUMMARY                                                                    */
  /* -------------------------------------------------------------------------- */

  const summary = useMemo(() => {
    const totalStock = filteredData.reduce(
      (sum, item) => sum + Number(item.stock ?? 0),
      0,
    );

    const purchaseValue = filteredData.reduce(
      (sum, item) =>
        sum + Number(item.stock ?? 0) * Number(item.purchasePrice ?? 0),
      0,
    );

    const sellingValue = filteredData.reduce(
      (sum, item) =>
        sum + Number(item.stock ?? 0) * Number(item.sellingPrice ?? 0),
      0,
    );

    const potentialProfit = sellingValue - purchaseValue;

    return [
      {
        label: "Products",
        value: filteredData.length,
        formattedValue: filteredData.length.toLocaleString("en-IN"),
      },

      {
        label: "Total Stock",
        value: totalStock,
        formattedValue: totalStock.toLocaleString("en-IN"),
      },

      {
        label: "Purchase Value",
        value: purchaseValue,
        formattedValue: `₹${purchaseValue.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },

      {
        label: "Potential Profit",
        value: potentialProfit,
        formattedValue: `₹${potentialProfit.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
    ];
  }, [filteredData]);

  /* -------------------------------------------------------------------------- */
  /* EXPORT                                                                     */
  /* -------------------------------------------------------------------------- */

  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      setError(null);

      const blob = await reportService.exportStockPdf();

      if (!(blob instanceof Blob)) {
        throw new Error("Invalid PDF response.");
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "stock-report.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export stock report:", err);

      setError("Unable to export stock report. Please try again.");
    } finally {
      setExporting(false);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* HELPERS                                                                    */
  /* -------------------------------------------------------------------------- */

  const formatCurrency = (value: number) =>
    `₹${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* -------------------------------------------------------------------------- */
  /* TABLE COLUMNS                                                              */
  /* -------------------------------------------------------------------------- */

  const columns: ReportColumn<StockReportItem>[] = [
    {
      key: "productCode",
      title: "Code",
    },

    {
      key: "productName",
      title: "Product",
    },

    {
      key: "category",
      title: "Category",
    },

    {
      key: "subCategory",
      title: "Sub Category",
    },

    {
      key: "stock",
      title: "Stock",
      align: "right",
      render: (row) => (
        <span className="font-semibold">
          {Number(row.stock).toLocaleString("en-IN")}
        </span>
      ),
    },

    {
      key: "purchasePrice",
      title: "Purchase Price",
      align: "right",
      render: (row) => <span>{formatCurrency(row.purchasePrice)}</span>,
    },

    {
      key: "sellingPrice",
      title: "Selling Price",
      align: "right",
      render: (row) => (
        <span className="font-semibold">
          {formatCurrency(row.sellingPrice)}
        </span>
      ),
    },

    {
      key: "profit",
      title: "Profit",
      align: "right",
      render: (row) => (
        <span className="font-semibold text-emerald-600">
          {formatCurrency(row.profit)}
        </span>
      ),
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <ReportLayout
      title="Stock Report"
      description="Inventory • Stock Levels • Pricing • Profit"
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
            Loading stock report...
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border bg-card shadow-sm">
          <div className="text-center">
            <p className="text-base font-semibold">No stock records found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              No products match your current search.
            </p>
          </div>
        </div>
      ) : (
        <ReportTable columns={columns} data={filteredData} />
      )}
    </ReportLayout>
  );
}
