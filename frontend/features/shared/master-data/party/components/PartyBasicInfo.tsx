"use client";

import { Mail, Phone, User, Sparkles } from "lucide-react";
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

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
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

      <div className="space-y-5 p-5">
        {/* Name */}

        <div>
          <Label className="mb-2 flex items-center gap-1 text-sm font-medium">
            {config.nameLabel}
            <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              {...register("name")}
              placeholder={`Enter ${config.singular.toLowerCase()} name`}
              className="h-12 rounded-xl border-slate-200 bg-white pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {errors.name && (
            <p className="mt-2 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Mobile */}

        <div>
          <Label className="mb-2 flex items-center gap-1 text-sm font-medium">
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
              className="h-12 rounded-xl border-slate-200 bg-white pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {errors.mobile && (
            <p className="mt-2 text-xs text-red-500">{errors.mobile.message}</p>
          )}
        </div>

        {/* Email */}

        <div>
          <Label className="mb-2 text-sm font-medium">Email Address</Label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              type="email"
              {...register("email")}
              placeholder="example@email.com"
              className="h-12 rounded-xl border-slate-200 bg-white pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-xs text-red-500">{errors.email.message}</p>
          )}

          <p className="mt-2 text-xs text-slate-500">
            Optional. Used for invoices, reports and customer communication.
          </p>
        </div>
      </div>
    </Card>
  );
}
