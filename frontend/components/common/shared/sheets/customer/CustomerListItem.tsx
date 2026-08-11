"use client";

import { User, Phone, Wallet, Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { Customer } from "@/features/customers/types/customer";

interface CustomerListItemProps {
  customer: Customer;

  selected?: boolean;

  onSelect: (customer: Customer) => void;
}

export default function CustomerListItem({
  customer,
  selected = false,
  onSelect,
}: CustomerListItemProps) {
  const due = customer.openingBalance ?? 0;

  const hasDue = due > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(customer)}
      className={cn(
        `
          w-full
          rounded-3xl
          border
          bg-background
          p-4
          text-left
          transition-all
          duration-200
          hover:border-violet-300
          hover:shadow-lg
          active:scale-[0.99]
        `,
        selected && "border-violet-600 bg-violet-50",
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-violet-100
          "
        >
          <User className="h-6 w-6 text-violet-700" />
        </div>

        {/* Customer Info */}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate font-semibold">{customer.name}</h3>

            {selected && (
              <div
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-violet-600
                "
              >
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />

            <span>{customer.mobile || "No Mobile"}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs">
              <Wallet className="h-3.5 w-3.5 text-violet-600" />

              <span className="font-medium">
                Opening ₹{due.toLocaleString("en-IN")}
              </span>
            </div>

            <div
              className={cn(
                `
                  rounded-full
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                `,
                hasDue
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700",
              )}
            >
              {hasDue ? "Due" : "No Due"}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
