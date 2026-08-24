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
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { ProductFormData } from "../../schemas/product.schema";

export default function ProductInventoryCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const stock = useWatch({
    control,
    name: "stock",
  });

  const purchase = useWatch({
    control,
    name: "purchasePrice",
  });

  const stockValue = (stock || 0) * (purchase || 0);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="space-y-5 p-5">
        <h2 className="text-lg font-semibold">Inventory</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Opening Stock */}

          <div className="space-y-2">
            <Label>Opening Stock *</Label>

            <Input
              className={
                errors.stock ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              type="number"
              inputMode="numeric"
              placeholder="Enter quantity"
              {...register("stock", {
                valueAsNumber: true,
              })}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
            />

            {errors.stock && (
              <p className="text-sm text-red-500">{errors.stock.message}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Initial available stock.
            </p>
          </div>

          {/* Minimum Stock */}

          <div className="space-y-2">
            <Label>Minimum Stock *</Label>

            <Input
              className={
                errors.minimumStock
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              type="number"
              inputMode="numeric"
              placeholder="Alert quantity"
              {...register("minimumStock", {
                valueAsNumber: true,
              })}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
            />

            {errors.minimumStock && (
              <p className="text-sm text-red-500">
                {errors.minimumStock.message}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Low stock reminder level.
            </p>
          </div>
        </div>

        {/* Unit */}

        <div className="space-y-2">
          <Label>Unit</Label>

          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select unit" />
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

        {/* Stock Value */}

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700">Inventory Value</p>

          {stock > 0 && purchase > 0 ? (
            <h2 className="mt-2 text-3xl font-bold text-blue-700">
              ₹{stockValue.toFixed(2)}
            </h2>
          ) : (
            <>
              <h2 className="mt-2 text-3xl font-bold text-blue-700">--</h2>

              <p className="mt-1 text-xs text-blue-600">
                Enter purchase price and opening stock to calculate inventory
                value.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
