"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  Edit3,
  Folder,
  Package,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import type { SubCategory } from "../types/sub-category";
import SubCategoryService from "../services/sub-category.service";

import SearchInput from "@/features/shared/ui/forms/SearchInput";
import FilterSelect from "@/features/shared/ui/forms/FilterSelect";

import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

export default function SubCategoryPage() {
  const router = useRouter();

  /* ---------------------------------------------------------------------- */
  /* State                                                                  */
  /* ---------------------------------------------------------------------- */

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [sort, setSort] = useState("NAME_ASC");

  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Load                                                                  */
  /* ---------------------------------------------------------------------- */

  async function loadSubCategories() {
    try {
      setLoading(true);
      setError(null);

      const data = await SubCategoryService.getSubCategories();

      setSubCategories(data.items);
    } catch (error) {
      console.error("Failed to load sub categories:", error);

      setSubCategories([]);
      setError("Unable to load sub categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSubCategories();
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Statistics                                                             */
  /* ---------------------------------------------------------------------- */

  const stats = useMemo(() => {
    const total = subCategories.length;

    const active = subCategories.filter(
      (subCategory) => subCategory.isActive === true,
    ).length;

    const inactive = subCategories.filter(
      (subCategory) => subCategory.isActive !== true,
    ).length;

    const products = subCategories.reduce(
      (totalProducts, subCategory) =>
        totalProducts + Number(subCategory.productCount ?? 0),
      0,
    );

    return {
      total,
      active,
      inactive,
      products,
    };
  }, [subCategories]);

  /* ---------------------------------------------------------------------- */
  /* Search + Filter + Sort                                                 */
  /* ---------------------------------------------------------------------- */

  const filteredSubCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = subCategories.filter((subCategory) => {
      const name = String(subCategory.name ?? "").toLowerCase();

      const subCategoryCode = String(
        subCategory.subCategoryCode ?? "",
      ).toLowerCase();

      let categoryName = "";

      if (
        typeof subCategory.category === "object" &&
        subCategory.category !== null
      ) {
        categoryName = String(subCategory.category.name ?? "").toLowerCase();
      } else if (typeof subCategory.category === "string") {
        categoryName = subCategory.category.toLowerCase();
      }

      const matchesSearch =
        keyword.length === 0 ||
        name.includes(keyword) ||
        subCategoryCode.includes(keyword) ||
        categoryName.includes(keyword);

      const matchesStatus =
        status === "ALL"
          ? true
          : status === "ACTIVE"
            ? subCategory.isActive === true
            : subCategory.isActive !== true;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      const nameA = String(a.name ?? "").trim();
      const nameB = String(b.name ?? "").trim();

      if (sort === "NAME_DESC") {
        return nameB.localeCompare(nameA, "en", {
          sensitivity: "base",
        });
      }

      return nameA.localeCompare(nameB, "en", {
        sensitivity: "base",
      });
    });
  }, [subCategories, search, status, sort]);

  /* ---------------------------------------------------------------------- */
  /* Delete                                                                 */
  /* ---------------------------------------------------------------------- */

  function handleDelete(subCategory: SubCategory) {
    setSelectedSubCategory(subCategory);
    setDeleteOpen(true);
  }

  /* ---------------------------------------------------------------------- */
  /* Confirm Delete                                                         */
  /* ---------------------------------------------------------------------- */

  async function confirmDelete() {
    if (!selectedSubCategory?._id) {
      console.error("Sub category ID is missing:", selectedSubCategory);
      return;
    }

    try {
      setDeleteLoading(true);

      await SubCategoryService.delete(selectedSubCategory._id);

      setSubCategories((current) =>
        current.filter((item) => item._id !== selectedSubCategory._id),
      );

      setDeleteOpen(false);
      setSelectedSubCategory(null);
    } catch (error) {
      console.error("Failed to delete sub category:", error);
    } finally {
      setDeleteLoading(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
          Loading sub categories...
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-10 w-10 text-red-500" />

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load sub categories
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            type="button"
            onClick={() => void loadSubCategories()}
            className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Page                                                                   */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <main className="min-h-screen bg-slate-50 pb-28 dark:bg-background">
        <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:px-6 lg:px-0">
          {/* Statistics */}

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Sub Categories"
              value={stats.total}
              description="Total"
              icon={<Folder className="h-5 w-5" />}
              iconClass="bg-sky-50 text-sky-600"
            />

            <StatCard
              label="Products"
              value={stats.products}
              description="Assigned"
              icon={<Package className="h-5 w-5" />}
              iconClass="bg-violet-50 text-violet-600"
            />

            <StatCard
              label="Active"
              value={stats.active}
              description="Enabled"
              icon={<CheckCircle2 className="h-5 w-5" />}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              label="Inactive"
              value={stats.inactive}
              description="Disabled"
              icon={<XCircle className="h-5 w-5" />}
              iconClass="bg-slate-100 text-slate-500"
            />
          </section>

          {/* Search + Filters */}

          <section className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search sub categories..."
            />

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

              <FilterSelect
                value={sort}
                onChange={setSort}
                options={[
                  {
                    label: "A → Z",
                    value: "NAME_ASC",
                  },
                  {
                    label: "Z → A",
                    value: "NAME_DESC",
                  },
                ]}
              />
            </div>
          </section>

          {/* Section Header */}

          <section className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Sub Categories
                </h1>

                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-600">
                  {filteredSubCategories.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Organize your product sub categories
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/categories/sub-category/new")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600"
              aria-label="Add sub category"
            >
              <Plus className="h-5 w-5" />
            </button>
          </section>

          {/* Empty State */}

          {filteredSubCategories.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Folder className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No Sub Categories Found
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {search.trim()
                  ? "Try changing your search or filters."
                  : "Create your first sub category to organize your products."}
              </p>

              {search.trim() || status !== "ALL" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("ALL");
                    setSort("NAME_ASC");
                  }}
                  className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/categories/sub-category/new")}
                  className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Add Sub Category
                </button>
              )}
            </div>
          ) : (
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubCategories.map((subCategory) => (
                <SubCategoryCard
                  key={subCategory._id}
                  subCategory={subCategory}
                  onEdit={() => {
                    if (!subCategory._id) {
                      console.error("Sub category ID is missing:", subCategory);
                      return;
                    }

                    router.push(
                      `/categories/sub-category/edit?id=${subCategory._id}`,
                    );
                  }}
                  onDelete={() => handleDelete(subCategory)}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      {/* Delete Dialog */}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityType="Sub Category"
        entityName={selectedSubCategory?.name ?? ""}
        loading={deleteLoading}
        onConfirm={confirmDelete}
      />

      <ProgressDialog
        open={deleteLoading}
        title="Deleting Sub Category"
        description="Please wait while we delete the sub category."
      />
    </>
  );
}

/* ========================================================================== */
/* Sub Category Card                                                          */
/* ========================================================================== */

interface SubCategoryCardProps {
  subCategory: SubCategory;
  onEdit: () => void;
  onDelete: () => void;
}

function SubCategoryCard({
  subCategory,
  onEdit,
  onDelete,
}: SubCategoryCardProps) {
  const name = String(subCategory.name ?? "").trim() || "Unnamed Sub Category";

  const subCategoryCode =
    String(subCategory.subCategoryCode ?? "").trim() || "—";

  const categoryName = getCategoryName(subCategory.category);

  const productCount = Number(subCategory.productCount ?? 0);

  const active = subCategory.isActive === true;

  return (
    <article
      className="
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:border-sky-200
        hover:shadow-lg
      "
    >
      {/* Body */}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-sky-500
              to-blue-600
              text-white
              shadow-md
            "
          >
            <Folder className="h-5 w-5" />
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            <h2
              className="
                truncate
                text-[15px]
                font-bold
                text-slate-900
              "
            >
              {name}
            </h2>

            <p
              className="
                mt-1
                truncate
                text-[11px]
                text-slate-400
              "
            >
              {categoryName}
            </p>

            <span
              className={`
                mt-3
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-semibold
                ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }
              `}
            >
              {active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Product Count */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            rounded-2xl
            bg-slate-50
            px-3
            py-2.5
          "
        >
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-sky-500" />

            <span className="text-xs text-slate-500">Products</span>

            <span className="text-sm font-bold text-slate-800">
              {productCount}
            </span>
          </div>

          <span
            className="
              max-w-[100px]
              truncate
              text-[11px]
              text-slate-400
            "
          >
            {subCategoryCode}
          </span>
        </div>
      </div>

      {/* Actions */}

      <div
        className="
          grid
          grid-cols-2
          border-t
          border-slate-100
          bg-slate-50
        "
      >
        <button
          type="button"
          onClick={onEdit}
          className="
            flex
            h-11
            items-center
            justify-center
            gap-2
            text-xs
            font-medium
            text-slate-700
            transition
            hover:bg-white
            hover:text-sky-600
          "
        >
          <Edit3 className="h-3.5 w-3.5 text-sky-600" />
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="
            flex
            h-11
            items-center
            justify-center
            gap-2
            border-l
            border-slate-100
            text-xs
            font-medium
            text-red-600
            transition
            hover:bg-red-50
            hover:text-red-700
          "
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </article>
  );
}

/* ========================================================================== */
/* Category Name Helper                                                       */
/* ========================================================================== */

function getCategoryName(category: SubCategory["category"]): string {
  if (typeof category === "object" && category !== null) {
    return String(category.name ?? "").trim() || "Category";
  }

  if (typeof category === "string") {
    return category.trim() || "Category";
  }

  return "Category";
}

/* ========================================================================== */
/* Stat Card                                                                  */
/* ========================================================================== */

interface StatCardProps {
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  iconClass: string;
}

function StatCard({
  label,
  value,
  description,
  icon,
  iconClass,
}: StatCardProps) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
