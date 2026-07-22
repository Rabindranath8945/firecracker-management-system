"use client";

import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Package,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const features = [
    {
      title: "Inventory",
      icon: Package,
    },
    {
      title: "Sales",
      icon: ShoppingCart,
    },
    {
      title: "Purchases",
      icon: Truck,
    },
    {
      title: "Reports",
      icon: BarChart3,
    },
    {
      title: "Customers",
      icon: Users,
    },
    {
      title: "Suppliers",
      icon: Truck,
    },
  ];

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="OneHub"
              width={170}
              height={170}
              priority
              className="h-40 w-40 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to OneHub
            </h1>

            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Manage your business from one place.
            </p>
          </div>

          {/* Features */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="rounded-2xl p-5 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <span className="text-sm font-semibold">
                      {feature.title}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Button */}
          <Button
            size="lg"
            className="mt-10 h-12 w-full rounded-xl text-base"
            onClick={onNext}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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
