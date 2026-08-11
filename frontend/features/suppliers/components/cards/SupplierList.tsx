"use client";

import type { Supplier } from "../../types/supplier";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

import SupplierListCard from "./SupplierListCard";

interface SupplierListProps {
  suppliers: Supplier[];

  onDelete: (supplier: Supplier) => void;

  onAdd?: () => void;
}

export default function SupplierList({
  suppliers,
  onDelete,
  onAdd,
}: SupplierListProps) {
  if (suppliers.length === 0) {
    return (
      <EmptyState
        title="No Suppliers Found"
        description="Create your first supplier to start managing purchases and payments."
        actionLabel={onAdd ? "Add Supplier" : undefined}
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="space-y-6">
      {suppliers.map((supplier) => (
        <SupplierListCard
          key={supplier._id}
          supplier={supplier}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
