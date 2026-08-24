"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { LANGUAGES } from "../constants/languages";

interface LanguageSelectionScreenProps {
  onNext: (language: string) => void;
}

export default function LanguageSelectionScreen({
  onNext,
}: LanguageSelectionScreenProps) {
  const [selected, setSelected] = useState("en");

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="OneHub"
              width={120}
              height={120}
              className="h-28 w-28"
              priority
            />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold">Choose Language</h1>

            <p className="mt-2 text-muted-foreground">
              You can change it anytime from Settings.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {LANGUAGES.map((language) => {
              const Icon = language.icon;

              return (
                <Card
                  key={language.id}
                  onClick={() => setSelected(language.id)}
                  className={`cursor-pointer rounded-2xl p-5 transition-all ${
                    selected === language.id
                      ? "border-primary ring-2 ring-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <div>
                        <p className="font-semibold">{language.name}</p>

                        <p className="text-sm text-muted-foreground">
                          {language.nativeName}
                        </p>
                      </div>
                    </div>

                    {selected === language.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <Button
            className="mt-8 h-12 w-full rounded-xl"
            onClick={() => onNext(selected)}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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
