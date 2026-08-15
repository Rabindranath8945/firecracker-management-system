"use client";

import { useMemo, useState } from "react";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import FloatingActionButton from "@/components/common/shared/button/FloatingActionButton";

import { usePurchases } from "../hooks/usePurchases";
import { useSuppliers } from "@/features/suppliers/hook/useSuppliers";

import { PurchaseHero } from "../components/PurchaseHero";
import { PurchaseSearch } from "../components/PurchaseSearch";
import { PurchaseQuickActions } from "../components/PurchaseQuickActions";
import { PurchaseSummary } from "../components/PurchaseSummary";
import PurchaseList from "../components/PurchaseList";
import PurchaseFilterSheet from "../components/PurchaseFilterSheet";
import PurchaseSupplierSheet from "../components/PurchaseSupplierSheet";

import type {
  PaymentStatus,
  Purchase,
  PurchaseQueryParams,
} from "../types/purchase.types";

export default function PurchasesPage() {
  /* ---------------------------------------------------------------------- */
  /* Search                                                                 */
  /* ---------------------------------------------------------------------- */

  const [search, setSearch] = useState("");

  /* ---------------------------------------------------------------------- */
  /* Filters                                                                */
  /* ---------------------------------------------------------------------- */

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>(
    undefined,
  );

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [supplierId, setSupplierId] = useState("");

  /* ---------------------------------------------------------------------- */
  /* Sheets                                                                 */
  /* ---------------------------------------------------------------------- */

  const [filterOpen, setFilterOpen] = useState(false);

  const [supplierOpen, setSupplierOpen] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Suppliers                                                              */
  /* ---------------------------------------------------------------------- */

  const { data: suppliers = [] } = useSuppliers();

  const purchaseSuppliers = useMemo(() => {
    return suppliers.map((supplier) => ({
      _id: supplier._id,
      name: supplier.name,
      mobile: supplier.mobile,
      supplierCode: supplier.supplierCode,
      currentDue: Math.max(
        Number(supplier.openingBalance ?? 0) +
          Number(supplier.totalPurchases ?? 0) -
          Number(supplier.totalPaid ?? 0),
        0,
      ),
    }));
  }, [suppliers]);

  /* ---------------------------------------------------------------------- */
  /* Backend Query                                                          */
  /* ---------------------------------------------------------------------- */

  const query = useMemo<PurchaseQueryParams>(() => {
    const params: PurchaseQueryParams = {
      page: 1,
      limit: 20,
      sort: "purchaseDate",
      order: "desc",
    };

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    if (paymentStatus) {
      params.paymentStatus = paymentStatus;
    }

    if (fromDate) {
      params.fromDate = fromDate;
    }

    if (toDate) {
      params.toDate = toDate;
    }

    if (supplierId) {
      params.supplier = supplierId;
    }

    return params;
  }, [search, paymentStatus, fromDate, toDate, supplierId]);

  /* ---------------------------------------------------------------------- */
  /* Load Purchases                                                         */
  /* ---------------------------------------------------------------------- */

  const { data, isLoading, isError, error } = usePurchases(query);

  /* ---------------------------------------------------------------------- */
  /* Normalize API Response                                                 */
  /* ---------------------------------------------------------------------- */

  const purchases: Purchase[] = useMemo(() => {
    if (Array.isArray(data?.data?.items)) {
      return data.data.items;
    }

    if (Array.isArray(data?.items)) {
      return data.items;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  }, [data]);

  /* ---------------------------------------------------------------------- */
  /* Summary                                                                */
  /* ---------------------------------------------------------------------- */

  const summary = useMemo(() => {
    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    /* ------------------------------------------------------------------ */
    /* Today's Purchases                                                   */
    /* ------------------------------------------------------------------ */

    const todayPurchases = purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.purchaseDate);

      return purchaseDate >= startOfToday && purchaseDate <= endOfToday;
    });

    const todayAmount = todayPurchases.reduce(
      (sum, purchase) => sum + Number(purchase.grandTotal ?? 0),
      0,
    );

    /* ------------------------------------------------------------------ */
    /* Pending Amount                                                      */
    /* ------------------------------------------------------------------ */

    const pendingAmount = purchases.reduce((sum, purchase) => {
      return sum + Math.max(Number(purchase.dueAmount ?? 0), 0);
    }, 0);

    /* ------------------------------------------------------------------ */
    /* Suppliers                                                           */
    /* ------------------------------------------------------------------ */

    const supplierSet = new Set<string>();

    purchases.forEach((purchase) => {
      const supplierId = purchase.supplier?._id;

      if (supplierId) {
        supplierSet.add(String(supplierId));
      }
    });

    /* ------------------------------------------------------------------ */
    /* Items                                                               */
    /* ------------------------------------------------------------------ */

    const itemCount = purchases.reduce((sum, purchase) => {
      if (!Array.isArray(purchase.items)) {
        return sum;
      }

      return (
        sum +
        purchase.items.reduce(
          (itemSum, item) => itemSum + Number(item.quantity ?? 0),
          0,
        )
      );
    }, 0);

    return {
      today: todayAmount,
      pending: pendingAmount,
      suppliers: supplierSet.size,
      items: itemCount,
    };
  }, [purchases]);

  /* ---------------------------------------------------------------------- */
  /* Reset Filters                                                          */
  /* ---------------------------------------------------------------------- */

  function resetFilters() {
    setSearch("");
    setPaymentStatus(undefined);
    setFromDate("");
    setToDate("");
    setSupplierId("");
  }

  /* ---------------------------------------------------------------------- */
  /* Delete                                                                 */
  /* ---------------------------------------------------------------------- */

  function handleDelete(purchase: Purchase) {
    console.log("Delete purchase:", purchase._id);
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (isError) {
    return (
      <PageContainer className="pb-24">
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-500/15">
            <span className="text-2xl font-black text-red-600">!</span>
          </div>

          <h2 className="mt-5 text-xl font-black">Unable to load purchases</h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading purchases."}
          </p>
        </div>
      </PageContainer>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Page                                                                   */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <PageContainer className="space-y-5 pb-24">
        {/* Hero */}
        <PurchaseHero />

        {/* Search + Date */}
        <PurchaseSearch
          value={search}
          onChange={setSearch}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onFilterClick={() => setFilterOpen(true)}
        />

        {/* Quick Actions */}
        <PurchaseQuickActions
          onSupplierClick={() => setSupplierOpen(true)}
          onFilterClick={() => setFilterOpen(true)}
          supplierActive={Boolean(supplierId)}
          filtersActive={
            Boolean(paymentStatus) || Boolean(fromDate) || Boolean(toDate)
          }
        />

        {/* Summary */}
        <PurchaseSummary
          today={summary.today}
          pending={summary.pending}
          suppliers={summary.suppliers}
          items={summary.items}
        />

        {/* Active Filters */}
        {(paymentStatus || fromDate || toDate || supplierId) && (
          <div className="flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 dark:border-violet-800 dark:bg-violet-500/10">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">
                Filters applied
              </p>

              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {[
                  paymentStatus,
                  fromDate && `From ${fromDate}`,
                  toDate && `To ${toDate}`,
                  supplierId && "Supplier",
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="shrink-0 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-300"
            >
              Clear
            </button>
          </div>
        )}

        {/* Purchase List */}
        <PurchaseList
          loading={isLoading}
          purchases={purchases}
          onDelete={handleDelete}
        />
      </PageContainer>

      {/* New Purchase */}
      <FloatingActionButton href="/purchases/new" label="New Purchase" />

      {/* Filter Sheet */}
      <PurchaseFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onReset={() => {
          setPaymentStatus(undefined);
          setFromDate("");
          setToDate("");
        }}
      />

      {/* Supplier Sheet */}
      <PurchaseSupplierSheet
        open={supplierOpen}
        suppliers={purchaseSuppliers}
        selectedSupplierId={supplierId}
        onClose={() => setSupplierOpen(false)}
        onSelect={(supplier) => {
          setSupplierId(supplier._id);
          setSupplierOpen(false);
        }}
        onClear={() => {
          setSupplierId("");
          setSupplierOpen(false);
        }}
      />
    </>
  );
}
