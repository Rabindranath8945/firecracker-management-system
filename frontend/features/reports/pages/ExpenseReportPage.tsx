"use client";

import { useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";
import DateText from "@/features/shared/ui/data-display/DateText";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";
import type { ExpenseReportItem, ReportColumn } from "../types/report";

export default function ExpenseReportPage() {
  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  /* -------------------------------------------------------------------------- */
  /* Data                                                                       */
  /* -------------------------------------------------------------------------- */

  const data = reportService.getExpenseReport();

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter(
      (expense) =>
        expense.expenseNo.toLowerCase().includes(keyword) ||
        expense.category.toLowerCase().includes(keyword),
    );
  }, [data, search]);

  const summary = reportService.getExpenseSummary();

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

  const columns: ReportColumn<ExpenseReportItem>[] = [
    {
      key: "expenseNo",
      title: "Expense No",
    },
    {
      key: "category",
      title: "Category",
    },
    {
      key: "date",
      title: "Date",
      render: (row) => <DateText value={row.date} />,
    },
    {
      key: "amount",
      title: "Amount",
      align: "right",
      render: (row) => <AmountText value={row.amount} />,
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <ReportLayout
      title="Expense Report"
      description="Business Expenses • Categories • Spending Analysis"
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
