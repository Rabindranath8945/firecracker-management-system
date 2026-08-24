"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";

import type { Supplier, SupplierBalance } from "../types/supplier.type";

import { getSupplier, getSupplierBalance } from "../services/supplier.service";

import { Button } from "@/components/ui/button";

import SupplierDetailsHero from "../components/cards/SupplierDetailsHero";
import SupplierFinancialOverview from "../components/details/SupplierFinancialOverview";
import SupplierQuickActions from "../components/details/SupplierQuickActions";
import SupplierTimeline from "../components/details/SupplierTimeline";
import SupplierTransactions from "../components/details/SupplierTransactions";
import SupplierContactCard from "../components/details/SupplierContactCard";

interface SupplierDetailsPageProps {
  supplierId: string;
}

export default function SupplierDetailsPage({
  supplierId,
}: SupplierDetailsPageProps) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  const [balance, setBalance] = useState<SupplierBalance | null>(null);

  const [loadingSupplier, setLoadingSupplier] = useState(true);

  const [loadingBalance, setLoadingBalance] = useState(true);

  const [supplierError, setSupplierError] = useState<string | null>(null);

  const [balanceError, setBalanceError] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* Load Supplier                                                              */
  /* -------------------------------------------------------------------------- */

  const loadSupplier = useCallback(async () => {
    if (!supplierId) {
      setSupplierError("Supplier ID is missing.");
      setLoadingSupplier(false);
      return;
    }

    try {
      setLoadingSupplier(true);
      setSupplierError(null);

      const data = await getSupplier(supplierId);

      setSupplier(data);
    } catch (error) {
      console.error("Failed to load supplier:", error);

      setSupplier(null);
      setSupplierError("Unable to load supplier information.");
    } finally {
      setLoadingSupplier(false);
    }
  }, [supplierId]);

  /* -------------------------------------------------------------------------- */
  /* Load Balance                                                               */
  /* -------------------------------------------------------------------------- */

  const loadBalance = useCallback(async () => {
    if (!supplierId) {
      return;
    }

    try {
      setLoadingBalance(true);
      setBalanceError(null);

      const data = await getSupplierBalance(supplierId);

      setBalance(data);
    } catch (error) {
      console.error("Failed to load supplier balance:", error);

      setBalance(null);
      setBalanceError("Unable to load financial information.");
    } finally {
      setLoadingBalance(false);
    }
  }, [supplierId]);

  /* -------------------------------------------------------------------------- */
  /* Initial Load                                                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    void loadSupplier();
    void loadBalance();
  }, [loadSupplier, loadBalance]);

  /* -------------------------------------------------------------------------- */
  /* Loading Supplier                                                           */
  /* -------------------------------------------------------------------------- */

  if (loadingSupplier) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-background">
        <div
          className="
            flex
            min-h-[70vh]
            items-center
            justify-center
            px-4
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-indigo-50
                text-indigo-600
                dark:bg-indigo-500/10
              "
            >
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-600 dark:text-muted-foreground">
              Loading supplier...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Supplier Error                                                             */
  /* -------------------------------------------------------------------------- */

  if (supplierError || !supplier) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-background">
        <div
          className="
            flex
            min-h-[70vh]
            items-center
            justify-center
            px-4
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-[28px]
              border
              border-red-200
              bg-white
              p-6
              text-center
              shadow-sm
              dark:border-red-500/20
              dark:bg-card
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-red-50
                text-red-500
                dark:bg-red-500/10
              "
            >
              !
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-foreground">
              Supplier Not Found
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">
              {supplierError ?? "Unable to load this supplier."}
            </p>

            <Link href="/suppliers">
              <Button className="mt-5 rounded-2xl">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Suppliers
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Main                                                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background">
      <div
        className="
          mx-auto
          max-w-7xl
          space-y-6
          px-4
          py-6
          lg:px-0
        "
      >
        {/* ------------------------------------------------------------------ */}
        {/* Top Bar                                                            */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-center justify-between gap-3">
          <Link href="/suppliers">
            <Button
              type="button"
              variant="outline"
              className="
                rounded-2xl
                border-slate-200
                bg-white
                shadow-sm
                dark:border-border
                dark:bg-card
              "
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Suppliers
            </Button>
          </Link>

          {/* Refresh */}

          <Button
            type="button"
            variant="outline"
            disabled={loadingBalance}
            onClick={() => void loadBalance()}
            className="
              rounded-2xl
              border-slate-200
              bg-white
              shadow-sm
              dark:border-border
              dark:bg-card
            "
          >
            {loadingBalance ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}

            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Supplier Hero                                                      */}
        {/* ------------------------------------------------------------------ */}

        <SupplierDetailsHero supplier={supplier} />

        {/* ------------------------------------------------------------------ */}
        {/* Balance Error                                                      */}
        {/* ------------------------------------------------------------------ */}

        {balanceError && (
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
              dark:border-red-500/20
              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            <span>{balanceError}</span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void loadBalance()}
              className="text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              Retry
            </Button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Financial Overview                                                 */}
        {/* ------------------------------------------------------------------ */}

        {loadingBalance && !balance ? (
          <div
            className="
              flex
              min-h-[160px]
              items-center
              justify-center
              rounded-[24px]
              border
              border-slate-200
              bg-white
              shadow-sm
              dark:border-border
              dark:bg-card
            "
          >
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              Loading financial information...
            </div>
          </div>
        ) : (
          <SupplierFinancialOverview
            outstanding={
              balance?.currentDue ??
              supplier.currentDue ??
              supplier.openingBalance ??
              0
            }
            totalPurchases={
              balance?.totalPurchases ?? supplier.totalPurchases ?? 0
            }
            totalPayments={balance?.totalPaid ?? supplier.totalPaid ?? 0}
            advancePaid={0}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Quick Actions                                                      */}
        {/* ------------------------------------------------------------------ */}

        <SupplierQuickActions
          mobile={supplier.mobile}
          supplierId={supplier._id}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Main Content                                                        */}
        {/* ------------------------------------------------------------------ */}

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Contact */}

          <div className="space-y-6">
            <SupplierContactCard supplier={supplier} />
          </div>

          {/* Activity */}

          <div className="space-y-6 xl:col-span-2">
            <SupplierTimeline timeline={[]} />

            <SupplierTransactions supplierId={supplier._id} transactions={[]} />
          </div>
        </div>
      </div>
    </main>
  );
}
