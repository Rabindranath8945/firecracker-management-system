"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, ChartColumn, Menu } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: ChartColumn,
  },
  {
    label: "More",
    href: "/settings",
    icon: Menu,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const hideBottomNav =
    pathname.endsWith("/new") ||
    pathname.endsWith("/edit") ||
    /^\/products\/[^/]+$/.test(pathname);

  if (hideBottomNav) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center border-t border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-[80px] w-full max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all ${
                active ? "text-red-600" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />

              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
