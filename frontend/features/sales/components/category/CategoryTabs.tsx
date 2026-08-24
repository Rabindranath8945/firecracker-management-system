"use client";

import { LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CategoryTab {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: CategoryTab[];

  value?: string;

  loading?: boolean;

  onChange: (categoryId: string) => void;
}

export default function CategoryTabs({
  categories,
  value,
  loading,
  onChange,
}: CategoryTabsProps) {
  if (loading) {
    return (
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-violet-600" />

          <h2 className="font-semibold">Categories</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-11 w-28 shrink-0 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {/* Heading */}

      <div className="flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-violet-600" />

        <h2 className="font-semibold">Categories</h2>
      </div>

      {/* Tabs */}

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => onChange("")}
          className={cn(
            "shrink-0 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all",
            value === ""
              ? "border-violet-600 bg-violet-600 text-white shadow-md"
              : "bg-card hover:bg-muted",
          )}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={cn(
              "shrink-0 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all",
              value === category.id
                ? "border-violet-600 bg-violet-600 text-white shadow-md"
                : "bg-card hover:bg-muted",
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
