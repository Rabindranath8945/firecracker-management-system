"use client";

import { Check, Phone, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/* -------------------------------------------------------------------------- */
/* Purchase Supplier                                                          */
/* -------------------------------------------------------------------------- */

export interface PurchaseSupplier {
  _id: string;
  name: string;
  mobile: string;
  supplierCode: string;
  currentDue: number;
}
/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface PurchaseSupplierSheetProps {
  open: boolean;

  suppliers: PurchaseSupplier[];

  selectedSupplierId: string;

  onClose: () => void;

  onSelect: (supplier: PurchaseSupplier) => void;

  onClear: () => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function PurchaseSupplierSheet({
  open,
  suppliers,
  selectedSupplierId,
  onClose,
  onSelect,
  onClear,
}: PurchaseSupplierSheetProps) {
  const [search, setSearch] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Filter Suppliers                                                         */
  /* ------------------------------------------------------------------------ */

  const filteredSuppliers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return suppliers;
    }

    return suppliers.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(keyword) ||
        supplier.mobile.toLowerCase().includes(keyword) ||
        supplier.supplierCode.toLowerCase().includes(keyword)
      );
    });
  }, [suppliers, search]);

  /* ------------------------------------------------------------------------ */
  /* Close Sheet                                                              */
  /* ------------------------------------------------------------------------ */

  function handleOpenChange(value: boolean) {
    if (!value) {
      onClose();
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Clear Supplier                                                           */
  /* ------------------------------------------------------------------------ */

  function handleClear() {
    onClear();
    setSearch("");
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] rounded-t-[32px] px-5 pb-6"
      >
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <SheetHeader className="pb-4">
          <SheetTitle>Select Supplier</SheetTitle>
        </SheetHeader>

        {/* ---------------------------------------------------------------- */}
        {/* Search                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search supplier..."
            className="h-12 rounded-2xl pl-10"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Clear Supplier                                                   */}
        {/* ---------------------------------------------------------------- */}

        {selectedSupplierId && (
          <Button
            type="button"
            variant="outline"
            className="mb-4 h-11 w-full rounded-2xl"
            onClick={handleClear}
          >
            <Trash2 className="mr-2 size-4" />
            Clear Supplier
          </Button>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Supplier List                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="max-h-[55vh] space-y-2 overflow-y-auto">
          {filteredSuppliers.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-medium">No suppliers found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try another search.
              </p>
            </div>
          ) : (
            filteredSuppliers.map((supplier) => {
              const selected = supplier._id === selectedSupplierId;

              const currentDue = Number(supplier.currentDue ?? 0);

              return (
                <button
                  key={supplier._id}
                  type="button"
                  onClick={() => onSelect(supplier)}
                  className={`
                    w-full
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "bg-card hover:border-primary/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* ---------------------------------------------------- */}
                    {/* Avatar                                               */}
                    {/* ---------------------------------------------------- */}

                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                      {supplier.name.charAt(0).toUpperCase()}
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Supplier Details                                     */}
                    {/* ---------------------------------------------------- */}

                    <div className="min-w-0 flex-1">
                      {/* Name */}

                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate font-semibold">
                          {supplier.name}
                        </h3>

                        {selected && (
                          <Check className="size-5 shrink-0 text-primary" />
                        )}
                      </div>

                      {/* Mobile */}

                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" />

                        <span>{supplier.mobile}</span>
                      </div>

                      {/* Code + Due */}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          {supplier.supplierCode}
                        </span>

                        <span
                          className={
                            currentDue > 0
                              ? "text-xs font-semibold text-red-600"
                              : "text-xs font-semibold text-green-600"
                          }
                        >
                          Due ₹
                          {currentDue.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
