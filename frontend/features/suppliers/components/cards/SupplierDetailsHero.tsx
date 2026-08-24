"use client";

import { Building2, CalendarDays, Mail, MapPin, Phone } from "lucide-react";

import type { Supplier } from "../../types/supplier.type";

interface SupplierHeroProps {
  supplier: Supplier;
}

export default function SupplierDetailsHero({ supplier }: SupplierHeroProps) {
  const createdDate = supplier.createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(supplier.createdAt))
    : "-";

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <Building2 className="h-10 w-10 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                {supplier.supplierCode}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  supplier.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {supplier.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <h6 className="truncate text-lg font-bold text-white">
              {supplier.name}
            </h6>

            <p className="mt-2 text-sm text-indigo-100">
              Supplier Details & Business Information
            </p>
          </div>
        </div>
      </div>

      {/* Information */}

      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
            <Phone className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500">Mobile</p>
            <p className="font-semibold text-slate-900">
              {supplier.mobile || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
            <Mail className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="truncate font-semibold text-slate-900">
              {supplier.email || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="font-semibold text-slate-900">
              {supplier.city || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500">Supplier Since</p>
            <p className="font-semibold text-slate-900">{createdDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
