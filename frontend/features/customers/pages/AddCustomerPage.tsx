"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PartyForm from "@/features/shared/master-data/party/components/PartyForm";
import { PARTY_CONFIG } from "@/features/shared/master-data/party/constants";
import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

export default function AddCustomerPage() {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = async (values: PartyFormValues) => {
    try {
      console.log(values);

      // TODO:
      // const customer = await customerService.create(values);

      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PartyForm config={PARTY_CONFIG.customer} onSubmit={handleSubmit} />

      <SuccessDialog
        open={successOpen}
        title="Customer Created"
        description="The customer has been created successfully."
        primaryLabel="Back to Customers"
        secondaryLabel="Add Another"
        onPrimary={() => {
          router.push("/customers");
        }}
        onSecondary={() => {
          setSuccessOpen(false);

          // Later you can reset the form here if needed
          // or simply refresh the page.

          router.refresh();
        }}
      />
    </>
  );
}
