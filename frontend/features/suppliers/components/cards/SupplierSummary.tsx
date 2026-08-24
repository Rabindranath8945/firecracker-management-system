"use client";

import {
  Building2,
  CircleDollarSign,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import type { Supplier } from "../../types/supplier.type";

import StatCard from "@/features/shared/ui/cards/StatCard";

interface SupplierSummaryProps {
  suppliers: Supplier[];
}

export default function SupplierSummary({ suppliers }: SupplierSummaryProps) {
  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.isActive,
  ).length;

  const inactiveSuppliers = totalSuppliers - activeSuppliers;

  const payable = suppliers.reduce(
    (total, supplier) => total + (supplier.openingBalance ?? 0),
    0,
  );

  return (
    <section className="grid grid-cols-2 gap-4">
      <StatCard
        title="Suppliers"
        value={totalSuppliers}
        subtitle="Total Suppliers"
        icon={<Building2 className="h-6 w-6" />}
        iconClassName="bg-indigo-100 text-indigo-700"
      />

      <StatCard
        title="Active"
        value={activeSuppliers}
        subtitle="Currently Active"
        icon={<ShieldCheck className="h-6 w-6" />}
        iconClassName="bg-emerald-100 text-emerald-700"
      />

      <StatCard
        title="Inactive"
        value={inactiveSuppliers}
        subtitle="Currently Inactive"
        icon={<ShieldX className="h-6 w-6" />}
        iconClassName="bg-rose-100 text-rose-700"
      />

      <StatCard
        title="Payable"
        value={`₹${payable.toLocaleString("en-IN")}`}
        subtitle="Outstanding Balance"
        icon={<CircleDollarSign className="h-6 w-6" />}
        iconClassName="bg-amber-100 text-amber-700"
      />
    </section>
  );
}
