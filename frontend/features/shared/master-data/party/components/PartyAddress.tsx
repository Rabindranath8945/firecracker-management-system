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
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
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

      <div className="space-y-6 p-6">
        {/* Address */}

        <div>
          <Label className="mb-2">Street Address</Label>

          <div className="relative">
            <Home className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

            <Textarea
              {...register("address")}
              rows={4}
              placeholder="House No, Street, Area"
              className="
                rounded-2xl
                border-slate-200
                pl-12
                resize-none
                transition-all
                focus:border-orange-500
                focus:ring-4
                focus:ring-orange-100
              "
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
            <Label className="mb-2">City</Label>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("city")}
                placeholder="Kolkata"
                className="
                  h-14
                  rounded-2xl
                  pl-12
                  transition-all
                  focus:border-orange-500
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {errors.city && (
              <p className="mt-2 text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* State */}

          <div>
            <Label className="mb-2">State</Label>

            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("state")}
                placeholder="West Bengal"
                className="
                  h-14
                  rounded-2xl
                  pl-12
                  transition-all
                  focus:border-orange-500
                  focus:ring-4
                  focus:ring-orange-100
                "
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
            <Label className="mb-2">PIN Code</Label>

            <div className="relative">
              <MapPinned className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("pinCode")}
                placeholder="721657"
                inputMode="numeric"
                maxLength={6}
                className="
                  h-14
                  rounded-2xl
                  pl-12
                  transition-all
                  focus:border-orange-500
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {errors.pinCode && (
              <p className="mt-2 text-xs text-red-500">
                {errors.pinCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Note */}

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm leading-6 text-orange-700">
            Address information is optional but recommended for invoices,
            delivery, GST records and business communication.
          </p>
        </div>
      </div>
    </Card>
  );
}
