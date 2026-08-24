"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Loader2, Tag } from "lucide-react";

import type { Category } from "@/features/categories/category/types/category";
import CategoryService from "@/features/categories/category/services/category.service";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";

import type { CategoryFormValues } from "./CategoryForm";

interface CategoryBasicInfoProps {
  form: UseFormReturn<CategoryFormValues>;
  showParentCategory: boolean;
}

export default function CategoryBasicInfo({
  form,
  showParentCategory,
}: CategoryBasicInfoProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const selectedCategory = categories.find(
    (category) => category.id === form.watch("categoryId"),
  );

  /* ---------------------------------------------------------------------- */
  /* LOAD CATEGORIES                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!showParentCategory) {
      return;
    }

    let cancelled = false;

    async function loadCategories() {
      try {
        setLoadingCategories(true);
        setCategoryError(null);

        const data = await CategoryService.getCategories();

        if (!cancelled) {
          setCategories(data.filter((category) => Boolean(category.id)));
        }
      } catch (error) {
        console.error("Failed to load parent categories:", error);

        if (!cancelled) {
          setCategories([]);
          setCategoryError("Unable to load categories.");
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, [showParentCategory]);

  const selectedCategoryId = form.watch("categoryId");

  return (
    <Card className="rounded-[28px] border-slate-200 shadow-sm">
      <CardContent className="space-y-7 p-7">
        {/* Header */}

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the basic information for this category.
          </p>
        </div>

        {/* Parent Category */}

        {showParentCategory && (
          <div className="space-y-2">
            <Label>Parent Category</Label>

            <Select
              value={selectedCategoryId ?? ""}
              onValueChange={(value) => {
                form.setValue("categoryId", value ?? undefined, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              disabled={loadingCategories}
            >
              <SelectTrigger className="h-12 rounded-xl">
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading categories...</span>
                  </div>
                ) : (
                  <span className="truncate">
                    {selectedCategory?.name ?? "Select parent category"}
                  </span>
                )}
              </SelectTrigger>

              <SelectContent>
                {categories.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-slate-500">
                    {categoryError ?? "No categories found."}
                  </div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Debug/current selection */}

            {selectedCategoryId && (
              <p className="text-xs text-emerald-600">
                Selected category ID: {selectedCategoryId}
              </p>
            )}

            {categoryError && (
              <p className="text-xs text-red-500">{categoryError}</p>
            )}
          </div>
        )}

        {/* Name */}

        <div className="space-y-2">
          <Label>
            {showParentCategory ? "Sub Category Name" : "Category Name"}
          </Label>

          <div className="relative">
            <Tag className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

            <Input
              className="h-12 rounded-xl pl-11"
              placeholder={
                showParentCategory
                  ? "Enter sub category name"
                  : "Enter category name"
              }
              {...form.register("name")}
            />
          </div>
        </div>

        {/* Description */}

        <div className="space-y-2">
          <Label>Description</Label>

          <Textarea
            rows={4}
            className="resize-none rounded-xl"
            placeholder="Write a short description..."
            {...form.register("description")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
