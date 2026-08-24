"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import SearchableSelect from "./SearchableSelect";
import type { SearchableSelectOption } from "./searchable-select.types";

const schema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z
    .string()
    .trim()
    .min(2, "Sub Category name is required")
    .max(100, "Maximum 100 characters"),
});

type FormValues = z.infer<typeof schema>;

interface AddSubCategoryDialogProps {
  open: boolean;
  loading?: boolean;

  categories: SearchableSelectOption[];

  onOpenChange: (open: boolean) => void;

  onSubmit: (values: FormValues) => Promise<void> | void;
}

export default function AddSubCategoryDialog({
  open,
  loading = false,
  categories,
  onOpenChange,
  onSubmit,
}: AddSubCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: "",
      name: "",
    },
  });

  const categoryId = watch("categoryId");

  useEffect(() => {
    if (open) {
      reset({
        categoryId: "",
        name: "",
      });
    }
  }, [open, reset]);

  const submit = async (values: FormValues) => {
    await onSubmit(values);

    reset();

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Sub Category</DialogTitle>

          <DialogDescription>
            Create a new product sub category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>

            <SearchableSelect
              value={categoryId}
              options={categories}
              placeholder="Select Category"
              searchPlaceholder="Search Category..."
              onChange={(value) =>
                setValue("categoryId", value, {
                  shouldValidate: true,
                })
              }
            />

            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sub Category Name</label>

            <Input
              placeholder="Enter sub category name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Sub Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
