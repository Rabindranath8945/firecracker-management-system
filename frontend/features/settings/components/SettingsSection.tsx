"use client";

import type { LucideIcon } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: SettingsSectionProps) {
  return (
    <section className="border-b border-slate-200/80 px-5 py-7 last:border-b-0 sm:px-7 sm:py-8 lg:px-8">
      {/* ---------------------------------------------------------------- */}
      {/* SECTION HEADER                                                    */}
      {/* ---------------------------------------------------------------- */}

      <div className="mb-6 flex items-start gap-3.5">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-[18px] w-[18px]" />
          </div>
        )}

        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-[17px]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CONTENT                                                           */}
      {/* ---------------------------------------------------------------- */}

      <div className="max-w-5xl">{children}</div>
    </section>
  );
}
