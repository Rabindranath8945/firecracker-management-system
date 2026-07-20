"use client";

import { FolderOpen, Package, CheckCircle2, XCircle } from "lucide-react";

import type { SubCategory } from "../../types/sub-category";

import StatCard from "@/features/shared/ui/cards/StatCard";

interface Props {
  subCategories: SubCategory[];
}

export default function SubCategoryStats({ subCategories }: Props) {
  const totalSubCategories = subCategories.length;

  const activeSubCategories = subCategories.filter(
    (subCategory) => subCategory.isActive,
  ).length;

  const inactiveSubCategories = totalSubCategories - activeSubCategories;

  const totalProducts = subCategories.reduce(
    (sum, subCategory) => sum + subCategory.productCount,
    0,
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="Sub Categories"
        value={totalSubCategories}
        subtitle="Total"
        icon={<FolderOpen className="h-5 w-5" />}
      />

      <StatCard
        title="Products"
        value={totalProducts}
        subtitle="Available"
        icon={<Package className="h-5 w-5" />}
      />

      <StatCard
        title="Active"
        value={activeSubCategories}
        subtitle="Enabled"
        icon={<CheckCircle2 className="h-5 w-5" />}
      />

      <StatCard
        title="Inactive"
        value={inactiveSubCategories}
        subtitle="Disabled"
        icon={<XCircle className="h-5 w-5" />}
      />
    </div>
  );
}
