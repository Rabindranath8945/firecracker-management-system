"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PartyForm from "@/features/shared/master-data/party/components/PartyForm";
import { PARTY_CONFIG } from "@/features/shared/master-data/party/constants";
import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

import { updateSupplier } from "../services/supplier.service";

import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";
import SuccessSheet from "@/components/common/shared/sheets/SuccessSheet";

interface EditSupplierPageProps {
  supplierId: string;
  defaultValues: Partial<PartyFormValues>;
}

export default function EditSupplierPage({
  supplierId,
  defaultValues,
}: EditSupplierPageProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [updatedSupplier, setUpdatedSupplier] = useState<{
    name: string;
    mobile: string;
  } | null>(null);

  async function handleSubmit(values: PartyFormValues) {
    try {
      setLoading(true);

      const supplier = await updateSupplier(supplierId, values);

      setUpdatedSupplier({
        name: supplier.name,
        mobile: supplier.mobile,
      });

      setSuccessOpen(true);
    } catch (error) {
      console.error("Update Supplier Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PartyForm
        mode="edit"
        loading={loading}
        config={PARTY_CONFIG.supplier}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />

      <ProgressDialog
        open={loading}
        title="Updating Supplier"
        description="Please wait while we update the supplier..."
      />

      <SuccessSheet
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Supplier Updated Successfully"
        description="The supplier information has been updated."
        summary={[
          {
            label: "Supplier",
            value: updatedSupplier?.name ?? "-",
          },
          {
            label: "Mobile",
            value: updatedSupplier?.mobile ?? "-",
          },
        ]}
        primaryAction={{
          label: "View Supplier",
          onClick: () => router.push(`/suppliers/${supplierId}`),
        }}
        secondaryActions={[
          {
            label: "Back to Suppliers",
            onClick: () => router.push("/suppliers"),
          },
        ]}
      />
    </>
  );
}
