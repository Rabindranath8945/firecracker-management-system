"use client";

import { useState } from "react";
import { Bell, BellRing, Mail, ShieldAlert, Smartphone } from "lucide-react";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";

export default function NotificationsPage() {
  const [lowStock, setLowStock] = useState(true);
  const [purchaseDue, setPurchaseDue] = useState(true);
  const [customerDue, setCustomerDue] = useState(true);
  const [backupReminder, setBackupReminder] = useState(true);

  const [desktop, setDesktop] = useState(true);
  const [sound, setSound] = useState(true);
  const [popup, setPopup] = useState(true);

  const [invoiceEmail, setInvoiceEmail] = useState(false);
  const [backupEmail, setBackupEmail] = useState(false);
  const [systemUpdates, setSystemUpdates] = useState(true);

  return (
    <SettingsFormLayout
      title="Notifications"
      description="Manage business alerts, reminders and notification preferences."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Header */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
              <BellRing className="h-8 w-8 text-amber-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Notification Center</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Stay informed with important business alerts, reminders and
                application notifications.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Alerts
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Reminders
                </span>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                  Email
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Summary */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 md:grid-cols-3">
          <NotificationCard
            title="Business Alerts"
            value="4"
            subtitle="Active"
            color="amber"
          />

          <NotificationCard
            title="Application"
            value="3"
            subtitle="Enabled"
            color="blue"
          />

          <NotificationCard
            title="Email"
            value="1"
            subtitle="Configured"
            color="emerald"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Business Alerts */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Business Alerts"
          description="Receive important business notifications."
          icon={ShieldAlert}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Low Stock Alert"
              description="Notify when product stock reaches the minimum level."
              checked={lowStock}
              onCheckedChange={setLowStock}
            />

            <SettingSwitch
              title="Purchase Due Reminder"
              description="Notify when supplier payments become due."
              checked={purchaseDue}
              onCheckedChange={setPurchaseDue}
            />

            <SettingSwitch
              title="Customer Payment Reminder"
              description="Notify when customer payments are pending."
              checked={customerDue}
              onCheckedChange={setCustomerDue}
            />

            <SettingSwitch
              title="Daily Backup Reminder"
              description="Remind you to create a daily backup."
              checked={backupReminder}
              onCheckedChange={setBackupReminder}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Application */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Application Notifications"
          description="Configure desktop and in-app notifications."
          icon={Smartphone}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Desktop Notifications"
              description="Show notifications while using the application."
              checked={desktop}
              onCheckedChange={setDesktop}
            />

            <SettingSwitch
              title="Sound Notifications"
              description="Play sound for important events."
              checked={sound}
              onCheckedChange={setSound}
            />

            <SettingSwitch
              title="Popup Notifications"
              description="Display popup notifications."
              checked={popup}
              onCheckedChange={setPopup}
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Email */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Email Notifications"
          description="Configure email notification preferences."
          icon={Mail}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Invoice Email"
              description="Automatically send invoices by email."
              checked={invoiceEmail}
              onCheckedChange={setInvoiceEmail}
            />

            <SettingSwitch
              title="Backup Email"
              description="Receive backup confirmation emails."
              checked={backupEmail}
              onCheckedChange={setBackupEmail}
            />

            <SettingSwitch
              title="System Updates"
              description="Receive product update notifications."
              checked={systemUpdates}
              onCheckedChange={setSystemUpdates}
            />
          </div>
        </SettingsSection>
      </div>
    </SettingsFormLayout>
  );
}

interface NotificationCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: "amber" | "blue" | "emerald";
}

function NotificationCard({
  title,
  value,
  subtitle,
  color,
}: NotificationCardProps) {
  const badge = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge[color]}`}
      >
        {title}
      </span>

      <h3 className="mt-4 text-2xl font-bold">{value}</h3>

      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
