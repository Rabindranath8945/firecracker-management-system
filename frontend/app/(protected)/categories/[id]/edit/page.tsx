"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import EditCategoryPage from "@/features/categories/category/pages/EditCategoryPage";
import CategoryService from "@/features/categories/category/services/category.service";
import type { Category } from "@/features/categories/category/types/category";

export default function CategoryEditRoute() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params.id === "string" ? params.id : "";

  const [category, setCategory] = useState<Category | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Load Category                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!id) {
      setCategory(null);
      setError("Invalid category ID.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await CategoryService.getCategory(id);

        if (cancelled) {
          return;
        }

        setCategory(data);
      } catch (error) {
        console.error("Failed to load category:", error);

        if (cancelled) {
          return;
        }

        setCategory(null);
        setError("Unable to load category information.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadCategory();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-5
            py-4
            text-sm
            text-slate-500
            shadow-sm
          "
        >
          <Loader2 className="h-5 w-5 animate-spin text-sky-600" />

          <span>Loading category...</span>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (!category) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div
          className="
            w-full
            max-w-md
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-6
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-red-50
              text-lg
              font-bold
              text-red-600
            "
          >
            !
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load category
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ?? "Category information could not be found."}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/categories")}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              Back to Categories
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                rounded-xl
                bg-sky-500
                px-4
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

  /* ---------------------------------------------------------------------- */
  /* Edit Category                                                           */
  /* ---------------------------------------------------------------------- */

  return (
    <EditCategoryPage
      categoryId={category.id}
      defaultValues={{
        name: category.name,
        description: category.description ?? "",
        isActive: category.isActive,
      }}
    />
  );
}
