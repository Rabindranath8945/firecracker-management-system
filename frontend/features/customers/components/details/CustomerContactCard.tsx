"use client";

import {
  BadgeIndianRupee,
  Calendar,
  Mail,
  MapPin,
  Phone,
  CreditCard,
} from "lucide-react";

import type { Customer } from "../../types/customer";

interface CustomerContactCardProps {
  customer: Customer;
}

export default function CustomerContactCard({
  customer,
}: CustomerContactCardProps) {
  const createdDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(customer.createdAt));

  const items = [
    {
      icon: Phone,
      label: "Mobile Number",
      value: customer.mobile,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: Mail,
      label: "Email Address",
      value: customer.email || "-",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: MapPin,
      label: "Address",
      value: customer.address || customer.city || customer.state || "-",
      color: "bg-orange-100 text-orange-700",
    },
    {
      icon: BadgeIndianRupee,
      label: "Opening Balance",
      value: `₹${(customer.openingBalance ?? 0).toLocaleString("en-IN")}`,
      color: "bg-violet-100 text-violet-700",
    },
    {
      icon: CreditCard,
      label: "Credit Limit",
      value: `₹${(customer.creditLimit ?? 0).toLocaleString("en-IN")}`,
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      icon: Calendar,
      label: "Customer Since",
      value: createdDate,
      color: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customer profile and account details.
        </p>
      </div>

      <div className="space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 break-words text-[15px] font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
