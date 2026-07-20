"use client";

import { ListFilter } from "lucide-react";

import FilterSelect from "@/features/shared/ui/forms/FilterSelect";

interface CategoryListFilterProps {
  total: number;

  status: string;
  onStatusChange: (value: string) => void;

  sort: string;
  onSortChange: (value: string) => void;
}

export default function CategoryListFilter({
  total,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: CategoryListFilterProps) {
  return (
    <section className="mb-5">
      {/* Header */}

      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Categories</h2>

          <p className="mt-1 text-sm text-slate-500">
            Organize your product categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            {total}
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md">
            <ListFilter className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="px-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </label>

          <FilterSelect
            value={status}
            onChange={onStatusChange}
            options={[
              {
                label: "All Categories",
                value: "ALL",
              },
              {
                label: "Active",
                value: "ACTIVE",
              },
              {
                label: "Inactive",
                value: "INACTIVE",
              },
            ]}
          />
        </div>

        <div className="space-y-1">
          <label className="px-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Sort
          </label>

          <FilterSelect
            value={sort}
            onChange={onSortChange}
            options={[
              {
                label: "A → Z",
                value: "NAME_ASC",
              },
              {
                label: "Z → A",
                value: "NAME_DESC",
              },
              {
                label: "Most Products",
                value: "PRODUCTS_DESC",
              },
              {
                label: "Least Products",
                value: "PRODUCTS_ASC",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
