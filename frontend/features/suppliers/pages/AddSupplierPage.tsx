"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PartyForm from "@/features/shared/master-data/party/components/PartyForm";
import { PARTY_CONFIG } from "@/features/shared/master-data/party/constants";
import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

export default function AddSupplierPage() {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = async (values: PartyFormValues) => {
    try {
      console.log(values);

      // TODO:
      // const supplier = await supplierService.create(values);

      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PartyForm config={PARTY_CONFIG.supplier} onSubmit={handleSubmit} />

      <SuccessDialog
        open={successOpen}
        title="Supplier Created"
        description="The supplier has been created successfully."
        primaryLabel="Back to Suppliers"
        secondaryLabel="Add Another"
        onPrimary={() => {
          router.push("/suppliers");
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
