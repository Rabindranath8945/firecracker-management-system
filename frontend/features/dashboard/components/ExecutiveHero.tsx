"use client";

import { Sparkles } from "lucide-react";

import type { DashboardSummary } from "../types/dashboard.type";

interface ExecutiveHeroProps {
  dashboard: DashboardSummary;
}

export default function ExecutiveHero({ dashboard }: ExecutiveHeroProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <section className="space-y-2 px-1 py-2">
      <div className="flex items-center gap-2 text-sky-600">
        <Sparkles className="h-5 w-5" />

        <span className="text-sm font-semibold tracking-wide">{greeting}</span>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-slate-900">
        Welcome back, {dashboard.owner.name}.
      </h2>

      <p className="max-w-sm text-sm leading-6 text-slate-500">
        Here's what's happening in your business today.
      </p>
    </section>
  );
}
