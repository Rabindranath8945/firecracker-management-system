"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext, useWatch } from "react-hook-form";
import type { ProductFormData } from "../../schemas/product.schema";

export default function ProductPricingCard() {
  const { register, control } = useFormContext<ProductFormData>();

  const purchase = useWatch({
    control,
    name: "purchasePrice",
  });

  const selling = useWatch({
    control,
    name: "sellingPrice",
  });

  const profit = Math.max(0, selling - purchase);
  const margin = selling > 0 ? ((profit / selling) * 100).toFixed(1) : "0";

  const markup = purchase > 0 ? ((profit / purchase) * 100).toFixed(1) : "0";

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="space-y-5 p-5">
        <h2 className="text-lg font-semibold">Pricing</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Purchase Price *</Label>

            <Input
              type="number"
              {...register("purchasePrice", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Selling Price *</Label>

            <Input
              type="number"
              {...register("sellingPrice", {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>MRP</Label>

          <Input
            type="number"
            {...register("mrp", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-100 p-3 text-center">
            <p className="text-xs text-muted-foreground">Profit</p>

            <p className="mt-1 text-lg font-bold text-green-600">
              ₹₹{profit.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 p-3 text-center">
            <p className="text-xs text-muted-foreground">Margin</p>

            <p className="mt-1 text-lg font-bold">
              {Number(margin).toFixed(1)}%
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 p-3 text-center">
            <p className="text-xs text-muted-foreground">Markup</p>

            <p className="mt-1 text-lg font-bold">
              {Number(markup).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
