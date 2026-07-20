"use client";

import { FolderTree, Package, CheckCircle2, XCircle } from "lucide-react";

import type { Category } from "../../types/category";

import StatCard from "@/features/shared/ui/cards/StatCard";

interface Props {
  categories: Category[];
}

export default function CategoryStats({ categories }: Props) {
  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive,
  ).length;

  const inactiveCategories = totalCategories - activeCategories;

  const totalProducts = categories.reduce(
    (sum, category) => sum + category.productCount,
    0,
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="Categories"
        value={totalCategories}
        subtitle="Total"
        icon={<FolderTree className="h-5 w-5" />}
      />

      <StatCard
        title="Products"
        value={totalProducts}
        subtitle="Available"
        icon={<Package className="h-5 w-5" />}
      />

      <StatCard
        title="Active"
        value={activeCategories}
        subtitle="Enabled"
        icon={<CheckCircle2 className="h-5 w-5" />}
      />

      <StatCard
        title="Inactive"
        value={inactiveCategories}
        subtitle="Disabled"
        icon={<XCircle className="h-5 w-5" />}
      />
    </div>
  );
}
