"use client";

import { useState } from "react";
import { BadgePercent, Building2, Landmark, Receipt } from "lucide-react";

import { CURRENCY_OPTIONS, GST_OPTIONS } from "../constants/settings-options";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";
import SettingsSection from "../components/SettingsSection";
import SettingsSelect from "../components/SettingsSelect";
import SettingSwitch from "../components/SettingSwitch";

export default function TaxSettingsPage() {
  const [currency, setCurrency] = useState("INR");
  const [gstRate, setGstRate] = useState("18");
  const [enableGST, setEnableGST] = useState(true);

  return (
    <SettingsFormLayout
      title="Tax & GST"
      description="Manage GST, taxation and business registration."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <Landmark className="h-8 w-8 text-green-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Tax & GST Configuration</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Configure GST rates, business tax information and currency
                preferences for your Business OS.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  GST
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Currency
                </span>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                  Registration
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Summary */}
        {/* ------------------------------------------------------------- */}

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            icon={BadgePercent}
            title="GST Rate"
            value={`${gstRate}%`}
            color="green"
          />

          <SummaryCard
            icon={Receipt}
            title="Currency"
            value={currency}
            color="blue"
          />

          <SummaryCard
            icon={Building2}
            title="Business"
            value="Registered"
            color="orange"
          />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* GST */}
        {/* ------------------------------------------------------------- */}

        <SettingsSection
          title="GST Configuration"
          description="Configure GST settings for sales and purchases."
          icon={BadgePercent}
        >
          <div className="space-y-5">
            <SettingSwitch
              title="Enable GST"
              description="Apply GST to all purchase and sales transactions."
              checked={enableGST}
              onCheckedChange={setEnableGST}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <SettingsSelect
                label="Default GST Rate"
                value={gstRate}
                onChange={setGstRate}
                options={GST_OPTIONS}
              />

              <SettingsSelect
                label="Currency"
                value={currency}
                onChange={setCurrency}
                options={CURRENCY_OPTIONS}
              />
            </div>
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------- */}
        {/* Business Details */}
        {/* ------------------------------------------------------------- */}

        <SettingsSection
          title="Business Registration"
          description="Government registration and tax information."
          icon={Landmark}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsInput label="GST Number" placeholder="22AAAAA0000A1Z5" />

            <SettingsInput label="PAN Number" placeholder="ABCDE1234F" />

            <SettingsInput label="Business Type" placeholder="Proprietorship" />

            <SettingsInput label="State Code" placeholder="19" />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------- */}
        {/* Preview */}
        {/* ------------------------------------------------------------- */}

        <SettingsSection
          title="Current Tax Summary"
          description="Review your current tax configuration."
          icon={Receipt}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <PreviewCard
              title="GST Status"
              value={enableGST ? "Enabled" : "Disabled"}
            />

            <PreviewCard title="Default GST" value={`${gstRate}%`} />

            <PreviewCard title="Currency" value={currency} />

            <PreviewCard title="Business Type" value="Proprietorship" />
          </div>
        </SettingsSection>
      </div>
    </SettingsFormLayout>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: "green" | "blue" | "orange";
}

function SummaryCard({ icon: Icon, title, value, color }: SummaryCardProps) {
  const styles = {
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles[color].bg}`}
      >
        <Icon className={`h-6 w-6 ${styles[color].text}`} />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{title}</p>

      <h3 className="mt-1 text-xl font-bold">{value}</h3>
    </div>
  );
}

interface PreviewCardProps {
  title: string;
  value: string;
}

function PreviewCard({ title, value }: PreviewCardProps) {
  return (
    <div className="rounded-2xl border bg-muted/40 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-background">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </p>

      <p className="mt-3 text-lg font-semibold">{value}</p>
    </div>
  );
}
