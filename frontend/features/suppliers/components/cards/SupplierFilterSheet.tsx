"use client";

import { Check, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface SupplierFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  status: string;
  sort: string;

  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function SupplierFilterSheet({
  open,
  onOpenChange,
  status,
  sort,
  onStatusChange,
  onSortChange,
}: SupplierFilterSheetProps) {
  const statusItems = [
    {
      label: "All",
      value: "ALL",
    },
    {
      label: "Active",
      value: "ACTIVE",
    },
    {
      label: "Inactive",
      value: "INACTIVE",
    },
  ];

  const sortItems = [
    {
      label: "Name (A–Z)",
      value: "NAME_ASC",
    },
    {
      label: "Name (Z–A)",
      value: "NAME_DESC",
    },
    {
      label: "Newest",
      value: "NEWEST",
    },
    {
      label: "Oldest",
      value: "OLDEST",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[32px] px-5 pb-8">
        <SheetHeader>
          <SheetTitle>Filter Suppliers</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Status */}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Status
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {statusItems.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant="outline"
                  onClick={() => onStatusChange(item.value)}
                  className={
                    status === item.value
                      ? "rounded-2xl border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                      : "rounded-2xl border-slate-200"
                  }
                >
                  {status === item.value && <Check className="mr-2 h-4 w-4" />}

                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort */}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Sort By
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {sortItems.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant="outline"
                  onClick={() => onSortChange(item.value)}
                  className={
                    sort === item.value
                      ? "rounded-2xl border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                      : "rounded-2xl border-slate-200"
                  }
                >
                  {sort === item.value && <Check className="mr-2 h-4 w-4" />}

                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Footer */}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 flex-1 rounded-2xl"
              onClick={() => {
                onStatusChange("ALL");
                onSortChange("NAME_ASC");
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              type="button"
              className="h-12 flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-700"
              onClick={() => onOpenChange(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
