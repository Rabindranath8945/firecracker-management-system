"use client";

import { Truck, UserCheck, UserX, Wallet } from "lucide-react";

import type { Supplier } from "../../types/supplier.type";

import StatCard from "@/features/shared/ui/cards/StatCard";

interface Props {
  suppliers: Supplier[];
}

export default function SupplierStats({ suppliers }: Props) {
  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter((s) => s.isActive).length;

  const inactiveSuppliers = totalSuppliers - activeSuppliers;

  const payable = suppliers.reduce(
    (sum, supplier) => sum + supplier.balance,
    0,
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="Suppliers"
        value={totalSuppliers}
        subtitle="Total"
        icon={<Truck className="h-5 w-5" />}
      />

      <StatCard
        title="Active"
        value={activeSuppliers}
        subtitle="Available"
        icon={<UserCheck className="h-5 w-5" />}
      />

      <StatCard
        title="Inactive"
        value={inactiveSuppliers}
        subtitle="Disabled"
        icon={<UserX className="h-5 w-5" />}
      />

      <StatCard
        title="Payable"
        value={`₹${payable.toLocaleString("en-IN")}`}
        subtitle="Outstanding"
        icon={<Wallet className="h-5 w-5" />}
      />
    </div>
  );
}
