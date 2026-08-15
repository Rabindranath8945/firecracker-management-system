"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PartyForm from "@/features/shared/master-data/party/components/PartyForm";
import { PARTY_CONFIG } from "@/features/shared/master-data/party/constants";
import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

import customerService from "../services/customer.service";
import type { Customer } from "../types/customer";

import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";
import SuccessSheet from "@/components/common/shared/sheets/SuccessSheet";

export default function AddCustomerPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [createdCustomer, setCreatedCustomer] = useState<Customer | null>(null);

  async function handleSubmit(values: PartyFormValues) {
    try {
      setSaving(true);

      const customer = await customerService.createCustomer(values);

      setCreatedCustomer(customer);

      setSuccessOpen(true);
    } catch (error) {
      console.error("Create Customer Error:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PartyForm
        config={PARTY_CONFIG.customer}
        loading={saving}
        onSubmit={handleSubmit}
      />

      <ProgressDialog
        open={saving}
        title="Creating Customer"
        description="Please wait while we create the customer..."
      />

      {createdCustomer && (
        <SuccessSheet
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title="Customer Created Successfully"
          description="The customer has been added to your business."
          summary={[
            {
              label: "Customer",
              value: createdCustomer.name,
            },
            {
              label: "Customer Code",
              value: createdCustomer.customerCode,
            },
            {
              label: "Mobile",
              value: createdCustomer.mobile,
            },
          ]}
          primaryAction={{
            label: "View Customer",
            onClick: () => router.push(`/customers/${createdCustomer._id}`),
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
              label: "Back to Customers",
              onClick: () => router.push("/customers"),
            },
          ]}
        />
      )}
    </>
  );
}
