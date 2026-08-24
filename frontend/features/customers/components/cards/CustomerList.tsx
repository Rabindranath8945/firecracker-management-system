"use client";

import type { Customer } from "../../types/customer";

import CustomerCard from "./CustomerCard";

interface CustomerListProps {
  customers: Customer[];
  onDelete: (customer: Customer) => void;
}

export default function CustomerList({
  customers,
  onDelete,
}: CustomerListProps) {
  if (customers.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}

      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Customers</h2>

          <p className="mt-1 text-sm text-slate-500">
            {customers.length} customer{customers.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Customer Cards */}

      <div className="space-y-3">
        {customers.map((customer) => (
          <CustomerCard
            key={customer._id}
            customer={customer}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
