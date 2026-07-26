"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useBusiness } from "@/features/business/hooks/useBusiness";
import type { Business } from "@/features/business/types/business.types";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const { getMyBusiness } = useBusiness();

  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const data = await getMyBusiness();

        setBusiness(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadBusiness();
  }, [getMyBusiness]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      {/* Background */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-24 h-80 w-80 rounded-[100px] bg-sky-100/70 blur-sm" />

        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-[100px] bg-sky-100/70 blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-24 w-24 text-green-500" />
        </div>

        <Image
          src="/onehub.png"
          alt="OneHub"
          width={100}
          height={100}
          className="mx-auto mt-6"
        />

        <h1 className="mt-8 text-4xl font-bold text-slate-900">
          Workspace Ready 🎉
        </h1>

        <p className="mt-3 text-slate-500">
          Your business has been created successfully.
        </p>

        {business && (
          <div className="mt-8 rounded-3xl border border-sky-100 bg-sky-50 p-6 text-left">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Business Name
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {business.name}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Business ID
              </p>

              <p className="mt-1 font-medium text-sky-600">
                {business.businessId}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Business Type
              </p>

              <p className="mt-1 font-medium">
                {business.type.replaceAll("_", " ")}
              </p>
            </div>
          </div>
        )}

        <Button
          className="mt-10 h-14 w-full rounded-2xl text-base"
          onClick={onNext}
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="mt-8 text-xs text-slate-400">
          Version 1.0.0 • Built by Mahendra Tech Solutions
        </p>
      </div>
    </main>
  );
}
