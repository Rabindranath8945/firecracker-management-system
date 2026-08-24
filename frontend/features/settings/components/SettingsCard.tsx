"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SettingCard as SettingCardType } from "../types/settings";

interface SettingCardProps {
  setting: SettingCardType;
}

const colorMap = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    hover: "group-hover:border-blue-200",
  },

  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    hover: "group-hover:border-emerald-200",
  },

  orange: {
    icon: "bg-orange-50 text-orange-600",
    hover: "group-hover:border-orange-200",
  },

  purple: {
    icon: "bg-purple-50 text-purple-600",
    hover: "group-hover:border-purple-200",
  },

  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    hover: "group-hover:border-cyan-200",
  },

  amber: {
    icon: "bg-amber-50 text-amber-600",
    hover: "group-hover:border-amber-200",
  },

  rose: {
    icon: "bg-rose-50 text-rose-600",
    hover: "group-hover:border-rose-200",
  },

  slate: {
    icon: "bg-slate-100 text-slate-600",
    hover: "group-hover:border-slate-300",
  },
} satisfies Record<
  SettingCardType["color"],
  {
    icon: string;
    hover: string;
  }
>;

export default function SettingCard({ setting }: SettingCardProps) {
  const Icon = setting.icon;
  const colors = colorMap[setting.color];

  return (
    <Link href={setting.href} className="block outline-none">
      <div
        className={cn(
          "group flex items-center gap-4",
          "rounded-[22px] border border-slate-200/80",
          "bg-white px-5 py-4 sm:px-6 sm:py-5",
          "shadow-[0_4px_18px_-14px_rgba(15,23,42,0.35)]",
          "transition-all duration-200",
          "hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-18px_rgba(15,23,42,0.35)]",
          "focus-visible:ring-2 focus-visible:ring-primary/30",
          colors.hover,
        )}
      >
        {/* Icon */}

        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center",
            "rounded-xl",
            colors.icon,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-[15px]">
            {setting.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500 sm:text-sm">
            {setting.description}
          </p>
        </div>

        {/* Arrow */}

        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center",
            "rounded-xl bg-slate-50 text-slate-400",
            "transition-all duration-200",
            "group-hover:bg-primary group-hover:text-white",
          )}
        >
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
