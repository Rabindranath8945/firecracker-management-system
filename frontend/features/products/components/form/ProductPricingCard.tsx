"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext, useWatch } from "react-hook-form";
import type { ProductFormData } from "../../schemas/product.schema";

export default function ProductPricingCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const purchase = useWatch({
    control,
    name: "purchasePrice",
  });

  const selling = useWatch({
    control,
    name: "sellingPrice",
  });

  const profit = Math.max(0, (selling || 0) - (purchase || 0));

  const margin = selling > 0 ? ((profit / selling) * 100).toFixed(1) : "--";

  const markup = purchase > 0 ? ((profit / purchase) * 100).toFixed(1) : "--";

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="space-y-5 p-5">
        <h2 className="text-lg font-semibold">Pricing</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Purchase */}

          <div className="space-y-2">
            <Label>Purchase Price *</Label>

            <Input
              type="number"
              inputMode="decimal"
              placeholder="₹ Enter purchase price"
              className={
                errors.purchasePrice
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              {...register("purchasePrice", {
                valueAsNumber: true,
              })}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
            />

            {errors.purchasePrice && (
              <p className="text-sm text-red-500">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>

          {/* Selling */}

          <div className="space-y-2">
            <Label>Selling Price *</Label>

            <Input
              type="number"
              inputMode="decimal"
              placeholder="₹ Enter selling price"
              className={
                errors.sellingPrice
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              {...register("sellingPrice", {
                valueAsNumber: true,
              })}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
            />

            {errors.sellingPrice && (
              <p className="text-sm text-red-500">
                {errors.sellingPrice.message}
              </p>
            )}
          </div>
        </div>

        {/* MRP */}

        {/* <div className="space-y-2">
          <Label>MRP</Label>

          <Input
            type="number"
            inputMode="decimal"
            placeholder="₹ Enter MRP (Optional)"
            {...register("mrp", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            onFocus={(e) => {
              if (e.target.value === "0") {
                e.target.value = "";
              }
            }}
          />
        </div> */}

        {/* Summary */}

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-green-50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Profit</p>

            <p className="mt-1 text-lg font-bold text-green-600">
              {purchase > 0 && selling > 0 ? `₹${profit.toFixed(2)}` : "--"}
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Margin</p>

            <p className="mt-1 text-lg font-bold">
              {margin === "--" ? "--" : `${margin}%`}
            </p>
          </div>

          <div className="rounded-xl bg-violet-50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Markup</p>

            <p className="mt-1 text-lg font-bold">
              {markup === "--" ? "--" : `${markup}%`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
