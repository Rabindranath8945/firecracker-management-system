"use client";

import {
  ArrowRight,
  ChartColumn,
  PackagePlus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import QuickActionCard from "./QuickActionCard";

export default function QuickActions() {
  const actions = [
    {
      title: "New Sale",
      description: "Create a sales invoice",
      href: "/sales/new",
      icon: ShoppingCart,
      color: "emerald" as const,
    },
    {
      title: "Purchase",
      description: "Receive new stock",
      href: "/purchases/new",
      icon: PackagePlus,
      color: "sky" as const,
    },
    {
      title: "Add Product",
      description: "Create inventory item",
      href: "/products/new",
      icon: Plus,
      color: "violet" as const,
    },
    {
      title: "Reports",
      description: "Business analytics",
      href: "/reports",
      icon: ChartColumn,
      color: "amber" as const,
    },
  ];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>

        <p className="mt-1 text-sm text-slate-500">Frequently used shortcuts</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {actions.map((action) => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            href={action.href}
            icon={action.icon}
            color={action.color}
          />
        ))}
      </div>
    </section>
  );
}
