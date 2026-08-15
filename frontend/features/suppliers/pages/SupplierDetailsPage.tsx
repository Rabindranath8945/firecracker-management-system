"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Supplier } from "../types/supplier.type";

import { Button } from "@/components/ui/button";

import SupplierHero from "../components/cards/SupplierDetailsHero";
import SupplierFinancialOverview from "../components/details/SupplierFinancialOverview";
import SupplierQuickActions from "../components/details/SupplierQuickActions";
import SupplierBusinessSummary from "../components/details/SupplierBusinessSummary";
import SupplierTimeline from "../components/details/SupplierTimeline";
import SupplierTransactions from "../components/details/SupplierTransactions";
import SupplierContactCard from "../components/details/SupplierContactCard";

interface SupplierDetailsPageProps {
  supplier: Supplier;
}

export default function SupplierDetailsPage({
  supplier,
}: SupplierDetailsPageProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-0">
      {/* Top Bar */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/suppliers">
          <Button variant="outline" className="rounded-2xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Button>
        </Link>
      </div>

      {/* Hero */}

      <SupplierHero supplier={supplier} />

      {/* Financial Overview */}

      <SupplierFinancialOverview
        outstanding={supplier.openingBalance}
        totalPurchases={0}
        totalPayments={0}
        advancePaid={0}
      />

      {/* Quick Actions */}

      <SupplierQuickActions
        mobile={supplier.mobile}
        supplierId={supplier._id}
      />

      {/* Main Content */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Sidebar */}

        <div className="space-y-6">
          <SupplierContactCard supplier={supplier} />
        </div>

        {/* Right Content */}

        <div className="space-y-6 xl:col-span-2">
          <SupplierTimeline timeline={[]} />

          <SupplierTransactions supplierId={supplier._id} transactions={[]} />
        </div>
      </div>
    </div>
  );
}
