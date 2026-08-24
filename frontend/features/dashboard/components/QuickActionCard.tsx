"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import AppCard from "@/components/layout/AppCard";

const COLORS = {
  sky: {
    bg: "bg-sky-100",
    text: "text-sky-600",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
  },
} as const;

type ActionColor = keyof typeof COLORS;

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: ActionColor;
}

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  color,
}: QuickActionCardProps) {
  const styles = COLORS[color];

  return (
    <Link href={href}>
      <AppCard className="group h-full rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="flex items-start justify-between">
            <div className={`rounded-2xl ${styles.bg} p-4`}>
              <Icon className={`h-6 w-6 ${styles.text}`} />
            </div>

            <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </AppCard>
    </Link>
  );
}
