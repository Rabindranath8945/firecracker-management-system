"use client";

import { useSearchParams } from "next/navigation";

import PageHeader from "@/components/common/shared/header/PageHeader";

import PurchaseDetails from "@/features/purchases/page/DetailsPurchasePage";

export default function PurchaseDetailsPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") ?? "";

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-24 pt-4 dark:bg-background">
      <PageHeader
        title="Purchase Details"
        description="View purchase information"
        backHref="/purchases"
      />

      <div className="mt-5">
        <PurchaseDetails purchaseId={id} />
      </div>
    </div>
  );
}
