"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

import { BUSINESSES } from "../constants/businesses";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BusinessSelectionScreenProps {
  onNext: (business: string) => void;
}

export default function BusinessSelectionScreen({
  onNext,
}: BusinessSelectionScreenProps) {
  const [selected, setSelected] = useState("GENERAL_STORE");

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 -top-20 h-72 w-72 rotate-12 rounded-[90px] bg-sky-100/70 blur-sm" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 -rotate-12 rounded-[90px] bg-sky-100/70 blur-sm" />

        <div className="absolute left-5 top-44 h-20 w-20 rotate-12 border border-sky-200 opacity-60 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />

        <div className="absolute bottom-44 right-5 h-20 w-20 rotate-12 border border-sky-200 opacity-60 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Step */}
          <div className="flex justify-center">
            <div className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              Step 1 of 3
            </div>
          </div>

          {/* Logo */}
          <div className="mt-6 flex justify-center">
            <Image
              src="/onehub.png"
              alt="OneHub"
              width={120}
              height={120}
              priority
              className="h-28 w-28 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Choose Your
              <br />
              Business Type
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-500">
              Select the business you want to set up in OneHub.
            </p>
          </div>

          {/* Business List */}
          <div className="mt-10 space-y-4">
            {BUSINESSES.map((business) => {
              const Icon = business.icon;
              const isSelected = selected === business.id;

              return (
                <button
                  key={business.id}
                  type="button"
                  onClick={() => setSelected(business.id)}
                  className={`w-full rounded-3xl border p-5 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-sky-500 bg-gradient-to-r from-sky-50 to-white shadow-lg shadow-sky-100"
                      : "border-slate-200 bg-white hover:border-sky-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-2xl p-4 ${
                          isSelected
                            ? "bg-sky-500 text-white"
                            : "bg-sky-100 text-sky-600"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {business.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Ready to use
                        </p>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">
                        Available
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info */}
          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-center text-sm leading-6 text-slate-600">
              Select your business type to continue.
              <br />
              All business types use the same OneHub setup process.
            </p>
          </div>

          {/* Continue */}
          <Button
            className="mt-8 h-14 w-full rounded-2xl bg-sky-600 text-base font-semibold hover:bg-sky-700"
            onClick={() => onNext(selected)}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-sm text-slate-500">Version 1.0.0</p>

        <div className="mt-2 flex items-center justify-center gap-1 text-sm">
          <span className="text-slate-500">Built with</span>

          <span className="text-red-500">❤️</span>

          <span className="text-slate-500">by</span>

          <span className="font-semibold text-sky-600">
            Mahendra Tech Solutions
          </span>
        </div>
      </footer>
    </main>
  );
}
