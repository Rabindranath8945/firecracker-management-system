import {
  Bell,
  Building2,
  FileText,
  Hash,
  Info,
  Palette,
  Receipt,
  ShieldCheck,
} from "lucide-react";

import type { SettingCard } from "../types/settings";

export const SETTINGS_CARDS: SettingCard[] = [
  {
    id: "business",
    title: "Business Profile",
    description: "Manage business information, logo and GST details.",
    href: "/settings/business",
    icon: Building2,
    color: "blue",
  },
  {
    id: "invoice",
    title: "Invoice Settings",
    description: "Configure invoice format, logo and printing options.",
    href: "/settings/invoice",
    icon: Receipt,
    color: "emerald",
  },
  {
    id: "tax",
    title: "Tax & GST",
    description: "Manage GST rates and tax configuration.",
    href: "/settings/tax",
    icon: FileText,
    color: "orange",
  },
  {
    id: "numberSeries",
    title: "Number Series",
    description: "Configure invoice, purchase and product numbering.",
    href: "/settings/number-series",
    icon: Hash,
    color: "purple",
  },
  {
    id: "security",
    title: "Users & Security",
    description: "Manage authentication and security settings.",
    href: "/settings/security",
    icon: ShieldCheck,
    color: "cyan",
  },
  {
    id: "backup",
    title: "Backup & Restore",
    description: "Backup and restore your business data.",
    href: "/settings/backup",
    icon: Building2,
    color: "amber",
  },
  {
    id: "preferences",
    title: "App Preferences",
    description: "Customize language, theme and application behavior.",
    href: "/settings/preferences",
    icon: Palette,
    color: "rose",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage reminders and business notifications.",
    href: "/settings/notifications",
    icon: Bell,
    color: "emerald",
  },
  {
    id: "about",
    title: "About",
    description: "Application information and version details.",
    href: "/settings/about",
    icon: Info,
    color: "slate",
  },
];

export const SETTINGS_SECTION_TITLE = "Settings";

export const SETTINGS_SECTION_DESCRIPTION =
  "Manage your business configuration, application preferences and security settings.";
