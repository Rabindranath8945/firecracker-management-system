"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import CategoryBasicInfo from "./CategoryBasicInfo";
import CategoryHero from "./CategoryHero";
import CategorySettings from "./CategorySettings";
import CategoryStickyBar from "./CategoryStickyBar";
import PageContainer from "@/features/shared/ui/layout/PageContainer";
import PageHeader from "@/features/shared/ui/layout/PageHeader";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface CategoryFormValues {
  name: string;
  description?: string;
  categoryId?: string;
  isActive: boolean;
}

interface CategoryFormConfig {
  title: string;
  description: string;
  submitLabel: string;
  showParentCategory: boolean;
}

interface CategoryFormProps {
  config: CategoryFormConfig;

  mode?: "create" | "edit";

  defaultValues?: Partial<CategoryFormValues>;

  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
}

export default function CategoryForm({
  config,
  mode = "create",
  defaultValues,
  onSubmit,
}: CategoryFormProps) {
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const submit = form.handleSubmit(onSubmit);

  return (
    <PageContainer className="space-y-6 pb-32">
      <div className="flex items-center">
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <PageHeader
        title={
          mode === "edit"
            ? config.showParentCategory
              ? "Edit Sub Category"
              : "Edit Category"
            : config.title
        }
        description={
          mode === "edit"
            ? config.showParentCategory
              ? "Update your sub category information."
              : "Update your category information."
            : config.description
        }
      />

      {/* <CategoryHero
        title={
          mode === "edit"
            ? config.showParentCategory
              ? "Edit Sub Category"
              : "Edit Category"
            : config.title
        }
        description={
          mode === "edit"
            ? config.showParentCategory
              ? "Update your sub category information."
              : "Update your category information."
            : config.description
        }
        showParentCategory={config.showParentCategory}
      /> */}

      <CategoryBasicInfo
        form={form}
        showParentCategory={config.showParentCategory}
      />

      <CategorySettings form={form} />

      <CategoryStickyBar
        saveLabel={
          mode === "edit"
            ? config.showParentCategory
              ? "Update Sub Category"
              : "Update Category"
            : config.submitLabel
        }
        onSave={submit}
        onCancel={() => router.back()}
      />
    </PageContainer>
  );
}
