"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useBusiness } from "@/features/business/hooks/useBusiness";

import BusinessSelectionScreen from "../components/BusinessSelectionScreen";
import BusinessInfoScreen from "../components/BusinessInfoScreen";
import ProgressScreen from "../components/ProgressScreen";

import type { BusinessInfo, OnboardingStep } from "../types/onboarding.types";

export default function OnboardingPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { createBusiness } = useBusiness();

  const initialStep =
    (searchParams.get("step") as OnboardingStep) ?? "business";

  const [step, setStep] = useState<OnboardingStep>(initialStep);

  /* -------------------------------------------------------------------------- */
  /*                           Create Business                                  */
  /* -------------------------------------------------------------------------- */

  const setupBusiness = async () => {
    const info = JSON.parse(
      sessionStorage.getItem("business-info") ?? "{}",
    ) as BusinessInfo;

    const businessType =
      sessionStorage.getItem("business-type") ?? "GENERAL_STORE";

    await createBusiness({
      name: info.businessName || "My Business",

      type: businessType as
        | "GENERAL_STORE"
        | "MEDICAL"
        | "GROCERY"
        | "HARDWARE"
        | "STATIONERY"
        | "ELECTRONICS"
        | "CLOTHING"
        | "RESTAURANT"
        | "OTHER",

      ...(info.mobile && {
        phone: info.mobile,
      }),

      ...(info.address && {
        address: info.address,
      }),
    });
  };

  switch (step) {
    /* ---------------------------------------------------------------------- */
    /*                         Business Type                                  */
    /* ---------------------------------------------------------------------- */

    case "business":
      return (
        <BusinessSelectionScreen
          onNext={(businessType) => {
            sessionStorage.setItem("business-type", businessType);

            setStep("business-info");
          }}
        />
      );

    /* ---------------------------------------------------------------------- */
    /*                      Business Information                              */
    /* ---------------------------------------------------------------------- */

    case "business-info":
      return (
        <BusinessInfoScreen
          onNext={(data) => {
            sessionStorage.setItem("business-info", JSON.stringify(data));

            setStep("progress");
          }}
          onSkip={() => {
            sessionStorage.setItem(
              "business-info",
              JSON.stringify({
                businessName: "My Business",
                ownerName: "",
                mobile: "",
                gstNo: "",
                address: "",
              }),
            );

            setStep("progress");
          }}
        />
      );

    /* ---------------------------------------------------------------------- */
    /*                           Create Business                              */
    /* ---------------------------------------------------------------------- */

    case "progress":
      return (
        <ProgressScreen
          onComplete={async () => {
            try {
              await setupBusiness();

              localStorage.setItem("onboarding-completed", "true");

              sessionStorage.removeItem("business-info");
              sessionStorage.removeItem("business-type");

              toast.success("Business created successfully.");

              router.replace("/business/select");
            } catch (error) {
              console.error(error);

              toast.error("Unable to create your business.");
            }
          }}
        />
      );

    default:
      return null;
  }
}
