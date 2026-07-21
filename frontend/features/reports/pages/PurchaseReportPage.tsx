"use client";

import { useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";
import DateText from "@/features/shared/ui/data-display/DateText";
import StatusBadge from "@/features/shared/ui/badges/StatusBadge";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";
import type { PurchaseReportItem, ReportColumn } from "../types/report";

export default function PurchaseReportPage() {
  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  /* -------------------------------------------------------------------------- */
  /* Data                                                                       */
  /* -------------------------------------------------------------------------- */

  const data = reportService.getPurchaseReport();

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((purchase) => {
      const matchesSearch =
        purchase.purchaseNo.toLowerCase().includes(keyword) ||
        purchase.supplier.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "all" || purchase.paymentStatus.toLowerCase() === status;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  const summary = reportService.getPurchaseSummary();

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

  const columns: ReportColumn<PurchaseReportItem>[] = [
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
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      key: "total",
      title: "Amount",
      align: "right",
      render: (row) => <AmountText value={row.total} />,
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <ReportLayout
      title="Purchase Report"
      description="Suppliers • Purchases • Payments"
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
