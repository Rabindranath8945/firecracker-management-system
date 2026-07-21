"use client";

import { useMemo, useState } from "react";

import AmountText from "@/features/shared/ui/data-display/AmountText";

import ReportLayout from "../components/ReportLayout";
import ReportTable from "../components/ReportTable";
import ReportToolbar from "../components/ReportToolbar";
import { reportService } from "../services/report.service";
import type { CustomerReportItem, ReportColumn } from "../types/report";

export default function CustomerReportPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  const data = reportService.getCustomerReport();

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter(
      (customer) =>
        customer.customerNo.toLowerCase().includes(keyword) ||
        customer.name.toLowerCase().includes(keyword) ||
        customer.mobile.includes(keyword),
    );
  }, [data, search]);

  const summary = reportService.getCustomerSummary();

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
      key: "balance",
      title: "Outstanding",
      align: "right",
      render: (row) => <AmountText value={row.balance} />,
    },
  ];

  return (
    <ReportLayout
      title="Customer Report"
      description="Customers • Outstanding • Business Activity"
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
