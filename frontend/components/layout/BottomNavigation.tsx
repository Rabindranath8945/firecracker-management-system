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
    label: "Purchase",
    href: "/purchases",
    icon: ChartColumn,
  },
  {
    label: "More",
    href: "/more",
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
    <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex h-20 items-center justify-around rounded-3xl border border-slate-800 bg-slate-950/95 px-2 backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-1 justify-center"
              >
                <div
                  className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all duration-300 ${
                    active ? "bg-sky-600/15" : "hover:bg-slate-800/60"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                      active
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={`text-[11px] font-medium ${
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
