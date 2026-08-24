"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Lock, ShieldCheck, Smartphone, Users } from "lucide-react";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";
import SettingsInput from "../components/SettingsInput";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface SecuritySettings {
  googleLogin: boolean;
  trustedDevices: boolean;
  allowMultipleDevices: boolean;
}

/* -------------------------------------------------------------------------- */
/* Default Values                                                             */
/* -------------------------------------------------------------------------- */

const DEFAULT_SECURITY: SecuritySettings = {
  googleLogin: true,
  trustedDevices: true,
  allowMultipleDevices: true,
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SecuritySettingsPage() {
  const [security, setSecurity] = useState<SecuritySettings>(DEFAULT_SECURITY);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Load Settings                                                          */
  /* ---------------------------------------------------------------------- */

  const loadSettings = useCallback(async () => {
    /*
     * Security settings are currently displayed from the existing
     * backend-compatible structure.
     *
     * Connect this to your existing Settings service when the
     * security-settings service is available.
     */
    try {
      setLoading(true);
      setError("");

      /*
       * TODO:
       * const data = await securitySettingsService.getSettings();
       * setSecurity(data);
       */

      setSecurity(DEFAULT_SECURITY);
    } catch (error) {
      console.error("Failed to load security settings:", error);

      setError("Failed to load security settings.");
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

  const updateSecurity = (field: keyof SecuritySettings, value: boolean) => {
    setSecurity((current) => ({
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

      const payload: SecuritySettings = {
        googleLogin: security.googleLogin,
        trustedDevices: security.trustedDevices,
        allowMultipleDevices: security.allowMultipleDevices,
      };

      /*
       * TODO:
       * await securitySettingsService.updateSettings(payload);
       */

      console.log("Security settings:", payload);

      setSaved(true);
    } catch (error) {
      console.error("Failed to save security settings:", error);

      setError("Failed to save security settings.");
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
        title="Users & Security"
        description="Manage authentication, security and device access."
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading security settings...
          </p>
        </div>
      </SettingsFormLayout>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Security Status                                                         */
  /* ---------------------------------------------------------------------- */

  const enabledSecurityCount = [
    security.googleLogin,
    security.trustedDevices,
    security.allowMultipleDevices,
  ].filter(Boolean).length;

  const securityStatus =
    enabledSecurityCount === 3
      ? "High"
      : enabledSecurityCount === 2
        ? "Good"
        : enabledSecurityCount === 1
          ? "Basic"
          : "Low";

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <SettingsFormLayout
      title="Users & Security"
      description="Manage authentication, security and device access."
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-100">
              <ShieldCheck className="h-8 w-8 text-red-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Security Center</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Manage authentication, trusted devices and access protection for
                your Business OS.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Authentication
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Access Control
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Device Security
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Status                                                            */}
        {/* ---------------------------------------------------------------- */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Security settings saved successfully.
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Security Overview                                                 */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 md:grid-cols-3">
          <SecurityCard
            title="Security"
            value={securityStatus}
            subtitle={`${enabledSecurityCount}/3 protections enabled`}
            color="emerald"
          />

          <SecurityCard
            title="Authentication"
            value={security.googleLogin ? "Enabled" : "Disabled"}
            subtitle="Google authentication"
            color="blue"
          />

          <SecurityCard
            title="Devices"
            value={security.trustedDevices ? "Trusted" : "Open"}
            subtitle={
              security.allowMultipleDevices
                ? "Multiple devices allowed"
                : "Single device access"
            }
            color="orange"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Authentication                                                    */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Authentication"
          description="Configure how users authenticate with the application."
          icon={KeyRound}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Google Authentication"
              description="Allow users to authenticate using their Google account."
              checked={security.googleLogin}
              onCheckedChange={(value) => updateSecurity("googleLogin", value)}
            />

            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Current Authentication
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {security.googleLogin
                      ? "Google authentication is enabled."
                      : "Google authentication is disabled."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Device Security                                                   */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Device Security"
          description="Control trusted devices and application access."
          icon={Smartphone}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Trusted Devices"
              description="Allow authenticated devices to remain trusted."
              checked={security.trustedDevices}
              onCheckedChange={(value) =>
                updateSecurity("trustedDevices", value)
              }
            />

            <SettingSwitch
              title="Allow Multiple Devices"
              description="Allow the same account to access the application from multiple devices."
              checked={security.allowMultipleDevices}
              onCheckedChange={(value) =>
                updateSecurity("allowMultipleDevices", value)
              }
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Access Control                                                    */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Access Control"
          description="Review the current access policy for this business."
          icon={Lock}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AccessCard
              icon={Users}
              title="Device Access"
              value={
                security.allowMultipleDevices
                  ? "Multiple Devices"
                  : "Single Device"
              }
              description={
                security.allowMultipleDevices
                  ? "Multiple devices can access this account."
                  : "Only one device is allowed."
              }
            />

            <AccessCard
              icon={ShieldCheck}
              title="Trusted Access"
              value={security.trustedDevices ? "Enabled" : "Disabled"}
              description={
                security.trustedDevices
                  ? "Trusted device protection is active."
                  : "Trusted device protection is disabled."
              }
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Administrator Information                                        */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Security Information"
          description="Authentication information for the current application."
          icon={KeyRound}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsInput
              label="Authentication Method"
              value={
                security.googleLogin ? "Google Authentication" : "Disabled"
              }
            />

            <SettingsInput
              label="Device Policy"
              value={
                security.allowMultipleDevices
                  ? "Multiple Devices"
                  : "Single Device"
              }
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Save                                                              */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex justify-end border-t pt-6">
          <button
            type="button"
            onClick={() => {
              void handleSave();
            }}
            disabled={saving}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </SettingsFormLayout>
  );
}

/* -------------------------------------------------------------------------- */
/* Security Card                                                              */
/* -------------------------------------------------------------------------- */

interface SecurityCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: "emerald" | "blue" | "orange";
}

function SecurityCard({ title, value, subtitle, color }: SecurityCardProps) {
  const badge = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",

    blue: "bg-blue-50 border-blue-200 text-blue-700",

    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge[color]}`}
      >
        {title}
      </span>

      <h3 className="mt-4 text-2xl font-bold">{value}</h3>

      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Access Card                                                                */
/* -------------------------------------------------------------------------- */

interface AccessCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
}

function AccessCard({
  icon: Icon,
  title,
  value,
  description,
}: AccessCardProps) {
  return (
    <div className="rounded-2xl border bg-muted/30 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
          <Icon className="h-5 w-5 text-primary" />
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
