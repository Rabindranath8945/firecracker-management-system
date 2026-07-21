"use client";

import { useState } from "react";
import { FileText, Hash, Receipt, Tags } from "lucide-react";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";

export default function NumberSeriesPage() {
  const [autoGenerate, setAutoGenerate] = useState(true);

  return (
    <SettingsFormLayout
      title="Number Series"
      description="Configure automatic numbering for business documents."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Header */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
              <Hash className="h-8 w-8 text-indigo-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Document Number Series</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Automatically generate unique numbers for invoices, purchases,
                customers, suppliers and other business documents.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  Auto Numbering
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Prefix
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Preview
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Summary */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            icon={Receipt}
            title="Sales Invoice"
            value="INV-1001"
            color="blue"
          />

          <SummaryCard
            icon={Tags}
            title="Products"
            value="PRD-0001"
            color="emerald"
          />

          <SummaryCard
            icon={FileText}
            title="Purchase"
            value="PUR-1001"
            color="orange"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Auto Number */}
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
        {/* Prefix */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Document Prefix"
          description="Configure prefixes for every business module."
          icon={Hash}
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SettingsInput label="Sales Invoice" defaultValue="INV" />
            <SettingsInput label="Purchase" defaultValue="PUR" />
            <SettingsInput label="Product" defaultValue="PRD" />
            <SettingsInput label="Customer" defaultValue="CUS" />
            <SettingsInput label="Supplier" defaultValue="SUP" />
            <SettingsInput label="Expense" defaultValue="EXP" />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Starting Number */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Starting Number"
          description="Set the first number for every document series."
          icon={Hash}
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SettingsInput
              label="Sales Invoice"
              type="number"
              defaultValue="1001"
            />

            <SettingsInput label="Purchase" type="number" defaultValue="1001" />

            <SettingsInput label="Product" type="number" defaultValue="1" />

            <SettingsInput label="Customer" type="number" defaultValue="1" />

            <SettingsInput label="Supplier" type="number" defaultValue="1" />

            <SettingsInput label="Expense" type="number" defaultValue="1" />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Preview */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Preview"
          description="Example document numbers after applying your settings."
          icon={Hash}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <PreviewCard title="Sales Invoice" value="INV-1001" />
            <PreviewCard title="Purchase" value="PUR-1001" />
            <PreviewCard title="Product" value="PRD-0001" />
            <PreviewCard title="Customer" value="CUS-0001" />
            <PreviewCard title="Supplier" value="SUP-0001" />
            <PreviewCard title="Expense" value="EXP-0001" />
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
  color: "blue" | "emerald" | "orange";
}

function SummaryCard({ icon: Icon, title, value, color }: SummaryCardProps) {
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

      <p className="mt-3 text-lg font-semibold tracking-wide">{value}</p>
    </div>
  );
}
