"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  stockFilter: string;
  onStockFilterChange: (value: string) => void;

  sortBy: string;
  onSortChange: (value: string) => void;
}

const stockOptions = [
  { label: "All", value: "ALL" },
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

const sortOptions = [
  { label: "A-Z", value: "NAME_ASC" },
  { label: "Z-A", value: "NAME_DESC" },
  { label: "Price ↑", value: "PRICE_ASC" },
  { label: "Price ↓", value: "PRICE_DESC" },
  { label: "Stock ↑", value: "STOCK_ASC" },
  { label: "Stock ↓", value: "STOCK_DESC" },
];

export default function FilterSheet({
  open,
  onOpenChange,
  stockFilter,
  onStockFilterChange,
  sortBy,
  onSortChange,
}: FilterSheetProps) {
  const handleReset = () => {
    onStockFilterChange("ALL");
    onSortChange("NAME_ASC");
    onOpenChange(false);
  };

  const handleApply = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>

        <div className="h-[calc(85vh-150px)] overflow-y-auto space-y-8 px-5 py-5">
          <section>
            <h3 className="mb-3 text-sm font-semibold">Stock Status</h3>

            <div className="grid grid-cols-2 gap-3">
              {stockOptions.map((item) => (
                <Button
                  key={item.value}
                  variant={stockFilter === item.value ? "default" : "outline"}
                  className="h-12 rounded-2xl"
                  onClick={() => onStockFilterChange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold">Sort By</h3>

            <div className="grid grid-cols-2 gap-3">
              {sortOptions.map((item) => (
                <Button
                  key={item.value}
                  variant={sortBy === item.value ? "default" : "outline"}
                  className="h-12 rounded-2xl"
                  onClick={() => onSortChange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t bg-background p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-2xl"
              onClick={handleReset}
            >
              Reset
            </Button>

            <Button className="h-12 flex-1 rounded-2xl" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
