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
    <div className="max-w-xl">
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder="Search settings..."
      />
    </div>
  );
}
