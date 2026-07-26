"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useBusiness } from "@/features/business/hooks/useBusiness";

import WelcomeScreen from "../components/WelcomeScreen";
import BusinessSelectionScreen from "../components/BusinessSelectionScreen";
import BusinessInfoScreen from "../components/BusinessInfoScreen";
import ProgressScreen from "../components/ProgressScreen";

import type { BusinessInfo, OnboardingStep } from "../types/onboarding.types";

export default function OnboardingPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { createBusiness } = useBusiness();

  const initialStep = (searchParams.get("step") as OnboardingStep) ?? "welcome";

  const [step, setStep] = useState<OnboardingStep>(initialStep);

  /* -------------------------------------------------------------------------- */
  /*                           Finish Onboarding                                */
  /* -------------------------------------------------------------------------- */

  const finishOnboarding = () => {
    localStorage.setItem("onboarding-completed", "true");

    sessionStorage.removeItem("business-info");
    sessionStorage.removeItem("business-type");

    router.replace("/dashboard");
  };

  /* -------------------------------------------------------------------------- */
  /*                         Create Business (Backend)                          */
  /* -------------------------------------------------------------------------- */

  const setupBusiness = async () => {
    const info = JSON.parse(
      sessionStorage.getItem("business-info") ?? "{}",
    ) as BusinessInfo;

    await createBusiness({
      name: info.businessName || "My Business",
      type: "GENERAL_STORE",

      ...(info.mobile && { phone: info.mobile }),
      ...(info.address && { address: info.address }),
    });
  };

  switch (step) {
    /* ---------------------------------------------------------------------- */
    /*                                Welcome                                 */
    /* ---------------------------------------------------------------------- */

    case "welcome":
      return <WelcomeScreen onNext={() => setStep("business")} />;

    /* ---------------------------------------------------------------------- */
    /*                          Business Selection                            */
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
    /*                         Business Information                           */
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
    /*                           Setup Progress                               */
    /* ---------------------------------------------------------------------- */

    case "progress":
      return (
        <ProgressScreen
          onComplete={async () => {
            try {
              await setupBusiness();

              toast.success("Business created successfully.");

              setStep("tour");
            } catch (error) {
              console.error(error);

              toast.error("Unable to create your business.");
            }
          }}
        />
      );

    /* ---------------------------------------------------------------------- */
    /*                           Workspace Ready                              */
    /* ---------------------------------------------------------------------- */

    case "tour":
      return <WelcomeScreen onNext={finishOnboarding} />;

    default:
      return null;
  }
}
