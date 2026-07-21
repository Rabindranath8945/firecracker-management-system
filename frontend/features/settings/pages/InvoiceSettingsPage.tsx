"use client";

import { useState } from "react";
import { FileText, Eye, Hash, Printer } from "lucide-react";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";

export default function InvoiceSettingsPage() {
  const [showLogo, setShowLogo] = useState(true);
  const [showGST, setShowGST] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  return (
    <SettingsFormLayout
      title="Invoice Settings"
      description="Configure invoice numbering, printing and appearance."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100">
              <FileText className="h-8 w-8 text-sky-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Invoice Configuration</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Customize invoice numbering, printing and invoice layout for
                your business.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Numbering
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Appearance
                </span>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                  Printing
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
            icon={Hash}
            title="Invoice Prefix"
            value="INV"
            color="blue"
          />

          <SummaryCard
            icon={Printer}
            title="Paper Size"
            value="A4"
            color="emerald"
          />

          <SummaryCard
            icon={Eye}
            title="Preview"
            value="Ready"
            color="orange"
          />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Numbering */}
        {/* ------------------------------------------------------------- */}

        <SettingsSection
          title="Invoice Numbering"
          description="Configure invoice numbering."
          icon={Hash}
        >
          <div className="grid gap-5 md:grid-cols-3">
            <SettingsInput label="Sales Prefix" defaultValue="INV" />

            <SettingsInput label="Purchase Prefix" defaultValue="PUR" />

            <SettingsInput
              label="Starting Number"
              defaultValue="1001"
              type="number"
            />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------- */}
        {/* Appearance */}
        {/* ------------------------------------------------------------- */}

        <SettingsSection
          title="Invoice Appearance"
          description="Customize invoice information."
          icon={FileText}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Show Business Logo"
              description="Display company logo on invoice."
              checked={showLogo}
              onCheckedChange={setShowLogo}
            />

            <SettingSwitch
              title="Show GST Number"
              description="Print GST number on invoice."
              checked={showGST}
              onCheckedChange={setShowGST}
            />

            <SettingSwitch
              title="Show Signature"
              description="Display authorized signature."
              checked={showSignature}
              onCheckedChange={setShowSignature}
            />

            <SettingSwitch
              title="Show Footer Message"
              description="Display thank you message."
              checked={showFooter}
              onCheckedChange={setShowFooter}
            />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------- */}
        {/* Printing */}
        {/* ------------------------------------------------------------- */}

        <SettingsSection
          title="Printing"
          description="Configure printing preferences."
          icon={Printer}
        >
          <div className="grid gap-5 md:grid-cols-3">
            <SettingsInput label="Paper Size" defaultValue="A4" />

            <SettingsInput
              label="Default Copies"
              defaultValue="1"
              type="number"
            />

            <SettingsInput label="Invoice Title" defaultValue="TAX INVOICE" />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------- */}
        {/* Preview */}
        {/* ------------------------------------------------------------- */}

        <SettingsSection
          title="Invoice Preview"
          description="Current invoice configuration."
          icon={Eye}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <PreviewCard title="Sales Invoice" value="INV-1001" />

            <PreviewCard title="Purchase" value="PUR-1001" />

            <PreviewCard title="Paper Size" value="A4" />

            <PreviewCard title="Copies" value="1 Copy" />
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

      <p className="mt-3 text-lg font-semibold">{value}</p>
    </div>
  );
}
