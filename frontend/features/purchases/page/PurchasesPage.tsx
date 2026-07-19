"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { usePurchases } from "../hooks/usePurchases";

import { PurchaseHero } from "../components/PurchaseHero";
import { PurchaseSummary } from "../components/PurchaseSummary";
import { PurchaseSearch } from "../components/PurchaseSearch";
import { PurchaseCard } from "../components/PurchaseCard";
import { PurchaseSkeleton } from "../components/PurchaseSkeleton";
import { EmptyPurchase } from "../components/EmptyPurchase";
import { useRouter } from "next/navigation";

export default function PurchasesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, isLoading } = usePurchases();

  const purchases = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const filteredPurchases = useMemo(() => {
    if (!search.trim()) return purchases;

    const keyword = search.toLowerCase();

    return purchases.filter((purchase: any) => {
      return (
        purchase.purchaseNo?.toLowerCase().includes(keyword) ||
        purchase.invoiceNo?.toLowerCase().includes(keyword) ||
        purchase.supplierName?.toLowerCase().includes(keyword)
      );
    });
  }, [search, purchases]);

  const totalPurchase = purchases.reduce(
    (sum: number, purchase: any) => sum + purchase.grandTotal,
    0,
  );

  const todayPurchase = purchases.reduce(
    (sum: number, purchase: any) => sum + purchase.grandTotal,
    0,
  );

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-6">
      <PurchaseHero totalPurchase={totalPurchase} monthlyGrowth={18.5} />

      <PurchaseSummary
        today={todayPurchase}
        pending={0}
        suppliers={0}
        items={purchases.length}
      />

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <PurchaseSearch value={search} onChange={setSearch} />
      </section>

      <section className="space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Recent Purchases</h2>

            <p className="text-sm text-muted-foreground">
              {filteredPurchases.length} purchase
              {filteredPurchases.length !== 1 && "s"}
            </p>
          </div>
        </div>

        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <PurchaseSkeleton key={index} />
          ))}

        {!isLoading && filteredPurchases.length === 0 && (
          <section className="rounded-3xl border border-dashed p-10">
            <EmptyPurchase />
          </section>
        )}

        {!isLoading &&
          filteredPurchases.map((purchase: any) => (
            <PurchaseCard key={purchase._id} purchase={purchase} />
          ))}
      </section>
      <Button
        size="lg"
        onClick={() => router.push("/purchases/new")}
        className="
    fixed
    bottom-24
    right-5
    z-50
    h-16
    rounded-full
    px-7
    shadow-2xl
    active:scale-95
  "
      >
        <Plus className="mr-2 h-5 w-5" />
        New Purchase
      </Button>
    </main>
  );
}
