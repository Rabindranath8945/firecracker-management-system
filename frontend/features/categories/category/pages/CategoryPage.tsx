"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Category } from "../types/category";
import { categories } from "../services/category.service";

import CategoryStats from "../components/cards/CategoryStats";
import CategoryList from "../components/cards/CategoryList";
import CategoryListFilter from "../components/cards/CategoryListFilter";

import PageToolbar from "@/features/shared/ui/layout/PageToolbar";

import SearchInput from "@/features/shared/ui/forms/SearchInput";
import FilterSelect from "@/features/shared/ui/forms/FilterSelect";

import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";
import EmptyState from "@/features/shared/ui/cards/EmptyState";

import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [sort, setSort] = useState("NAME_ASC");

  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(keyword) ||
        category.categoryNo.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "ALL"
          ? true
          : status === "ACTIVE"
            ? category.isActive
            : !category.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  async function handleDelete() {
    if (!selectedCategory) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Delete:", selectedCategory);

    setLoading(false);

    setDeleteOpen(false);

    setSelectedCategory(null);
  }

  return (
    <>
      <CategoryStats categories={filteredCategories} />

      <PageToolbar
        left={
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search categories..."
            />

            <FilterSelect
              value={status}
              onChange={setStatus}
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
          </>
        }
      />

      {filteredCategories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="Create your first category to organize your products."
          actionLabel="Add Category"
          onAction={() => router.push("/categories/new")}
        />
      ) : (
        <>
          <CategoryListFilter
            total={filteredCategories.length}
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
          />

          <CategoryList
            categories={filteredCategories}
            onAdd={() => router.push("/categories/new")}
            onDelete={(category) => {
              setSelectedCategory(category);
              setDeleteOpen(true);
            }}
          />
        </>
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityType="Category"
        entityName={selectedCategory?.name ?? ""}
        loading={loading}
        onConfirm={handleDelete}
      />

      <ProgressDialog
        open={loading}
        title="Deleting Category"
        description="Please wait while we delete the category."
      />
    </>
  );
}
