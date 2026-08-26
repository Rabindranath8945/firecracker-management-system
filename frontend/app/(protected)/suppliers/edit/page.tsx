"use client";

import { useSearchParams } from "next/navigation";

import SupplierEditClient from "./SupplierEditClient";

export default function SupplierEditRoute() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") ?? "";

  return <SupplierEditClient id={id} />;
}
