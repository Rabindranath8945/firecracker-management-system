"use client";

import { FolderTree } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SubCategoryTab {
  id: string;
  name: string;
}

interface SubCategoryTabsProps {
  subCategories: SubCategoryTab[];

  categoryId: string;

  value?: string;

  loading?: boolean;

  onChange: (id: string) => void;
}

export default function SubCategoryTabs({
  subCategories,
  categoryId,
  value,
  loading,
  onChange,
}: SubCategoryTabsProps) {
  // Hide until a category is selected
  if (!categoryId) {
    return null;
  }

  if (loading) {
    return (
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-indigo-600" />

          <h2 className="font-semibold">Sub Categories</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-11 w-24 shrink-0 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  if (subCategories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <FolderTree className="h-5 w-5 text-indigo-600" />

        <h2 className="font-semibold">Sub Categories</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => onChange("")}
          className={cn(
            "shrink-0 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all",
            value === ""
              ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
              : "bg-card hover:bg-muted",
          )}
        >
          All
        </button>

        {subCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "shrink-0 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all",
              value === item.id
                ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                : "bg-card hover:bg-muted",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
    </section>
  );
}
