"use client";

import type { ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;

  icon: ReactNode;

  iconClassName?: string;

  className?: string;

  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClassName,
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-3xl",
        "border border-slate-200/80",
        "bg-white",
        "p-5",
        "shadow-sm",
        "transition-all duration-300",
        "hover:-translate-y-1",
        "hover:border-slate-300",
        "hover:shadow-xl",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {/* Background Glow */}

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100/70 blur-2xl transition-all duration-300 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-4">
        {/* Content */}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {/* Icon */}

        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110",
            iconClassName,
          )}
        >
          {icon}
        </div>
      </div>

      {/* Click Indicator */}

      {onClick && (
        <ChevronRight className="absolute bottom-4 right-4 h-4 w-4 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-500" />
      )}
    </div>
  );
}
