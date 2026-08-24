"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, Phone, User } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  quickSupplierSchema,
  type QuickSupplierForm,
} from "../schemas/quickSupplier.schema";

interface QuickSupplierSheetProps {
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
}: QuickSupplierSheetProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickSupplierForm>({
    resolver: zodResolver(quickSupplierSchema),
    mode: "onChange",
    defaultValues: {
      businessName: "",
      contactPerson: "",
      mobile: "",
    },
  });

  /* ---------------------------------------------------------------------- */
  /* RESET                                                                  */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!open) {
      reset({
        businessName: "",
        contactPerson: "",
        mobile: "",
      });
    }
  }, [open, reset]);

  /* ---------------------------------------------------------------------- */
  /* SAVE                                                                   */
  /* ---------------------------------------------------------------------- */

  function submit(data: QuickSupplierForm) {
    onSave(data);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          max-h-[90vh]
          overflow-y-auto
          rounded-t-[30px]
          border-t
          px-5
          pb-6
          pt-4
          sm:px-6
        "
      >
        {/* ---------------------------------------------------------------- */}
        {/* HANDLE                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-muted" />

        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6 flex items-center gap-3">
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
              dark:bg-emerald-500/10
            "
          >
            <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold">Add Supplier</h2>

            <p className="text-xs text-muted-foreground">
              Quickly add a supplier to this purchase
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* FORM                                                              */}
        {/* ---------------------------------------------------------------- */}

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {/* Business Name */}

          <div className="space-y-1.5">
            <Label
              htmlFor="supplier-business-name"
              className="text-xs font-semibold"
            >
              Business Name *
            </Label>

            <div className="relative">
              <Building2
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                id="supplier-business-name"
                placeholder="ABC Fireworks"
                autoComplete="organization"
                disabled={loading}
                className="
                  h-11
                  rounded-xl
                  pl-10
                  focus-visible:border-emerald-500
                  focus-visible:ring-emerald-500/20
                "
                {...register("businessName")}
              />
            </div>

            {errors.businessName && (
              <p className="text-xs text-red-500">
                {errors.businessName.message}
              </p>
            )}
          </div>

          {/* Contact Person */}

          <div className="space-y-1.5">
            <Label
              htmlFor="supplier-contact-person"
              className="text-xs font-semibold"
            >
              Contact Person
            </Label>

            <div className="relative">
              <User
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                id="supplier-contact-person"
                placeholder="Mr. Sharma"
                autoComplete="name"
                disabled={loading}
                className="
                  h-11
                  rounded-xl
                  pl-10
                  focus-visible:border-emerald-500
                  focus-visible:ring-emerald-500/20
                "
                {...register("contactPerson")}
              />
            </div>
          </div>

          {/* Mobile */}

          <div className="space-y-1.5">
            <Label htmlFor="supplier-mobile" className="text-xs font-semibold">
              Mobile Number *
            </Label>

            <div className="relative">
              <Phone
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                id="supplier-mobile"
                placeholder="9876543210"
                inputMode="numeric"
                autoComplete="tel"
                disabled={loading}
                className="
                  h-11
                  rounded-xl
                  pl-10
                  focus-visible:border-emerald-500
                  focus-visible:ring-emerald-500/20
                "
                {...register("mobile")}
              />
            </div>

            {errors.mobile && (
              <p className="text-xs text-red-500">{errors.mobile.message}</p>
            )}
          </div>

          {/* More Details */}

          <button
            type="button"
            disabled={loading}
            onClick={onMoreDetails}
            className="
              flex
              w-full
              items-center
              justify-between
              gap-3
              rounded-2xl
              border
              p-3.5
              text-left
              transition
              hover:border-emerald-300
              hover:bg-emerald-50/50
              disabled:pointer-events-none
              disabled:opacity-50
              dark:hover:bg-emerald-500/5
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100
                  dark:bg-emerald-500/10
                "
              >
                <PlusIcon />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold">Add More Details</h3>

                <p className="truncate text-[10px] text-muted-foreground">
                  GST, address, email and more
                </p>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>

          {/* Save */}

          <Button
            type="submit"
            disabled={loading}
            className="
              h-12
              w-full
              rounded-2xl
              bg-emerald-600
              font-semibold
              hover:bg-emerald-700
              active:scale-[0.98]
              dark:bg-emerald-600
              dark:hover:bg-emerald-700
            "
          >
            {loading ? "Creating Supplier..." : "Save Supplier"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  ICON                                      */
/* -------------------------------------------------------------------------- */

function PlusIcon() {
  return (
    <span className="text-lg font-semibold leading-none text-emerald-600 dark:text-emerald-400">
      +
    </span>
  );
}
