"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SettingSwitchProps {
  title: string;
  description?: string | undefined;
  checked?: boolean | undefined;
  onCheckedChange?: (checked: boolean) => void;
}

export default function SettingSwitch({
  title,
  description,
  checked = false,
  onCheckedChange,
}: SettingSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-slate-100 py-4 last:border-b-0">
      <div className="min-w-0">
        <Label className="text-sm font-medium text-slate-800">{title}</Label>

        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </div>
  );
}
