"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SettingCard as SettingCardType } from "../types/settings";

interface SettingCardProps {
  setting: SettingCardType;
}

const colorMap = {
  blue: "from-blue-500 to-cyan-500",
  emerald: "from-emerald-500 to-green-500",
  orange: "from-orange-500 to-amber-500",
  purple: "from-violet-500 to-purple-500",
  cyan: "from-cyan-500 to-sky-500",
  amber: "from-amber-500 to-yellow-500",
  rose: "from-rose-500 to-pink-500",
  slate: "from-slate-600 to-slate-500",
};

export default function SettingCard({ setting }: SettingCardProps) {
  const Icon = setting.icon;

  return (
    <Link href={setting.href}>
      <Card
        className={cn(
          "group overflow-hidden rounded-3xl border bg-card transition-all duration-300",
          "hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl",
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            {/* Icon */}

            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                colorMap[setting.color],
              )}
            >
              <Icon className="h-7 w-7" />
            </div>

            {/* Content */}

            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold tracking-tight">
                {setting.title}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {setting.description}
              </p>
            </div>

            {/* Arrow */}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
