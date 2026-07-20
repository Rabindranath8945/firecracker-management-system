"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CategoryForm from "@/features/categories/shared/components/CategoryForm";
import { CATEGORY_CONFIG } from "@/features/categories/shared/constants/category.config";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

import type { CategoryFormValues } from "@/features/categories/shared/components/CategoryForm";

interface EditCategoryPageProps {
  categoryId: string;
  defaultValues: Partial<CategoryFormValues>;
}

export default function EditCategoryPage({
  categoryId,
  defaultValues,
}: EditCategoryPageProps) {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  async function handleSubmit(values: CategoryFormValues) {
    try {
      console.log("Update Category", values);

      // await categoryService.update(categoryId, values);

      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <CategoryForm
        mode="edit"
        config={CATEGORY_CONFIG.category}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />

      <SuccessDialog
        open={successOpen}
        title="Category Updated"
        description="Category has been updated successfully."
        primaryLabel="View Category"
        secondaryLabel="Back to Categories"
        onPrimary={() => router.push(`/categories/${categoryId}`)}
        onSecondary={() => router.push("/categories")}
      />
    </>
  );
}
