"use client";

import {
  BadgeIndianRupee,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Wallet,
} from "lucide-react";

import type { Supplier } from "../../types/supplier.type";

interface Props {
  supplier: Supplier;
}

export default function SupplierContactCard({ supplier }: Props) {
  const createdDate = supplier.createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(supplier.createdAt))
    : "-";

  const openingBalance = Number(supplier.openingBalance ?? 0);

  // Temporary until Purchase/Accounts module
  const currentBalance = Number(supplier.openingBalance ?? 0);

  const items = [
    {
      icon: Phone,
      label: "Mobile",
      value: supplier.mobile || "-",
    },
    {
      icon: Mail,
      label: "Email",
      value: supplier.email || "-",
    },
    {
      icon: MapPin,
      label: "Address",
      value: supplier.address || "-",
    },
    {
      icon: BadgeIndianRupee,
      label: "Opening Balance",
      value: `₹${openingBalance.toLocaleString("en-IN")}`,
    },
    {
      icon: Wallet,
      label: "Current Balance",
      value: `₹${currentBalance.toLocaleString("en-IN")}`,
    },
    {
      icon: Calendar,
      label: "Supplier Since",
      value: createdDate,
    },
  ];

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Contact Information</h2>

        <p className="mt-1 text-sm text-slate-500">Supplier profile details</p>
      </div>

      <div className="space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Icon className="h-5 w-5 text-slate-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-500">{item.label}</p>

                <p className="break-words font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
