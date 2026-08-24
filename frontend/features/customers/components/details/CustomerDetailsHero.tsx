"use client";

import { CalendarDays, Mail, MapPin, Phone, UserCircle2 } from "lucide-react";

import type { Customer } from "../../types/customer";

interface CustomerDetailsHeroProps {
  customer: Customer;
}

export default function CustomerDetailsHero({
  customer,
}: CustomerDetailsHeroProps) {
  const createdDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(customer.createdAt));

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
            <UserCircle2 className="h-10 w-10 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                {customer.customerCode}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  customer.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {customer.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <h1 className="truncate text-3xl font-bold text-white">
              {customer.name}
            </h1>

            <p className="mt-2 text-sm text-emerald-50">
              Customer Details & Business Information
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
            <Phone className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500">Mobile</p>

            <p className="font-semibold text-slate-900">
              {customer.mobile || "-"}
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
              {customer.email || "-"}
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
              {customer.city || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500">Customer Since</p>

            <p className="font-semibold text-slate-900">{createdDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
