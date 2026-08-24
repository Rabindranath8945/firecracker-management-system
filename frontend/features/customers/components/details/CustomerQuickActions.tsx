"use client";

import Link from "next/link";
import { MessageCircle, Pencil, Phone, ReceiptText } from "lucide-react";

interface CustomerQuickActionsProps {
  mobile: string;
  customerId: string;
}

export default function CustomerQuickActions({
  mobile,
  customerId,
}: CustomerQuickActionsProps) {
  const actions = [
    {
      title: "Call",
      href: `tel:${mobile}`,
      icon: Phone,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "WhatsApp",
      href: `https://wa.me/91${mobile}`,
      icon: MessageCircle,
      color: "bg-green-100 text-green-700",
      external: true,
    },
    {
      title: "New Sale",
      href: `/sales/new?customer=${customerId}`,
      icon: ReceiptText,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Edit",
      href: `/customers/${customerId}/edit`,
      icon: Pencil,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>

        <p className="text-sm text-slate-500">
          Perform common customer actions.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
            >
              <div
                className="
                  group
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <div
                  className={`
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    ${action.color}
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  `}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <p className="mt-3 text-center text-xs font-semibold text-slate-700">
                  {action.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
