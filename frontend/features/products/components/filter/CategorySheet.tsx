"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import CategoryService from "@/features/categories/category/services/category.service";

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  value: string;
  onSelect: (category: string) => void;
}

export default function CategorySheet({
  open,
  onOpenChange,
  value,
  onSelect,
}: CategorySheetProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getCategories,
  });

  const categories = [
    {
      _id: "ALL",
      name: "All",
    },
    ...(data ?? []).map((category) => ({
      _id: category.id,
      name: category.name,
    })),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Select Category</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3 p-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-2xl bg-slate-200"
                />
              ))
            : categories.map((category) => (
                <Button
                  key={category._id}
                  variant={value === category._id ? "default" : "outline"}
                  className="h-12 rounded-2xl"
                  onClick={() => {
                    onSelect(category._id);
                    onOpenChange(false);
                  }}
                >
                  {category.name}
                </Button>
              ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
