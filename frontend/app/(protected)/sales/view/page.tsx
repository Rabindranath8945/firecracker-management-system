"use client";

import { useSearchParams } from "next/navigation";

import SalesDetailsPage from "@/features/sales/pages/SaleDetailsPage";

export default function Page() {
  const searchParams = useSearchParams();

  const saleId = searchParams.get("id") ?? "";

  return <SalesDetailsPage saleId={saleId} />;
}
