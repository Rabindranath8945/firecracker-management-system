"use client";

import { useState } from "react";
import { Globe, MonitorSmartphone, Palette, Settings2 } from "lucide-react";

import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "../constants/settings-options";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";
import SettingsSelect from "../components/SettingsSelect";
import SettingSwitch from "../components/SettingSwitch";

/* -------------------------------------------------------------------------- */
/* Options                                                                    */
/* -------------------------------------------------------------------------- */

const FONT_SIZE_OPTIONS = [
  {
    label: "Small",
    value: "SMALL",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "Large",
    value: "LARGE",
  },
];

const DATE_FORMAT_OPTIONS = [
  {
    label: "DD/MM/YYYY",
    value: "DD/MM/YYYY",
  },
  {
    label: "MM/DD/YYYY",
    value: "MM/DD/YYYY",
  },
  {
    label: "YYYY-MM-DD",
    value: "YYYY-MM-DD",
  },
];

const DECIMAL_OPTIONS = [
  {
    label: "0 Decimal Places",
    value: "0",
  },
  {
    label: "1 Decimal Place",
    value: "1",
  },
  {
    label: "2 Decimal Places",
    value: "2",
  },
  {
    label: "3 Decimal Places",
    value: "3",
  },
  {
    label: "4 Decimal Places",
    value: "4",
  },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AppPreferencesPage() {
  const [language, setLanguage] = useState("ENGLISH");

  const [theme, setTheme] = useState("LIGHT");

  const [fontSize, setFontSize] = useState("MEDIUM");

  const [compactMode, setCompactMode] = useState(false);

  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const [decimalPlaces, setDecimalPlaces] = useState("2");

  return (
    <SettingsFormLayout
      title="Application Preferences"
      description="Customize the look, language and behavior of your Business OS."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Header Card                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
              <Settings2 className="h-8 w-8 text-blue-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Application Preferences</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Personalize your Business OS experience by choosing your
                preferred language, appearance and system behavior.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Appearance
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Language
                </span>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                  System
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Appearance                                                       */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Appearance"
          description="Customize the visual appearance of the application."
          icon={Palette}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsSelect
              label="Theme"
              value={theme}
              onChange={setTheme}
              options={THEME_OPTIONS}
            />

            <SettingsSelect
              label="Font Size"
              value={fontSize}
              onChange={setFontSize}
              options={FONT_SIZE_OPTIONS}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Regional Settings                                                */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Regional Settings"
          description="Language and regional formatting preferences."
          icon={Globe}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsSelect
              label="Language"
              value={language}
              onChange={setLanguage}
              options={LANGUAGE_OPTIONS}
            />

            <SettingsSelect
              label="Date Format"
              value={dateFormat}
              onChange={setDateFormat}
              options={DATE_FORMAT_OPTIONS}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* System Settings                                                   */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="System Settings"
          description="Control how numbers and information are displayed."
          icon={Settings2}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsSelect
              label="Decimal Places"
              value={decimalPlaces}
              onChange={setDecimalPlaces}
              options={DECIMAL_OPTIONS}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Application Experience                                           */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Application Experience"
          description="Control the layout and information density."
          icon={MonitorSmartphone}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Compact Mode"
              description="Display more information with reduced spacing."
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Current Configuration                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-muted/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
              <Settings2 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">Current Configuration</h3>

              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <p>
                  Theme:{" "}
                  <span className="font-medium text-foreground">{theme}</span>
                </p>

                <p>
                  Font Size:{" "}
                  <span className="font-medium text-foreground">
                    {fontSize}
                  </span>
                </p>

                <p>
                  Language:{" "}
                  <span className="font-medium text-foreground">
                    {language}
                  </span>
                </p>

                <p>
                  Date Format:{" "}
                  <span className="font-medium text-foreground">
                    {dateFormat}
                  </span>
                </p>

                <p>
                  Decimal Places:{" "}
                  <span className="font-medium text-foreground">
                    {decimalPlaces}
                  </span>
                </p>

                <p>
                  Compact Mode:{" "}
                  <span className="font-medium text-foreground">
                    {compactMode ? "Enabled" : "Disabled"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsFormLayout>
  );
}
