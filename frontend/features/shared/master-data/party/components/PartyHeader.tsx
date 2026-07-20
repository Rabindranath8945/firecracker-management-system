"use client";

import { ArrowLeft, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface PartyHeaderProps {
  title: string;
  description: string;
  backLabel: string;
}

export default function PartyHeader({
  title,
  description,
  backLabel,
}: PartyHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6 w-full">
      {/* Back Button */}
      <div className="mb-5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="h-10 rounded-full px-3 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />

          <span className="font-medium">{backLabel}</span>
        </Button>
      </div>

      {/* Hero */}

      <div className="w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 shadow-lg">
        <div className="flex items-center gap-4 p-5">
          {/* Icon */}

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <UserRoundPlus className="h-7 w-7 text-cyan-300" />
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
