"use client";

import { useState } from "react";
import { Globe, MonitorSmartphone, Palette, Settings2 } from "lucide-react";

import {
  CURRENCY_OPTIONS,
  LANGUAGE_OPTIONS,
  THEME_OPTIONS,
} from "../constants/settings-options";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";
import SettingsSelect from "../components/SettingsSelect";
import SettingSwitch from "../components/SettingSwitch";

export default function AppPreferencesPage() {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("system");
  const [currency, setCurrency] = useState("INR");

  const [animations, setAnimations] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <SettingsFormLayout
      title="Application Preferences"
      description="Customize the look, language and behavior of your Business OS."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------------ */}
        {/* Header Card */}
        {/* ------------------------------------------------------------------ */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Settings2 className="h-8 w-8 text-blue-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Application Preferences</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Personalize your Business OS experience by choosing your
                preferred language, appearance and application behavior.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Theme
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Language
                </span>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                  Experience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Appearance */}
        {/* ------------------------------------------------------------------ */}

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
              label="Currency"
              value={currency}
              onChange={setCurrency}
              options={CURRENCY_OPTIONS}
            />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------------ */}
        {/* Language */}
        {/* ------------------------------------------------------------------ */}

        <SettingsSection
          title="Regional Settings"
          description="Language and localization preferences."
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
              label="Default Currency"
              value={currency}
              onChange={setCurrency}
              options={CURRENCY_OPTIONS}
            />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------------ */}
        {/* Experience */}
        {/* ------------------------------------------------------------------ */}

        <SettingsSection
          title="Application Experience"
          description="Control how the application behaves."
          icon={MonitorSmartphone}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Enable Animations"
              description="Use smooth transitions throughout the application."
              checked={animations}
              onCheckedChange={setAnimations}
            />

            <SettingSwitch
              title="Compact Mode"
              description="Display more information with reduced spacing."
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />

            <SettingSwitch
              title="Enable Sound Effects"
              description="Play sounds for important actions and alerts."
              checked={soundEffects}
              onCheckedChange={setSoundEffects}
            />
          </div>
        </SettingsSection>
      </div>
    </SettingsFormLayout>
  );
}
