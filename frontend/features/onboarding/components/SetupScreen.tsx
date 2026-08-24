"use client";

import Image from "next/image";
import { ArrowRight, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SetupScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function SetupScreen({ onNext, onSkip }: SetupScreenProps) {
  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="OneHub"
              width={140}
              height={140}
              priority
              className="h-36 w-36 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Let's Get Started
            </h1>

            <p className="mt-3 text-base text-muted-foreground">
              We'll set up OneHub for your business.
            </p>
          </div>

          {/* Info Card */}
          <Card className="mt-10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <Clock3 className="h-6 w-6 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">Quick Setup</h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  It takes less than a minute to configure your business. You
                  can skip this now and complete it later from Settings.
                </p>
              </div>
            </div>
          </Card>

          {/* Buttons */}
          <div className="mt-10 flex gap-4">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onSkip}
            >
              Skip
            </Button>

            <Button className="flex-1 rounded-xl" onClick={onNext}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
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
