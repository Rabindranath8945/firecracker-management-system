"use client";

import { useMemo, useState } from "react";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import FloatingActionButton from "@/components/common/shared/button/FloatingActionButton";

import { usePurchases } from "../hooks/usePurchases";

import { PurchaseHero } from "../components/PurchaseHero";
import { PurchaseSearch } from "../components/PurchaseSearch";
import { PurchaseQuickActions } from "../components/PurchaseQuickActions";
import { PurchaseSummary } from "../components/PurchaseSummary";
import PurchaseList from "../components/PurchaseList";

import type { Purchase } from "../types/purchase.types";

export default function PurchasesPage() {
  const [search, setSearch] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);

  const [supplierOpen, setSupplierOpen] = useState(false);

  const { data, isLoading } = usePurchases();

  const purchases: Purchase[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const filteredPurchases = useMemo(() => {
    if (!search.trim()) {
      return purchases;
    }

    const keyword = search.toLowerCase();

    return purchases.filter((purchase) => {
      return (
        purchase.purchaseNo.toLowerCase().includes(keyword) ||
        purchase.invoiceNo?.toLowerCase().includes(keyword) ||
        purchase.supplierName?.toLowerCase().includes(keyword)
      );
    });
  }, [purchases, search]);

  const todayPurchase = filteredPurchases.reduce(
    (sum, purchase) => sum + purchase.grandTotal,
    0,
  );

  return (
    <>
      <PageContainer className="space-y-6 pb-24">
        <PurchaseHero />

        <PurchaseSearch value={search} onChange={setSearch} />

        <PurchaseQuickActions
          onSupplierClick={() => setSupplierOpen(true)}
          onFilterClick={() => setFilterOpen(true)}
        />

        <PurchaseSummary
          today={todayPurchase}
          pending={0}
          suppliers={0}
          items={filteredPurchases.length}
        />

        <PurchaseList
          loading={isLoading}
          purchases={filteredPurchases}
          onDelete={(purchase) => {
            console.log("Delete Purchase", purchase);
          }}
        />
      </PageContainer>

      <FloatingActionButton href="/purchases/new" label="New Purchase" />

      {/* TODO */}
      {/* <PurchaseFilterSheet
          open={filterOpen}
          onOpenChange={setFilterOpen}
      /> */}

      {/* <SupplierSheet
          open={supplierOpen}
          onOpenChange={setSupplierOpen}
      /> */}
    </>
  );
}
