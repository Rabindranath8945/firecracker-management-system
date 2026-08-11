"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PartyForm from "@/features/shared/master-data/party/components/PartyForm";
import { PARTY_CONFIG } from "@/features/shared/master-data/party/constants";
import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

import { updateCustomer } from "../services/customer.service";

import SuccessSheet from "@/components/common/shared/sheets/SuccessSheet";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

interface EditCustomerPageProps {
  customerId: string;
  defaultValues: Partial<PartyFormValues>;
}

export default function EditCustomerPage({
  customerId,
  defaultValues,
}: EditCustomerPageProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  async function handleSubmit(values: PartyFormValues) {
    try {
      setLoading(true);

      await updateCustomer(customerId, values);

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to update customer:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PartyForm
        mode="edit"
        loading={loading}
        config={PARTY_CONFIG.customer}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />

      <SuccessSheet
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Customer Updated"
        summary={[
          {
            label: "Customer",
            value: defaultValues.name ?? "",
          },
          {
            label: "Mobile",
            value: defaultValues.mobile ?? "",
          },
        ]}
        primaryAction={{
          label: "View Customer",
          onClick: () => router.push(`/customers/${customerId}`),
        }}
        secondaryActions={[
          {
            label: "Back to Customers",
            onClick: () => router.push("/customers"),
          },
        ]}
      />

      <ProgressDialog
        open={loading}
        title="Updating Customer"
        description="Please wait while we update customer information..."
      />
    </>
  );
}
