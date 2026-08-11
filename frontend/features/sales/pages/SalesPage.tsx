"use client";

import { useState } from "react";

import { SalesHero } from "@/features/sales/components/hero/SalesHero";
import { SalesSummary } from "@/features/sales/components/summary/SalesSummary";
import { SalesSearch } from "@/features/sales/components/search/SalesSearch";
import { SaleFilters } from "@/features/sales/components/list/SaleFilters";
import { SaleList } from "@/features/sales/components/list/SaleList";
import FloatingActionButton from "@/components/common/shared/button/FloatingActionButton";

export default function SalesPage() {
  const [search, setSearch] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  return (
    <main className="space-y-5 px-4 py-5 pb-24">
      <SalesHero />

      <SalesSummary />

      <SalesSearch value={search} onChange={setSearch} />

      <SaleFilters
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <SaleList
        search={search}
        paymentStatus={paymentStatus}
        fromDate={fromDate}
        toDate={toDate}
      />
      <FloatingActionButton href="/sales/new" label="New Sale" />
    </main>
  );
}
