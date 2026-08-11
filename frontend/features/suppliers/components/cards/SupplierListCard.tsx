"use client";

import { Eye, MoreVertical, Pencil, Phone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Supplier } from "../../types/supplier";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SupplierListCardProps {
  supplier: Supplier;
  onDelete: (supplier: Supplier) => void;
}

export default function SupplierListCard({
  supplier,
  onDelete,
}: SupplierListCardProps) {
  const router = useRouter();

  return (
    <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-lg">
      {/* Body */}

      <div
        onClick={() => router.push(`/suppliers/${supplier._id}`)}
        className="cursor-pointer p-5"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-md">
            {supplier.name.charAt(0).toUpperCase()}
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-[16px] font-bold text-slate-900">
                  {supplier.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {supplier.supplierCode}
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Phone className="h-4 w-4 text-indigo-600" />

                  <span>{supplier.mobile}</span>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-xl"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4 text-slate-500" />
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge
                className={
                  supplier.isActive
                    ? "border-0 bg-emerald-100 text-emerald-700"
                    : "border-0 bg-red-100 text-red-700"
                }
              >
                {supplier.isActive ? "Active" : "Inactive"}
              </Badge>

              <div className="text-right">
                <p className="text-xs text-slate-500">Opening Balance</p>

                <p className="text-lg font-bold text-amber-600">
                  ₹{(supplier.openingBalance ?? 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50">
        <Button
          variant="ghost"
          className="h-11 rounded-none"
          onClick={() => router.push(`/suppliers/${supplier._id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>

        <Button
          variant="ghost"
          className="h-11 rounded-none border-x border-slate-100"
          onClick={() => router.push(`/suppliers/${supplier._id}/edit`)}
        >
          <Pencil className="mr-2 h-4 w-4 text-indigo-600" />
          Edit
        </Button>

        <Button
          variant="ghost"
          className="h-11 rounded-none text-red-600 hover:text-red-700"
          onClick={() => onDelete(supplier)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </article>
  );
}
