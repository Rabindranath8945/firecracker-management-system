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

  const isCustomer = config.primaryType === "CUSTOMER";

  const accent = isCustomer
    ? {
        header: "bg-emerald-100 text-emerald-700",
        ring: "focus:ring-emerald-100",
        border: "focus:border-emerald-500",
        active: "border-emerald-500 bg-emerald-50",
        activeIcon: "bg-emerald-600 text-white",
      }
    : {
        header: "bg-indigo-100 text-indigo-700",
        ring: "focus:ring-indigo-100",
        border: "focus:border-indigo-500",
        active: "border-indigo-500 bg-indigo-50",
        activeIcon: "bg-indigo-600 text-white",
      };

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.header}`}
          >
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

      <div className="space-y-6 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* GST */}

          <div>
            <Label className="mb-2">GST Number</Label>

            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("gstNo")}
                placeholder="22AAAAA0000A1Z5"
                className={`h-14 rounded-2xl pl-12 ${accent.border} ${accent.ring}`}
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
            <Label className="mb-2">Opening Balance</Label>

            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                type="number"
                {...register("openingBalance", {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                className={`h-14 rounded-2xl pl-12 ${accent.border} ${accent.ring}`}
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
          <Label className="mb-3 block">Party Type</Label>

          <div className="space-y-3">
            {[
              {
                value: config.primaryType,
                title: config.primaryTypeLabel,
                description: config.primaryTypeDescription,
              },
              {
                value: config.secondaryType,
                title: config.secondaryTypeLabel,
                description: config.secondaryTypeDescription,
              },
            ].map((item) => {
              const selected = partyType === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setValue("type", item.value, {
                      shouldValidate: true,
                    })
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    selected
                      ? accent.active
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        selected
                          ? accent.activeIcon
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <div
                      className={`h-5 w-5 rounded-full border-2 transition-all ${
                        selected
                          ? isCustomer
                            ? "border-emerald-600 bg-emerald-600"
                            : "border-indigo-600 bg-indigo-600"
                          : "border-slate-300"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
