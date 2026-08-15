"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PartyForm from "@/features/shared/master-data/party/components/PartyForm";
import { PARTY_CONFIG } from "@/features/shared/master-data/party/constants";
import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

import { createSupplier } from "../services/supplier.service";
import type { Supplier } from "../types/supplier.type";

import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";
import SuccessSheet from "@/components/common/shared/sheets/SuccessSheet";

export default function AddSupplierPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [createdSupplier, setCreatedSupplier] = useState<Supplier | null>(null);

  async function handleSubmit(values: PartyFormValues) {
    try {
      setSaving(true);

      const supplier = await createSupplier(values);

      setCreatedSupplier(supplier);

      setSuccessOpen(true);
    } catch (error) {
      console.error("Create Supplier Error:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PartyForm
        config={PARTY_CONFIG.supplier}
        loading={saving}
        onSubmit={handleSubmit}
      />

      <ProgressDialog
        open={saving}
        title="Creating Supplier"
        description="Please wait while we create the supplier..."
      />

      {createdSupplier && (
        <SuccessSheet
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title="Supplier Created Successfully"
          description="The supplier has been added to your business."
          summary={[
            {
              label: "Supplier",
              value: createdSupplier.name,
            },
            {
              label: "Supplier Code",
              value: createdSupplier.supplierCode,
            },
            {
              label: "Mobile",
              value: createdSupplier.mobile,
            },
          ]}
          primaryAction={{
            label: "View Supplier",
            onClick: () => router.push(`/suppliers/${createdSupplier._id}`),
          }}
          secondaryActions={[
            {
              label: "Add Another",
              onClick: () => {
                setSuccessOpen(false);
                router.refresh();
              },
            },
            {
              label: "Back to Suppliers",
              onClick: () => router.push("/suppliers"),
            },
          ]}
        />
      )}
    </>
  );
}
