"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useFormContext, Controller } from "react-hook-form";
import type { ProductFormData } from "../../schemas/product.schema";

export default function ProductAdditionalCard() {
  const { register, control } = useFormContext<ProductFormData>();
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="space-y-5 p-5">
        <h2 className="text-lg font-semibold">Additional Information</h2>

        {/* Brand */}

        <div className="space-y-2">
          <Label>Brand</Label>

          <Input
            {...register("brand")}
            placeholder="Enter brand name"
            className="h-11 rounded-xl"
          />
        </div>

        {/* HSN & GST */}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>HSN Code</Label>

            <Input
              {...register("hsn")}
              placeholder="36041000"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>GST %</Label>

            <Input
              {...register("gst", {
                valueAsNumber: true,
              })}
              type="number"
              placeholder="18"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        {/* Description */}

        <div className="space-y-2">
          <Label>Description</Label>

          <Textarea
            {...register("description")}
            placeholder="Write product description..."
            className="min-h-28 rounded-xl"
          />
        </div>

        {/* Active */}

        <div className="flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="font-medium">Active Product</p>

            <p className="text-sm text-muted-foreground">
              Visible in sales & purchases
            </p>
          </div>

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
