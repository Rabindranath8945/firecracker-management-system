"use client";

import { useCallback, useEffect, useState } from "react";
import { BadgePercent, Building2, Landmark, Receipt } from "lucide-react";

import { CURRENCY_OPTIONS, GST_OPTIONS } from "../constants/settings-options";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";
import SettingsSection from "../components/SettingsSection";
import SettingsSelect from "../components/SettingsSelect";
import SettingSwitch from "../components/SettingSwitch";

import {
  taxSettingsService,
  type TaxSettings,
} from "../services/tax-settings.service";

interface BusinessSettings {
  gstNo: string;
  panNo: string;
  businessType: string;
}

interface SettingsData {
  tax: TaxSettings;
  business: BusinessSettings;
}

export default function TaxSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [enableGST, setEnableGST] = useState(true);
  const [gstRate, setGstRate] = useState("18");
  const [taxType, setTaxType] = useState("EXCLUSIVE");
  const [currency, setCurrency] = useState("INR");

  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [businessType, setBusinessType] = useState("");

  /* ---------------------------------------------------------------------- */
  /* Load                                                                  */
  /* ---------------------------------------------------------------------- */

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data: SettingsData = await taxSettingsService.getSettings();

      setEnableGST(data.tax.enabled);
      setGstRate(String(data.tax.defaultGST));
      setTaxType(data.tax.taxType);
      setCurrency(data.tax.currency);

      setGstNumber(data.business.gstNo ?? "");
      setPanNumber(data.business.panNo ?? "");
      setBusinessType(data.business.businessType ?? "");
    } catch (err) {
      console.error("Failed to load tax settings:", err);

      setError("Unable to load tax settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  /* ---------------------------------------------------------------------- */
  /* Save                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const rate = Number(gstRate);

      if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
        setError("GST rate must be between 0 and 100.");
        return;
      }

      const updatedTax = await taxSettingsService.updateSettings({
        enabled: enableGST,
        defaultGST: rate,
        taxType,
        currency,
        currencySymbol: currency === "INR" ? "₹" : currency,
      });

      // Keep UI synchronized with backend response.
      setEnableGST(updatedTax.enabled);
      setGstRate(String(updatedTax.defaultGST));
      setTaxType(updatedTax.taxType);
      setCurrency(updatedTax.currency);

      setSuccess(true);

      window.setTimeout(() => {
        setSuccess(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to save tax settings:", err);

      setError("Unable to save tax settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <SettingsFormLayout
        title="Tax & GST"
        description="Manage GST, taxation and business registration."
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading tax settings...
          </p>
        </div>
      </SettingsFormLayout>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <SettingsFormLayout
      title="Tax & GST"
      description="Manage GST, taxation and business registration."
      onSave={handleSave}
    >
      <div className="space-y-6">
        {/* Header */}

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

        {/* Status */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Tax settings saved successfully.
          </div>
        )}

        {/* Summary */}

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
            value={businessType || "Configured"}
            color="orange"
          />
        </div>

        {/* GST */}

        <SettingsSection
          title="GST Configuration"
          description="Configure GST settings for sales and purchases."
          icon={BadgePercent}
        >
          <div className="space-y-5">
            <SettingSwitch
              title="Enable GST"
              description="Apply GST to purchase and sales transactions."
              checked={enableGST}
              onCheckedChange={setEnableGST}
            />

            <div className="grid gap-5 md:grid-cols-3">
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

              <SettingsSelect
                label="Tax Type"
                value={taxType}
                onChange={setTaxType}
                options={[
                  {
                    label: "Exclusive",
                    value: "EXCLUSIVE",
                  },
                  {
                    label: "Inclusive",
                    value: "INCLUSIVE",
                  },
                ]}
              />
            </div>
          </div>
        </SettingsSection>

        {/* Business */}

        <SettingsSection
          title="Business Registration"
          description="Government registration and tax information."
          icon={Landmark}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsInput
              label="GST Number"
              value={gstNumber}
              disabled
              placeholder="22AAAAA0000A1Z5"
            />

            <SettingsInput
              label="PAN Number"
              value={panNumber}
              disabled
              placeholder="ABCDE1234F"
            />

            <SettingsInput
              label="Business Type"
              value={businessType}
              disabled
              placeholder="Proprietorship"
            />

            <SettingsInput
              label="Currency Symbol"
              value={currency === "INR" ? "₹" : currency}
              disabled
              placeholder="₹"
            />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Business registration details are managed from Business Profile.
          </p>
        </SettingsSection>

        {/* Preview */}

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

            <PreviewCard
              title="Tax Type"
              value={taxType === "INCLUSIVE" ? "Inclusive" : "Exclusive"}
            />
          </div>
        </SettingsSection>

        {/* Save */}

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
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Preview Card                                                               */
/* -------------------------------------------------------------------------- */

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
