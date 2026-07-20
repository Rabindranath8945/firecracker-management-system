"use client";

import { useForm } from "react-hook-form";
import { Building2, Phone, MapPin, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SupplierForm {
  name: string;
  mobile: string;
  gst: string;
  address: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSave: (supplier: SupplierForm) => void;
}

export default function SupplierCreateSheet({
  open,
  onOpenChange,
  onSave,
}: Props) {
  const { register, handleSubmit, reset } = useForm<SupplierForm>({
    defaultValues: {
      name: "",
      mobile: "",
      gst: "",
      address: "",
    },
  });

  function submit(data: SupplierForm) {
    onSave(data);

    reset();

    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[32px] pb-8">
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-muted" />

        <h2 className="text-2xl font-bold">Add Supplier</h2>

        <p className="text-sm text-muted-foreground">
          Create a supplier without leaving the purchase.
        </p>

        <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-5">
          <div>
            <Label>Supplier Name *</Label>

            <Input
              {...register("name", {
                required: true,
              })}
              placeholder="Enter supplier name"
            />
          </div>

          <div>
            <Label>Mobile *</Label>

            <Input
              {...register("mobile", {
                required: true,
              })}
              placeholder="9876543210"
            />
          </div>

          <div>
            <Label>GSTIN</Label>

            <Input {...register("gst")} placeholder="Optional" />
          </div>

          <div>
            <Label>Address</Label>

            <Input {...register("address")} placeholder="Optional" />
          </div>

          <Button className="h-12 w-full rounded-xl" type="submit">
            Save Supplier
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
