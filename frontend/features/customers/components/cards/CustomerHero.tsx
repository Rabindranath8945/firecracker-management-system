"use client";

import { BadgeCheck, Phone, Wallet } from "lucide-react";

import type { Customer } from "../../types/customer";

import { Badge } from "@/components/ui/badge";

interface CustomerHeroProps {
  customer: Customer;
}

export default function CustomerHero({ customer }: CustomerHeroProps) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/20 text-3xl font-bold ring-4 ring-white/10">
              {customer.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">{customer.name}</h1>

                <Badge
                  className={
                    customer.isActive
                      ? "border-0 bg-emerald-500"
                      : "border-0 bg-red-500"
                  }
                >
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                Customer ID • {customer.customerNo}
              </p>

              <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />

                  {customer.mobile}
                </div>

                {customer.type === "BOTH" && (
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    Customer & Supplier
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="text-left lg:text-right">
            <p className="text-sm text-slate-300">Outstanding Balance</p>

            <div className="mt-3 flex items-center gap-3 lg:justify-end">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
                <Wallet className="h-6 w-6 text-emerald-300" />
              </div>

              <h2 className="text-4xl font-black tracking-tight text-emerald-300">
                ₹{customer.balance.toLocaleString("en-IN")}
              </h2>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Opening Balance ₹{customer.openingBalance.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
