"use client";

import { SETTINGS_CARDS } from "../constants/settings.constants";

import SettingCard from "./SettingsCard";

interface SettingsListProps {
  search: string;
}

export default function SettingsList({ search }: SettingsListProps) {
  const keyword = search.trim().toLowerCase();

  const settings = SETTINGS_CARDS.filter((item) => {
    if (!keyword) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  });

  if (settings.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto max-w-sm">
          <p className="text-sm font-semibold text-slate-800">
            No settings found
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            We couldn't find a setting matching your search. Try another
            keyword.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {settings.map((setting) => (
        <SettingCard key={setting.id} setting={setting} />
      ))}
    </div>
  );
}
