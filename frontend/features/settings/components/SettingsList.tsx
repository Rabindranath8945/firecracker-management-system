"use client";

import { SETTINGS_CARDS } from "../constants/settings.constants";

import SettingCard from "./SettingsCard";

interface SettingsListProps {
  search: string;
}

export default function SettingsList({ search }: SettingsListProps) {
  const keyword = search.toLowerCase();

  const settings = SETTINGS_CARDS.filter(
    (item) =>
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword),
  );

  return (
    <div className="grid gap-5">
      {settings.map((setting) => (
        <SettingCard key={setting.id} setting={setting} />
      ))}
    </div>
  );
}
