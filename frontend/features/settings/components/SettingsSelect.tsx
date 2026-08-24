"use client";

import { Label } from "@/components/ui/label";

import FilterSelect from "@/features/shared/ui/forms/FilterSelect";

interface Option {
  label: string;
  value: string;
}

interface SettingsSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  description?: string | undefined;
}

export default function SettingsSelect({
  label,
  value,
  onChange,
  options,
  description,
}: SettingsSelectProps) {
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-medium text-slate-700">{label}</Label>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        )}
      </div>

      <FilterSelect value={value} onChange={onChange} options={options} />
    </div>
  );
}
