"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ProgressScreenProps {
  onComplete: () => void;
}

const STEPS = [
  "Preparing Workspace",
  "Creating Local Database",
  "Saving Business Type",
  "Saving Language",
  "Creating Default Settings",
  "Finalizing Setup",
];

export default function ProgressScreen({ onComplete }: ProgressScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);

          setTimeout(() => {
            onComplete();
          }, 500);

          return 100;
        }

        return prev + 2;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  const currentStep =
    STEPS[
      Math.min(Math.floor(progress / (100 / STEPS.length)), STEPS.length - 1)
    ];

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <Image
            src="/logo.png"
            alt="OneHub"
            width={140}
            height={140}
            priority
            className="mx-auto h-36 w-36 object-contain"
          />

          <h1 className="mt-8 text-3xl font-bold">Setting Up OneHub</h1>

          <p className="mt-2 text-muted-foreground">
            Please wait while we prepare your workspace.
          </p>

          <div className="mt-10">
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{progress}%</span>

              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>

          <div className="mt-10 rounded-2xl border bg-card p-5 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />

              <span className="font-medium">{currentStep}</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="pb-8 text-center">
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Built by{" "}
          <span className="font-medium text-foreground">
            Mahendra Tech Solutions
          </span>
        </p>
      </footer>
    </main>
  );
}
