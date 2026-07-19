"use client";

import { Users, UserCheck, UserX, Wallet } from "lucide-react";

import type { Customer } from "../../types/customer";

import StatCard from "@/features/shared/ui/cards/StatCard";

interface Props {
  customers: Customer[];
}

export default function CustomerStats({ customers }: Props) {
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter((c) => c.isActive).length;

  const inactiveCustomers = totalCustomers - activeCustomers;

  const receivable = customers.reduce(
    (sum, customer) => sum + customer.balance,
    0,
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="Customers"
        value={totalCustomers}
        subtitle="Total"
        icon={<Users className="h-5 w-5" />}
      />

      <StatCard
        title="Active"
        value={activeCustomers}
        subtitle="Available"
        icon={<UserCheck className="h-5 w-5" />}
      />

      <StatCard
        title="Inactive"
        value={inactiveCustomers}
        subtitle="Disabled"
        icon={<UserX className="h-5 w-5" />}
      />

      <StatCard
        title="Receivable"
        value={`₹${receivable.toLocaleString("en-IN")}`}
        subtitle="Outstanding"
        icon={<Wallet className="h-5 w-5" />}
      />
    </div>
  );
}
