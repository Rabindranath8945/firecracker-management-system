"use client";

import { ShieldCheck, UserCheck, UserCog, Users, UserX } from "lucide-react";

import type { UserStats as UserStatsType } from "../types/user.types";

interface UserStatsProps {
  stats: UserStatsType;
}

const cards = [
  {
    key: "total",
    title: "Total Users",
    icon: Users,
    className: "bg-sky-50 text-sky-600",
  },
  {
    key: "active",
    title: "Active",
    icon: UserCheck,
    className: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "inactive",
    title: "Inactive",
    icon: UserX,
    className: "bg-amber-50 text-amber-600",
  },
  {
    key: "managers",
    title: "Managers",
    icon: UserCog,
    className: "bg-violet-50 text-violet-600",
  },
  {
    key: "suspended",
    title: "Suspended",
    icon: ShieldCheck,
    className: "bg-red-50 text-red-600",
  },
] as const;

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        const value = stats[card.key];

        return (
          <div
            key={card.key}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.className}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <p className="mt-4 text-xs text-slate-500">{card.title}</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          </div>
        );
      })}
    </section>
  );
}
