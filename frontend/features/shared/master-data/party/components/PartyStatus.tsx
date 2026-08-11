"use client";

import {
  BadgeCheck,
  History,
  Receipt,
  Settings2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import type { PartyFormValues } from "../lib/party-schema";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function PartyStatus() {
  const { control, watch } = useFormContext<PartyFormValues>();

  const isActive = watch("isActive");

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Settings2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Status & Permissions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enable or disable this party for future business transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="space-y-6 p-6">
        {/* Active Status */}

        <div
          className={`rounded-3xl border p-5 transition-all ${
            isActive
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center justify-between gap-5">
            <div className="flex flex-1 items-start gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isActive ? (
                  <ShieldCheck className="h-7 w-7" />
                ) : (
                  <ShieldX className="h-7 w-7" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {isActive ? "Active" : "Inactive"}
                  </h3>

                  <BadgeCheck
                    className={`h-5 w-5 ${
                      isActive ? "text-emerald-600" : "text-red-600"
                    }`}
                  />
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isActive
                    ? "This party can be selected in Sales, Purchases, Payments and all business operations."
                    : "This party will remain in history but cannot be selected for new transactions."}
                </p>
              </div>
            </div>

            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Information */}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300 hover:bg-white">
            <Receipt className="mb-3 h-6 w-6 text-blue-600" />

            <h3 className="font-semibold text-slate-900">Transactions</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Available for Sales, Purchases, Payments and Ledger entries.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300 hover:bg-white">
            <BadgeCheck className="mb-3 h-6 w-6 text-emerald-600" />

            <h3 className="font-semibold text-slate-900">Reports</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Included in dashboards, analytics, statements and reports.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300 hover:bg-white">
            <History className="mb-3 h-6 w-6 text-violet-600" />

            <h3 className="font-semibold text-slate-900">History</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Existing invoices and transactions are permanently preserved.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
