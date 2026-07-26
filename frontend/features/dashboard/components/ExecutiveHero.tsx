"use client";

import { Building2, CalendarDays, User2 } from "lucide-react";

import AppCard from "@/components/layout/AppCard";

interface ExecutiveHeroProps {
  userName: string;
  businessName: string;
  businessId: string;
}

export default function ExecutiveHero({
  userName,
  businessName,
  businessId,
}: ExecutiveHeroProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <AppCard className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
      <div className="relative">
        {/* Top Accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600" />

        <div className="space-y-8 p-6">
          {/* Greeting */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">{greeting}</p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {businessName}
            </h1>

            <p className="text-xs text-slate-400">{businessId}</p>

            <p className="pt-3 text-sm text-slate-500">
              Welcome back. Here's what's happening today.
            </p>
          </div>

          {/* Information */}
          {/* <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="rounded-xl bg-sky-100 p-2">
                <Building2 className="h-5 w-5 text-sky-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Business ID</p>

                <p className="font-semibold text-slate-900">{businessId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="rounded-xl bg-sky-100 p-2">
                <User2 className="h-5 w-5 text-sky-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Owner</p>

                <p className="font-semibold text-slate-900">{userName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="rounded-xl bg-sky-100 p-2">
                <CalendarDays className="h-5 w-5 text-sky-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Today</p>

                <p className="font-semibold text-slate-900">{today}</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </AppCard>
  );
}
