"use client";

import { Building2, CreditCard, IndianRupee, Landmark } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { PartyConfig } from "../constants";
import type { PartyFormValues } from "../lib/party-schema";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PartyBusinessInfoProps {
  config: PartyConfig;
}

export default function PartyBusinessInfo({ config }: PartyBusinessInfoProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PartyFormValues>();

  const partyType = watch("type");

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md">
            <Landmark className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Business Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Financial and taxation details.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="space-y-6 p-5">
        <div className="grid gap-5 md:grid-cols-2">
          {/* GST */}

          <div>
            <Label className="mb-2 text-sm font-medium">GST Number</Label>

            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("gstNo")}
                placeholder="22AAAAA0000A1Z5"
                className="h-12 rounded-xl border-slate-200 pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.gstNo && (
              <p className="mt-2 text-xs text-red-500">
                {errors.gstNo.message}
              </p>
            )}
          </div>

          {/* Opening Balance */}

          <div>
            <Label className="mb-2 text-sm font-medium">Opening Balance</Label>

            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                type="number"
                {...register("openingBalance", {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                className="h-12 rounded-xl border-slate-200 pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.openingBalance && (
              <p className="mt-2 text-xs text-red-500">
                {errors.openingBalance.message}
              </p>
            )}
          </div>
        </div>

        {/* Party Type */}

        <div>
          <Label className="mb-3 block text-sm font-medium">Party Type</Label>

          <div className="grid gap-3">
            {/* Primary */}

            <button
              type="button"
              onClick={() => setValue("type", config.primaryType)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                partyType === config.primaryType
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    partyType === config.primaryType
                      ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {config.primaryTypeLabel}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {config.primaryTypeDescription}
                  </p>
                </div>

                <div
                  className={`h-5 w-5 rounded-full border-2 transition-all ${
                    partyType === config.primaryType
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300"
                  }`}
                />
              </div>
            </button>

            {/* Secondary */}

            <button
              type="button"
              onClick={() => setValue("type", config.secondaryType)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                partyType === config.secondaryType
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    partyType === config.secondaryType
                      ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {config.secondaryTypeLabel}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {config.secondaryTypeDescription}
                  </p>
                </div>

                <div
                  className={`h-5 w-5 rounded-full border-2 transition-all ${
                    partyType === config.secondaryType
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-slate-300"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
