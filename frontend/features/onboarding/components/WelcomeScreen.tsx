"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useBusiness } from "@/features/business/hooks/useBusiness";
import type { Business } from "@/features/business/types/business.types";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const { getMyBusiness } = useBusiness();

  const [businesses, setBusinesses] = useState<Business[]>([]);

  const latestBusiness = businesses.at(-1);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const data = await getMyBusiness();

        setBusinesses(data);
      } catch (error) {
        console.error("Failed to load businesses:", error);
      }
    }

    loadBusinesses();
  }, [getMyBusiness]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      {/* Background */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-24 h-80 w-80 rounded-[120px] bg-sky-100/60 blur-3xl" />

        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-[120px] bg-cyan-100/60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <CheckCircle2 className="mx-auto h-24 w-24 text-emerald-500" />

        <Image
          src="/onehub.png"
          alt="OneHub"
          width={90}
          height={90}
          className="mx-auto mt-6"
        />

        <h1 className="mt-8 text-3xl font-bold text-slate-900">
          Workspace Ready 🎉
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Your business has been created successfully.
        </p>

        {latestBusiness && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
                <Building2 className="h-7 w-7 text-sky-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold text-slate-900">
                  {latestBusiness.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {(latestBusiness.type ?? "GENERAL_STORE").replaceAll(
                    "_",
                    " ",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Business ID</span>

                <span className="font-semibold text-sky-600">
                  {latestBusiness.businessId}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button onClick={onNext} className="mt-10 h-14 w-full rounded-2xl">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="mt-8 text-xs text-slate-400">
          Version 1.0.0 • Built with ❤️ by Mahendra Tech Solutions
        </p>
      </div>
    </main>
  );
}
