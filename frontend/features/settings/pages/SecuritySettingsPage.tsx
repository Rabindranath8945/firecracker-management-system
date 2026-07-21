"use client";

import { useState } from "react";
import { KeyRound, Lock, ShieldCheck, Smartphone } from "lucide-react";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";

export default function SecuritySettingsPage() {
  const [screenLock, setScreenLock] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const [pinLock, setPinLock] = useState(true);
  const [hidePreview, setHidePreview] = useState(false);

  return (
    <SettingsFormLayout
      title="Users & Security"
      description="Manage authentication, security and access settings."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------------------ */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <ShieldCheck className="h-8 w-8 text-red-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Security Center</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Protect your Business OS with strong authentication, secure
                access and mobile protection.
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

        {/* ------------------------------------------------------------ */}
        {/* Overview */}
        {/* ------------------------------------------------------------ */}

        <div className="grid gap-4 md:grid-cols-3">
          <SecurityCard
            title="Security"
            value="High"
            subtitle="Protected"
            color="emerald"
          />

          <SecurityCard
            title="Authentication"
            value="Enabled"
            subtitle="Administrator"
            color="blue"
          />

          <SecurityCard
            title="Devices"
            value="1"
            subtitle="Trusted Device"
            color="orange"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Authentication */}
        {/* ------------------------------------------------------------ */}

        <SettingsSection
          title="Authentication"
          description="Manage administrator credentials."
          icon={KeyRound}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsInput
              label="Administrator Name"
              defaultValue="Administrator"
            />

            <SettingsInput
              label="Email Address"
              defaultValue="admin@example.com"
            />

            <SettingsInput label="Current Password" type="password" />

            <SettingsInput label="New Password" type="password" />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------ */}
        {/* Application Security */}
        {/* ------------------------------------------------------------ */}

        <SettingsSection
          title="Application Security"
          description="Protect access to your Business OS."
          icon={Lock}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Enable Screen Lock"
              description="Lock the application after inactivity."
              checked={screenLock}
              onCheckedChange={setScreenLock}
            />

            <SettingSwitch
              title="Enable Session Timeout"
              description="Automatically sign out inactive users."
              checked={sessionTimeout}
              onCheckedChange={setSessionTimeout}
            />

            <SettingSwitch
              title="Enable Biometric Login"
              description="Allow fingerprint or Face ID on supported devices."
              checked={biometric}
              onCheckedChange={setBiometric}
            />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------ */}
        {/* Mobile */}
        {/* ------------------------------------------------------------ */}

        <SettingsSection
          title="Mobile Security"
          description="Extra protection for mobile devices."
          icon={Smartphone}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Require PIN Before Opening"
              description="Ask for PIN whenever the application starts."
              checked={pinLock}
              onCheckedChange={setPinLock}
            />

            <SettingSwitch
              title="Hide Sensitive Information"
              description="Hide financial information in recent app previews."
              checked={hidePreview}
              onCheckedChange={setHidePreview}
            />
          </div>
        </SettingsSection>
      </div>
    </SettingsFormLayout>
  );
}

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
