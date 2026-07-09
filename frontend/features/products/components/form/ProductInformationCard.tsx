"use client";

import { Camera } from "lucide-react";
import ProductImagePicker from "./ProductImagePicker";
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
import { useFormContext, Controller } from "react-hook-form";
import type { ProductFormData } from "../../schemas/product.schema";

export default function ProductInformationCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormData>();
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="space-y-5 p-5">
        <h2 className="text-lg font-semibold">Product Information</h2>

        {/* Product Image */}

        <div className="flex justify-center">
          <ProductImagePicker />
        </div>

        {/* Product Name */}

        <div className="space-y-2">
          <Label>Product Name *</Label>

          <Input
            {...register("name")}
            placeholder="Enter product name"
            className="h-11 rounded-xl"
          />

          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* SKU */}

        <div className="space-y-2">
          <Label>SKU</Label>

          <Input
            {...register("sku")}
            value="auto-generated"
            readOnly
            className="h-11 rounded-xl bg-slate-100"
          />
        </div>

        {/* Barcode */}

        <div className="space-y-2">
          <Label>Barcode</Label>

          <Input
            {...register("barcode")}
            placeholder="Scan or enter barcode"
            className="h-11 rounded-xl"
          />
        </div>

        {/* Category */}

        <div className="space-y-2">
          <Label>Category</Label>

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.category.message}
                  </p>
                )}
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Rocket">Rocket</SelectItem>
                  <SelectItem value="Bomb">Bomb</SelectItem>
                  <SelectItem value="Flower Pot">Flower Pot</SelectItem>
                  <SelectItem value="Fancy">Fancy</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
