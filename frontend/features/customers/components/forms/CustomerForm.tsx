"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  customerSchema,
  CustomerFormValues,
} from "../../lib/validation/customer";

import CustomerBasicInfo from "./CustomerBasicInfo";
import CustomerBusinessInfo from "./CustomerBusinessInfo";
import CustomerAddress from "./CustomerAddress";
import CustomerStatus from "./CustomerStatus";

import { Button } from "@/components/ui/button";

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormValues>;
  loading?: boolean;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
}

export default function CustomerForm({
  defaultValues,
  loading = false,
  onSubmit,
}: CustomerFormProps) {
  const router = useRouter();

  const methods = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      address: "",
      gstNo: "",
      openingBalance: 0,
      type: "CUSTOMER",
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 pb-32"
      >
        <CustomerBasicInfo />

        <CustomerBusinessInfo />

        <CustomerAddress />

        <CustomerStatus />

        {/* Sticky Footer */}

        <div className="sticky bottom-5 z-50 rounded-3xl border bg-white/90 p-4 shadow-2xl backdrop-blur">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl"
              onClick={() => router.back()}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-2xl px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Customer
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
