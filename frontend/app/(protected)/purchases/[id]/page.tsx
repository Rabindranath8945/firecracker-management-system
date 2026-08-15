"use client";

import { use } from "react";

import PageHeader from "@/components/common/shared/header/PageHeader";

import PurchaseDetails from "@/features/purchases/page/DetailsPurchasePage";

interface PurchaseDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PurchaseDetailsPage({
  params,
}: PurchaseDetailsPageProps) {
  const { id } = use(params);

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
