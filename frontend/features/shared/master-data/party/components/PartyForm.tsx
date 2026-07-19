"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import type { PartyConfig } from "../constants";

import {
  partySchema,
  PartyFormInput,
  PartyFormValues,
} from "../lib/party-schema";

import PartyHeader from "./PartyHeader";
import PartyBasicInfo from "./PartyBasicInfo";
import PartyBusinessInfo from "./PartyBusinessInfo";
import PartyAddress from "./PartyAddress";
import PartyStatus from "./PartyStatus";
import PartyFooter from "./PartyFooter";

interface PartyFormProps {
  config: PartyConfig;
  mode?: "create" | "edit";
  loading?: boolean;
  defaultValues?: Partial<PartyFormValues>;
  onSubmit: (values: PartyFormValues) => Promise<void>;
}

export default function PartyForm({
  config,
  mode = "create",
  loading = false,

  defaultValues,
  onSubmit,
}: PartyFormProps) {
  const router = useRouter();

  const methods = useForm<PartyFormInput, unknown, PartyFormValues>({
    resolver: zodResolver(partySchema),

    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      gstNo: "",
      openingBalance: 0,
      type: config.primaryType,
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-5 pb-24"
        >
          <PartyHeader
            title={mode === "edit" ? config.editTitle : config.title}
            description={config.description}
            backLabel={config.plural}
          />

          <PartyBasicInfo config={config} />

          <PartyBusinessInfo config={config} />

          <PartyAddress />

          <PartyStatus />

          <PartyFooter
            loading={loading}
            saveLabel={config.saveButton}
            onCancel={() => router.back()}
          />
        </form>
      </div>
    </FormProvider>
  );
}
