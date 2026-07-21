"use client";

import { useMemo, useState } from "react";
import { Download, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import PageHeader from "@/features/shared/ui/layout/PageHeader";

import SettingsList from "../components/SettingsList";
import SettingsOverview from "../components/SettingsOverview";
import SettingsSearch from "../components/SettingsSearch";

export default function SettingsPage() {
  const [search, setSearch] = useState("");

  const totalSettings = useMemo(() => 9, []);

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your business profile, invoices, security, application preferences and system configuration."
        action={
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Backup
          </Button>
        }
      />

      <SettingsOverview />

      <SettingsSearch value={search} onChange={setSearch} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Configuration</h2>

            <p className="text-sm text-muted-foreground">
              {totalSettings} settings available
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Settings2 className="h-5 w-5" />
          </div>
        </div>

        <SettingsList search={search} />
      </div>
    </PageContainer>
  );
}
