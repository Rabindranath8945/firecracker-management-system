"use client";

import { useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";
import type { ReportColumn, SupplierReportItem } from "../types/report";

export default function SupplierReportPage() {
  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  /* -------------------------------------------------------------------------- */
  /* Data                                                                       */
  /* -------------------------------------------------------------------------- */

  const data = reportService.getSupplierReport();

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter(
      (supplier) =>
        supplier.supplierNo.toLowerCase().includes(keyword) ||
        supplier.name.toLowerCase().includes(keyword) ||
        supplier.mobile.includes(keyword),
    );
  }, [data, search]);

  const summary = reportService.getSupplierSummary();

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

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
      key: "balance",
      title: "Outstanding",
      align: "right",
      render: (row) => <AmountText value={row.balance} />,
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <ReportLayout
      title="Supplier Report"
      description="Suppliers • Outstanding • Payment Summary"
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
