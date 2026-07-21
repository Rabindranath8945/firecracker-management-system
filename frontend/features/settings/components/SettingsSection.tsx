"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
      {/* Header */}

      <div className="flex items-start justify-between border-b bg-gradient-to-r from-slate-50 to-white px-6 py-5">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
              <Icon className="h-6 w-6" />
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        <ChevronRight className="mt-1 h-5 w-5 text-slate-300" />
      </div>

      {/* Body */}

      <CardContent className="bg-white p-6">{children}</CardContent>
    </Card>
  );
}
