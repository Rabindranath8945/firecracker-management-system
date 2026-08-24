"use client";

import { CalendarDays, FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { PurchaseForm } from "../schemas/purchase.schema";

export default function PurchaseInfoCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PurchaseForm>();

  return (
    <Card className="overflow-hidden rounded-3xl border shadow-sm">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          border-b
          bg-gradient-to-r
          from-emerald-50
          to-green-50
          px-5
          py-5
          dark:from-emerald-500/10
          dark:to-green-500/5
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-emerald-100
              dark:bg-emerald-500/15
            "
          >
            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold">Purchase Information</h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Invoice number and purchase date
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Form                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-5 p-5">
        {/* ---------------------------------------------------------------- */}
        {/* Invoice Number                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="purchase-invoice-no"
              className="text-sm font-semibold"
            >
              Invoice Number
            </Label>

            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Auto Generated
            </span>
          </div>

          <div className="relative">
            <FileText
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                z-10
                h-4
                w-4
                -translate-y-1/2
                text-emerald-600
                dark:text-emerald-400
              "
            />

            <Input
              id="purchase-invoice-no"
              value="Generated automatically"
              readOnly
              disabled
              className="
                h-12
                rounded-2xl
                bg-muted/40
                pl-11
                font-medium
                text-muted-foreground
                opacity-100
                cursor-not-allowed
              "
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            Invoice number will be generated automatically when the purchase is
            saved.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Purchase Date                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-2">
          <Label htmlFor="purchase-date" className="text-sm font-semibold">
            Purchase Date
          </Label>

          <div className="relative">
            <CalendarDays
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                z-10
                h-4
                w-4
                -translate-y-1/2
                text-emerald-600
                dark:text-emerald-400
              "
            />

            <Input
              id="purchase-date"
              type="date"
              {...register("purchaseDate")}
              className={cn(
                "h-12 rounded-2xl bg-muted/30 pl-11 pr-4",
                "focus-visible:border-emerald-500",
                "focus-visible:ring-2",
                "focus-visible:ring-emerald-500/20",
                errors.purchaseDate &&
                  "border-red-500 focus-visible:border-red-500",
              )}
            />
          </div>

          {errors.purchaseDate?.message && (
            <p className="text-xs font-medium text-red-600">
              {errors.purchaseDate.message}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
