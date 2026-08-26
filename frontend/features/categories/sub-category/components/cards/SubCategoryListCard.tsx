"use client";

import {
  FolderOpen,
  FolderTree,
  MoreVertical,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { SubCategory } from "../../types/sub-category";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SubCategoryListCardProps {
  subCategory: SubCategory;
  onDelete: (subCategory: SubCategory) => void;
}

export default function SubCategoryListCard({
  subCategory,
  onDelete,
}: SubCategoryListCardProps) {
  const router = useRouter();

  const categoryName =
    typeof subCategory.category === "object" && subCategory.category !== null
      ? subCategory.category.name
      : "Uncategorized";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
      {/* Body */}

      <div
        onClick={() =>
          router.push(`/categories/sub-category/${subCategory._id}`)
        }
        className="cursor-pointer px-4 py-3"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}

          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{
              background: "linear-gradient(135deg,#2563eb,#06b6d4)",
            }}
          >
            <FolderOpen className="h-5 w-5" />
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            {/* Header */}

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-semibold leading-none text-slate-900">
                  {subCategory.name}
                </h3>

                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <FolderTree className="h-3.5 w-3.5 text-blue-500" />

                  <span>{categoryName}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
            </div>

            {/* Footer */}

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    subCategory.isActive
                      ? "border-0 bg-emerald-100 text-[11px] text-emerald-700"
                      : "border-0 bg-red-100 text-[11px] text-red-700"
                  }
                >
                  {subCategory.isActive ? "Active" : "Inactive"}
                </Badge>

                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-[11px] text-blue-700"
                >
                  <Package className="mr-1 h-3 w-3" />
                  {subCategory.productCount ?? 0}
                </Badge>
              </div>

              <span className="text-sm font-semibold text-slate-600">
                {subCategory.subCategoryCode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}

      <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50">
        <Button
          variant="ghost"
          className="h-9 rounded-none border-x border-slate-100 text-xs"
          onClick={() =>
            router.push(`/categories/sub-category/edit?id=${subCategory._id}`)
          }
        >
          <Pencil className="mr-1 h-3.5 w-3.5 text-blue-600" />
          Edit
        </Button>

        <Button
          variant="ghost"
          className="h-9 rounded-none text-xs text-red-600 hover:text-red-700"
          onClick={() => onDelete(subCategory)}
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
