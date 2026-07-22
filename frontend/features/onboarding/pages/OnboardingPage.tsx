"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import WelcomeScreen from "../components/WelcomeScreen";
import SetupScreen from "../components/SetupScreen";
import BusinessSelectionScreen from "../components/BusinessSelectionScreen";
import LanguageSelectionScreen from "../components/LanguageSelectionScreen";
import ProgressScreen from "../components/ProgressScreen";
import BusinessInfoScreen from "../components/BusinessInfoScreen";
import AppTourScreen from "../components/AppTourScreen";

import type { OnboardingStep } from "../types/onboarding.types";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("welcome");

  switch (step) {
    case "welcome":
      return <WelcomeScreen onNext={() => setStep("setup")} />;

    case "setup":
      return (
        <SetupScreen
          onNext={() => setStep("business")}
          onSkip={() => setStep("business")}
        />
      );
    case "business":
      return <BusinessSelectionScreen onNext={() => setStep("language")} />;

    case "language":
      return <LanguageSelectionScreen onNext={() => setStep("progress")} />;

    case "progress":
      return <ProgressScreen onComplete={() => setStep("business-info")} />;

    case "business-info":
      return (
        <BusinessInfoScreen
          onNext={() => setStep("tour")}
          onSkip={() => setStep("tour")}
        />
      );

    case "tour":
      return (
        <AppTourScreen
          onFinish={() => {
            localStorage.setItem("onboarding-completed", "true");
            router.replace("/login");
          }}
        />
      );

    default:
      return null;
  }
}
