"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CategoryForm from "@/features/categories/shared/components/CategoryForm";
import { CATEGORY_CONFIG } from "@/features/categories/shared/constants/category.config";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

export default function AddCategoryPage() {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  async function handleSubmit(values: unknown) {
    try {
      console.log(values);

      // TODO:
      // await categoryService.create(values);

      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <CategoryForm config={CATEGORY_CONFIG.category} onSubmit={handleSubmit} />

      <SuccessDialog
        open={successOpen}
        title="Category Created"
        description="The category has been created successfully."
        primaryLabel="Back to Categories"
        secondaryLabel="Add Another"
        onPrimary={() => router.push("/categories")}
        onSecondary={() => {
          setSuccessOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
