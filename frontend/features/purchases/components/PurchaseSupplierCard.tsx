"use client";

import { Building2, ChevronRight, Phone, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Supplier {
  id: string;
  name: string;
  mobile: string;
  due: number;
}

interface Props {
  supplier: Supplier | null;

  onSelect: () => void;

  onAdd: () => void;
}

export default function PurchaseSupplierCard({
  supplier,
  onSelect,
  onAdd,
}: Props) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      {/* Header */}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Supplier</h2>

          <p className="text-sm text-muted-foreground">
            Select supplier for this purchase
          </p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="mr-1 size-4" />
            Add
          </Button>

          <Button size="sm" variant="outline" onClick={onSelect}>
            {supplier ? "Change" : "Select"}
          </Button>
        </div>
      </div>

      {!supplier ? (
        <div className="space-y-3">
          {/* Select Supplier */}

          <button
            type="button"
            onClick={onSelect}
            className="flex w-full items-center justify-between rounded-2xl border border-dashed p-5 transition hover:border-primary hover:bg-primary/5"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/10 p-3">
                <Building2 className="size-6 text-primary" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold">Select Supplier</h3>

                <p className="text-sm text-muted-foreground">
                  Search existing supplier
                </p>
              </div>
            </div>

            <ChevronRight className="size-5" />
          </button>

          {/* Add Supplier */}

          <button
            type="button"
            onClick={onAdd}
            className="flex w-full items-center justify-between rounded-2xl border border-dashed p-5 transition hover:border-green-500 hover:bg-green-50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-green-100 p-3">
                <Plus className="size-6 text-green-600" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold">Add New Supplier</h3>

                <p className="text-sm text-muted-foreground">
                  Create supplier without leaving this page
                </p>
              </div>
            </div>

            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-muted/40 p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{supplier.name}</h3>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />

                {supplier.mobile}
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Due Amount</p>

              <p
                className={`text-lg font-bold ${
                  supplier.due > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                ₹{supplier.due.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
