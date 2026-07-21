"use client";

import { useMemo, useState } from "react";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";
import type { ReportColumn, StockReportItem } from "../types/report";

export default function StockReportPage() {
  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  /* -------------------------------------------------------------------------- */
  /* Data                                                                       */
  /* -------------------------------------------------------------------------- */

  const data = reportService.getStockReport();

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter(
      (item) =>
        item.productName.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword),
    );
  }, [data, search]);

  const summary = reportService.getStockSummary();

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

  const columns: ReportColumn<StockReportItem>[] = [
    {
      key: "productName",
      title: "Product",
    },
    {
      key: "category",
      title: "Category",
    },
    {
      key: "stock",
      title: "Stock",
      align: "right",
      render: (row) => <span className="font-semibold">{row.stock}</span>,
    },
    {
      key: "unit",
      title: "Unit",
      align: "center",
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <ReportLayout
      title="Stock Report"
      description="Inventory • Stock Levels • Product Availability"
      totalRecords={filteredData.length}
      summary={summary}
      showBackButton
      toolbar={
        <ReportToolbar
          search={search}
          status={status}
          dateRange={dateRange}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onDateRangeChange={setDateRange}
          onExport={() => {}}
        />
      }
      onExport={() => {}}
    >
      <ReportTable columns={columns} data={filteredData} />
    </ReportLayout>
  );
}
