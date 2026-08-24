"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import EditSubCategoryPage from "@/features/categories/sub-category/pages/EditSubCategoryPage";
import SubCategoryService from "@/features/categories/sub-category/services/sub-category.service";

import type { SubCategory } from "@/features/categories/sub-category/types/sub-category";

export default function SubCategoryEditRoute() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params.id === "string" ? params.id : "";

  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid sub category ID.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadSubCategory() {
      try {
        setLoading(true);
        setError(null);

        const data = await SubCategoryService.getSubCategory(id);

        if (!cancelled) {
          setSubCategory(data);
        }
      } catch (error) {
        console.error("Failed to load sub category:", error);

        if (!cancelled) {
          setSubCategory(null);
          setError("Unable to load sub category information.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSubCategory();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
          Loading sub category...
        </div>
      </main>
    );
  }

  if (error || !subCategory) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Unable to load sub category
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error ?? "Sub category information could not be found."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium"
          >
            Back to Categories
          </button>
        </div>
      </main>
    );
  }

  const parentCategoryId =
    typeof subCategory.category === "object" && subCategory.category !== null
      ? subCategory.category._id
      : (subCategory.category ?? "");

  return (
    <EditSubCategoryPage
      subCategoryId={subCategory._id}
      defaultValues={{
        name: subCategory.name,
        description: subCategory.description ?? "",
        categoryId: parentCategoryId,
        isActive: subCategory.isActive,
      }}
    />
  );
}
