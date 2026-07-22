"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { APP_TOUR } from "../constants/app-tour";

interface AppTourScreenProps {
  onFinish: () => void;
}

export default function AppTourScreen({ onFinish }: AppTourScreenProps) {
  const [page, setPage] = useState(0);

  const item = APP_TOUR[page];

  if (!item) {
    return null;
  }

  const Icon = item.icon;

  function handleNext() {
    if (page >= APP_TOUR.length - 1) {
      onFinish();
      return;
    }

    setPage((prev) => prev + 1);
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="OneHub"
              width={120}
              height={120}
              priority
              className="h-28 w-28 object-contain"
            />
          </div>

          <Card className="mt-10 rounded-3xl p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Icon className="h-10 w-10 text-primary" />
            </div>

            <h2 className="mt-8 text-2xl font-bold">{item.title}</h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              {item.description}
            </p>
          </Card>

          <div className="mt-8 flex justify-center gap-2">
            {APP_TOUR.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  page === index ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <Button className="mt-8 h-12 w-full rounded-xl" onClick={handleNext}>
            {page === APP_TOUR.length - 1 ? "Get Started" : "Next"}

            <ArrowRight className="ml-2 h-4 w-4" />
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
