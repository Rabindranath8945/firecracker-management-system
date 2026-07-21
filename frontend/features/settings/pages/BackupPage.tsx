"use client";

import {
  CalendarClock,
  Database,
  Download,
  HardDriveUpload,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";

export default function BackupPage() {
  return (
    <SettingsFormLayout
      title="Backup & Restore"
      description="Protect your business data with secure backup and restore."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Header Card */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <Database className="h-8 w-8 text-emerald-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Backup & Restore</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Secure your business with automatic backups and restore your
                data whenever required.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Secure
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Automatic
                </span>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                  Restore Anytime
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Backup Status */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 md:grid-cols-3">
          <StatusCard
            title="Last Backup"
            value="Today"
            subtitle="09:45 AM"
            color="emerald"
          />

          <StatusCard
            title="Backup Size"
            value="18.4 MB"
            subtitle="Database"
            color="blue"
          />

          <StatusCard
            title="Backup Status"
            value="Healthy"
            subtitle="Everything is safe"
            color="violet"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Automatic Backup */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Automatic Backup"
          description="Keep your data protected automatically."
          icon={ShieldCheck}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Enable Automatic Backup"
              description="Create backups every day."
              checked
            />

            <SettingSwitch
              title="Backup Before Major Changes"
              description="Automatically create a restore point before import or bulk updates."
              checked
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Actions */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3">
                <Download className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold">Create Backup</h3>

                <p className="text-sm text-muted-foreground">
                  Download the latest database backup.
                </p>
              </div>
            </div>

            <Button className="w-full rounded-xl">
              <Download className="mr-2 h-4 w-4" />
              Create Backup
            </Button>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3">
                <HardDriveUpload className="h-6 w-6 text-orange-600" />
              </div>

              <div>
                <h3 className="font-semibold">Restore Backup</h3>

                <p className="text-sm text-muted-foreground">
                  Restore data from a backup file.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full rounded-xl">
              <HardDriveUpload className="mr-2 h-4 w-4" />
              Restore Backup
            </Button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Schedule */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Backup Schedule"
          description="Current automatic backup schedule."
          icon={CalendarClock}
        >
          <div className="rounded-2xl bg-muted/40 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Daily Backup</p>

                <p className="text-sm text-muted-foreground">
                  Every day at 09:00 PM
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                Active
              </span>
            </div>
          </div>
        </SettingsSection>
      </div>
    </SettingsFormLayout>
  );
}

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: "emerald" | "blue" | "violet";
}

function StatusCard({ title, value, subtitle, color }: StatusCardProps) {
  const colors = {
    emerald: "border-emerald-500 bg-emerald-50 text-emerald-700",
    blue: "border-blue-500 bg-blue-50 text-blue-700",
    violet: "border-violet-500 bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${colors[color]}`}
      >
        {title}
      </span>

      <h3 className="mt-4 text-2xl font-bold">{value}</h3>

      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
