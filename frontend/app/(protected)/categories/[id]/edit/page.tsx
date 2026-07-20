import { notFound } from "next/navigation";

import EditCategoryPage from "@/features/categories/category/pages/EditCategoryPage";
import { categories } from "@/features/categories/category/services/category.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryEditRoute({ params }: Props) {
  const { id } = await params;

  const category = categories.find((item) => item.id === id);

  if (!category) {
    notFound();
  }

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
