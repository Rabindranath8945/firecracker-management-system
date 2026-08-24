"use client";

import { ArrowLeft, Clock3, ReceiptText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

export default function ExpenseReportPage() {
  const router = useRouter();

  return (
    <PageContainer className="space-y-6 pb-10">
      {/* Back */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="w-fit rounded-2xl shadow-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Reports
      </Button>

      {/* Coming Soon Card */}
      <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
        {/* Top Accent */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500" />

        <div className="flex min-h-[520px] items-center justify-center px-6 py-12">
          <div className="max-w-xl text-center">
            {/* Icon */}
            <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl">
              <ReceiptText className="h-11 w-11" />

              <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              <Clock3 className="h-4 w-4" />
              Coming Soon
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Expense Report
            </h1>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Expense management and expense reporting are currently
              unavailable.
            </p>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              The Expense module is planned for a future update. Once it is
              available, you will be able to track business expenses,
              categories, spending and expense reports from here.
            </p>

            {/* Status */}
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4">
              <p className="text-sm font-semibold text-blue-800">
                Currently Unavailable
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700/80">
                Expense data is not available yet because the Expense module has
                not been added to the system.
              </p>
            </div>

            {/* Action */}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="mt-8 rounded-2xl px-6"
            >
              Back to Reports
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
