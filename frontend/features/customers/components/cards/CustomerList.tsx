"use client";

import type { Customer } from "../../types/customer";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

import CustomerListCard from "./CustomerListCard";

interface CustomerListProps {
  customers: Customer[];

  onDelete: (customer: Customer) => void;

  onAdd?: () => void;
}

export default function CustomerList({
  customers,
  onDelete,
  onAdd,
}: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <EmptyState
        title="No Customers Found"
        description="Create your first customer to start billing and managing payments."
        actionLabel={onAdd ? "Add Customer" : undefined}
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="space-y-6">
      {customers.map((customer) => (
        <CustomerListCard
          key={customer.id}
          customer={customer}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
