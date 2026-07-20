"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PartyForm from "@/features/shared/master-data/party/components/PartyForm";
import { PARTY_CONFIG } from "@/features/shared/master-data/party/constants";
import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

interface EditCustomerPageProps {
  customerId: string;
  defaultValues: Partial<PartyFormValues>;
}

export default function EditCustomerPage({
  customerId,
  defaultValues,
}: EditCustomerPageProps) {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  async function handleSubmit(values: PartyFormValues) {
    try {
      console.log("Update Customer:", values);

      // TODO:
      // await customerService.update(customerId, values);

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  }

  return (
    <>
      <PartyForm
        mode="edit"
        config={PARTY_CONFIG.customer}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />

      <SuccessDialog
        open={successOpen}
        title="Customer Updated"
        description="Customer information has been updated successfully."
        primaryLabel="View Customer"
        secondaryLabel="Back to Customers"
        onPrimary={() => {
          router.push(`/customers/${customerId}`);
        }}
        onSecondary={() => {
          router.push("/customers");
        }}
      />
    </>
  );
}
