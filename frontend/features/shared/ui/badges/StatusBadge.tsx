"use client";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type Status =
  | "Paid"
  | "Pending"
  | "Cancelled"
  | "Completed"
  | "Active"
  | "Inactive";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const STATUS_STYLES = {
  Paid: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },

  Pending: {
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },

  Cancelled: {
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },

  Completed: {
    icon: CheckCircle2,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },

  Active: {
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-200",
  },

  Inactive: {
    icon: XCircle,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
} as const;

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_STYLES[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        config.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
