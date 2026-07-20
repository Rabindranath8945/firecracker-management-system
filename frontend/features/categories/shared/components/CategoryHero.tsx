"use client";

import { FolderTree, Layers3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface CategoryHeroProps {
  title: string;
  description: string;
  showParentCategory?: boolean;
}

export default function CategoryHero({
  title,
  description,
  showParentCategory = false,
}: CategoryHeroProps) {
  return (
    <Card className="overflow-hidden rounded-[30px] border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 shadow-xl">
      <CardContent className="relative overflow-hidden p-8">
        {/* Background Decoration */}

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute -bottom-16 left-0 h-44 w-44 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex items-center gap-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
            {showParentCategory ? (
              <Layers3 className="h-10 w-10 text-cyan-300" />
            ) : (
              <FolderTree className="h-10 w-10 text-cyan-300" />
            )}
          </div>

          <div className="flex-1">
            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Master Data
            </span>

            <h1 className="mt-4 text-3xl font-bold text-white">{title}</h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
