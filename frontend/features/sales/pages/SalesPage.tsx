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
  const [paymentMethod, setPaymentMethod] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <main className="space-y-5 px-4 py-5 pb-24">
      <SalesHero />

      <SalesSummary />

      <SalesSearch
        value={search}
        onChange={setSearch}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onResetDate={() => {
          setFromDate("");
          setToDate("");
        }}
      />

      <SaleFilters
        paymentStatus={paymentStatus}
        paymentMethod={paymentMethod}
        fromDate={fromDate}
        toDate={toDate}
        onPaymentStatusChange={setPaymentStatus}
        onPaymentMethodChange={setPaymentMethod}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onReset={() => {
          setPaymentStatus("");
          setPaymentMethod("");
          setFromDate("");
          setToDate("");
        }}
      />

      <SaleList
        search={search}
        paymentStatus={paymentStatus}
        paymentMethod={paymentMethod}
        fromDate={fromDate}
        toDate={toDate}
      />

      <FloatingActionButton href="/sales/new" label="New Sale" />
    </main>
  );
}
