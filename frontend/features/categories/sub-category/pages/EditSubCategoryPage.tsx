"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CategoryForm from "@/features/categories/shared/components/CategoryForm";
import { CATEGORY_CONFIG } from "@/features/categories/shared/constants/category.config";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

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

  const [successOpen, setSuccessOpen] = useState(false);

  async function handleSubmit(values: CategoryFormValues) {
    try {
      console.log("Update Sub Category", values);

      // await subCategoryService.update(subCategoryId, values);

      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <CategoryForm
        mode="edit"
        config={CATEGORY_CONFIG.subCategory}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />

      <SuccessDialog
        open={successOpen}
        title="Sub Category Updated"
        description="Sub category has been updated successfully."
        primaryLabel="View Sub Category"
        secondaryLabel="Back to Categories"
        onPrimary={() =>
          router.push(`/categories/sub-category/${subCategoryId}`)
        }
        onSecondary={() => router.push("/categories")}
      />
    </>
  );
}
