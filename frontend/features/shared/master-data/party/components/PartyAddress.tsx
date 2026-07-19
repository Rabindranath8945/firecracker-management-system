"use client";

import { Home, Landmark, MapPin, MapPinned, Navigation } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { PartyFormValues } from "../lib/party-schema";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PartyAddress() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PartyFormValues>();

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md">
            <Navigation className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Address Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Billing and delivery address details.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="space-y-5 p-5">
        {/* Address */}

        <div>
          <Label className="mb-2 text-sm font-medium">Street Address</Label>

          <div className="relative">
            <Home className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

            <Textarea
              {...register("address")}
              rows={3}
              placeholder="House No, Street, Area"
              className="rounded-xl border-slate-200 pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {errors.address && (
            <p className="mt-2 text-xs text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* City / State / PIN */}

        <div className="grid gap-5 md:grid-cols-3">
          {/* City */}

          <div>
            <Label className="mb-2 text-sm font-medium">City</Label>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("city")}
                placeholder="Kolkata"
                className="h-12 rounded-xl border-slate-200 pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.city && (
              <p className="mt-2 text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* State */}

          <div>
            <Label className="mb-2 text-sm font-medium">State</Label>

            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("state")}
                placeholder="West Bengal"
                className="h-12 rounded-xl border-slate-200 pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.state && (
              <p className="mt-2 text-xs text-red-500">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* PIN */}

          <div>
            <Label className="mb-2 text-sm font-medium">PIN Code</Label>

            <div className="relative">
              <MapPinned className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("pinCode")}
                placeholder="721657"
                inputMode="numeric"
                maxLength={6}
                className="h-12 rounded-xl border-slate-200 pl-12 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.pinCode && (
              <p className="mt-2 text-xs text-red-500">
                {errors.pinCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Footer Note */}

        <div className="rounded-xl bg-orange-50 px-4 py-3">
          <p className="text-xs leading-5 text-orange-700">
            Address information is optional but recommended for invoices,
            delivery, GST records, and customer communication.
          </p>
        </div>
      </div>
    </Card>
  );
}
