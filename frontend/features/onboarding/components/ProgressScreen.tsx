"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ProgressScreenProps {
  onComplete: () => Promise<void> | void;
}

const STEPS = [
  "Creating your business...",
  "Generating Business ID...",
  "Configuring workspace...",
  "Preparing dashboard...",
];

export default function ProgressScreen({ onComplete }: ProgressScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    let mounted = true;

    async function runSetup() {
      for (let i = 0; i < STEPS.length; i++) {
        if (!mounted) return;

        setCurrentStep(i);

        await new Promise((resolve) => setTimeout(resolve, 700));

        setProgress(Math.round(((i + 1) / STEPS.length) * 100));
      }

      if (mounted) {
        await onComplete();
      }
    }

    runSetup();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-20 h-80 w-80 rounded-[100px] bg-sky-100/70 blur-sm" />
        <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-[100px] bg-sky-100/70 blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center">
          <Image
            src="/onehub.png"
            alt="OneHub"
            width={110}
            height={110}
            priority
          />
        </div>

        <h1 className="mt-8 text-center text-3xl font-bold text-slate-900">
          Setting up OneHub
        </h1>

        <p className="mt-3 text-center text-slate-500">
          Please wait while we prepare your workspace.
        </p>

        {/* Progress */}
        <div className="mt-10 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-sky-500 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-3 text-center text-sm font-medium text-sky-600">
          {progress}% Completed
        </p>

        {/* Steps */}
        <div className="mt-10 space-y-4">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              {index < currentStep ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : index === currentStep ? (
                <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-slate-300" />
              )}

              <span
                className={`font-medium ${
                  index <= currentStep ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          This usually takes only a few seconds.
        </p>
      </div>
    </main>
  );
}
