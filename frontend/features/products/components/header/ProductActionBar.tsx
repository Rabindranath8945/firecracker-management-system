"use client";

import { Filter, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductActionBarProps {
  onFilterClick?: () => void;
  onCategoryClick?: () => void;
}

export default function ProductActionBar({
  onFilterClick,
  onCategoryClick,
}: ProductActionBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-12 rounded-2xl flex-1"
        onClick={onFilterClick}
      >
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-12 rounded-2xl flex-1"
        onClick={onCategoryClick}
      >
        <LayoutGrid className="mr-2 h-4 w-4" />
        Category
      </Button>
    </div>
  );
}
