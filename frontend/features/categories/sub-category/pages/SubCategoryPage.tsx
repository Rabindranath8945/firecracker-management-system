"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { SubCategory } from "../types/sub-category";
import { subCategories } from "../services/sub-category.service";

import SubCategoryStats from "../components/cards/SubCategoryStats";
import SubCategoryList from "../components/cards/SubCategoryList";
import SubCategoryListFilter from "../components/cards/SubCategoryListFilter";

import PageToolbar from "@/features/shared/ui/layout/PageToolbar";

import SearchInput from "@/features/shared/ui/forms/SearchInput";
import FilterSelect from "@/features/shared/ui/forms/FilterSelect";

import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

export default function SubCategoryPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [sort, setSort] = useState("NAME_ASC");

  const [loading, setLoading] = useState(false);

  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredSubCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return subCategories.filter((subCategory) => {
      const matchesSearch =
        subCategory.name.toLowerCase().includes(keyword) ||
        subCategory.subCategoryNo.toLowerCase().includes(keyword) ||
        subCategory.categoryName.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "ALL"
          ? true
          : status === "ACTIVE"
            ? subCategory.isActive
            : !subCategory.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  async function handleDelete() {
    if (!selectedSubCategory) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Delete:", selectedSubCategory);

    setLoading(false);

    setDeleteOpen(false);

    setSelectedSubCategory(null);
  }

  return (
    <>
      <SubCategoryStats subCategories={filteredSubCategories} />

      <PageToolbar
        left={
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search sub categories..."
            />

            <FilterSelect
              value={status}
              onChange={setStatus}
              options={[
                {
                  label: "All Sub Categories",
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

      {filteredSubCategories.length === 0 ? (
        <EmptyState
          title="No Sub Categories Found"
          description="Create your first sub category to organize your products."
          actionLabel="Add Sub Category"
          onAction={() => router.push("/categories/sub-category/new")}
        />
      ) : (
        <>
          <SubCategoryListFilter
            total={filteredSubCategories.length}
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
          />

          <SubCategoryList
            subCategories={filteredSubCategories}
            onAdd={() => router.push("/categories/sub-category/new")}
            onDelete={(subCategory) => {
              setSelectedSubCategory(subCategory);
              setDeleteOpen(true);
            }}
          />
        </>
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityType="Sub Category"
        entityName={selectedSubCategory?.name ?? ""}
        loading={loading}
        onConfirm={handleDelete}
      />

      <ProgressDialog
        open={loading}
        title="Deleting Sub Category"
        description="Please wait while we delete the sub category."
      />
    </>
  );
}
