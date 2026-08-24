"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Hash,
  Receipt,
  ShoppingCart,
  Tags,
  Users,
  WalletCards,
} from "lucide-react";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";

import {
  numberSeriesSettingsService,
  type NumberingSettings,
} from "../services/number-series-settings.service";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface StartingNumbers {
  product: string;
  customer: string;
  supplier: string;
  purchase: string;
  sale: string;
  expense: string;
}

/* -------------------------------------------------------------------------- */
/* Default Values                                                             */
/* -------------------------------------------------------------------------- */

const DEFAULT_NUMBERING: NumberingSettings = {
  product: "PRD",
  customer: "CUS",
  supplier: "SUP",
  purchase: "PUR",
  sale: "SAL",
  expense: "EXP",
};

const DEFAULT_STARTING_NUMBERS: StartingNumbers = {
  product: "0001",
  customer: "0001",
  supplier: "0001",
  purchase: "0001",
  sale: "0001",
  expense: "0001",
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function NumberSeriesPage() {
  const [autoGenerate, setAutoGenerate] = useState(true);

  const [numbering, setNumbering] =
    useState<NumberingSettings>(DEFAULT_NUMBERING);

  const [startingNumbers, setStartingNumbers] = useState<StartingNumbers>(
    DEFAULT_STARTING_NUMBERS,
  );

  const [loading, setLoading] = useState(true);
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

      const data = await numberSeriesSettingsService.getSettings();

      setNumbering(data);
    } catch (error) {
      console.error("Failed to load number series settings:", error);

      setError("Failed to load number series settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  /* ---------------------------------------------------------------------- */
  /* Update Prefix                                                          */
  /* ---------------------------------------------------------------------- */

  const updatePrefix = (field: keyof NumberingSettings, value: string) => {
    setNumbering((current) => ({
      ...current,
      [field]: value.toUpperCase(),
    }));

    setSaved(false);
  };

  /* ---------------------------------------------------------------------- */
  /* Update Starting Number                                                */
  /* ---------------------------------------------------------------------- */

  const updateStartingNumber = (
    field: keyof StartingNumbers,
    value: string,
  ) => {
    const cleanedValue = value.replace(/\D/g, "");

    setStartingNumbers((current) => ({
      ...current,
      [field]: cleanedValue,
    }));

    setSaved(false);
  };

  /* ---------------------------------------------------------------------- */
  /* Format Preview Number                                                  */
  /* ---------------------------------------------------------------------- */

  const getPreviewNumber = (prefix: string, startingNumber: string) => {
    const normalizedPrefix = prefix.trim().toUpperCase();

    const number = startingNumber.trim() || "0001";

    return `${normalizedPrefix}-${number.padStart(4, "0")}`;
  };

  /* ---------------------------------------------------------------------- */
  /* Save                                                                    */
  /* ---------------------------------------------------------------------- */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const payload: NumberingSettings = {
        product: numbering.product.trim().toUpperCase(),
        customer: numbering.customer.trim().toUpperCase(),
        supplier: numbering.supplier.trim().toUpperCase(),
        purchase: numbering.purchase.trim().toUpperCase(),
        sale: numbering.sale.trim().toUpperCase(),
        expense: numbering.expense.trim().toUpperCase(),
      };

      const updated = await numberSeriesSettingsService.updateSettings(payload);

      setNumbering(updated);

      setSaved(true);
    } catch (error) {
      console.error("Failed to save number series settings:", error);

      setError("Failed to save number series settings.");
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
        title="Number Series"
        description="Configure automatic numbering for business documents."
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading number series...
          </p>
        </div>
      </SettingsFormLayout>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Preview Values                                                          */
  /* ---------------------------------------------------------------------- */

  const previewItems = [
    {
      key: "sale",
      title: "Sale",
      value: getPreviewNumber(numbering.sale, startingNumbers.sale),
      icon: Receipt,
      color: "blue" as const,
    },
    {
      key: "purchase",
      title: "Purchase",
      value: getPreviewNumber(numbering.purchase, startingNumbers.purchase),
      icon: ShoppingCart,
      color: "orange" as const,
    },
    {
      key: "product",
      title: "Product",
      value: getPreviewNumber(numbering.product, startingNumbers.product),
      icon: Tags,
      color: "emerald" as const,
    },
    {
      key: "customer",
      title: "Customer",
      value: getPreviewNumber(numbering.customer, startingNumbers.customer),
      icon: Users,
      color: "violet" as const,
    },
    {
      key: "supplier",
      title: "Supplier",
      value: getPreviewNumber(numbering.supplier, startingNumbers.supplier),
      icon: FileText,
      color: "amber" as const,
    },
    {
      key: "expense",
      title: "Expense",
      value: getPreviewNumber(numbering.expense, startingNumbers.expense),
      icon: WalletCards,
      color: "rose" as const,
    },
  ];

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <SettingsFormLayout
      title="Number Series"
      description="Configure automatic numbering for business documents."
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
              <Hash className="h-8 w-8 text-indigo-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Document Number Series</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Automatically generate unique numbers for sales, purchases,
                customers, suppliers and other business records.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  Auto Numbering
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Prefix
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Live Preview
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
            Number series saved successfully.
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Live Preview                                                      */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Live Preview"
          description="See how your document numbers will look with the current prefix and starting number."
          icon={Hash}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {previewItems.map((item) => (
              <PreviewCard
                key={item.key}
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}
              />
            ))}
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Automatic Number Generation                                      */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Automatic Number Generation"
          description="Generate unique document numbers automatically."
          icon={Hash}
        >
          <SettingSwitch
            title="Enable Auto Numbering"
            description="Automatically generate numbers for every new record."
            checked={autoGenerate}
            onCheckedChange={setAutoGenerate}
          />
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Document Prefix                                                   */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Document Prefix"
          description="Configure prefixes for every business module."
          icon={Hash}
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SettingsInput
              label="Sale"
              value={numbering.sale}
              onChange={(event) => updatePrefix("sale", event.target.value)}
            />

            <SettingsInput
              label="Purchase"
              value={numbering.purchase}
              onChange={(event) => updatePrefix("purchase", event.target.value)}
            />

            <SettingsInput
              label="Product"
              value={numbering.product}
              onChange={(event) => updatePrefix("product", event.target.value)}
            />

            <SettingsInput
              label="Customer"
              value={numbering.customer}
              onChange={(event) => updatePrefix("customer", event.target.value)}
            />

            <SettingsInput
              label="Supplier"
              value={numbering.supplier}
              onChange={(event) => updatePrefix("supplier", event.target.value)}
            />

            <SettingsInput
              label="Expense"
              value={numbering.expense}
              onChange={(event) => updatePrefix("expense", event.target.value)}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Starting Number                                                   */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Starting Number"
          description="Set the first number for every document series."
          icon={Hash}
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SettingsInput
              label="Sale"
              type="number"
              value={startingNumbers.sale}
              onChange={(event) =>
                updateStartingNumber("sale", event.target.value)
              }
            />

            <SettingsInput
              label="Purchase"
              type="number"
              value={startingNumbers.purchase}
              onChange={(event) =>
                updateStartingNumber("purchase", event.target.value)
              }
            />

            <SettingsInput
              label="Product"
              type="number"
              value={startingNumbers.product}
              onChange={(event) =>
                updateStartingNumber("product", event.target.value)
              }
            />

            <SettingsInput
              label="Customer"
              type="number"
              value={startingNumbers.customer}
              onChange={(event) =>
                updateStartingNumber("customer", event.target.value)
              }
            />

            <SettingsInput
              label="Supplier"
              type="number"
              value={startingNumbers.supplier}
              onChange={(event) =>
                updateStartingNumber("supplier", event.target.value)
              }
            />

            <SettingsInput
              label="Expense"
              type="number"
              value={startingNumbers.expense}
              onChange={(event) =>
                updateStartingNumber("expense", event.target.value)
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
/* Preview Card                                                               */
/* -------------------------------------------------------------------------- */

interface PreviewCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: "blue" | "emerald" | "orange" | "violet" | "amber" | "rose";
}

function PreviewCard({ title, value, icon: Icon, color }: PreviewCardProps) {
  const styles = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
    },

    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },

    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
    },

    violet: {
      bg: "bg-violet-100",
      text: "text-violet-600",
    },

    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
    },

    rose: {
      bg: "bg-rose-100",
      text: "text-rose-600",
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

      <h3 className="mt-1 text-2xl font-bold tracking-wide">{value}</h3>
    </div>
  );
}
