"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

interface SettingsFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onSave?: () => void;
}

export default function SettingsFormLayout({
  title,
  description,
  children,
}: SettingsFormLayoutProps) {
  const router = useRouter();

  return (
    <PageContainer className="space-y-7 pb-14">
      {/* ------------------------------------------------------------------ */}
      {/* TOP                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="-ml-2 h-9 rounded-lg px-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PAGE HEADER                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
          {description}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN FORM CARD                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_8px_30px_-20px_rgba(15,23,42,0.3)]">
        {children}
      </div>
    </PageContainer>
  );
}
