import { notFound } from "next/navigation";

import EditSubCategoryPage from "@/features/categories/sub-category/pages/EditSubCategoryPage";
import { subCategories } from "@/features/categories/sub-category/services/sub-category.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubCategoryEditRoute({ params }: Props) {
  const { id } = await params;

  const subCategory = subCategories.find((item) => item.id === id);

  if (!subCategory) {
    notFound();
  }

  return (
    <EditSubCategoryPage
      subCategoryId={subCategory.id}
      defaultValues={{
        categoryId: subCategory.categoryId ?? "",
        name: subCategory.name,
        description: subCategory.description ?? "",
        isActive: subCategory.isActive,
      }}
    />
  );
}
