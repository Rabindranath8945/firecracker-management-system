"use client";

import { Flame, TrendingUp, Heart, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuickShortcutProps {
  value?: string;
  onChange?: (value: string) => void;
}

const SHORTCUTS = [
  {
    id: "frequent",
    label: "Frequently Sold",
    icon: Flame,
    active:
      "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-300",
  },
  {
    id: "best",
    label: "Best Selling",
    icon: TrendingUp,
    active:
      "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    id: "favorite",
    label: "Favourite",
    icon: Heart,
    active:
      "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-500/10 dark:text-pink-300",
  },
  {
    id: "new",
    label: "New Arrival",
    icon: Sparkles,
    active:
      "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300",
  },
];

export default function QuickShortcut({ value, onChange }: QuickShortcutProps) {
  return (
    <section className="overflow-x-auto no-scrollbar">
      <div className="flex gap-3 pb-1">
        {SHORTCUTS.map((item) => {
          const Icon = item.icon;

          const selected = value === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange?.(selected ? "" : item.id)}
              className={cn(
                "flex min-w-[145px] shrink-0 items-center justify-center gap-2 rounded-2xl border bg-card px-4 py-3 shadow-sm transition-all active:scale-95",
                selected ? item.active : "hover:bg-muted/50",
              )}
            >
              <Icon className="h-5 w-5" />

              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
