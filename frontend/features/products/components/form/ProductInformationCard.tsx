"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  MasterPickerField,
  MasterPickerSheet,
} from "@/components/common/master-picker";

import ProductImagePicker from "@/components/common/shared/image/ProductImagePicker";
import { useCreateSubCategoryMutation } from "@/features/categories/sub-category/hooks/useCreateSubCategoryMutation";
import CategoryService from "@/features/categories/category/services/category.service";
import SubCategoryService from "@/features/categories/sub-category/services/sub-category.service";
import { AddSubCategoryDialog } from "@/components/common/searchable-select";
import type { ProductFormData } from "../../schemas/product.schema";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  title: string;
}

interface ProductInformationCardProps {
  onOpenCategoryDialog: () => void;
  onOpenSubCategoryDialog: () => void;
}

export default function ProductInformationCard({
  onOpenCategoryDialog,
  onOpenSubCategoryDialog,
}: ProductInformationCardProps) {
  const {
    register,
    control,
    setValue,

    formState: { errors },
  } = useFormContext<ProductFormData>();

  const selectedCategory = useWatch({
    control,
    name: "category",
  });

  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const createSubCategoryMutation = useCreateSubCategoryMutation();

  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  /* -------------------------------------------------------------------------- */
  /*                                 Categories                                 */
  /* -------------------------------------------------------------------------- */

  const { data: categories = [], isLoading: categoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getCategories,
  });

  const categoryOptions: CategoryOption[] = categories.map(
    (category: Category) => ({
      id: category._id,
      title: category.name,
    }),
  );

  /* -------------------------------------------------------------------------- */
  /*                              Sub Categories                                */
  /* -------------------------------------------------------------------------- */

  const { data: subCategories = [], isLoading: subCategoryLoading } = useQuery({
    queryKey: ["sub-categories", selectedCategory],
    queryFn: () => SubCategoryService.getByCategory(selectedCategory),
    enabled: !!selectedCategory,
  });

  const subCategoryOptions = subCategories.map((item: SubCategory) => ({
    id: item._id,
    title: item.name,
  }));

  /* -------------------------------------------------------------------------- */
  /*                     Clear Sub Category On Change                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setValue("subCategory", "");
  }, [selectedCategory, setValue]);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="space-y-5 p-5">
        <h2 className="text-lg font-semibold">Product Information</h2>

        {/* Product Image */}

        <div className="flex justify-center">
          <ProductImagePicker />
        </div>

        {/* Product Name */}

        <div className="space-y-2">
          <Label>Product Name *</Label>

          <Input
            {...register("name")}
            placeholder="Enter product name"
            className="h-11 rounded-xl"
          />

          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Product Code */}

        <div className="space-y-2">
          <Label>Product Code</Label>

          <Input
            {...register("productCode")}
            readOnly
            className="h-11 rounded-xl bg-muted"
          />
        </div>

        {/* Barcode */}

        <div className="space-y-2">
          <Label>Barcode</Label>

          <Input
            {...register("barcode")}
            placeholder="Scan or enter barcode"
            className="h-11 rounded-xl"
          />

          {errors.barcode && (
            <p className="text-sm text-destructive">{errors.barcode.message}</p>
          )}
        </div>

        {/* Category */}

        <div className="space-y-2">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <>
                <MasterPickerField
                  label="Category"
                  value={
                    categories.find(
                      (item: Category) => item._id === field.value,
                    )?.name
                  }
                  placeholder="Select Category"
                  error={errors.category?.message}
                  onClick={() => setCategoryOpen(true)}
                />

                <MasterPickerSheet
                  open={categoryOpen}
                  title="Select Category"
                  placeholder="Search Category..."
                  loading={categoryLoading}
                  value={field.value}
                  items={categoryOptions}
                  onClose={() => setCategoryOpen(false)}
                  onSelect={(id) => field.onChange(id)}
                  addButtonLabel="Add Category"
                  onAddNew={() => {
                    setCategoryOpen(false);
                    onOpenCategoryDialog();
                  }}
                />
              </>
            )}
          />
        </div>
        {/* Sub Category */}

        <div className="space-y-2">
          <Controller
            control={control}
            name="subCategory"
            render={({ field }) => (
              <>
                <MasterPickerField
                  label="Sub Category"
                  value={
                    subCategories.find(
                      (item: SubCategory) => item._id === field.value,
                    )?.name
                  }
                  placeholder={
                    selectedCategory
                      ? "Select Sub Category"
                      : "Select Category First"
                  }
                  disabled={!selectedCategory}
                  error={errors.subCategory?.message}
                  onClick={() => setSubCategoryOpen(true)}
                />

                <MasterPickerSheet
                  open={subCategoryOpen}
                  title="Select Sub Category"
                  placeholder="Search Sub Category..."
                  loading={subCategoryLoading}
                  value={field.value}
                  items={subCategoryOptions}
                  onClose={() => setSubCategoryOpen(false)}
                  onSelect={(id) => field.onChange(id)}
                  addButtonLabel="Add Sub Category"
                  onAddNew={() => {
                    setSubCategoryOpen(false);
                    setSubCategoryDialogOpen(true);
                  }}
                />
              </>
            )}
          />
        </div>
        <AddSubCategoryDialog
          open={subCategoryDialogOpen}
          loading={createSubCategoryMutation.isPending}
          categories={categoryOptions.map((item) => ({
            value: item.id,
            label: item.title,
          }))}
          onOpenChange={setSubCategoryDialogOpen}
          onSubmit={async (values) => {
            const subCategory = await createSubCategoryMutation.mutateAsync({
              name: values.name,
              category: values.categoryId,
            });

            await queryClient.refetchQueries({
              queryKey: ["sub-categories", values.categoryId],
            });

            setValue("subCategory", subCategory._id, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });

            setSubCategoryDialogOpen(false);
          }}
        />
      </CardContent>
    </Card>
  );
}
