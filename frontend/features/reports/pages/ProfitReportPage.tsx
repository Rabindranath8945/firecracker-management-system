"use client";

import { useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";
import type { ProfitReportItem, ReportColumn } from "../types/report";

export default function ProfitReportPage() {
  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  /* -------------------------------------------------------------------------- */
  /* Data                                                                       */
  /* -------------------------------------------------------------------------- */

  const data = reportService.getProfitReport();

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((item) => item.month.toLowerCase().includes(keyword));
  }, [data, search]);

  const summary = reportService.getProfitSummary();

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

  const columns: ReportColumn<ProfitReportItem>[] = [
    {
      key: "month",
      title: "Month",
    },
    {
      key: "sales",
      title: "Sales",
      align: "right",
      render: (row) => <AmountText value={row.sales} />,
    },
    {
      key: "purchases",
      title: "Purchases",
      align: "right",
      render: (row) => <AmountText value={row.purchases} />,
    },
    {
      key: "expenses",
      title: "Expenses",
      align: "right",
      render: (row) => <AmountText value={row.expenses} />,
    },
    {
      key: "profit",
      title: "Net Profit",
      align: "right",
      render: (row) => (
        <AmountText
          value={row.profit}
          className="font-semibold text-emerald-600"
        />
      ),
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <ReportLayout
      title="Profit Summary"
      description="Revenue • Purchases • Expenses • Net Profit"
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
