"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsInputProps {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
}

export default function SettingsInput({
  label,
  placeholder,
  defaultValue,
  type = "text",
}: SettingsInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}
