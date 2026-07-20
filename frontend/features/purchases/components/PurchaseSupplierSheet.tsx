"use client";

import { useMemo, useState } from "react";
import { Building2, Phone, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Supplier {
  id: string;
  name: string;
  mobile: string;
  due: number;
}

interface Props {
  open: boolean;
  suppliers: Supplier[];
  onClose: () => void;
  onSelect: (supplier: Supplier) => void;
}

export default function PurchaseSupplierSheet({
  open,
  suppliers,
  onClose,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers;

    const keyword = search.toLowerCase();

    return suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(keyword) ||
        supplier.mobile.includes(keyword),
    );
  }, [search, suppliers]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-50
          h-[80vh]
          rounded-t-[32px]
          bg-background
          shadow-2xl
        "
      >
        <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-muted" />

        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold">Select Supplier</h2>

            <p className="text-sm text-muted-foreground">
              Search supplier by name or mobile
            </p>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              placeholder="Search supplier..."
              className="h-12 rounded-2xl pl-12"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3 overflow-y-auto px-6 pb-8">
          {filteredSuppliers.map((supplier) => (
            <button
              key={supplier.id}
              type="button"
              onClick={() => {
                onSelect(supplier);
                onClose();
              }}
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                border
                bg-card
                p-4
                text-left
                transition-all
                hover:border-primary
              "
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-3">
                  <Building2 className="size-6 text-primary" />
                </div>

                <div>
                  <h3 className="font-semibold">{supplier.name}</h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="size-4" />
                    {supplier.mobile}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Due</p>

                <p
                  className={`font-bold ${
                    supplier.due > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ₹{supplier.due.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
