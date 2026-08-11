"use client";

import { ChevronRight, Pencil, Phone, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Customer } from "../../types/customer";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  customer: Customer;
  onDelete: (customer: Customer) => void;
}

export default function CustomerCard({ customer, onDelete }: Props) {
  const router = useRouter();

  const initials = customer.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="p-5">
        {/* Header */}

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-700">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="truncate text-lg font-semibold text-slate-900">
                  {customer.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {customer.customerCode}
                </p>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <Phone className="h-4 w-4" />

              <span>{customer.mobile}</span>
            </div>
          </div>
        </div>

        {/* Balance */}

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Outstanding</span>

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                customer.openingBalance > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              ₹{customer.openingBalance.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Actions */}

        <div className="mt-5 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => router.push(`/customers/${customer._id}`)}
          >
            <User className="mr-2 h-4 w-4" />
            View
          </Button>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => router.push(`/customers/${customer._id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={() => onDelete(customer)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
