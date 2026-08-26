"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  Edit3,
  FolderTree,
  Package,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import type { Category } from "../types/category";

import CategoryService from "../services/category.service";
import CategorySearch from "../components/filters/CategorySearch";
import CategoryFilters from "../components/filters/CategoryFilters";

import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

export default function CategoryPage() {
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [sort, setSort] = useState("NAME_ASC");

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* Load Categories                                                            */
  /* -------------------------------------------------------------------------- */

  async function loadCategories() {
    try {
      setLoading(true);
      setError(null);

      const data = await CategoryService.getCategories();

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load categories:", error);

      setCategories([]);

      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Statistics                                                                 */
  /* -------------------------------------------------------------------------- */

  const stats = useMemo(() => {
    const total = categories.length;

    const active = categories.filter(
      (category) => category.isActive === true,
    ).length;

    const inactive = categories.filter(
      (category) => category.isActive !== true,
    ).length;

    const products = categories.reduce((total, category) => {
      return total + Number(category.productCount ?? 0);
    }, 0);

    return {
      total,
      active,
      inactive,
      products,
    };
  }, [categories]);

  /* -------------------------------------------------------------------------- */
  /* Search + Filter + Sort                                                     */
  /* -------------------------------------------------------------------------- */

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = categories.filter((category) => {
      /*
       * IMPORTANT:
       * The backend may contain old categories where categoryNo is missing.
       * Always convert nullable/undefined values to a string before calling
       * string methods.
       */

      const categoryName = String(category.name ?? "").toLowerCase();

      const categoryNo = String(category.categoryCode ?? "").toLowerCase();

      const matchesSearch =
        keyword.length === 0 ||
        categoryName.includes(keyword) ||
        categoryNo.includes(keyword);

      const matchesStatus =
        status === "ALL"
          ? true
          : status === "ACTIVE"
            ? category.isActive === true
            : category.isActive !== true;

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
  }, [categories, search, status, sort]);

  /* -------------------------------------------------------------------------- */
  /* Delete Open                                                                */
  /* -------------------------------------------------------------------------- */

  function handleDelete(category: Category) {
    setSelectedCategory(category);

    setDeleteOpen(true);
  }

  /* -------------------------------------------------------------------------- */
  /* Confirm Delete                                                             */
  /* -------------------------------------------------------------------------- */

  async function confirmDelete() {
    if (!selectedCategory) {
      return;
    }

    try {
      setDeleteLoading(true);

      await CategoryService.delete(selectedCategory.id);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category.id !== selectedCategory.id,
        ),
      );

      setDeleteOpen(false);

      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setDeleteLoading(false);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Loading                                                                    */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-background">
        <div className="mx-auto max-w-5xl">
          <div
            className="
              flex
              min-h-[400px]
              items-center
              justify-center
              rounded-[28px]
              border
              border-slate-200
              bg-white
              shadow-sm
              dark:border-border
              dark:bg-card
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-slate-200
                  border-t-sky-500
                "
              />

              <p className="mt-4 text-sm font-medium text-slate-600 dark:text-muted-foreground">
                Loading categories...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Error                                                                      */
  /* -------------------------------------------------------------------------- */

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-background">
        <div className="mx-auto max-w-5xl">
          <div
            className="
              rounded-[28px]
              border
              border-red-200
              bg-white
              p-8
              text-center
              shadow-sm
              dark:border-red-500/20
              dark:bg-card
            "
          >
            <XCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-foreground">
              Unable to load categories
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadCategories()}
              className="
                mt-5
                rounded-xl
                bg-sky-500
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-sky-600
              "
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <main
        className="
          min-h-screen
          bg-slate-50
          pb-28
          dark:bg-background
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-5xl
            space-y-5
            px-4
            py-5
            sm:px-6
            lg:px-0
          "
        >
          {/* ---------------------------------------------------------------- */}
          {/* Statistics                                                       */}
          {/* ---------------------------------------------------------------- */}

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Categories"
              value={stats.total}
              description="Total"
              icon={<FolderTree className="h-5 w-5" />}
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

          {/* ---------------------------------------------------------------- */}
          {/* Search + Filters                                                  */}
          {/* ---------------------------------------------------------------- */}

          <section
            className="
              rounded-[24px]
              border
              border-slate-200
              bg-white
              p-3
              shadow-sm
              dark:border-border
              dark:bg-card
              sm:p-4
            "
          >
            <CategorySearch
              value={search}
              onChange={setSearch}
              placeholder="Search categories..."
            />

            <div className="mt-3">
              <CategoryFilters
                status={status}
                sort={sort}
                onStatusChange={setStatus}
                onSortChange={setSort}
              />
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Section Header                                                    */}
          {/* ---------------------------------------------------------------- */}

          <section className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">
                  Categories
                </h1>

                <span
                  className="
                    rounded-full
                    bg-sky-50
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    text-sky-600
                  "
                >
                  {filteredCategories.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400 dark:text-muted-foreground">
                Organize your product categories
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/categories/new")}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-sky-500
                text-white
                shadow-lg
                shadow-sky-500/20
                transition
                hover:bg-sky-600
              "
              aria-label="Add category"
            >
              <Plus className="h-5 w-5" />
            </button>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Empty State                                                      */}
          {/* ---------------------------------------------------------------- */}

          {filteredCategories.length === 0 ? (
            <div
              className="
                rounded-[26px]
                border
                border-dashed
                border-slate-300
                bg-white
                px-6
                py-16
                text-center
                dark:border-border
                dark:bg-card
              "
            >
              <FolderTree className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-foreground">
                No Categories Found
              </h2>

              <p className="mt-2 text-sm text-slate-400 dark:text-muted-foreground">
                {search.trim()
                  ? "Try changing your search or filters."
                  : "Create your first category to organize your products."}
              </p>

              {search.trim() || status !== "ALL" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("ALL");
                    setSort("NAME_ASC");
                  }}
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/categories/new")}
                  className="
                    mt-5
                    rounded-xl
                    bg-sky-500
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-sky-600
                  "
                >
                  Add Category
                </button>
              )}
            </div>
          ) : (
            /* -------------------------------------------------------------- */
            /* Category Grid                                                   */
            /* -------------------------------------------------------------- */

            <section
              className="
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {filteredCategories.map((category, index) => (
                <CategoryCard
                  key={
                    category.id ?? category.categoryCode ?? `category-${index}`
                  }
                  category={category}
                  onEdit={() => {
                    if (!category.id) {
                      console.error("Category ID is missing:", category);
                      return;
                    }

                    router.push(`/categories/edit?id=${category.id}`);
                  }}
                  onDelete={() => handleDelete(category)}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* Delete Confirmation                                                  */}
      {/* -------------------------------------------------------------------- */}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityType="Category"
        entityName={selectedCategory?.name ?? ""}
        loading={deleteLoading}
        onConfirm={confirmDelete}
      />

      {/* -------------------------------------------------------------------- */}
      {/* Delete Progress                                                      */}
      {/* -------------------------------------------------------------------- */}

      <ProgressDialog
        open={deleteLoading}
        title="Deleting Category"
        description="Please wait while we delete the category."
      />
    </>
  );
}

/* ========================================================================== */
/* Category Card                                                              */
/* ========================================================================== */

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const categoryName = String(category.name ?? "Unnamed Category");

  const categoryNo = String(category.categoryCode ?? "—");

  const productCount = Number(category.productCount ?? 0);

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
        dark:border-border
        dark:bg-card
      "
    >
      {/* Card Body */}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Category Icon */}

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
            <FolderTree className="h-5 w-5" />
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-[15px]
                  font-bold
                  text-slate-900
                  dark:text-foreground
                "
              >
                {categoryName}
              </h2>

              <p
                className="
                  mt-1
                  truncate
                  text-[10px]
                  uppercase
                  tracking-[0.12em]
                  text-slate-400
                "
              >
                {categoryNo}
              </p>
            </div>

            {/* Status */}

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
                  category.isActive === true
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }
              `}
            >
              {category.isActive === true ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Products */}

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
            dark:bg-background/50
          "
        >
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-sky-500" />

            <span className="text-xs text-slate-500 dark:text-muted-foreground">
              Products
            </span>

            <span className="text-sm font-bold text-slate-800 dark:text-foreground">
              {productCount}
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            {category.isActive === true ? "Available" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Direct Actions */}

      <div
        className="
          grid
          grid-cols-2
          border-t
          border-slate-100
          bg-slate-50
          dark:border-border
          dark:bg-background/30
        "
      >
        {/* Edit */}

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
            dark:text-muted-foreground
            dark:hover:bg-card
            dark:hover:text-sky-400
          "
        >
          <Edit3 className="h-3.5 w-3.5 text-sky-600" />
          Edit
        </button>

        {/* Delete */}

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
            dark:border-border
            dark:hover:bg-red-500/10
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
/* Stat Card                                                                  */
/* ========================================================================== */

interface StatCardProps {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
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
    <div
      className="
        rounded-[22px]
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        dark:border-border
        dark:bg-card
      "
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-slate-400
            "
          >
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-foreground">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${iconClass}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
