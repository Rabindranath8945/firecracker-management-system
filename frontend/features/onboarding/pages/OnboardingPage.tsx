"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useBusiness } from "@/features/business/hooks/useBusiness";

import BusinessSelectionScreen from "../components/BusinessSelectionScreen";
import BusinessInfoScreen from "../components/BusinessInfoScreen";
import ProgressScreen from "../components/ProgressScreen";

import type { BusinessInfo, OnboardingStep } from "../types/onboarding.types";

/* -------------------------------------------------------------------------- */
/* ONBOARDING CONTENT                                                         */
/* -------------------------------------------------------------------------- */

function OnboardingContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { createBusiness } = useBusiness();

  const initialStep =
    (searchParams.get("step") as OnboardingStep) ?? "business";

  const [step, setStep] = useState<OnboardingStep>(initialStep);

  /* ------------------------------------------------------------------------ */
  /* Create Business                                                          */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Business Selection                                                       */
  /* ------------------------------------------------------------------------ */

  if (step === "business") {
    return (
      <BusinessSelectionScreen
        onNext={(businessType) => {
          sessionStorage.setItem("business-type", businessType);

          setStep("business-info");
        }}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Business Information                                                     */
  /* ------------------------------------------------------------------------ */

  if (step === "business-info") {
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
  }

  /* ------------------------------------------------------------------------ */
  /* Progress / Create Business                                               */
  /* ------------------------------------------------------------------------ */

  if (step === "progress") {
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
            console.error("Failed to create business:", error);

            toast.error("Unable to create your business.");
          }
        }}
      />
    );
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-sm text-muted-foreground">
            Loading onboarding...
          </div>
        </main>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
