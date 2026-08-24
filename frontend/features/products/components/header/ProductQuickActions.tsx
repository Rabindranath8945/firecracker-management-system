"use client";

import { ArrowUpDown, Funnel, Grid2X2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProductQuickActionsProps {
  onCategoryClick: () => void;
  onFilterClick: () => void;
  onSortClick?: () => void;
}

export default function ProductQuickActions({
  onCategoryClick,
  onFilterClick,
  onSortClick,
}: ProductQuickActionsProps) {
  return (
    <section className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
      <Button
        variant="outline"
        onClick={onCategoryClick}
        className="h-11 rounded-2xl border-slate-200 bg-white px-4 shadow-sm hover:bg-slate-50"
      >
        <Grid2X2 className="mr-2 h-4 w-4 text-sky-600" />
        Category
      </Button>

      <Button
        variant="outline"
        onClick={onFilterClick}
        className="h-11 rounded-2xl border-slate-200 bg-white px-4 shadow-sm hover:bg-slate-50"
      >
        <Funnel className="mr-2 h-4 w-4 text-amber-600" />
        Filter
      </Button>
    </section>
  );
}
