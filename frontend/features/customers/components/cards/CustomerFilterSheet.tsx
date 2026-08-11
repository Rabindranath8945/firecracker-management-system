"use client";

import { Check, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  status: string;
  sort: string;

  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function CustomerFilterSheet({
  open,
  onOpenChange,
  status,
  sort,
  onStatusChange,
  onSortChange,
}: Props) {
  const statusItems = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  const sortItems = [
    { label: "Name (A–Z)", value: "NAME_ASC" },
    { label: "Name (Z–A)", value: "NAME_DESC" },
    { label: "Newest", value: "NEWEST" },
    { label: "Oldest", value: "OLDEST" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[32px] px-5 pb-8">
        {/* Drag Handle */}

        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-200" />

        <SheetHeader className="pb-2">
          <SheetTitle className="text-center text-xl font-bold">
            Filter Customers
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">
              Customer Status
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {statusItems.map((item) => {
                const active = status === item.value;

                return (
                  <Button
                    key={item.value}
                    type="button"
                    variant="outline"
                    onClick={() => onStatusChange(item.value)}
                    className={
                      active
                        ? "rounded-2xl border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                        : "rounded-2xl border-slate-200 bg-white"
                    }
                  >
                    {active && <Check className="mr-2 h-4 w-4" />}

                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Sort */}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">
              Sort Customers
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {sortItems.map((item) => {
                const active = sort === item.value;

                return (
                  <Button
                    key={item.value}
                    type="button"
                    variant="outline"
                    onClick={() => onSortChange(item.value)}
                    className={
                      active
                        ? "rounded-2xl border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                        : "rounded-2xl border-slate-200 bg-white"
                    }
                  >
                    {active && <Check className="mr-2 h-4 w-4" />}

                    {item.label}
                  </Button>
                );
              })}
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
              className="
                h-12
                flex-1
                rounded-2xl
                bg-emerald-600
                shadow-lg
                hover:bg-emerald-700
              "
              onClick={() => onOpenChange(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
