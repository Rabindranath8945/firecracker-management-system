"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import type { ProductFormData } from "../../schemas/product.schema";

export default function ProductInventoryCard() {
  const { register, control } = useFormContext<ProductFormData>();

  const stock = useWatch({
    control,
    name: "openingStock",
  });

  const purchase = useWatch({
    control,
    name: "purchasePrice",
  });
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="space-y-5 p-5">
        <h2 className="text-lg font-semibold">Inventory</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Opening Stock *</Label>

            <Input
              type="number"
              {...register("openingStock", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Minimum Stock *</Label>

            <Input
              type="number"
              {...register("minimumStock", {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Unit</Label>

          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="piece">Piece (PCS)</SelectItem>

                  <SelectItem value="box">Box</SelectItem>

                  <SelectItem value="packet">Packet</SelectItem>

                  <SelectItem value="carton">Carton</SelectItem>

                  <SelectItem value="dozen">Dozen</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-sm text-blue-700">Stock Value</p>

          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            ₹{(stock * purchase).toFixed(2)}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
