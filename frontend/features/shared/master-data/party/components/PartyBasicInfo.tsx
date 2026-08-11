"use client";

import { Building2, Mail, Phone, Sparkles, User } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { PartyConfig } from "../constants";
import type { PartyFormValues } from "../lib/party-schema";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PartyBasicInfoProps {
  config: PartyConfig;
}

export default function PartyBasicInfo({ config }: PartyBasicInfoProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PartyFormValues>();

  const isCustomer = config.primaryType === "CUSTOMER";

  const accent = isCustomer
    ? {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        ring: "focus:ring-emerald-100",
        border: "focus:border-emerald-500",
      }
    : {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        ring: "focus:ring-indigo-100",
        border: "focus:border-indigo-500",
      };

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bg} ${accent.text}`}
          >
            {isCustomer ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the essential details for this{" "}
              {config.singular.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="space-y-6 p-6">
        {/* Name */}

        <div>
          <Label className="mb-2 flex items-center gap-1">
            {config.nameLabel}
            <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              {...register("name")}
              placeholder={`Enter ${config.singular.toLowerCase()} name`}
              className={`h-14 rounded-2xl pl-12 transition-all ${accent.border} ${accent.ring}`}
            />
          </div>

          {errors.name && (
            <p className="mt-2 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Mobile */}

        <div>
          <Label className="mb-2 flex items-center gap-1">
            Mobile Number
            <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              {...register("mobile")}
              placeholder="9876543210"
              maxLength={10}
              inputMode="numeric"
              className={`h-14 rounded-2xl pl-12 transition-all ${accent.border} ${accent.ring}`}
            />
          </div>

          {errors.mobile && (
            <p className="mt-2 text-xs text-red-500">{errors.mobile.message}</p>
          )}
        </div>

        {/* Email */}

        <div>
          <Label className="mb-2">Email Address</Label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              type="email"
              {...register("email")}
              placeholder="example@email.com"
              className={`h-14 rounded-2xl pl-12 transition-all ${accent.border} ${accent.ring}`}
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-xs text-red-500">{errors.email.message}</p>
          )}

          <p className="mt-2 text-xs text-slate-500">
            Optional. Used for invoices, reports and communication.
          </p>
        </div>
      </div>
    </Card>
  );
}
