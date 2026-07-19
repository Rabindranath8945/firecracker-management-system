"use client";

import {
  BadgeCheck,
  ShieldCheck,
  ShieldX,
  Settings2,
  Receipt,
  History,
} from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import type { PartyFormValues } from "../lib/party-schema";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PartyStatus() {
  const { control, watch } = useFormContext<PartyFormValues>();

  const isActive = watch("isActive");

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md">
            <Settings2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Status</h2>

            <p className="mt-1 text-sm text-slate-500">
              Control whether this party can be used in future transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="space-y-5 p-5">
        {/* Active Card */}

        <div
          className={`rounded-2xl border p-5 transition-all ${
            isActive
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left */}

            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isActive
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isActive ? (
                  <ShieldCheck className="h-6 w-6" />
                ) : (
                  <ShieldX className="h-6 w-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {isActive ? "Active" : "Inactive"}
                  </h3>

                  <BadgeCheck
                    className={`h-4 w-4 ${
                      isActive ? "text-emerald-600" : "text-red-600"
                    }`}
                  />
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isActive
                    ? "This party will be available for sales, purchases and all business operations."
                    : "The party will remain in records but cannot be selected for new transactions."}
                </p>
              </div>
            </div>

            {/* Switch */}

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

        {/* Info Cards */}

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Receipt className="mb-2 h-5 w-5 text-blue-600" />

            <h4 className="text-sm font-semibold text-slate-900">
              Transactions
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Available in Sales, Purchases and Payments.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <BadgeCheck className="mb-2 h-5 w-5 text-emerald-600" />

            <h4 className="text-sm font-semibold text-slate-900">Reports</h4>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Included in analytics, ledgers and reports.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <History className="mb-2 h-5 w-5 text-violet-600" />

            <h4 className="text-sm font-semibold text-slate-900">History</h4>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Existing records are always preserved.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
