"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;

  gradient?: string;

  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient = "from-blue-600 to-cyan-500",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
            gradient,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
