"use client";

import {
  Eye,
  FolderTree,
  MoreVertical,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { Category } from "../../types/category";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryListCardProps {
  category: Category;
  onDelete: (category: Category) => void;
}

export default function CategoryListCard({
  category,
  onDelete,
}: CategoryListCardProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
      {/* Body */}

      <div
        onClick={() => router.push(`/categories/${category.id}`)}
        className="cursor-pointer px-4 py-3"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}

          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{
              background: category.color
                ? category.color
                : "linear-gradient(135deg,#2563eb,#06b6d4)",
            }}
          >
            <FolderTree className="h-5 w-5" />
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-semibold leading-none text-slate-900">
                  {category.name}
                </h3>

                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <Package className="h-3.5 w-3.5 text-blue-500" />

                  <span>{category.productCount} Products</span>
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

            <div className="mt-2 flex items-center justify-between">
              <Badge
                className={
                  category.isActive
                    ? "border-0 bg-emerald-100 text-[11px] text-emerald-700"
                    : "border-0 bg-red-100 text-[11px] text-red-700"
                }
              >
                {category.isActive ? "Active" : "Inactive"}
              </Badge>

              <span className="text-sm font-semibold text-slate-600">
                {category.categoryNo}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}

      <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50">
        {/* <Button
          variant="ghost"
          className="h-9 rounded-none text-xs"
          onClick={() => router.push(`/categories/${category.id}`)}
        >
          <Eye className="mr-1 h-3.5 w-3.5" />
          View
        </Button> */}

        <Button
          variant="ghost"
          className="h-9 rounded-none border-x border-slate-100 text-xs"
          onClick={() => router.push(`/categories/${category.id}/edit`)}
        >
          <Pencil className="mr-1 h-3.5 w-3.5 text-blue-600" />
          Edit
        </Button>

        <Button
          variant="ghost"
          className="h-9 rounded-none text-xs text-red-600 hover:text-red-700"
          onClick={() => onDelete(category)}
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
