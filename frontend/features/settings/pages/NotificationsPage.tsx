"use client";

import { useState } from "react";
import {
  Bell,
  BellRing,
  Database,
  Download,
  Package,
  ShoppingCart,
  Volume2,
} from "lucide-react";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsSection from "../components/SettingsSection";
import SettingSwitch from "../components/SettingSwitch";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface NotificationSettings {
  lowStock: boolean;
  outOfStock: boolean;
  saleSuccess: boolean;
  purchaseSuccess: boolean;
  expenseAdded: boolean;
  importCompleted: boolean;
  exportCompleted: boolean;
  sound: boolean;
}

/* -------------------------------------------------------------------------- */
/* Defaults                                                                   */
/* -------------------------------------------------------------------------- */

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  lowStock: true,
  outOfStock: true,
  saleSuccess: true,
  purchaseSuccess: true,
  expenseAdded: true,
  importCompleted: true,
  exportCompleted: true,
  sound: true,
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATIONS,
  );

  const [saved, setSaved] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Update Setting                                                         */
  /* ---------------------------------------------------------------------- */

  const updateNotification = (
    field: keyof NotificationSettings,
    value: boolean,
  ) => {
    setNotifications((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  };

  /* ---------------------------------------------------------------------- */
  /* Save                                                                    */
  /* ---------------------------------------------------------------------- */

  const handleSave = () => {
    /*
     * Connect this to your existing Settings notification API.
     *
     * Expected payload:
     *
     * notifications
     */

    console.log("Notification settings:", notifications);

    setSaved(true);
  };

  /* ---------------------------------------------------------------------- */
  /* Counts                                                                  */
  /* ---------------------------------------------------------------------- */

  const businessAlerts = [
    notifications.lowStock,
    notifications.outOfStock,
    notifications.saleSuccess,
    notifications.purchaseSuccess,
    notifications.expenseAdded,
  ].filter(Boolean).length;

  const dataAlerts = [
    notifications.importCompleted,
    notifications.exportCompleted,
  ].filter(Boolean).length;

  const totalEnabled = Object.values(notifications).filter(Boolean).length;

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <SettingsFormLayout
      title="Notifications"
      description="Manage business alerts and application notification preferences."
      onSave={handleSave}
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
              <BellRing className="h-8 w-8 text-amber-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">Notification Center</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Stay informed about important business events, stock changes,
                sales, purchases and data operations.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  Business Alerts
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Activity
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Sound
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Saved Message                                                    */}
        {/* ---------------------------------------------------------------- */}

        {saved && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Notification settings saved successfully.
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Summary                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 md:grid-cols-3">
          <NotificationCard
            title="Business Alerts"
            value={`${businessAlerts}/5`}
            subtitle="Enabled"
            color="amber"
          />

          <NotificationCard
            title="Data Activity"
            value={`${dataAlerts}/2`}
            subtitle="Enabled"
            color="blue"
          />

          <NotificationCard
            title="Notifications"
            value={`${totalEnabled}/8`}
            subtitle="Total enabled"
            color="emerald"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stock Alerts                                                      */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Stock Alerts"
          description="Receive notifications when inventory requires attention."
          icon={Package}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Low Stock Alert"
              description="Notify when product stock reaches the configured minimum level."
              checked={notifications.lowStock}
              onCheckedChange={(value) => updateNotification("lowStock", value)}
            />

            <SettingSwitch
              title="Out of Stock Alert"
              description="Notify when a product reaches zero available stock."
              checked={notifications.outOfStock}
              onCheckedChange={(value) =>
                updateNotification("outOfStock", value)
              }
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Sales & Purchase                                                  */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Sales & Purchase"
          description="Receive notifications when important transaction events occur."
          icon={ShoppingCart}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Sale Success"
              description="Show a notification after a sale is successfully completed."
              checked={notifications.saleSuccess}
              onCheckedChange={(value) =>
                updateNotification("saleSuccess", value)
              }
            />

            <SettingSwitch
              title="Purchase Success"
              description="Show a notification after a purchase is successfully completed."
              checked={notifications.purchaseSuccess}
              onCheckedChange={(value) =>
                updateNotification("purchaseSuccess", value)
              }
            />

            <SettingSwitch
              title="Expense Added"
              description="Show a notification when a new expense is recorded."
              checked={notifications.expenseAdded}
              onCheckedChange={(value) =>
                updateNotification("expenseAdded", value)
              }
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Data Operations                                                   */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Data Operations"
          description="Receive notifications when import or export operations finish."
          icon={Database}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Import Completed"
              description="Notify when an Excel or other data import has completed."
              checked={notifications.importCompleted}
              onCheckedChange={(value) =>
                updateNotification("importCompleted", value)
              }
            />

            <SettingSwitch
              title="Export Completed"
              description="Notify when a data export has completed."
              checked={notifications.exportCompleted}
              onCheckedChange={(value) =>
                updateNotification("exportCompleted", value)
              }
            />
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Sound                                                             */}
        {/* ---------------------------------------------------------------- */}

        <SettingsSection
          title="Notification Sound"
          description="Control sound feedback for application notifications."
          icon={Volume2}
        >
          <div className="space-y-4">
            <SettingSwitch
              title="Enable Notification Sound"
              description="Play sound when an important notification is triggered."
              checked={notifications.sound}
              onCheckedChange={(value) => updateNotification("sound", value)}
            />

            <div className="rounded-2xl border bg-muted/30 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
                  <Volume2
                    className={
                      notifications.sound
                        ? "h-5 w-5 text-emerald-600"
                        : "h-5 w-5 text-muted-foreground"
                    }
                  />
                </div>

                <div>
                  <p className="font-semibold">Notification Sound</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {notifications.sound
                      ? "Sound notifications are enabled."
                      : "Sound notifications are disabled."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Current Configuration                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border bg-muted/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
              <Bell className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">Notification Summary</h3>

              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <SummaryRow
                  label="Low Stock"
                  enabled={notifications.lowStock}
                />

                <SummaryRow
                  label="Out of Stock"
                  enabled={notifications.outOfStock}
                />

                <SummaryRow
                  label="Sale Success"
                  enabled={notifications.saleSuccess}
                />

                <SummaryRow
                  label="Purchase Success"
                  enabled={notifications.purchaseSuccess}
                />

                <SummaryRow
                  label="Expense Added"
                  enabled={notifications.expenseAdded}
                />

                <SummaryRow
                  label="Import Completed"
                  enabled={notifications.importCompleted}
                />

                <SummaryRow
                  label="Export Completed"
                  enabled={notifications.exportCompleted}
                />

                <SummaryRow label="Sound" enabled={notifications.sound} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsFormLayout>
  );
}

/* -------------------------------------------------------------------------- */
/* Notification Card                                                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Summary Row                                                                */
/* -------------------------------------------------------------------------- */

interface SummaryRowProps {
  label: string;
  enabled: boolean;
}

function SummaryRow({ label, enabled }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>

      <span
        className={
          enabled
            ? "font-medium text-emerald-600"
            : "font-medium text-muted-foreground"
        }
      >
        {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}
