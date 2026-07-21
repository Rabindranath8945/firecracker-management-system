"use client";

import { useMemo, useState } from "react";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";

import { reportService } from "../services/report.service";
import type { ReportColumn, SalesReportItem } from "../types/report";

import StatusBadge from "@/features/shared/ui/badges/StatusBadge";
import AmountText from "@/features/shared/ui/data-display/AmountText";
import DateText from "@/features/shared/ui/data-display/DateText";

export default function SalesReportPage() {
  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  /* -------------------------------------------------------------------------- */
  /* Data                                                                       */
  /* -------------------------------------------------------------------------- */

  const data = reportService.getSalesReport();

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || item.paymentStatus.toLowerCase() === status;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  const summary = reportService.getSalesSummary();

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

  const columns: ReportColumn<SalesReportItem>[] = [
    {
      key: "invoiceNo",
      title: "Invoice",
    },
    {
      key: "customer",
      title: "Customer",
    },
    {
      key: "paymentStatus",
      title: "Status",
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      key: "total",
      title: "Amount",
      align: "right",
      render: (row) => <AmountText value={row.total} />,
    },
    {
      key: "date",
      title: "Date",
      render: (row) => <DateText value={row.date} />,
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <ReportLayout
      title="Sales Report"
      description="Revenue • Invoices • Payments"
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
