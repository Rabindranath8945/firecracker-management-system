"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  Database,
  Download,
  HardDriveUpload,
  ShieldCheck,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface DataManagementSettings {
  allowImport: boolean;
  allowExport: boolean;
  backupEnabled: boolean;
}

/* -------------------------------------------------------------------------- */
/* Defaults                                                                   */
/* -------------------------------------------------------------------------- */

const DEFAULT_SETTINGS: DataManagementSettings = {
  allowImport: true,
  allowExport: true,
  backupEnabled: true,
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function BackupPage() {
  const [settings, setSettings] =
    useState<DataManagementSettings>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Load Settings                                                          */
  /* ---------------------------------------------------------------------- */

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Connect this to your existing Settings service.
       *
       * Expected backend data:
       *
       * data.dataManagement
       */

      // Example once your service is available:
      //
      // const data =
      //   await dataManagementSettingsService.getSettings();
      //
      // setSettings(data);

      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Failed to load backup settings:", error);

      setError("Failed to load backup settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  /* ---------------------------------------------------------------------- */
  /* Update Setting                                                         */
  /* ---------------------------------------------------------------------- */

  const updateSetting = (
    field: keyof DataManagementSettings,
    value: boolean,
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  };

  /* ---------------------------------------------------------------------- */
  /* Save                                                                    */
  /* ---------------------------------------------------------------------- */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const payload: DataManagementSettings = {
        allowImport: settings.allowImport,
        allowExport: settings.allowExport,
        backupEnabled: settings.backupEnabled,
      };

      /*
       * Connect this to your existing Settings service.
       *
       * Example:
       *
       * await dataManagementSettingsService.updateSettings(payload);
       */

      console.log("Data management settings:", payload);

      setSaved(true);
    } catch (error) {
      console.error("Failed to save backup settings:", error);

      setError("Failed to save backup settings.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <SettingsFormLayout
        title="Backup & Restore"
        description="Protect your business data with secure backup and restore."
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading backup settings...
          </p>
        </div>
      </SettingsFormLayout>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  const backupStatus = settings.backupEnabled ? "Enabled" : "Disabled";

  const dataProtectionStatus =
    settings.backupEnabled && settings.allowImport && settings.allowExport
      ? "High"
      : settings.backupEnabled
        ? "Good"
        : "Basic";

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <SettingsFormLayout
      title="Backup & Restore"
      description="Protect your business data with secure backup and restore."
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
              <Database className="h-8 w-8 text-emerald-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Backup & Restore</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Protect your business data and manage backup, import and export
                access.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Secure
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Data Protection
                </span>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                  Business Data
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Messages                                                          */}
        {/* ---------------------------------------------------------------- */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Backup settings saved successfully.
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Status                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 md:grid-cols-3">
          <StatusCard
            title="Backup"
            value={backupStatus}
            subtitle={
              settings.backupEnabled
                ? "Backup protection enabled"
                : "Backup protection disabled"
            }
            color="emerald"
          />

          <StatusCard
            title="Data Protection"
            value={dataProtectionStatus}
            subtitle="Current protection level"
            color="blue"
          />

          <StatusCard
            title="Export"
            value={settings.allowExport ? "Allowed" : "Blocked"}
            subtitle="Business data export"
            color="violet"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Backup Protection                                                 */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Backup Protection"
          description="Control whether backup protection is enabled for your business data."
          icon={ShieldCheck}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Enable Backup"
              description="Keep backup protection enabled for your business data."
              checked={settings.backupEnabled}
              onCheckedChange={(value) => updateSetting("backupEnabled", value)}
            />

            <div className="rounded-2xl border bg-muted/30 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <p className="font-semibold">Backup Protection</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {settings.backupEnabled
                      ? "Backup protection is currently enabled."
                      : "Backup protection is currently disabled."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Data Management                                                   */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Data Management"
          description="Control import and export access for business data."
          icon={Database}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Allow Data Import"
              description="Allow business data to be imported into the application."
              checked={settings.allowImport}
              onCheckedChange={(value) => updateSetting("allowImport", value)}
            />

            <SettingSwitch
              title="Allow Data Export"
              description="Allow business data to be exported from the application."
              checked={settings.allowExport}
              onCheckedChange={(value) => updateSetting("allowExport", value)}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Backup Actions                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Create Backup */}

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3">
                <Download className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold">Create Backup</h3>

                <p className="text-sm text-muted-foreground">
                  Create a backup of your business data.
                </p>
              </div>
            </div>

            <Button
              className="w-full rounded-xl"
              disabled={!settings.backupEnabled}
              onClick={() => {
                /*
                 * Backup API will be connected here.
                 */
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Create Backup
            </Button>

            {!settings.backupEnabled && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Enable backup protection to use this action.
              </p>
            )}
          </div>

          {/* Restore Backup */}

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3">
                <HardDriveUpload className="h-6 w-6 text-orange-600" />
              </div>

              <div>
                <h3 className="font-semibold">Restore Backup</h3>

                <p className="text-sm text-muted-foreground">
                  Restore your business data from a backup file.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl"
              disabled={!settings.backupEnabled}
              onClick={() => {
                /*
                 * Restore API will be connected here.
                 */
              }}
            >
              <HardDriveUpload className="mr-2 h-4 w-4" />
              Restore Backup
            </Button>

            {!settings.backupEnabled && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Enable backup protection to use this action.
              </p>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Import / Export Information                                       */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Import & Export"
          description="Current data transfer permissions."
          icon={Download}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <DataAccessCard
              icon={Upload}
              title="Import"
              value={settings.allowImport ? "Allowed" : "Disabled"}
              description={
                settings.allowImport
                  ? "Data import is currently available."
                  : "Data import is currently blocked."
              }
              enabled={settings.allowImport}
            />

            <DataAccessCard
              icon={Download}
              title="Export"
              value={settings.allowExport ? "Allowed" : "Disabled"}
              description={
                settings.allowExport
                  ? "Data export is currently available."
                  : "Data export is currently blocked."
              }
              enabled={settings.allowExport}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Backup Schedule Information                                      */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Backup Schedule"
          description="Automatic backup scheduling is not configured yet."
          icon={CalendarClock}
        >
          <div className="rounded-2xl border bg-muted/30 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
                <CalendarClock className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <p className="font-semibold">Schedule Not Configured</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Automatic backup scheduling can be added later when the
                  backend backup scheduler is implemented.
                </p>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Save                                                              */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex justify-end border-t pt-6">
          <Button
            type="button"
            onClick={() => {
              void handleSave();
            }}
            disabled={saving}
            className="rounded-xl px-6"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </SettingsFormLayout>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Card                                                                */
/* -------------------------------------------------------------------------- */

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: "emerald" | "blue" | "violet";
}

function StatusCard({ title, value, subtitle, color }: StatusCardProps) {
  const colors = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",

    blue: "border-blue-200 bg-blue-50 text-blue-700",

    violet: "border-violet-200 bg-violet-50 text-violet-700",
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

/* -------------------------------------------------------------------------- */
/* Data Access Card                                                           */
/* -------------------------------------------------------------------------- */

interface DataAccessCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  enabled: boolean;
}

function DataAccessCard({
  icon: Icon,
  title,
  value,
  description,
  enabled,
}: DataAccessCardProps) {
  return (
    <div className="rounded-2xl border bg-muted/30 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
          <Icon
            className={
              enabled
                ? "h-5 w-5 text-emerald-600"
                : "h-5 w-5 text-muted-foreground"
            }
          />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h3 className="mt-1 font-semibold">{value}</h3>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
