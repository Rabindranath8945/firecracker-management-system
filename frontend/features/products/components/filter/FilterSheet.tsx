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

const stockOptions = ["All", "In Stock", "Low Stock", "Out of Stock"];

const sortOptions = ["A-Z", "Z-A", "Price ↑", "Price ↓", "Stock ↑", "Stock ↓"];

export default function FilterSheet({
  open,
  onOpenChange,
  stockFilter,
  onStockFilterChange,
  sortBy,
  onSortChange,
}: FilterSheetProps) {
  const handleReset = () => {
    onStockFilterChange("All");
    onSortChange("A-Z");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>

        <div className="h-[calc(85vh-150px)] overflow-y-auto space-y-8 px-5 py-5">
          {/* Stock Status */}

          <section>
            <h3 className="mb-3 text-sm font-semibold">Stock Status</h3>

            <div className="grid grid-cols-2 gap-3">
              {stockOptions.map((item) => (
                <Button
                  key={item}
                  variant={stockFilter === item ? "default" : "outline"}
                  className="h-12 rounded-2xl"
                  onClick={() => onStockFilterChange(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </section>

          {/* Sort */}

          <section>
            <h3 className="mb-3 text-sm font-semibold">Sort By</h3>

            <div className="grid grid-cols-2 gap-3">
              {sortOptions.map((item) => (
                <Button
                  key={item}
                  variant={sortBy === item ? "default" : "outline"}
                  className="h-12 rounded-2xl"
                  onClick={() => onSortChange(item)}
                >
                  {item}
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

            <Button
              className="h-12 flex-1 rounded-2xl"
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
