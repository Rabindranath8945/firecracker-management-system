"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

import SettingsList from "../components/SettingsList";
import SettingsSearch from "../components/SettingsSearch";

export default function SettingsPage() {
  const [search, setSearch] = useState("");

  const totalSettings = useMemo(() => 9, []);

  return (
    <PageContainer className="space-y-7 pb-14">
      {/* ------------------------------------------------------------------ */}
      {/* HERO CARD                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)]">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-7 sm:px-8 sm:py-8">
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 left-1/2 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                  <Settings2 className="h-4 w-4 text-cyan-300" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Configuration
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Manage your business, application preferences, security and
                system configuration.
              </p>
            </div>

            <Button
              variant="outline"
              className="h-11 shrink-0 rounded-xl border-white/15 bg-white/5 px-4 text-white hover:bg-white/10 hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Backup
            </Button>
          </div>
        </div>

        {/* Status strip */}

        <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <StatusItem icon={CheckCircle2} title="Business" value="Configured" />

          <StatusItem icon={ShieldCheck} title="Security" value="Protected" />

          <StatusItem
            icon={SlidersHorizontal}
            title="Configuration"
            value={`${totalSettings} settings`}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CONFIGURATION HEADER CARD                                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_6px_24px_-18px_rgba(15,23,42,0.25)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Settings2 className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Configuration
                </h2>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  {totalSettings}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Choose a section to manage your system.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-[300px]">
            <SettingsSearch value={search} onChange={setSearch} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SETTINGS LIST                                                       */}
      {/* ------------------------------------------------------------------ */}

      <section>
        <SettingsList search={search} />
      </section>
    </PageContainer>
  );
}

/* -------------------------------------------------------------------------- */
/* STATUS ITEM                                                                */
/* -------------------------------------------------------------------------- */

interface StatusItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}

function StatusItem({ icon: Icon, title, value }: StatusItemProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        <Icon className="h-4 w-4 text-emerald-600" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{title}</p>

        <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
