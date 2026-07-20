"use client";

import type { Category } from "../../types/category";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

import CategoryListCard from "./CategoryListCard";

interface CategoryListProps {
  categories: Category[];

  onDelete: (category: Category) => void;

  onAdd?: () => void;
}

export default function CategoryList({
  categories,
  onDelete,
  onAdd,
}: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <EmptyState
        title="No Categories Found"
        description="Create your first category to organize your products."
        actionLabel={onAdd ? "Add Category" : undefined}
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <CategoryListCard
          key={category.id}
          category={category}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
