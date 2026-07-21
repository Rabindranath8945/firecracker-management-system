"use client";

import {
  BadgeCheck,
  Building2,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  Info,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";

export default function AboutPage() {
  return (
    <SettingsFormLayout
      title="About"
      description="Application information and developer details."
    >
      <div className="space-y-6">
        {/* Hero */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">Mahendra Business OS</h2>

              <p className="mt-1 text-muted-foreground">
                Smart business management software for inventory, sales,
                purchases, expenses, reports and accounting.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Version 1.0.0
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Stable Release
                </span>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                  Commercial
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Application */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Application Information"
          description="Current application information."
          icon={Info}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              title="Application"
              value="Business OS"
              color="from-blue-500 to-cyan-500"
            />

            <InfoCard
              title="Version"
              value="v1.0.0"
              color="from-emerald-500 to-green-500"
            />

            <InfoCard
              title="Database"
              value="MongoDB"
              color="from-orange-500 to-amber-500"
            />

            <InfoCard
              title="Framework"
              value="Next.js 16"
              color="from-violet-500 to-purple-500"
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Developer */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Developer"
          description="Designed and developed by."
          icon={Building2}
        >
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-blue-700 text-4xl font-bold text-white shadow-lg">
                M
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem label="Developer">Rabindranath Mondal</InfoItem>

              <InfoItem label="Company">Mahendra Tech Solutions</InfoItem>

              <InfoItem label="Email">connectrnmwd@gmail.com</InfoItem>

              <InfoItem label="Mobile">+91 95474 72839</InfoItem>

              <InfoItem label="Location">West Bengal, India</InfoItem>

              <InfoItem label="Website">Coming Soon</InfoItem>
            </div>
          </div>
        </SettingsSection>
        {/* ---------------------------------------------------------------- */}
        {/* System Status */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="System Status"
          description="Current application status and services."
          icon={BadgeCheck}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatusCard title="Database" status="Connected" color="emerald" />

            <StatusCard title="Application" status="Healthy" color="blue" />

            <StatusCard title="License" status="Active" color="purple" />

            <StatusCard title="Updates" status="Latest" color="orange" />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Quick Actions */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Resources"
          description="Helpful links and application resources."
          icon={Globe}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="h-16 justify-start rounded-2xl border-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg">
              <RefreshCw className="mr-3 h-5 w-5" />

              <div className="text-left">
                <p className="font-semibold">Check for Updates</p>

                <p className="text-xs text-blue-100">Download latest version</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-16 justify-start rounded-2xl"
            >
              <FileText className="mr-3 h-5 w-5 text-blue-600" />

              <div className="text-left">
                <p className="font-semibold">Release Notes</p>

                <p className="text-xs text-muted-foreground">
                  View latest improvements
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-16 justify-start rounded-2xl"
            >
              <ShieldCheck className="mr-3 h-5 w-5 text-emerald-600" />

              <div className="text-left">
                <p className="font-semibold">Privacy Policy</p>

                <p className="text-xs text-muted-foreground">
                  Read our privacy policy
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-16 justify-start rounded-2xl"
            >
              <ExternalLink className="mr-3 h-5 w-5 text-orange-600" />

              <div className="text-left">
                <p className="font-semibold">Contact Support</p>

                <p className="text-xs text-muted-foreground">
                  Get help from our team
                </p>
              </div>
            </Button>
          </div>
        </SettingsSection>
        {/* ---------------------------------------------------------------- */}
        {/* Footer */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-50 via-white to-sky-50 p-10 shadow-sm">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl">
              <Building2 className="h-10 w-10 text-white" />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Mahendra Business OS
            </h2>

            <p className="mt-3 max-w-2xl text-muted-foreground">
              Modern business management software built to simplify Inventory,
              Sales, Purchases, Customers, Suppliers, Expenses, Reports and
              Accounting.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                Next.js 16
              </span>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                MongoDB
              </span>

              <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                TypeScript
              </span>

              <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                Tailwind CSS
              </span>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              Developed with
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span className="font-semibold text-foreground">
                Mahendra Tech Solutions
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              © 2026 Mahendra Tech Solutions. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </SettingsFormLayout>
  );
}
interface InfoCardProps {
  title: string;
  value: string;
  color: string;
}

function InfoCard({ title, value, color }: InfoCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className={`h-1 bg-gradient-to-r ${color}`} />

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>

        <h3 className="mt-3 text-lg font-bold text-foreground">{value}</h3>
      </div>
    </div>
  );
}
interface InfoItemProps {
  label: string;
  children: React.ReactNode;
}

function InfoItem({ label, children }: InfoItemProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>

      <p className="mt-3 break-all text-base font-semibold">{children}</p>
    </div>
  );
}
interface StatusCardProps {
  title: string;
  status: string;
  color: "emerald" | "blue" | "orange" | "purple";
}

function StatusCard({ title, status, color }: StatusCardProps) {
  const dotColor = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    purple: "bg-violet-500",
  };

  const badgeColor = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",

    blue: "bg-blue-50 text-blue-700 border-blue-200",

    orange: "bg-orange-50 text-orange-700 border-orange-200",

    purple: "bg-violet-50 text-violet-700 border-violet-200",
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${dotColor[color]}`} />

            <span className="font-semibold">{status}</span>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeColor[color]}`}
        >
          Healthy
        </span>
      </div>
    </div>
  );
}
