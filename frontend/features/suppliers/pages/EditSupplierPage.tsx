"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PartyForm from "@/features/shared/master-data/party/components/PartyForm";
import { PARTY_CONFIG } from "@/features/shared/master-data/party/constants";
import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

interface EditSupplierPageProps {
  supplierId: string;
  defaultValues: Partial<PartyFormValues>;
}

export default function EditSupplierPage({
  supplierId,
  defaultValues,
}: EditSupplierPageProps) {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  async function handleSubmit(values: PartyFormValues) {
    try {
      console.log("Update Supplier:", values);

      // TODO:
      // await supplierService.update(supplierId, values);

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to update supplier:", error);
    }
  }

  return (
    <>
      <PartyForm
        mode="edit"
        config={PARTY_CONFIG.supplier}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />

      <SuccessDialog
        open={successOpen}
        title="Supplier Updated"
        description="Supplier information has been updated successfully."
        primaryLabel="View Supplier"
        secondaryLabel="Back to Suppliers"
        onPrimary={() => {
          router.push(`/suppliers/${supplierId}`);
        }}
        onSecondary={() => {
          router.push("/suppliers");
        }}
      />
    </>
  );
}
