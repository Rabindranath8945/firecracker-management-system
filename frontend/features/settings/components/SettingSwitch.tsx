"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingSwitchProps {
  title: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function SettingSwitch({
  title,
  description,
  checked,
  onCheckedChange,
}: SettingSwitchProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-card p-4 transition hover:border-primary/30 hover:shadow-sm">
      <div className="space-y-1">
        <Label className="text-sm font-semibold">{title}</Label>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
