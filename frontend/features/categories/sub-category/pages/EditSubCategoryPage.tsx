"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import CategoryForm from "@/features/categories/shared/components/CategoryForm";
import { CATEGORY_CONFIG } from "@/features/categories/shared/constants/category.config";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

import SubCategoryService from "../services/sub-category.service";

import type { CategoryFormValues } from "@/features/categories/shared/components/CategoryForm";

interface EditSubCategoryPageProps {
  subCategoryId: string;

  defaultValues: Partial<CategoryFormValues>;
}

export default function EditSubCategoryPage({
  subCategoryId,
  defaultValues,
}: EditSubCategoryPageProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [updatedSubCategory, setUpdatedSubCategory] = useState<{
    name: string;
  } | null>(null);

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                  */
  /* ---------------------------------------------------------------------- */

  async function handleSubmit(values: CategoryFormValues) {
    try {
      setLoading(true);

      const categoryId = values.categoryId?.trim();

      if (!categoryId) {
        throw new Error("Please select a parent category.");
      }

      const name = values.name.trim();

      if (!name) {
        throw new Error("Sub category name is required.");
      }

      const updated = await SubCategoryService.update(subCategoryId, {
        name,
        category: categoryId,
        isActive: values.isActive ?? true,
      });

      setUpdatedSubCategory({
        name: updated.name,
      });

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to update sub category:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6">
        {/* ---------------------------------------------------------------- */}
        {/* Form                                                              */}
        {/* ---------------------------------------------------------------- */}

        <CategoryForm
          mode="edit"
          config={CATEGORY_CONFIG.subCategory}
          defaultValues={defaultValues}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Progress                                                            */}
      {/* ------------------------------------------------------------------ */}

      <ProgressDialog
        open={loading}
        title="Updating Sub Category"
        description="Please wait while we update the sub category."
      />

      {/* ------------------------------------------------------------------ */}
      {/* Success                                                             */}
      {/* ------------------------------------------------------------------ */}

      <SuccessDialog
        open={successOpen}
        title="Sub Category Updated"
        description={
          updatedSubCategory
            ? `"${updatedSubCategory.name}" has been updated successfully.`
            : "Sub category has been updated successfully."
        }
        primaryLabel="Back to Categories"
        secondaryLabel="Continue Editing"
        onPrimary={() => {
          setSuccessOpen(false);
          router.push("/categories");
        }}
        onSecondary={() => {
          setSuccessOpen(false);
        }}
      />
    </>
  );
}
