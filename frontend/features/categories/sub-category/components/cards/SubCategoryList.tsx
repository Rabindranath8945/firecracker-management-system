"use client";

import type { SubCategory } from "../../types/sub-category";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

import SubCategoryListCard from "./SubCategoryListCard";

interface SubCategoryListProps {
  subCategories: SubCategory[];

  onDelete: (subCategory: SubCategory) => void;

  onAdd?: () => void;
}

export default function SubCategoryList({
  subCategories,
  onDelete,
  onAdd,
}: SubCategoryListProps) {
  if (subCategories.length === 0) {
    return (
      <EmptyState
        title="No Sub Categories Found"
        description="Create your first sub category to organize your products."
        actionLabel={onAdd ? "Add Sub Category" : undefined}
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="space-y-6">
      {subCategories.map((subCategory) => (
        <SubCategoryListCard
          key={subCategory.id}
          subCategory={subCategory}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
