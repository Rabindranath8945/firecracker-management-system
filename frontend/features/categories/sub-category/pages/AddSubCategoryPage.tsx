"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CategoryForm from "@/features/categories/shared/components/CategoryForm";
import { CATEGORY_CONFIG } from "@/features/categories/shared/constants/category.config";

import SubCategoryService from "@/features/categories/sub-category/services/sub-category.service";

import type { CreateSubCategoryDto } from "@/features/categories/sub-category/services/sub-category.service";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

interface SubCategoryFormValues {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryId?: string;
  isActive?: boolean;
}

export default function AddSubCategoryPage() {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  const [createdSubCategory, setCreatedSubCategory] =
    useState<CreateSubCategoryDto | null>(null);

  async function handleSubmit(values: SubCategoryFormValues) {
    try {
      const categoryId = values.categoryId?.trim();

      if (!categoryId) {
        throw new Error("Please select a parent category.");
      }

      const name = values.name.trim();

      if (!name) {
        throw new Error("Please enter a sub category name.");
      }

      const payload: CreateSubCategoryDto = {
        name,
        category: categoryId,
      };

      const created = await SubCategoryService.create(payload);

      console.log("Sub category created:", created);

      setCreatedSubCategory(payload);
      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to create sub category:", error);
    }
  }

  return (
    <>
      <CategoryForm
        config={CATEGORY_CONFIG.subCategory}
        onSubmit={handleSubmit}
      />

      <SuccessDialog
        open={successOpen}
        title="Sub Category Created"
        description={
          createdSubCategory
            ? `"${createdSubCategory.name}" has been created successfully.`
            : "The sub category has been created successfully."
        }
        primaryLabel="Back to Categories"
        secondaryLabel="Add Another"
        onPrimary={() => {
          setSuccessOpen(false);
          router.push("/categories");
        }}
        onSecondary={() => {
          setSuccessOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
