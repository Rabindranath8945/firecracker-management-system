"use client";

import { CalendarDays, FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { PurchaseForm } from "../schemas/purchase.schema";

export default function PurchaseInfoCard() {
  const { register, watch } = useFormContext<PurchaseForm>();

  const paymentStatus = watch("paymentStatus");

  return (
    <Card className="rounded-3xl p-5">
      <div className="mb-5 flex items-center gap-4">
        <div className="rounded-2xl bg-muted p-3">
          <FileText className="size-6" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">Purchase Information</h2>

          <p className="text-sm text-muted-foreground">
            Invoice & Purchase Details
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Label>Invoice Number</Label>

          <Input {...register("invoiceNo")} placeholder="Auto Generated" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Purchase Date</Label>

            <div className="relative">
              <Input type="date" {...register("purchaseDate")} />

              <CalendarDays className="absolute top-3 right-3 size-4 text-muted-foreground" />
            </div>
          </div>

          {paymentStatus !== "PAID" && (
            <div>
              <Label>Due Date</Label>

              <div className="relative">
                <Input type="date" {...register("dueDate")} />

                <CalendarDays className="absolute top-3 right-3 size-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
