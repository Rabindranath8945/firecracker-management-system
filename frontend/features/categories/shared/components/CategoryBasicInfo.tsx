"use client";

import type { UseFormReturn } from "react-hook-form";
import { Tag } from "lucide-react";

import type { CategoryFormValues } from "./CategoryForm";

import { categories } from "@/features/categories/category/services/category.service";

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

interface CategoryBasicInfoProps {
  form: UseFormReturn<CategoryFormValues>;

  showParentCategory: boolean;
}

export default function CategoryBasicInfo({
  form,
  showParentCategory,
}: CategoryBasicInfoProps) {
  return (
    <Card className="rounded-[28px] shadow-sm">
      <CardContent className="space-y-7 p-7">
        {/* Header */}

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Fill in the required information.
          </p>
        </div>

        {/* Parent Category */}

        {showParentCategory && (
          <div className="space-y-2">
            <Label>Parent Category</Label>

            <Select
              value={form.watch("categoryId") ?? ""}
              onValueChange={(value) =>
                form.setValue("categoryId", value ?? "")
              }
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
