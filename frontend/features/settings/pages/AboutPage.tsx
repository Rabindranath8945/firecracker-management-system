"use client";

import {
  Activity,
  BadgeCheck,
  Building2,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";

import api from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface SettingsBusiness {
  name: string;
  ownerName: string;
  logo?: string;
  businessType?: string;
  gstNo?: string;
  panNo?: string;
  phone: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface SettingsAbout {
  version: string;
  developer: string;
  website: string;
  privacyPolicy: string;
  terms: string;
}

interface SettingsResponse {
  success: boolean;
  data: {
    business: SettingsBusiness;
    about: SettingsAbout;
  };
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  const [business, setBusiness] = useState<SettingsBusiness | null>(null);

  const [about, setAbout] = useState<SettingsAbout | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Load Settings                                                          */
  /* ---------------------------------------------------------------------- */

  const loadSettings = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await api.get<SettingsResponse>("/settings");

      if (!response.data.success) {
        throw new Error("Unable to load settings.");
      }

      const settings = response.data.data;

      setBusiness(settings.business);
      setAbout(settings.about);
    } catch (err) {
      console.error("Failed to load about information:", err);

      setError("Unable to load application information.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Initial Load                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <SettingsFormLayout
        title="About"
        description="Application information and business details."
      >
        <div className="flex min-h-[450px] items-center justify-center rounded-[2rem] border bg-card shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>

            <p className="mt-4 font-semibold">
              Loading application information
            </p>

            <p className="mt-1 text-sm text-muted-foreground">Please wait...</p>
          </div>
        </div>
      </SettingsFormLayout>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Display Values                                                         */
  /* ---------------------------------------------------------------------- */

  const businessName = business?.name || "Business OS";

  const developer = about?.developer || "Mahendra Tech Solutions";

  const version = about?.version || "1.0.0";

  const website = about?.website || business?.website || "";

  const privacyPolicy = about?.privacyPolicy || "";

  const terms = about?.terms || "";

  return (
    <SettingsFormLayout
      title="About"
      description="Application information, developer details and business information."
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ---------------------------------------------------------------- */}

        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void loadSettings(true)}
              className="rounded-xl"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                              */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative overflow-hidden rounded-[2rem] border bg-card shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500" />

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Logo */}

              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl">
                {business?.logo ? (
                  <img
                    src={business.logo}
                    alt={`${businessName} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10" />
                )}
              </div>

              {/* Information */}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    OneHub ERP
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    v{version}
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {businessName}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Business management software for inventory, sales, purchases,
                  customers, suppliers and business reports.
                </p>
              </div>

              {/* Refresh */}

              <Button
                type="button"
                variant="outline"
                disabled={refreshing}
                onClick={() => void loadSettings(true)}
                className="rounded-xl"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />

                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Application Information                                          */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Application Information"
          description="Current application information."
          icon={Info}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              title="Application"
              value="OneHub ERP System"
              icon={Building2}
              color="from-blue-500 to-cyan-500"
            />

            <InfoCard
              title="Version"
              value={`v${version}`}
              icon={BadgeCheck}
              color="from-emerald-500 to-green-500"
            />

            <InfoCard
              title="Database"
              value="MongoDB"
              icon={Database}
              color="from-orange-500 to-amber-500"
            />

            <InfoCard
              title="Frontend"
              value="Next.js 16"
              icon={Activity}
              color="from-violet-500 to-purple-500"
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Developer & Company                                               */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Developer & Company"
          description="Application developer and business information."
          icon={Building2}
        >
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            {/* Developer Logo */}

            <div className="flex justify-center">
              <div className="flex h-50 w-full max-w-lg items-center justify-center overflow-hidden rounded-[2rem] border bg-white px-8 py-6 shadow-lg">
                <img
                  src="/mahendra-logo.jpeg"
                  alt="Mahendra Tech Solutions"
                  className="h-full w-full fit-content"
                />
              </div>
            </div>

            {/* Information */}

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="Developer" icon={Building2}>
                Rabindranath Mondal
              </InfoItem>

              <InfoItem label="Business" icon={Building2}>
                Mahendra tech Solutions
              </InfoItem>

              <InfoItem label="Owner" icon={BadgeCheck}>
                Rabindranath Mondal
              </InfoItem>

              <InfoItem label="Mobile" icon={Phone}>
                +919547472839
              </InfoItem>

              <InfoItem label="Email" icon={Mail}>
                connectrnmwd@gmail.com
              </InfoItem>

              <InfoItem label="Business Type" icon={Building2}>
                IT & Software Development Services
              </InfoItem>

              <InfoItem label="GST Number" icon={BadgeCheck}>
                Not Available
              </InfoItem>

              <InfoItem label="PAN Number" icon={ShieldCheck}>
                Not Available
              </InfoItem>

              <InfoItem label="Location" icon={MapPin}>
                Haldia, West Bengal
              </InfoItem>

              <InfoItem label="Address" icon={MapPin}>
                Haldia, West Bengal
              </InfoItem>
            </div>
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Contact & Web                                                   */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Contact & Web"
          description="Mahendra Tech Solutions contact and business information."
          icon={Globe}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ContactCard icon={Globe} title="Website" value="Not Available" />

            <ContactCard icon={Mail} title="Email" value="Not Available" />

            <ContactCard icon={Phone} title="Phone" value="9547472839" />

            <ContactCard
              icon={MapPin}
              title="Business Location"
              value="Haldia, West Bengal"
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Legal                                                           */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Legal & Policies"
          description="Mahendra Tech Solutions legal information."
          icon={ShieldCheck}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <PolicyCard
              icon={ShieldCheck}
              title="Privacy Policy"
              available={false}
            />

            <PolicyCard
              icon={FileText}
              title="Terms & Conditions"
              available={false}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Technology                                                        */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Technology"
          description="Technology used by the application."
          icon={Database}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TechCard label="Frontend" value="Next.js 16" />

            <TechCard label="Language" value="TypeScript" />

            <TechCard label="Styling" value="Tailwind CSS" />

            <TechCard label="Database" value="MongoDB" />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Footer                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-slate-50 via-white to-sky-50 p-8 shadow-sm dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-10">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-50 w-50 items-center justify-center overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-xl ring-1 ring-border">
              <Image
                src="/one-logo-about.jpeg"
                alt="OneHub ERP"
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
              OneHub ERP System
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Modern business management software built to simplify everyday
              business operations.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <TechBadge label="Next.js 16" />
              <TechBadge label="MongoDB" />
              <TechBadge label="TypeScript" />
              <TechBadge label="Tailwind CSS" />
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              Built with
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span className="font-semibold text-foreground">{developer}</span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              © 2026 {developer}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </SettingsFormLayout>
  );
}

/* ========================================================================== */
/* Components                                                                 */
/* ========================================================================== */

interface InfoCardProps {
  title: string;
  value: string;
  icon: typeof Building2;
  color: string;
}

function InfoCard({ title, value, icon: Icon, color }: InfoCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className={`h-1 bg-gradient-to-r ${color}`} />

      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>

          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <h3 className="mt-3 truncate text-lg font-bold">{value}</h3>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Item                                                                  */
/* -------------------------------------------------------------------------- */

interface InfoItemProps {
  label: string;
  icon: typeof Building2;
  children: React.ReactNode;
}

function InfoItem({ label, icon: Icon, children }: InfoItemProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />

        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-3 break-words text-sm font-semibold">{children}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact Card                                                               */
/* -------------------------------------------------------------------------- */

interface ContactCardProps {
  icon: typeof Globe;
  title: string;
  value: string;
  href?: string;
}

function ContactCard({ icon: Icon, title, value, href }: ContactCardProps) {
  const canOpen = Boolean(href) && /^https?:\/\//i.test(href ?? "");

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <p className="break-all text-sm font-semibold">{value}</p>

            {canOpen && href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Open
                <ExternalLink className="ml-1.5 h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Policy Card                                                                */
/* -------------------------------------------------------------------------- */

interface PolicyCardProps {
  icon: typeof ShieldCheck;
  title: string;
  available: boolean;
  href?: string;
}

function PolicyCard({ icon: Icon, title, available, href }: PolicyCardProps) {
  const canOpen = Boolean(href) && /^https?:\/\//i.test(href ?? "");

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1">
          <p className="font-semibold">{title}</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {available ? "Available" : "Not configured"}
          </p>

          {canOpen && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              Open
              <ExternalLink className="ml-1.5 h-4 w-4" />
            </a>
          )}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            available
              ? "bg-emerald-50 text-emerald-700"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {available ? "Available" : "Not Set"}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Technology Card                                                            */
/* -------------------------------------------------------------------------- */

function TechCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-muted/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Technology Badge                                                           */
/* -------------------------------------------------------------------------- */

function TechBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm">
      {label}
    </span>
  );
}
