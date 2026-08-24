"use client";

import Link from "next/link";
import {
  FileText,
  MessageCircle,
  Pencil,
  Phone,
  Receipt,
  Wallet,
} from "lucide-react";

interface Props {
  mobile: string;
  supplierId: string;
}

export default function SupplierQuickActions({ mobile, supplierId }: Props) {
  const actions = [
    {
      title: "Call",
      icon: Phone,
      href: `tel:${mobile}`,
      external: true,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/91${mobile}`,
      external: true,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Purchase",
      icon: Receipt,
      href: `/purchases/new?supplier=${supplierId}`,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Payment",
      icon: Wallet,
      href: `/payments/new?supplier=${supplierId}`, // Future module
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Statement",
      icon: FileText,
      href: `/reports/supplier/${supplierId}`, // Future module
      color: "bg-violet-100 text-violet-700",
    },
    {
      title: "Edit",
      icon: Pencil,
      href: `/suppliers/${supplierId}/edit`,
      color: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.title}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            className="group"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${action.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <p className="mt-4 text-center text-sm font-semibold text-slate-700">
                {action.title}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
