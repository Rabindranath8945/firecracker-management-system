"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import PageHeader from "@/features/shared/ui/layout/PageHeader";

import CategoryTabs from "../shared/components/CategoryTabs";

import CategoryPage from "../category/pages/CategoryPage";
import SubCategoryPage from "../sub-category/pages/SubCategoryPage";

import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"CATEGORY" | "SUB_CATEGORY">("CATEGORY");

  const isCategory = tab === "CATEGORY";

  return (
    <PageContainer className="space-y-4 pb-24">
      <PageHeader
        title={isCategory ? "Categories" : "Sub Categories"}
        description={
          isCategory
            ? "Organize your products into categories."
            : "Organize your products into sub categories."
        }
        action={
          <Button
            className="h-11 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-5 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            onClick={() =>
              router.push(
                isCategory ? "/categories/new" : "/categories/sub-category/new",
              )
            }
          >
            <Plus className="mr-2 h-4 w-4" />

            {isCategory ? "Add Category" : "Add Sub Category"}
          </Button>
        }
      />

      <CategoryTabs value={tab} onChange={setTab} />

      {isCategory ? <CategoryPage /> : <SubCategoryPage />}
    </PageContainer>
  );
}
