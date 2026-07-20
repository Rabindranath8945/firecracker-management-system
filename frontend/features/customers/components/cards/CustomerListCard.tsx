"use client";

import { Eye, MoreVertical, Pencil, Phone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Customer } from "../../types/customer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CustomerListCardProps {
  customer: Customer;
  onDelete: (customer: Customer) => void;
}

export default function CustomerListCard({
  customer,
  onDelete,
}: CustomerListCardProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
      {/* Body */}

      <div
        onClick={() => router.push(`/customers/${customer.id}`)}
        className="cursor-pointer px-4 py-3"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 text-base font-bold text-white shadow-md">
            {customer.name.charAt(0).toUpperCase()}
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            {/* Top */}

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-semibold leading-none text-slate-900">
                  {customer.name}
                </h3>

                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <Phone className="h-3.5 w-3.5 text-blue-500" />

                  <span>{customer.mobile}</span>
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

            {/* Bottom */}

            <div className="mt-2 flex items-center justify-between">
              <Badge
                className={
                  customer.isActive
                    ? "border-0 bg-emerald-100 text-[11px] text-emerald-700"
                    : "border-0 bg-red-100 text-[11px] text-red-700"
                }
              >
                {customer.isActive ? "Active" : "Inactive"}
              </Badge>

              <span className="text-xl font-bold text-emerald-600">
                ₹{customer.balance.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}

      <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50">
        <Button
          variant="ghost"
          className="h-9 rounded-none text-xs"
          onClick={() => router.push(`/customers/${customer.id}`)}
        >
          <Eye className="mr-1 h-3.5 w-3.5" />
          View
        </Button>

        <Button
          variant="ghost"
          className="h-9 rounded-none border-x border-slate-100 text-xs"
          onClick={() => router.push(`/customers/${customer.id}/edit`)}
        >
          <Pencil className="mr-1 h-3.5 w-3.5 text-blue-600" />
          Edit
        </Button>

        <Button
          variant="ghost"
          className="h-9 rounded-none text-xs text-red-600 hover:text-red-700"
          onClick={() => onDelete(customer)}
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
