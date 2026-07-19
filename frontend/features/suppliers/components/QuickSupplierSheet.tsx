"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Phone, User, ArrowRight } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  quickSupplierSchema,
  type QuickSupplierForm,
} from "../schemas/quickSupplier.schema";

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  onSave: (data: QuickSupplierForm) => void;

  onMoreDetails: () => void;

  loading?: boolean;
}

export default function QuickSupplierSheet({
  open,
  onOpenChange,
  onSave,
  onMoreDetails,
  loading = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<QuickSupplierForm>({
    resolver: zodResolver(quickSupplierSchema),
    mode: "onChange",

    defaultValues: {
      businessName: "",
      contactPerson: "",
      mobile: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  function submit(data: QuickSupplierForm) {
    onSave(data);

    reset();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-8 pt-5">
        {/* Handle */}

        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-muted" />

        {/* Header */}

        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="size-8 text-primary" />
          </div>

          <h2 className="mt-4 text-2xl font-bold">Add Supplier</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a supplier without leaving this purchase.
          </p>
        </div>

        <div onSubmit={handleSubmit(submit)} className="space-y-5">
          {/* Business Name */}

          <div className="space-y-2">
            <Label>Business Name *</Label>

            <div className="relative">
              <Building2 className="absolute left-3 top-3.5 size-4 text-muted-foreground" />

              <Input
                placeholder="ABC Fireworks"
                className="pl-10"
                {...register("businessName")}
              />
            </div>

            {errors.businessName && (
              <p className="text-sm text-red-500">
                {errors.businessName.message}
              </p>
            )}
          </div>

          {/* Contact Person */}

          <div className="space-y-2">
            <Label>Contact Person</Label>

            <div className="relative">
              <User className="absolute left-3 top-3.5 size-4 text-muted-foreground" />

              <Input
                placeholder="Mr. Sharma"
                className="pl-10"
                {...register("contactPerson")}
              />
            </div>
          </div>

          {/* Mobile */}

          <div className="space-y-2">
            <Label>Mobile Number *</Label>

            <div className="relative">
              <Phone className="absolute left-3 top-3.5 size-4 text-muted-foreground" />

              <Input
                placeholder="9876543210"
                inputMode="numeric"
                className="pl-10"
                {...register("mobile")}
              />
            </div>

            {errors.mobile && (
              <p className="text-sm text-red-500">{errors.mobile.message}</p>
            )}
          </div>

          {/* More Details */}

          <button
            type="button"
            onClick={onMoreDetails}
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-2xl
              border
              p-4
              transition
              hover:bg-muted/50
            "
          >
            <div className="text-left">
              <h3 className="font-semibold">Add More Details</h3>

              <p className="text-sm text-muted-foreground">
                GST, address, email and more
              </p>
            </div>

            <ArrowRight className="size-5" />
          </button>

          {/* Save */}

          <Button
            type="button"
            onClick={handleSubmit(submit)}
            disabled={loading}
            className="h-12 w-full rounded-2xl"
          >
            {loading ? "Creating Supplier..." : "Save Supplier"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
