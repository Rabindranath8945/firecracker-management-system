"use client";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  UserRoundPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface PartyHeaderProps {
  title: string;
  description: string;
  backLabel: string;
  module?: "customer" | "supplier";
}

export default function PartyHeader({
  title,
  description,
  backLabel,
  module = "customer",
}: PartyHeaderProps) {
  const router = useRouter();

  const isCustomer = module === "customer";

  return (
    <section className="space-y-5">
      {/* Back */}

      <Button
        type="button"
        variant="ghost"
        onClick={() => router.back()}
        className="-ml-2 h-10 rounded-xl px-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backLabel}
      </Button>

      {/* Module Badge */}

      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
          isCustomer ? "bg-emerald-50" : "bg-indigo-50"
        }`}
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            isCustomer ? "bg-emerald-100" : "bg-indigo-100"
          }`}
        >
          {isCustomer ? (
            <UserRoundPlus className="h-4 w-4 text-emerald-700" />
          ) : (
            <Building2 className="h-4 w-4 text-indigo-700" />
          )}
        </div>

        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            isCustomer ? "text-emerald-700" : "text-indigo-700"
          }`}
        >
          {isCustomer ? "Customer Management" : "Supplier Management"}
        </span>
      </div>

      {/* Heading */}

      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </section>
  );
}
