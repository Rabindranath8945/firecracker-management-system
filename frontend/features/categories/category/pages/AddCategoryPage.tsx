"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CategoryForm from "@/features/categories/shared/components/CategoryForm";
import { CATEGORY_CONFIG } from "@/features/categories/shared/constants/category.config";

import CategoryService from "@/features/categories/category/services/category.service";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

import type { CreateCategoryDto } from "@/features/categories/category/services/category.service";

export default function AddCategoryPage() {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  const [createdCategory, setCreatedCategory] = useState<{
    name: string;
  } | null>(null);

  async function handleSubmit(values: CreateCategoryDto) {
    try {
      const category = await CategoryService.create(values);

      setCreatedCategory({
        name: category.name,
      });

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  }

  return (
    <>
      <CategoryForm config={CATEGORY_CONFIG.category} onSubmit={handleSubmit} />

      <SuccessDialog
        open={successOpen}
        title="Category Created"
        description={
          createdCategory
            ? `${createdCategory.name} has been created successfully.`
            : "The category has been created successfully."
        }
        primaryLabel="Back to Categories"
        secondaryLabel="Add Another"
        onPrimary={() => {
          setSuccessOpen(false);
          router.push("/categories");
        }}
        onSecondary={() => {
          setSuccessOpen(false);
          setCreatedCategory(null);
        }}
      />
    </>
  );
}
