"use client";

import { useSearchParams } from "next/navigation";

import SupplierDetailsPage from "@/features/suppliers/pages/SupplierDetailsPage";

export default function SupplierDetailsRoute() {
  const searchParams = useSearchParams();

  const supplierId = searchParams.get("id") ?? "";

  return <SupplierDetailsPage supplierId={supplierId} />;
}
