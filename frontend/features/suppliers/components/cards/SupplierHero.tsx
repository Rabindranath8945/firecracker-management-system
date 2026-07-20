"use client";

import { Building2, Mail, Phone } from "lucide-react";

import type { Supplier } from "../../types/supplier";

import { Badge } from "@/components/ui/badge";

interface SupplierHeroProps {
  supplier: Supplier;
}

export default function SupplierHero({ supplier }: SupplierHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar */}

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-3xl font-bold backdrop-blur">
            {supplier.name.charAt(0).toUpperCase()}
          </div>

          {/* Details */}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {supplier.name}
              </h1>

              <Badge
                className={
                  supplier.isActive
                    ? "border-0 bg-emerald-500 text-white"
                    : "border-0 bg-red-500 text-white"
                }
              >
                {supplier.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {supplier.mobile}
              </div>

              {supplier.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {supplier.email}
                </div>
              )}

              {supplier.gstNo && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {supplier.gstNo}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Balance */}

        <div className="rounded-2xl bg-white/10 px-6 py-4 text-right backdrop-blur">
          <p className="text-sm text-slate-300">Outstanding Payable</p>

          <h2 className="mt-1 text-3xl font-bold">
            ₹{supplier.balance.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>
    </section>
  );
}
