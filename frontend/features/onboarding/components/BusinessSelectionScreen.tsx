"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Store,
  Pill,
  Bike,
  Shirt,
  Hammer,
  UtensilsCrossed,
} from "lucide-react";
import { BUSINESSES } from "../constants/businesses";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BusinessSelectionScreenProps {
  onNext: (business: string) => void;
}

export default function BusinessSelectionScreen({
  onNext,
}: BusinessSelectionScreenProps) {
  const [selected, setSelected] = useState("general");

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
              className="h-28 w-28 object-contain"
              priority
            />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold">Choose Your Business</h1>

            <p className="mt-2 text-muted-foreground">
              Select your business type to get the best experience.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {BUSINESSES.map((business) => {
              const Icon = business.icon;

              return (
                <Card
                  key={business.id}
                  onClick={() => business.available && setSelected(business.id)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all ${
                    selected === business.id
                      ? "border-primary ring-2 ring-primary"
                      : ""
                  } ${
                    !business.available
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <span className="font-medium">{business.title}</span>
                    </div>

                    {business.available ? (
                      <Badge>Available</Badge>
                    ) : (
                      <Badge variant="secondary">Coming Soon</Badge>
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
