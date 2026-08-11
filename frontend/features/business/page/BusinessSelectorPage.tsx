"use client";

import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import BusinessService from "../services/business.service";
import { useSwitchBusiness } from "../hooks/useSwitchBusiness";
import { BUSINESS_TYPES } from "../constants/business-types";

export default function BusinessSelectorPage() {
  const router = useRouter();

  const switchBusiness = useSwitchBusiness();

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: BusinessService.getMine,
  });

  const getBusinessType = (type: string) =>
    BUSINESS_TYPES.find((item) => item.value === type);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-sky-600" />

          <p className="text-sm text-slate-500">Loading your workspaces...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-md px-5 py-8">
          <p className="text-sm font-semibold text-sky-600">OneHub Workspace</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Select Business
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Choose the business you want to manage.
          </p>
        </div>
      </div>

      {/* Empty State */}

      {!businesses.length && (
        <div className="mx-auto mt-20 max-w-md px-5 text-center">
          <Building2 className="mx-auto h-16 w-16 text-slate-300" />

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No Business Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create your first business to start using OneHub.
          </p>
        </div>
      )}

      {/* Business List */}

      <div className="mx-auto max-w-md space-y-4 px-5 py-6">
        {businesses.map((business) => {
          const type = getBusinessType(business.type);

          return (
            <button
              key={business.id}
              type="button"
              disabled={switchBusiness.isPending}
              onClick={() => switchBusiness.mutate(business.id)}
              className="
                group
                w-full
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                transition-all
                duration-300
                hover:border-sky-300
                hover:shadow-xl
                active:scale-[0.98]
              "
            >
              <div className="flex items-center gap-4">
                {/* Logo */}

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-3xl">
                  {type?.icon ?? "🏪"}
                </div>

                {/* Info */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-bold text-slate-900">
                      {business.name}
                    </h2>

                    {business.isActive && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
                      {type?.label ?? business.type}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {business.businessId}
                    </span>
                  </div>
                </div>

                {/* Arrow */}

                {switchBusiness.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-sky-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom CTA */}

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-5">
        <div className="mx-auto max-w-md">
          <Button
            className="h-14 w-full rounded-2xl"
            onClick={() => router.push("/business/create")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Business
          </Button>
        </div>
      </div>
    </main>
  );
}
