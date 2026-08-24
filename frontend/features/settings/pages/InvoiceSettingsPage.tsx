"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  FileText,
  Hash,
  Loader2,
  Printer,
} from "lucide-react";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";
import { invoiceSettingsService } from "../services/invoice-settings.service";

interface InvoiceSettings {
  prefix: string;
  nextNumber: number;
  footer: string;
  terms: string;
  showLogo: boolean;
  showGST: boolean;
  showCustomerMobile: boolean;
  showCustomerAddress: boolean;
}

const DEFAULT_SETTINGS: InvoiceSettings = {
  prefix: "INV",
  nextNumber: 1,
  footer: "",
  terms: "",
  showLogo: true,
  showGST: true,
  showCustomerMobile: true,
  showCustomerAddress: true,
};

export default function InvoiceSettingsPage() {
  const [settings, setSettings] = useState<InvoiceSettings>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* LOAD                                                                       */
  /* -------------------------------------------------------------------------- */

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await invoiceSettingsService.getSettings();

      setSettings({
        prefix: result.prefix ?? "INV",
        nextNumber: Math.max(1, Number(result.nextNumber ?? 1)),
        footer: result.footer ?? "",
        terms: result.terms ?? "",
        showLogo: Boolean(result.showLogo),
        showGST: Boolean(result.showGST),
        showCustomerMobile: Boolean(result.showCustomerMobile),
        showCustomerAddress: Boolean(result.showCustomerAddress),
      });
    } catch (err) {
      console.error("Failed to load invoice settings:", err);

      setError("Unable to load invoice settings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  /* -------------------------------------------------------------------------- */
  /* UPDATE                                                                     */
  /* -------------------------------------------------------------------------- */

  const updateField = <K extends keyof InvoiceSettings>(
    field: K,
    value: InvoiceSettings[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
    setError(null);
  };

  /* -------------------------------------------------------------------------- */
  /* SAVE                                                                       */
  /* -------------------------------------------------------------------------- */

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      await invoiceSettingsService.updateSettings(settings);

      setSaved(true);
    } catch (err) {
      console.error("Failed to save invoice settings:", err);

      setError("Unable to save invoice settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* PREVIEW NUMBER                                                             */
  /* -------------------------------------------------------------------------- */

  const invoiceNumber = useMemo(() => {
    const prefix = settings.prefix.trim().toUpperCase() || "INV";

    const number = Math.max(1, Number(settings.nextNumber) || 1);

    return `${prefix}-${number}`;
  }, [settings.prefix, settings.nextNumber]);

  /* -------------------------------------------------------------------------- */
  /* LOADING                                                                    */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <SettingsFormLayout
        title="Invoice Settings"
        description="Configure invoice numbering, printing and appearance."
      >
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Loading invoice settings...
          </div>
        </div>
      </SettingsFormLayout>
    );
  }

  return (
    <SettingsFormLayout
      title="Invoice Settings"
      description="Configure invoice numbering, printing and appearance."
    >
      <div className="pb-10">
        {/* ================================================================== */}
        {/* MAIN SETTINGS SURFACE                                             */}
        {/* ================================================================== */}

        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
          {/* ---------------------------------------------------------------- */}
          {/* TOP HEADER                                                       */}
          {/* ---------------------------------------------------------------- */}

          <div className="border-b border-border/60 px-5 py-6 sm:px-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Invoice Configuration
                    </h2>

                    {saved && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Saved
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage numbering and the information shown on invoices.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* BODY                                                             */}
          {/* ---------------------------------------------------------------- */}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* ============================================================= */}
            {/* LEFT                                                           */}
            {/* ============================================================= */}

            <div className="min-w-0">
              {/* ----------------------------------------------------------- */}
              {/* NUMBERING                                                   */}
              {/* ----------------------------------------------------------- */}

              <SettingsSection
                title="Invoice Numbering"
                description="Control how new invoice numbers are generated."
                icon={Hash}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <SettingsInput
                    label="Invoice Prefix"
                    placeholder="INV"
                    value={settings.prefix}
                    onChange={(event) =>
                      updateField("prefix", event.target.value.toUpperCase())
                    }
                  />

                  <SettingsInput
                    label="Next Number"
                    type="number"
                    value={String(settings.nextNumber)}
                    onChange={(event) => {
                      const value = Number(event.target.value);

                      updateField(
                        "nextNumber",
                        Math.max(1, Number.isFinite(value) ? value : 1),
                      );
                    }}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Next invoice number
                    </p>

                    <p className="mt-1 font-mono text-sm font-semibold">
                      {invoiceNumber}
                    </p>
                  </div>

                  <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
              </SettingsSection>

              {/* ----------------------------------------------------------- */}
              {/* INFORMATION                                                 */}
              {/* ----------------------------------------------------------- */}

              <SettingsSection
                title="Invoice Information"
                description="Choose what customers can see on the invoice."
                icon={FileText}
              >
                <div className="divide-y divide-border/50">
                  <SettingSwitch
                    title="Business Logo"
                    description="Show your business logo on the invoice."
                    checked={settings.showLogo}
                    onCheckedChange={(checked) =>
                      updateField("showLogo", checked)
                    }
                  />

                  <SettingSwitch
                    title="GST Number"
                    description="Display your registered GST number."
                    checked={settings.showGST}
                    onCheckedChange={(checked) =>
                      updateField("showGST", checked)
                    }
                  />

                  <SettingSwitch
                    title="Customer Mobile"
                    description="Display the customer's mobile number."
                    checked={settings.showCustomerMobile}
                    onCheckedChange={(checked) =>
                      updateField("showCustomerMobile", checked)
                    }
                  />

                  <SettingSwitch
                    title="Customer Address"
                    description="Display the customer's billing address."
                    checked={settings.showCustomerAddress}
                    onCheckedChange={(checked) =>
                      updateField("showCustomerAddress", checked)
                    }
                  />
                </div>
              </SettingsSection>

              {/* ----------------------------------------------------------- */}
              {/* CONTENT                                                     */}
              {/* ----------------------------------------------------------- */}

              <SettingsSection
                title="Invoice Content"
                description="Add standard terms and a footer message."
                icon={Printer}
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="invoice-terms"
                      className="text-sm font-medium"
                    >
                      Terms & Conditions
                    </label>

                    <textarea
                      id="invoice-terms"
                      rows={4}
                      value={settings.terms}
                      onChange={(event) =>
                        updateField("terms", event.target.value)
                      }
                      placeholder="Enter your invoice terms and conditions..."
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="invoice-footer"
                      className="text-sm font-medium"
                    >
                      Footer Message
                    </label>

                    <textarea
                      id="invoice-footer"
                      rows={3}
                      value={settings.footer}
                      onChange={(event) =>
                        updateField("footer", event.target.value)
                      }
                      placeholder="Thank you for your business..."
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </SettingsSection>
            </div>

            {/* ============================================================= */}
            {/* PREVIEW                                                        */}
            {/* ============================================================= */}

            <div className="border-t border-border/60 bg-muted/20 p-5 lg:border-l lg:border-t-0 lg:p-6">
              <div className="sticky top-6">
                <div className="mb-4 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />

                  <div>
                    <p className="text-sm font-semibold">Invoice Preview</p>

                    <p className="text-xs text-muted-foreground">
                      Live preview
                    </p>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* INVOICE                                                    */}
                {/* ======================================================== */}

                <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                  {/* Invoice top */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div
                          className="mb-3 flex h-9 w-16 items-center justify-center rounded-lg bg-muted text-[9px] font-medium text-muted-foreground transition-opacity"
                          style={{
                            opacity: settings.showLogo ? 1 : 0.25,
                          }}
                        >
                          LOGO
                        </div>

                        <p className="text-sm font-semibold">TAX INVOICE</p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Mahendra Tech Solutions
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Invoice No.
                        </p>

                        <p className="mt-1 font-mono text-sm font-semibold text-primary">
                          {invoiceNumber}
                        </p>
                      </div>
                    </div>

                    {/* Customer */}

                    <div className="mt-6 rounded-xl bg-muted/40 p-3">
                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                        Bill To
                      </p>

                      <p className="mt-1 text-xs font-semibold">
                        Customer Name
                      </p>

                      {settings.showCustomerMobile && (
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          +91 XXXXX XXXXX
                        </p>
                      )}

                      {settings.showCustomerAddress && (
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Customer address
                        </p>
                      )}
                    </div>

                    {/* Items */}

                    <div className="mt-5 space-y-2">
                      <PreviewLine
                        label="Product / Service"
                        value="Amount"
                        strong
                      />

                      <PreviewLine label="Item example" value="₹1,000" />

                      <PreviewLine label="Item example" value="₹500" />
                    </div>

                    {/* GST */}

                    {settings.showGST && (
                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                        <span className="text-[10px] text-muted-foreground">
                          GST
                        </span>

                        <span className="text-[10px] font-medium">
                          Included
                        </span>
                      </div>
                    )}

                    {/* Total */}

                    <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-3 py-3">
                      <span className="text-xs font-semibold">Total</span>

                      <span className="text-sm font-bold text-primary">
                        ₹1,500
                      </span>
                    </div>
                  </div>

                  {/* Footer */}

                  {(settings.terms || settings.footer) && (
                    <div className="border-t border-border/60 bg-muted/20 px-5 py-4">
                      {settings.terms && (
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Terms
                          </p>

                          <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-muted-foreground">
                            {settings.terms}
                          </p>
                        </div>
                      )}

                      {settings.footer && (
                        <p className="mt-3 border-t border-dashed border-border/50 pt-3 text-center text-[9px] text-muted-foreground">
                          {settings.footer}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Preview status */}

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Changes are reflected instantly
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* BOTTOM ACTION                                                   */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex items-center justify-between border-t border-border/60 px-5 py-5 sm:px-7">
            <p className="hidden text-xs text-muted-foreground sm:block">
              Changes will apply to newly generated invoices.
            </p>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="ml-auto inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </SettingsFormLayout>
  );
}

/* -------------------------------------------------------------------------- */
/* PREVIEW LINE                                                               */
/* -------------------------------------------------------------------------- */

interface PreviewLineProps {
  label: string;
  value: string;
  strong?: boolean;
}

function PreviewLine({ label, value, strong = false }: PreviewLineProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-border/40 pb-2 text-[10px] ${
        strong ? "font-semibold text-foreground" : "text-muted-foreground"
      }`}
    >
      <span>{label}</span>

      <span>{value}</span>
    </div>
  );
}
