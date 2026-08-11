"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useBusiness } from "../hooks/useBusiness";

import BusinessSelectionScreen from "@/features/onboarding/components/BusinessSelectionScreen";
import BusinessInfoScreen from "@/features/onboarding/components/BusinessInfoScreen";
import ProgressScreen from "@/features/onboarding/components/ProgressScreen";

import type { BusinessInfo } from "@/features/onboarding/types/onboarding.types";

type Step = "type" | "info" | "progress";

export default function CreateBusinessPage() {
  const router = useRouter();

  const { createBusiness } = useBusiness();

  const [step, setStep] = useState<Step>("type");

  const [businessType, setBusinessType] = useState("GENERAL_STORE");

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);

  async function handleCreateBusiness() {
    if (!businessInfo) return;

    await createBusiness({
      name: businessInfo.businessName || "My Business",

      type: businessType as never,

      phone: businessInfo.mobile,

      address: businessInfo.address,
    });

    toast.success("Business created successfully.");

    router.replace("/business/select");
  }

  switch (step) {
    case "type":
      return (
        <BusinessSelectionScreen
          onNext={(type) => {
            setBusinessType(type);

            setStep("info");
          }}
        />
      );

    case "info":
      return (
        <BusinessInfoScreen
          onNext={(data) => {
            setBusinessInfo(data);

            setStep("progress");
          }}
          onSkip={() => {
            setBusinessInfo({
              businessName: "My Business",
              ownerName: "",
              mobile: "",
              gstNo: "",
              address: "",
            });

            setStep("progress");
          }}
        />
      );

    case "progress":
      return <ProgressScreen onComplete={handleCreateBusiness} />;

    default:
      return null;
  }
}
