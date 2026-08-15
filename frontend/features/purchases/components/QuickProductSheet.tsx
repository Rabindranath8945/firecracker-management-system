"use client";

import { useEffect, useState } from "react";
import { Loader2, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  MasterPickerField,
  MasterPickerSheet,
} from "@/components/common/master-picker";

import { AddCategoryDialog } from "@/components/common/searchable-select";
import { AddSubCategoryDialog } from "@/components/common/searchable-select";

import CategoryService from "@/features/categories/category/services/category.service";
import SubCategoryService from "@/features/categories/sub-category/services/sub-category.service";

import { useCreateCategoryMutation } from "@/features/categories/category/hooks/useCreateCategoryMutation";
import { useCreateSubCategoryMutation } from "@/features/categories/sub-category/hooks/useCreateSubCategoryMutation";

import ProductService from "@/features/products/services/product.service";
import type { Product } from "@/features/products/types/product.types";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface QuickProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (product: Product) => void;
}

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

/* -------------------------------------------------------------------------- */
/* DEFAULT FORM                                                               */
/* -------------------------------------------------------------------------- */

const DEFAULT_FORM = {
  name: "",
  productCode: "",
  category: "",
  subCategory: "",
  purchasePrice: 0,
  sellingPrice: 0,
  stock: 0,
  minimumStock: 0,
  unit: "PCS",
  tax: 0,
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function QuickProductSheet({
  open,
  onOpenChange,
  onCreated,
}: QuickProductSheetProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState(DEFAULT_FORM);

  const [loading, setLoading] = useState(false);

  const [codeLoading, setCodeLoading] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* PICKER STATE                                                             */
  /* ------------------------------------------------------------------------ */

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* MUTATIONS                                                                */
  /* ------------------------------------------------------------------------ */

  const createCategoryMutation = useCreateCategoryMutation();

  const createSubCategoryMutation = useCreateSubCategoryMutation();

  /* ------------------------------------------------------------------------ */
  /* CATEGORIES                                                               */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* SUB CATEGORIES                                                           */
  /* ------------------------------------------------------------------------ */

  const { data: subCategories = [], isLoading: subCategoryLoading } = useQuery({
    queryKey: ["sub-categories", form.category],
    queryFn: () => SubCategoryService.getByCategory(form.category),
    enabled: open && Boolean(form.category),
  });

  const subCategoryOptions = subCategories.map((item: SubCategory) => ({
    id: item._id,
    title: item.name,
  }));

  /* ------------------------------------------------------------------------ */
  /* PRODUCT CODE                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadNextCode() {
      try {
        setCodeLoading(true);

        const productCode = await ProductService.getNextProductCode();

        if (!cancelled) {
          setForm((previous) => ({
            ...previous,
            productCode,
          }));
        }
      } catch (error) {
        console.error("Failed to generate product code:", error);
      } finally {
        if (!cancelled) {
          setCodeLoading(false);
        }
      }
    }

    setForm(DEFAULT_FORM);

    void loadNextCode();

    return () => {
      cancelled = true;
    };
  }, [open]);

  /* ------------------------------------------------------------------------ */
  /* FIELD UPDATE                                                             */
  /* ------------------------------------------------------------------------ */

  function updateField(
    field: keyof typeof DEFAULT_FORM,
    value: string | number,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /* ------------------------------------------------------------------------ */
  /* CATEGORY CHANGE                                                          */
  /* ------------------------------------------------------------------------ */

  function handleCategoryChange(categoryId: string) {
    setForm((previous) => ({
      ...previous,
      category: categoryId,
      subCategory: "",
    }));

    setSubCategoryOpen(false);
  }

  /* ------------------------------------------------------------------------ */
  /* ADD CATEGORY                                                             */
  /* ------------------------------------------------------------------------ */

  async function handleCreateCategory(name: string) {
    try {
      const category = await createCategoryMutation.mutateAsync({
        name,
      });

      await queryClient.refetchQueries({
        queryKey: ["categories"],
      });

      setCategoryDialogOpen(false);

      if (category?._id) {
        handleCategoryChange(category._id);
      }
    } catch (error) {
      console.error("Failed to create category:", error);

      throw error;
    }
  }

  /* ------------------------------------------------------------------------ */
  /* ADD SUB CATEGORY                                                         */
  /* ------------------------------------------------------------------------ */

  async function handleCreateSubCategory(values: {
    name: string;
    categoryId: string;
  }) {
    try {
      const subCategory = await createSubCategoryMutation.mutateAsync({
        name: values.name,
        category: values.categoryId,
      });

      await queryClient.refetchQueries({
        queryKey: ["sub-categories", values.categoryId],
      });

      setSubCategoryDialogOpen(false);

      if (subCategory?._id) {
        updateField("subCategory", subCategory._id);
      }
    } catch (error) {
      console.error("Failed to create sub category:", error);

      throw error;
    }
  }

  /* ------------------------------------------------------------------------ */
  /* CLOSE                                                                    */
  /* ------------------------------------------------------------------------ */

  function handleClose() {
    if (loading) {
      return;
    }

    onOpenChange(false);
  }

  /* ------------------------------------------------------------------------ */
  /* SAVE                                                                     */
  /* ------------------------------------------------------------------------ */

  async function handleSave() {
    const name = form.name.trim();

    if (!name) {
      toast.error("Product name is required.");
      return;
    }

    if (!form.productCode.trim()) {
      toast.error("Product code is required.");
      return;
    }

    if (!form.category) {
      toast.error("Category is required.");
      return;
    }

    if (form.purchasePrice < 0) {
      toast.error("Purchase price cannot be negative.");
      return;
    }

    if (form.sellingPrice < 0) {
      toast.error("Selling price cannot be negative.");
      return;
    }

    if (form.stock < 0) {
      toast.error("Opening stock cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const createdProduct = await ProductService.createProduct({
        name,

        productCode: form.productCode.trim(),

        category: form.category,

        subCategory: form.subCategory,

        purchasePrice: Number(form.purchasePrice),

        sellingPrice: Number(form.sellingPrice),

        stock: Number(form.stock),

        minimumStock: Number(form.minimumStock),

        unit: form.unit.trim() || "PCS",

        tax: Number(form.tax),

        barcode: "",

        hsnCode: "",

        brand: "",

        description: "",

        image: "",

        isActive: true,
      });

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product created successfully.");

      onOpenChange(false);

      onCreated(createdProduct);

      setForm(DEFAULT_FORM);
    } catch (error) {
      console.error("Failed to create product:", error);

      const message =
        error instanceof Error ? error.message : "Unable to create product.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* CLOSED                                                                   */
  /* ------------------------------------------------------------------------ */

  if (!open) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /* SHEET                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="fixed inset-0 z-50">
      {/* ------------------------------------------------------------------ */}
      {/* BACKDROP                                                           */}
      {/* ------------------------------------------------------------------ */}

      <button
        type="button"
        aria-label="Close"
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* ------------------------------------------------------------------ */}
      {/* SHEET                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="absolute bottom-0 left-0 right-0 max-h-[92vh] overflow-y-auto rounded-t-3xl border-t bg-background shadow-2xl">
        <div className="mx-auto w-full max-w-2xl">
          {/* ---------------------------------------------------------------- */}
          {/* HEADER                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="sticky top-0 z-20 border-b bg-background/95 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/15">
                <PackagePlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold">Add New Product</h2>

                <p className="text-xs text-muted-foreground">
                  Create a product and add it to this purchase.
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* FORM                                                             */}
          {/* ---------------------------------------------------------------- */}

          <div className="space-y-5 p-5">
            {/* Product Name */}

            <div className="space-y-2">
              <label className="text-sm font-semibold">Product Name *</label>

              <Input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Enter product name"
                disabled={loading}
                className="h-11 rounded-xl"
              />
            </div>

            {/* Product Code */}

            <div className="space-y-2">
              <label className="text-sm font-semibold">Product Code *</label>

              <Input
                value={form.productCode}
                readOnly
                placeholder={codeLoading ? "Generating..." : "Product code"}
                disabled={loading || codeLoading}
                className="h-11 rounded-xl bg-muted/40"
              />
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* CATEGORY                                                         */}
            {/* ---------------------------------------------------------------- */}

            <div className="space-y-2">
              <MasterPickerField
                label="Category *"
                value={
                  categories.find(
                    (item: Category) => item._id === form.category,
                  )?.name
                }
                placeholder="Select Category"
                onClick={() => setCategoryOpen(true)}
              />

              <MasterPickerSheet
                open={categoryOpen}
                title="Select Category"
                placeholder="Search Category..."
                loading={categoryLoading}
                value={form.category}
                items={categoryOptions}
                onClose={() => setCategoryOpen(false)}
                onSelect={handleCategoryChange}
                addButtonLabel="Add Category"
                onAddNew={() => {
                  setCategoryOpen(false);
                  setCategoryDialogOpen(true);
                }}
              />
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* SUB CATEGORY                                                     */}
            {/* ---------------------------------------------------------------- */}

            <div className="space-y-2">
              <MasterPickerField
                label="Sub Category"
                value={
                  subCategories.find(
                    (item: SubCategory) => item._id === form.subCategory,
                  )?.name
                }
                placeholder={
                  form.category
                    ? "Select Sub Category"
                    : "Select Category First"
                }
                disabled={!form.category}
                onClick={() => setSubCategoryOpen(true)}
              />

              <MasterPickerSheet
                open={subCategoryOpen}
                title="Select Sub Category"
                placeholder="Search Sub Category..."
                loading={subCategoryLoading}
                value={form.subCategory}
                items={subCategoryOptions}
                onClose={() => setSubCategoryOpen(false)}
                onSelect={(id) => updateField("subCategory", id)}
                addButtonLabel="Add Sub Category"
                onAddNew={() => {
                  setSubCategoryOpen(false);
                  setSubCategoryDialogOpen(true);
                }}
              />
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* PRICES                                                           */}
            {/* ---------------------------------------------------------------- */}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Purchase Price *
                </label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={form.purchasePrice}
                  onChange={(event) =>
                    updateField(
                      "purchasePrice",
                      Number(event.target.value) || 0,
                    )
                  }
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Selling Price *</label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={form.sellingPrice}
                  onChange={(event) =>
                    updateField("sellingPrice", Number(event.target.value) || 0)
                  }
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* STOCK / UNIT                                                     */}
            {/* ---------------------------------------------------------------- */}

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Opening Stock</label>

                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) =>
                    updateField("stock", Number(event.target.value) || 0)
                  }
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Min. Stock</label>

                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.minimumStock}
                  onChange={(event) =>
                    updateField("minimumStock", Number(event.target.value) || 0)
                  }
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Unit</label>

                <Input
                  value={form.unit}
                  onChange={(event) => updateField("unit", event.target.value)}
                  placeholder="PCS"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* GST                                                              */}
            {/* ---------------------------------------------------------------- */}

            <div className="space-y-2">
              <label className="text-sm font-semibold">GST %</label>

              <Input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.tax}
                onChange={(event) =>
                  updateField("tax", Number(event.target.value) || 0)
                }
                disabled={loading}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* FOOTER                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="sticky bottom-0 flex gap-3 border-t bg-background/95 p-5 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleClose}
              className="h-11 flex-1 rounded-xl"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                loading || codeLoading || !form.name.trim() || !form.category
              }
              onClick={() => {
                void handleSave();
              }}
              className="h-11 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Create & Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ADD CATEGORY DIALOG                                                   */}
      {/* -------------------------------------------------------------------- */}

      <AddCategoryDialog
        open={categoryDialogOpen}
        loading={createCategoryMutation.isPending}
        onOpenChange={setCategoryDialogOpen}
        onSubmit={async (name) => {
          await handleCreateCategory(name);
        }}
      />

      {/* -------------------------------------------------------------------- */}
      {/* ADD SUB CATEGORY DIALOG                                               */}
      {/* -------------------------------------------------------------------- */}

      <AddSubCategoryDialog
        open={subCategoryDialogOpen}
        loading={createSubCategoryMutation.isPending}
        categories={categoryOptions.map((item) => ({
          value: item.id,
          label: item.title,
        }))}
        onOpenChange={setSubCategoryDialogOpen}
        onSubmit={async (values) => {
          await handleCreateSubCategory(values);
        }}
      />
    </div>
  );
}
