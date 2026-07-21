"use client";

import SearchInput from "@/features/shared/ui/forms/SearchInput";

interface SettingsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SettingsSearch({
  value,
  onChange,
}: SettingsSearchProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder="Search settings..."
      />
    </div>
  );
}
