"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconTextClass: string;
}

export default function QuickActionCard({
  title,
  subtitle,
  href,
  icon: Icon,
  iconBgClass,
  iconTextClass,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        "active:scale-95",
      )}
    >
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
          iconBgClass,
          iconTextClass,
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="font-semibold text-slate-900">{title}</h3>

      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </Link>
  );
}
